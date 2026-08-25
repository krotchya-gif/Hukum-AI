'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Category {
  id: number
  name_id: string
}

export interface ArticleFormValues {
  id?: string
  title_id: string
  title_en: string
  slug: string
  excerpt_id: string
  excerpt_en: string
  content_id: string
  content_en: string
  cover_image: string
  category_id: number | null
  author_name: string
  is_premium: boolean
  is_published: boolean
}

const EMPTY: ArticleFormValues = {
  title_id: '', title_en: '', slug: '', excerpt_id: '', excerpt_en: '',
  content_id: '', content_en: '', cover_image: '', category_id: null,
  author_name: '', is_premium: false, is_published: true,
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function ArticleForm({
  categories,
  initial,
  locale,
}: {
  categories: Category[]
  initial?: ArticleFormValues
  locale: string
}) {
  const isID = locale === 'id'
  const router = useRouter()
  const [values, setValues] = useState<ArticleFormValues>(initial ?? EMPTY)
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof ArticleFormValues>(key: K, value: ArticleFormValues[K]) =>
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
      const payload = { ...values, category_id: values.category_id || null }
      const res = await fetch(
        initial?.id ? `/api/admin/articles/${initial.id}` : '/api/admin/articles',
        {
          method: initial?.id ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error || (isID ? 'Gagal menyimpan artikel.' : 'Failed to save article.'))
        return
      }
      router.push(`/${locale}/admin/berita`)
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'bg-white'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{isID ? 'Konten' : 'Content'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title_id">{isID ? 'Judul (ID) *' : 'Title (ID) *'}</Label>
              <Input id="title_id" required className={inputCls} value={values.title_id}
                onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title_en">{isID ? 'Judul (EN)' : 'Title (EN)'}</Label>
              <Input id="title_en" className={inputCls} value={values.title_en}
                onChange={(e) => set('title_en', e.target.value)} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" required className={inputCls} value={values.slug}
                onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)) }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author_name">{isID ? 'Penulis' : 'Author'}</Label>
              <Input id="author_name" className={inputCls} value={values.author_name}
                onChange={(e) => set('author_name', e.target.value)}
                placeholder={isID ? 'Tim Redaksi' : 'Editorial Team'} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="excerpt_id">{isID ? 'Ringkasan (ID)' : 'Excerpt (ID)'}</Label>
              <textarea id="excerpt_id" rows={2} className={`${inputCls} flex w-full rounded-md border border-input px-3 py-2 text-sm`}
                value={values.excerpt_id} onChange={(e) => set('excerpt_id', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt_en">{isID ? 'Ringkasan (EN)' : 'Excerpt (EN)'}</Label>
              <textarea id="excerpt_en" rows={2} className={`${inputCls} flex w-full rounded-md border border-input px-3 py-2 text-sm`}
                value={values.excerpt_en} onChange={(e) => set('excerpt_en', e.target.value)} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="content_id">{isID ? 'Konten (ID) *' : 'Content (ID) *'}</Label>
              <textarea id="content_id" rows={10} required className={`${inputCls} flex w-full rounded-md border border-input px-3 py-2 text-sm`}
                value={values.content_id} onChange={(e) => set('content_id', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content_en">{isID ? 'Konten (EN)' : 'Content (EN)'}</Label>
              <textarea id="content_en" rows={10} className={`${inputCls} flex w-full rounded-md border border-input px-3 py-2 text-sm`}
                value={values.content_en} onChange={(e) => set('content_en', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{isID ? 'Publikasi' : 'Publication'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category_id">{isID ? 'Kategori' : 'Category'}</Label>
              <select id="category_id" className={`${inputCls} flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm`}
                value={values.category_id ?? ''}
                onChange={(e) => set('category_id', e.target.value ? Number(e.target.value) : null)}>
                <option value="">—</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name_id}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cover_image">{isID ? 'URL Gambar Sampul' : 'Cover Image URL'}</Label>
              <Input id="cover_image" className={inputCls} value={values.cover_image}
                onChange={(e) => set('cover_image', e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <div className="flex gap-8 pt-2">
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
              {isID ? 'Artikel Premium' : 'Premium article'}
            </label>
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
            : (isID ? 'Buat Artikel' : 'Create Article')}
        </Button>
      </div>
    </form>
  )
}
