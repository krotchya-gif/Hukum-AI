'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface CheckoutButtonProps {
  plan: 'monthly' | 'yearly'
  ctaText: string
  isPopular: boolean
  disabled?: boolean
}

export function CheckoutButton({ plan, ctaText, isPopular, disabled }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/payment/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const data = await res.json()

      if (res.ok && data.url) {
        window.location.href = data.url
        return
      }

      setError(data.error || 'Terjadi kesalahan saat memproses pembayaran.')
    } catch {
      setError('Terjadi kesalahan saat menghubungi server pembayaran.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6">
      <Button
        onClick={handleCheckout}
        className={`w-full ${isPopular ? 'bg-accent hover:bg-accent/90 text-white' : ''}`}
        variant={isPopular ? 'default' : 'outline'}
        disabled={disabled || loading}
      >
        {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
        {loading ? 'Memproses...' : ctaText}
      </Button>
      {error && <p className="mt-2 text-xs text-red-600 text-center">{error}</p>}
    </div>
  )
}
