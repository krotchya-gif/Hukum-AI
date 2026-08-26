import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { Link } from '@/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, FileText, CheckCircle2 } from 'lucide-react'
import { AdminDeleteButton, GenerateSummaryButton } from '@/components/admin/AdminActions'

export default async function AdminRegulasiPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: regulations } = await supabase
    .from('regulations')
    .select(`*`)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Manajemen Regulasi</h1>
          <p className="text-muted-foreground mt-1">Kelola database UU, Peraturan, dan dokumen hukum lainnya.</p>
        </div>
        <Link href={`/${locale}/admin/regulasi/baru`}>
          <Button className="gap-2 bg-primary">
            <Plus className="size-4" />
            Tambah Regulasi Baru
          </Button>
        </Link>
      </div>

      <Card className="border shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Tipe & Nomor</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Judul Regulasi</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status Dokumen</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Metadata (AI)</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {regulations?.map((reg) => (
                <tr key={reg.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5 items-start">
                      <Badge variant="outline" className="bg-primary/5 text-primary tracking-widest">{reg.type}</Badge>
                      <span className="font-medium text-gray-700">{reg.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-primary max-w-xs line-clamp-2">
                      {locale === 'en' ? (reg.title_en || reg.title_id) : reg.title_id}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Diterbitkan: {reg.issued_date}</p>
                  </td>
                  <td className="px-6 py-4">
                    {reg.status === 'berlaku' ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Berlaku</Badge>
                    ) : reg.status === 'dicabut' ? (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Dicabut</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">{reg.status}</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <FileText className="size-3" />
                      {reg.file_url ? 'PDF Uploaded' : 'No PDF'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {reg.ai_summary_id ? (
                        <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="size-3"/> AI Summary Ready</span>
                      ) : (
                        <GenerateSummaryButton regulationId={reg.id} />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <Link href={`/${locale}/admin/regulasi/${reg.id}/edit`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="size-4" /> Edit
                      </Button>
                    </Link>
                    <AdminDeleteButton
                      endpoint="regulations"
                      id={reg.id}
                      confirmText={`Hapus regulasi "${reg.title_id}"? Tindakan ini tidak bisa dibatalkan.`}
                    />
                  </td>
                </tr>
              ))}
              {(!regulations || regulations.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Belum ada regulasi. Klik &quot;Tambah Regulasi Baru&quot; untuk menginput data ke database.
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
