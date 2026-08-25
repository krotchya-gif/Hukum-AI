import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Hapus akun user yang sedang login. Identitas SELALU dari sesi —
// request tanpa body/param sehingga tidak bisa menyasar akun lain.
export async function POST() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(user.id)

  if (error) {
    console.error('[Delete Account]', error.message)
    return NextResponse.json({ error: 'Gagal menghapus akun.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
