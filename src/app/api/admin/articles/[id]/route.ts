import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/utils/supabase/admin-guard'

const ARTICLE_FIELDS = [
  'title_id', 'title_en', 'slug', 'content_id', 'content_en',
  'excerpt_id', 'excerpt_en', 'cover_image', 'category_id',
  'author_name', 'is_premium', 'is_published',
] as const

function pickFields(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {}
  for (const field of ARTICLE_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field]
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
      .from('articles')
      .update(data)
      .eq('id', id)

    if (error) {
      console.error('[Admin Article Update]', error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Admin Article Update]', error)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await requireAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabase.from('articles').delete().eq('id', id)

  if (error) {
    console.error('[Admin Article Delete]', error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
