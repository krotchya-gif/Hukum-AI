'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Hapus baris konten via API admin (server memverifikasi role admin).
export function AdminDeleteButton({
  endpoint,
  id,
  confirmText,
}: {
  endpoint: 'articles' | 'regulations'
  id: string
  confirmText: string
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!window.confirm(confirmText)) return
    setLoading(true)
    try {
      await fetch(`/api/admin/${endpoint}/${id}`, { method: 'DELETE' })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 hover:text-red-600"
      onClick={handleDelete} disabled={loading} aria-label="Hapus">
      {loading ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
    </Button>
  )
}

// Panggil /api/ai/summarize untuk regulasi tanpa ringkasan.
export function GenerateSummaryButton({ regulationId }: { regulationId: string }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regulationId, language: 'id' }),
      })
      if (res.ok) {
        setDone(true)
        router.refresh()
      } else {
        setError(res.status === 429 ? 'Batas harian tercapai.' : 'Gagal generate.')
      }
    } catch {
      setError('Gagal menghubungi server.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return <span className="text-xs font-semibold text-green-600">Ringkasan dibuat ✓</span>
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline disabled:opacity-60 cursor-pointer"
      >
        {loading ? 'Membuat ringkasan...' : 'Generate AI Summary'}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </span>
  )
}
