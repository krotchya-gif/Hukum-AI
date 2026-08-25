import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { Link } from '@/navigation'
import { ArrowLeft } from 'lucide-react'
import { ArticleForm, type ArticleFormValues } from '@/components/admin/ArticleForm'

export default async function EditArticlePage({
  params: { locale, id }
}: {
  params: { locale: string, id: string }
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const [{ data: article }, { data: categories }] = await Promise.all([
    supabase.from('articles').select('*').eq('id', id).maybeSingle(),
    supabase.from('categories').select('id, name_id').order('name_id'),
  ])

  if (!article) notFound()

  const isID = locale === 'id'

  const initial: ArticleFormValues = {
    id: article.id,
    title_id: article.title_id ?? '',
    title_en: article.title_en ?? '',
    slug: article.slug ?? '',
    excerpt_id: article.excerpt_id ?? '',
    excerpt_en: article.excerpt_en ?? '',
    content_id: article.content_id ?? '',
    content_en: article.content_en ?? '',
    cover_image: article.cover_image ?? '',
    category_id: article.category_id ?? null,
    author_name: article.author_name ?? '',
    is_premium: Boolean(article.is_premium),
    is_published: Boolean(article.is_published),
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href={`/${locale}/admin/berita`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary mb-2">
          <ArrowLeft className="size-4" />
          {isID ? 'Kembali ke Daftar' : 'Back to List'}
        </Link>
        <h1 className="text-3xl font-display font-bold text-primary truncate">
          {isID ? 'Edit Artikel' : 'Edit Article'}
        </h1>
      </div>

      <ArticleForm categories={categories ?? []} initial={initial} locale={locale} />
    </div>
  )
}
