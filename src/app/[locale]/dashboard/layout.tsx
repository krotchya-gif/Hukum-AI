import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}/login`)
  }

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Profil bisa hilang (mis. OAuth tanpa profil). Buat ulang via
  // service-role agar dashboard tidak crash untuk user tersebut.
  if (!profile) {
    const admin = createAdminClient()
    const fullName =
      user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pengguna'
    await admin.from('profiles').upsert(
      { id: user.id, full_name: fullName, tier: 'free' },
      { onConflict: 'id' }
    )
    const { data: recreated } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = recreated ?? {
      id: user.id,
      full_name: fullName,
      avatar_url: null,
      role: 'user',
      tier: 'free',
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          <DashboardSidebar profile={profile} locale={locale} />
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
