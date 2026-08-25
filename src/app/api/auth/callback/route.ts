import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// `next` hanya boleh path relatif — cegah open redirect
// (mis. next=@evil.com/phish yang mengubah host tujuan redirect).
function safeNextPath(next: string | null): string {
  if (!next) return '/id/dashboard/profil'
  if (!next.startsWith('/') || next.startsWith('//')) return '/id/dashboard/profil'
  return next
}

async function ensureProfile(userId: string, fullName: string | null, avatarUrl: string | null) {
  const admin = createAdminClient()
  const { error } = await admin.from('profiles').upsert({
    id: userId,
    full_name: fullName,
    avatar_url: avatarUrl
  }, { onConflict: 'id', ignoreDuplicates: true })

  if (error) {
    console.error('[Auth] Gagal membuat profil:', error.message)
  }
}

// GET - Handle OAuth callback with code exchange
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = safeNextPath(searchParams.get('next'))

  if (code) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        await ensureProfile(
          user.id,
          user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          user.user_metadata?.avatar_url || null
        )
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/id/login?error=auth_callback_error`)
}

// POST - Handle email/password login
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password diperlukan' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    if (data.user) {
      await ensureProfile(
        data.user.id,
        data.user.user_metadata?.full_name || email.split('@')[0],
        data.user.user_metadata?.avatar_url || null
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Auth Login Error]', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login' },
      { status: 500 }
    )
  }
}
