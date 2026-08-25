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

export async function POST(req: NextRequest) {
  const supabase = await requireAdmin()
  if (!supabase) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    if (!body?.title_id || !body?.content_id) {
      return NextResponse.json(
        { error: 'Judul (ID) dan konten (ID) wajib diisi.' },
        { status: 400 }
      )
    }

    const data = pickFields(body)
    if (!data.slug && typeof body.slug_auto === 'string') {
      data.slug = body.slug_auto
    }
    if (!data.slug) {
      return NextResponse.json({ error: 'Slug wajib diisi.' }, { status: 400 })
    }

    const { data: article, error } = await supabase
      .from('articles')
      .insert(data)
      .select('id')
      .single()

    if (error) {
      console.error('[Admin Article Create]', error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, id: article.id })
  } catch (error) {
    console.error('[Admin Article Create]', error)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}
