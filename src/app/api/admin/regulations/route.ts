import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/utils/supabase/admin-guard'

const REGULATION_TYPES = ['uu', 'pp', 'perda', 'permen', 'putusan']
const REGULATION_STATUSES = ['berlaku', 'dicabut', 'diubah']

const REGULATION_FIELDS = [
  'number', 'title_id', 'title_en', 'slug', 'about_id', 'about_en',
  'issued_date', 'effective_date', 'issuing_body', 'file_url',
  'full_text', 'is_premium', 'is_published',
] as const

function pickFields(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {}
  for (const field of REGULATION_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field]
  }
  if (typeof body.type === 'string' && REGULATION_TYPES.includes(body.type)) {
    data.type = body.type
  }
  if (typeof body.status === 'string' && REGULATION_STATUSES.includes(body.status)) {
    data.status = body.status
  }
  return data
}

export async function POST(req: NextRequest) {
  const supabase = await requireAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    if (!body?.title_id) {
      return NextResponse.json({ error: 'Judul (ID) wajib diisi.' }, { status: 400 })
    }

    const data = pickFields(body)
    if (!data.type || !data.slug) {
      return NextResponse.json(
        { error: 'Tipe dan slug wajib diisi.' },
        { status: 400 }
      )
    }

    // Kolom is_published punya default TRUE di skema; form admin yang tidak
    // mengirimnya berarti ingin langsung publik.
    if (data.is_published === undefined) data.is_published = true

    const { data: regulation, error } = await supabase
      .from('regulations')
      .insert(data)
      .select('id')
      .single()

    if (error) {
      console.error('[Admin Regulation Create]', error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, id: regulation.id })
  } catch (error) {
    console.error('[Admin Regulation Create]', error)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}
