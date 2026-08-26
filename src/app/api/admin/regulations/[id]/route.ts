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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await requireAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = pickFields(body)

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Tidak ada perubahan.' }, { status: 400 })
    }

    const { error } = await supabase
      .from('regulations')
      .update(data)
      .eq('id', id)

    if (error) {
      console.error('[Admin Regulation Update]', error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Admin Regulation Update]', error)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await requireAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabase.from('regulations').delete().eq('id', id)

  if (error) {
    console.error('[Admin Regulation Delete]', error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
