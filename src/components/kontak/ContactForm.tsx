'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Form kontak publik: pesan disimpan ke tabel contact_messages via API
// (RLS hanya mengizinkan INSERT — tidak ada pembacaan dari publik).
export function ContactForm({ isID }: { isID: boolean }) {
  const [values, setValues] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/kontak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        setError(isID ? 'Gagal mengirim pesan. Silakan coba lagi.' : 'Failed to send message. Please try again.')
        return
      }
      setSent(true)
      setValues({ name: '', email: '', subject: '', message: '' })
    } catch {
      setError(isID ? 'Terjadi kesalahan jaringan.' : 'A network error occurred.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 className="size-12 text-emerald-500" />
        <h3 className="text-lg font-bold text-primary">
          {isID ? 'Pesan Terkirim!' : 'Message Sent!'}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {isID
            ? 'Terima kasih telah menghubungi kami. Tim kami akan membalas ke email Anda dalam 1-2 hari kerja.'
            : 'Thanks for reaching out. Our team will reply to your email within 1-2 business days.'}
        </p>
        <Button variant="outline" size="sm" onClick={() => setSent(false)}>
          {isID ? 'Kirim Pesan Lain' : 'Send Another Message'}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact-name">{isID ? 'Nama' : 'Name'} *</Label>
          <Input id="contact-name" required value={values.name} onChange={set('name')}
            placeholder={isID ? 'Nama lengkap' : 'Full name'} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">{isID ? 'Email' : 'Email'} *</Label>
          <Input id="contact-email" type="email" required value={values.email} onChange={set('email')}
            placeholder="nama@email.com" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-subject">{isID ? 'Subjek' : 'Subject'}</Label>
        <Input id="contact-subject" value={values.subject} onChange={set('subject')}
          placeholder={isID ? 'Perihal pesan' : 'Message subject'} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">{isID ? 'Pesan' : 'Message'} *</Label>
        <textarea id="contact-message" required rows={6} value={values.message} onChange={set('message')}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder={isID ? 'Tulis pertanyaan atau pesan Anda...' : 'Write your question or message...'} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full md:w-auto bg-primary hover:bg-primary/90 gap-2">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        {isID ? 'Kirim Pesan' : 'Send Message'}
      </Button>
    </form>
  )
}
