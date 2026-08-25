import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

// Simpan pesan dari form kontak publik. Memakai service-role karena
// pengunjung anonim; input divalidasi dan dibatasi panjangnya.
const MAX_LEN = 2000

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)

    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const subject = typeof body?.subject === 'string' ? body.subject.trim().slice(0, 200) : null
    const message = typeof body?.message === 'string' ? body.message.trim() : ''

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nama, email, dan pesan wajib diisi.' },
        { status: 400 }
      )
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Format email tidak valid.' }, { status: 400 })
    }
    if (message.length > MAX_LEN) {
      return NextResponse.json(
        { error: `Pesan maksimal ${MAX_LEN} karakter.` },
        { status: 400 }
      )
    }

    const admin = createAdminClient()
    const { error } = await admin.from('contact_messages').insert({
      name: name.slice(0, 100),
      email: email.slice(0, 200),
      subject,
      message,
    })

    if (error) {
      console.error('[Contact]', error.message)
      return NextResponse.json({ error: 'Gagal menyimpan pesan.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Contact]', error)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}
