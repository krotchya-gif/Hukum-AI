import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password diperlukan' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password minimal 8 karakter' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0]
        }
      }
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Buat profil via service-role: saat verifikasi email aktif, signUp
    // tidak mengembalikan sesi sehingga insert sebagai anonim akan ditolak
    // RLS dan profil gagal dibuat diam-diam.
    if (data.user) {
      const admin = createAdminClient()
      const { error: profileError } = await admin.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName || email.split('@')[0],
        avatar_url: null,
        tier: 'free'
      }, { onConflict: 'id' })

      if (profileError) {
        console.error('[Auth Register] Gagal membuat profil:', profileError.message)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil. Silakan cek email untuk verifikasi.'
    })
  } catch (error) {
    console.error('[Auth Register Error]', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat registrasi' },
      { status: 500 }
    )
  }
}
