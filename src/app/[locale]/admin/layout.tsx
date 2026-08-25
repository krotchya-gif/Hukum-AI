import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Newspaper, Gavel, Settings, LogOut } from 'lucide-react'

export default async function AdminLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect(`/${locale}`)
  }

  const isID = locale === 'id'

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-primary text-white shrink-0 border-r border-primary/20 shadow-xl">
        <div className="p-6 border-b border-white/10">
          <Link href={`/${locale}/admin`} className="flex items-center gap-2">
            <span className="font-display text-xl font-bold tracking-tight">
              HRP <span className="text-accent">ADMIN</span>
            </span>
          </Link>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2">
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4 px-2">Menu</p>
          <Link href={`/${locale}/admin`}>
            <Button variant="ghost" className="w-full justify-start gap-3 text-white/80 hover:text-white hover:bg-white/10">
              <LayoutDashboard className="size-5" />
              {isID ? 'Dashboard' : 'Dashboard'}
            </Button>
          </Link>
          <Link href={`/${locale}/admin/berita`}>
            <Button variant="ghost" className="w-full justify-start gap-3 text-white/80 hover:text-white hover:bg-white/10">
              <Newspaper className="size-5" />
              {isID ? 'Kelola Berita' : 'Manage News'}
            </Button>
          </Link>
          <Link href={`/${locale}/admin/regulasi`}>
            <Button variant="ghost" className="w-full justify-start gap-3 text-white/80 hover:text-white hover:bg-white/10">
              <Gavel className="size-5" />
              {isID ? 'Kelola Regulasi' : 'Manage Regulations'}
            </Button>
          </Link>
          <Link href={`/${locale}/admin/settings`}>
            <Button variant="ghost" className="w-full justify-start gap-3 text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-50" disabled>
              <Settings className="size-5" />
              {isID ? 'Pengaturan' : 'Settings'}
            </Button>
          </Link>
        </div>
        <div className="p-4 border-t border-white/10">
          <Link href={`/${locale}`}>
            <Button variant="ghost" className="w-full justify-start gap-3 text-red-300 hover:text-red-200 hover:bg-red-500/20">
              <LogOut className="size-5" />
              Keluar Admin
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto w-full">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <h2 className="font-semibold text-primary">Admin Panel</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground w-max text-right">Login as <b className="text-primary">Super Admin</b></span>
          </div>
        </header>
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
