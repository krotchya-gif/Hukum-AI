import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { Link } from '@/navigation'
import { ArrowLeft } from 'lucide-react'
import { ArticleForm } from '@/components/admin/ArticleForm'

export default async function NewArticlePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name_id')
    .order('name_id')

  const isID = locale === 'id'

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href={`/${locale}/admin/berita`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary mb-2">
          <ArrowLeft className="size-4" />
          {isID ? 'Kembali ke Daftar' : 'Back to List'}
        </Link>
        <h1 className="text-3xl font-display font-bold text-primary">
          {isID ? 'Tambah Artikel Baru' : 'New Article'}
        </h1>
      </div>

      <ArticleForm categories={categories ?? []} locale={locale} />
    </div>
  )
}
