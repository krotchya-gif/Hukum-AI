'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { slugify } from '@/components/admin/ArticleForm'

export interface RegulasiFormValues {
  id?: string
  type: string
  number: string
  title_id: string
  title_en: string
  slug: string
  about_id: string
  about_en: string
  status: string
  issued_date: string
  effective_date: string
  issuing_body: string
  file_url: string
  full_text: string
  is_premium: boolean
  is_published: boolean
}

const TYPES = ['uu', 'pp', 'perda', 'permen', 'putusan'] as const
const STATUSES = ['berlaku', 'dicabut', 'diubah'] as const

const EMPTY: RegulasiFormValues = {
  type: 'uu', number: '', title_id: '', title_en: '', slug: '',
  about_id: '', about_en: '', status: 'berlaku', issued_date: '',
  effective_date: '', issuing_body: '', file_url: '', full_text: '',
  is_premium: false, is_published: true,
}

const TYPE_LABELS: Record<string, { id: string; en: string }> = {
  uu: { id: 'Undang-Undang', en: 'Law (UU)' },
  pp: { id: 'Peraturan Pemerintah', en: 'Government Regulation (PP)' },
  perda: { id: 'Peraturan Daerah', en: 'Regional Regulation' },
  permen: { id: 'Peraturan Menteri', en: 'Ministerial Regulation' },
  putusan: { id: 'Putusan Pengadilan', en: 'Court Ruling' },
}

export function RegulasiForm({
  initial,
  locale,
}: {
  initial?: RegulasiFormValues
  locale: string
}) {
  const isID = locale === 'id'
  const router = useRouter()
  const [values, setValues] = useState<RegulasiFormValues>(initial ?? EMPTY)
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof RegulasiFormValues>(key: K, value: RegulasiFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const setTitle = (text: string) => {
    setValues((prev) => ({
      ...prev,
      title_id: text,
      slug: slugTouched ? prev.slug : slugify(text),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(
        initial?.id ? `/api/admin/regulations/${initial.id}` : '/api/admin/regulations',
        {
          method: initial?.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        }
      )
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error || (isID ? 'Gagal menyimpan regulasi.' : 'Failed to save regulation.'))
        return
      }
      router.push(`/${locale}/admin/regulasi`)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'bg-white'
  const dateValue = (d: string) => (d ? d.slice(0, 10) : '')

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{isID ? 'Identitas Regulasi' : 'Regulation Identity'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">{isID ? 'Tipe *' : 'Type *'}</Label>
              <select id="type" className={`${inputCls} flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm`}
                value={values.type} onChange={(e) => set('type', e.target.value)}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>{TYPE_LABELS[t][isID ? 'id' : 'en']}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">{isID ? 'Nomor/Tahun' : 'Number/Year'}</Label>
              <Input id="number" className={inputCls} value={values.number}
                onChange={(e) => set('number', e.target.value)} placeholder="UU No. 11 Tahun 2008" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">{isID ? 'Status' : 'Status'}</Label>
              <select id="status" className={`${inputCls} flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm`}
                value={values.status} onChange={(e) => set('status', e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title_id">{isID ? 'Judul Lengkap (ID) *' : 'Full Title (ID) *'}</Label>
            <Input id="title_id" required className={inputCls} value={values.title_id}
              onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title_en">{isID ? 'Judul (EN)' : 'Title (EN)'}</Label>
              <Input id="title_en" className={inputCls} value={values.title_en}
                onChange={(e) => set('title_en', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" required className={inputCls} value={values.slug}
                onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)) }} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issued_date">{isID ? 'Tanggal Terbit' : 'Issued Date'}</Label>
              <Input id="issued_date" type="date" className={inputCls}
                value={dateValue(values.issued_date)}
                onChange={(e) => set('issued_date', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="effective_date">{isID ? 'Tanggal Berlaku' : 'Effective Date'}</Label>
              <Input id="effective_date" type="date" className={inputCls}
                value={dateValue(values.effective_date)}
                onChange={(e) => set('effective_date', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issuing_body">{isID ? 'Instansi' : 'Issuing Body'}</Label>
              <Input id="issuing_body" className={inputCls} value={values.issuing_body}
                onChange={(e) => set('issuing_body', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{isID ? 'Isi & Dokumen' : 'Body & Document'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="about_id">{isID ? 'Tentang (ID)' : 'About (ID)'}</Label>
              <textarea id="about_id" rows={4} className={`${inputCls} flex w-full rounded-md border border-input px-3 py-2 text-sm`}
                value={values.about_id} onChange={(e) => set('about_id', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="about_en">{isID ? 'Tentang (EN)' : 'About (EN)'}</Label>
              <textarea id="about_en" rows={4} className={`${inputCls} flex w-full rounded-md border border-input px-3 py-2 text-sm`}
                value={values.about_en} onChange={(e) => set('about_en', e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_text">{isID ? 'Teks Lengkap' : 'Full Text'}</Label>
            <textarea id="full_text" rows={10} className={`${inputCls} flex w-full rounded-md border border-input px-3 py-2 text-sm`}
              value={values.full_text} onChange={(e) => set('full_text', e.target.value)} />
          </div>

          <div className="grid md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="file_url">{isID ? 'URL File PDF' : 'PDF File URL'}</Label>
              <Input id="file_url" className={inputCls} value={values.file_url}
                onChange={(e) => set('file_url', e.target.value)} placeholder="https://..." />
            </div>
            <div className="flex gap-8 pb-2">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input type="checkbox" className="size-4 accent-[var(--primary)]"
                  checked={values.is_published}
                  onChange={(e) => set('is_published', e.target.checked)} />
                {isID ? 'Publikasikan' : 'Published'}
              </label>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input type="checkbox" className="size-4 accent-[var(--primary)]"
                  checked={values.is_premium}
                  onChange={(e) => set('is_premium', e.target.checked)} />
                {isID ? 'Premium' : 'Premium'}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {isID ? 'Batal' : 'Cancel'}
        </Button>
        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
          {loading && <Loader2 className="size-4 animate-spin mr-2" />}
          {initial?.id
            ? (isID ? 'Simpan Perubahan' : 'Save Changes')
            : (isID ? 'Buat Regulasi' : 'Create Regulation')}
        </Button>
      </div>
    </form>
  )
}
