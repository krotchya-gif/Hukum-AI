import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { Card, CardContent } from '@/components/ui/card'
import { Users, FileText, Gavel, BarChart3 } from 'lucide-react'

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Fetch quick stats
  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: articlesCount } = await supabase.from('articles').select('*', { count: 'exact', head: true })
  const { count: regulationsCount } = await supabase.from('regulations').select('*', { count: 'exact', head: true })

  const stats = [
    { title: 'Total Pengguna', value: usersCount || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Total Artikel', value: articlesCount || 0, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'Total Regulasi', value: regulationsCount || 0, icon: Gavel, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Kunjungan (Bulan Ini)', value: '10.4K', icon: BarChart3, color: 'text-purple-500', bg: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-primary">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Ringkasan data platform HRP Legal hari ini.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`size-14 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`size-7 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border shadow-sm min-h-[400px]">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">Aktivitas Terbaru</h3>
            <div className="text-muted-foreground flex items-center justify-center h-64 border-2 border-dashed rounded-xl bg-gray-50 text-sm">
              Tidak ada aktivitas terbaru.
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm min-h-[400px]">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">Statistik Pendaftaran User</h3>
            <div className="text-muted-foreground flex items-center justify-center h-64 border-2 border-dashed rounded-xl bg-gray-50 text-sm">
              Grafik belum tersedia.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
