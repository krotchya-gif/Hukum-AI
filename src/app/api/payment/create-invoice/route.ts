import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

// Membuat invoice Xendit untuk upgrade Premium.
// Harga DITETAPKAN DI SERVER berdasarkan pilihan paket — nominal tidak
// pernah diterima dari client. Setelah pembayaran sukses, Xendit yang
// memanggil /api/webhook/payment untuk meng-upgrade tier.
const PLANS: Record<string, { amount: number; description: { id: string; en: string } }> = {
  monthly: {
    amount: 49000,
    description: { id: 'Langganan Premium Bulanan HukumAI', en: 'HukumAI Monthly Premium Subscription' },
  },
  yearly: {
    amount: 399000,
    description: { id: 'Langganan Premium Tahunan HukumAI', en: 'HukumAI Annual Premium Subscription' },
  },
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Silakan login terlebih dahulu.' }, { status: 401 })
    }

    const { plan } = await req.json()
    const selectedPlan = PLANS[plan]
    if (!selectedPlan) {
      return NextResponse.json({ error: 'Paket tidak dikenal.' }, { status: 400 })
    }

    const secretKey = process.env.XENDIT_SECRET_KEY
    if (!secretKey) {
      console.error('[Payment] XENDIT_SECRET_KEY belum diset')
      return NextResponse.json(
        { error: 'Pembayaran belum dikonfigurasi. Silakan coba lagi nanti.' },
        { status: 500 }
      )
    }

    const locale = req.nextUrl.searchParams.get('locale') === 'en' ? 'en' : 'id'
    const origin = req.nextUrl.origin
    // Suffix waktu membuat external_id unik per invoice; webhook mengambil
    // UUID di segmen pertama setelah prefix.
    const externalId = `premium_upgrade_${user.id}_${Date.now()}`

    const res = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_id: externalId,
        amount: selectedPlan.amount,
        payer_email: user.email,
        description: selectedPlan.description[locale],
        success_redirect_url: `${origin}/${locale}/dashboard/langganan?payment=success`,
        failure_redirect_url: `${origin}/${locale}/dashboard/langganan?payment=failed`,
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.invoice_url) {
      console.error('[Payment] Xendit error:', data)
      return NextResponse.json(
        { error: 'Gagal membuat invoice pembayaran. Silakan coba lagi.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ url: data.invoice_url })
  } catch (error) {
    console.error('[Payment Error]', error)
    return NextResponse.json({ error: 'Terjadi kesalahan saat memproses pembayaran.' }, { status: 500 })
  }
}
