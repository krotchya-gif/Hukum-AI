'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface AISummaryCardProps {
  regulationId: string
  initialSummaryId: string | null
  initialSummaryEn: string | null
  locale: string
}

export function AISummaryCard({ regulationId, initialSummaryId, initialSummaryEn, locale }: AISummaryCardProps) {
  const isID = locale === 'id'
  const initialSummary = isID ? initialSummaryId : initialSummaryEn
  
  const [summary, setSummary] = useState<string | null>(initialSummary)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regulationId, language: locale })
      })
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Terjadi kesalahan')
      }
      
      setSummary(data.summary)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-primary to-primary/90 text-white rounded-2xl p-8 mb-10 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <div className="p-1.5 bg-amber-500 rounded-lg shadow-inner">
          <Sparkles className="size-4 text-white" />
        </div>
        <h3 className="font-bold text-lg">{isID ? 'Ringkasan Cerdas AI' : 'AI Smart Summary'}</h3>
      </div>
      
      <div className="relative z-10">
        {summary ? (
          <div className="text-primary-foreground/90 leading-relaxed font-medium whitespace-pre-line text-sm md:text-base">
            {summary}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-primary-foreground/90 leading-relaxed italic text-sm">
              {isID 
                ? 'Klik Generate untuk menganalisis dokumen ini dalam hitungan detik dengan AI (Limit 3x/hari untuk Free).'
                : 'Click Generate to automatically analyze this document using AI (Limit 3x/day for Free).'}
            </p>
            {error && <p className="text-red-300 text-sm font-semibold">{error}</p>}
            <Button 
              onClick={handleGenerate} 
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold gap-2"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {isID ? (loading ? 'Memproses...' : 'Generate Ringkasan') : (loading ? 'Processing...' : 'Generate Summary')}
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end relative z-10">
        <Badge variant="outline" className="text-white border-white/20 bg-white/10">
          BETA
        </Badge>
      </div>
    </div>
  )
}
