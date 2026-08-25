import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// Webhook Xendit: dipanggil oleh Xendit saat status invoice berubah.
// Keaslian diverifikasi lewat header x-callback-token (Callback
// Verification Token di dashboard Xendit) — tanpa ini siapa pun bisa
// memalsukan pembayaran.
export async function POST(req: NextRequest) {
  const callbackToken = req.headers.get('x-callback-token')
  const expectedToken = process.env.XENDIT_CALLBACK_TOKEN

  if (!expectedToken || !callbackToken || callbackToken !== expectedToken) {
    return NextResponse.json({ error: 'Invalid callback token' }, { status: 401 })
  }

  let body: { external_id?: string; status?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 })
  }

  const { external_id, status } = body

  if (!external_id || !external_id.startsWith('premium_upgrade_')) {
    return NextResponse.json({ message: 'Ignored: unknown external_id' }, { status: 200 })
  }

  if (status !== 'PAID') {
    // EXPIRED / FAILED dsb. diabaikan — langganan tidak berubah.
    return NextResponse.json({ message: 'Ignored: unpaid status' }, { status: 200 })
  }

  const userId = external_id.replace('premium_upgrade_', '')

  const supabaseAdmin = createAdminClient()

  // Perpanjang dari akhir periode berjalan bila masih premium,
  // sehingga pembayaran lanjutan tidak menghanguskan sisa hari.
  const { data: profile, error: fetchError } = await supabaseAdmin
    .from('profiles')
    .select('subscription_end_at')
    .eq('id', userId)
    .single()

  if (fetchError || !profile) {
    console.error('[Webhook] Profile not found:', userId)
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const currentEnd = profile.subscription_end_at ? new Date(profile.subscription_end_at) : null
  const base = currentEnd && currentEnd > new Date() ? currentEnd : new Date()
  base.setDate(base.getDate() + 30)

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      tier: 'premium',
      subscription_end_at: base.toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('[Webhook Error]', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Tier updated to premium' }, { status: 200 })
}
