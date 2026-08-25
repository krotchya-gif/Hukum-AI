import { cookies } from 'next/headers'
import { createClient } from './server'

// Guard untuk endpoint admin: verifikasi sesi + role dari database.
// Mengembalikan client ter-scope user (RLS policy admin yang mengizinkan
// tulis konten) atau null bila bukan admin.
export async function requireAdmin() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return null

  return supabase
}
