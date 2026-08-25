'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/utils/supabase/client'

// Simpan nama tampilan langsung dari browser; RLS + column grant hanya
// mengizinkan update kolom full_name/avatar_url milik sendiri.
export function ProfileForm({
  initialName,
  isID,
}: {
  initialName: string
  isID: boolean
}) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!name.trim() || loading) return
    setError(null)
    setSaved(false)
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name.trim() })
        .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')
      if (error) {
        setError(isID ? 'Gagal menyimpan perubahan.' : 'Failed to save changes.')
        return
      }
      setSaved(true)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{isID ? 'Nama Lengkap' : 'Full Name'}</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => { setName(e.target.value); setSaved(false) }}
          placeholder={isID ? 'Masukkan nama lengkap' : 'Enter full name'}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {saved && (
        <p className="flex items-center gap-1.5 text-sm text-emerald-600">
          <CheckCircle2 className="size-4" />
          {isID ? 'Perubahan tersimpan.' : 'Changes saved.'}
        </p>
      )}
      <Button className="w-full" onClick={handleSave} disabled={loading || !name.trim()}>
        {loading && <Loader2 className="size-4 animate-spin mr-2" />}
        {isID ? 'Simpan Perubahan' : 'Save Changes'}
      </Button>
    </div>
  )
}
