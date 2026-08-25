import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { Link } from '@/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Image as ImageIcon } from 'lucide-react'
import { AdminDeleteButton } from '@/components/admin/AdminActions'

export default async function AdminBeritaPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: articles } = await supabase
    .from('articles')
    .select(`*, category:categories(*)`)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Manajemen Berita</h1>
          <p className="text-muted-foreground mt-1">Kelola artikel dan publikasi untuk platform hukum Anda.</p>
        </div>
        <Link href={`/${locale}/admin/berita/baru`}>
          <Button className="gap-2 bg-primary">
            <Plus className="size-4" />
            Tambah Artikel Baru
          </Button>
        </Link>
      </div>

      <Card className="border shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Judul Artikel</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Akses (Tier)</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {articles?.map((article) => (
                <tr key={article.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 shrink-0 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {article.cover_image ? (
                          <img src={article.cover_image} className="w-full h-full object-cover" alt="cover" />
                        ) : (
                          <ImageIcon className="text-gray-400 size-5" />
                        )}
                      </div>
                      <div className="font-semibold text-primary max-w-[300px] truncate">
                        {locale === 'en' ? (article.title_en || article.title_id) : article.title_id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600">
                    {locale === 'en' ? article.category?.name_en : article.category?.name_id}
                  </td>
                  <td className="px-6 py-4">
                    {article.is_published ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Published</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Draft</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {article.is_premium ? (
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-none">Premium</Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Free</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <Link href={`/${locale}/admin/berita/${article.id}/edit`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="size-4" /> Edit
                      </Button>
                    </Link>
                    <AdminDeleteButton
                      endpoint="articles"
                      id={article.id}
                      confirmText={`Hapus artikel "${article.title_id}"? Tindakan ini tidak bisa dibatalkan.`}
                    />
                  </td>
                </tr>
              ))}
              {(!articles || articles.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Belum ada artikel. Klik &quot;Tambah Artikel Baru&quot; untuk membuat yang pertama.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
