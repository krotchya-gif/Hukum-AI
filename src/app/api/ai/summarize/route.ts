import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { generateAIText } from '@/utils/ai-client'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    const regulationId = typeof body?.regulationId === 'string' ? body.regulationId : null
    const language = body?.language === 'en' ? 'en' : 'id'

    if (!regulationId) {
      return NextResponse.json({ error: 'Regulation ID diperlukan.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const { data: regulation, error: regError } = await supabase
      .from('regulations')
      .select('*')
      .eq('id', regulationId)
      .single()

    if (regError || !regulation) {
      return NextResponse.json({ error: 'Regulasi tidak ditemukan.' }, { status: 404 })
    }

    // Ringkasan yang masih segar dilayani dari cache tanpa menghitung kuota.
    const cacheField = language === 'en' ? 'ai_summary_en' : 'ai_summary_id'
    if (regulation[cacheField] && regulation.ai_summarized_at) {
      const cacheAgeHours = (Date.now() - new Date(regulation.ai_summarized_at).getTime()) / 3600000
      if (cacheAgeHours < 24) {
        return NextResponse.json({ summary: regulation[cacheField], cached: true, cached_at: regulation.ai_summarized_at })
      }
    }

    // Kuota atomik di database sebelum generasi berjalan.
    const { data: allowed, error: quotaError } = await supabase.rpc('consume_ai_quota', {
      p_kind: 'summary',
    })

    if (quotaError) {
      console.error('[AI Summarize] Quota check failed:', quotaError.message)
      return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
    }

    if (!allowed) {
      return NextResponse.json(
        { error: 'Batas harian tercapai', message: 'Anda telah mencapai batas 3 ringkasan hari ini.', upgrade: true },
        { status: 429 }
      )
    }

    const systemPrompt = language === 'en' ? `
You are an expert in Indonesian law. Create a structured summary from the following regulation:

Format output (in English):
## About This Regulation
[1-2 sentences overview]

## Key Points
- [point 1]
- [etc]
` : `
Kamu adalah ahli hukum Indonesia. Buatkan ringkasan dari regulasi/peraturan berikut dengan format terstruktur:

Format output (dalam Bahasa Indonesia):
## Tentang Regulasi Ini
[1-2 kalimat gambaran umum]

## Poin-Poin Utama
- [poin 1]
- [dst]
`

    const contentToSummarize = `
Judul: ${language === 'en' ? regulation.title_en || regulation.title_id : regulation.title_id}
Nomor: ${regulation.number || '-'}
Teks Lengkap: ${(regulation.full_text || regulation.about_id || '-').slice(0, 30000)}
`.trim()

    const summary = await generateAIText({
      systemPrompt,
      maxTokens: 2048,
      messages: [{ role: 'user', content: contentToSummarize }]
    })

    // Cache the summary in database
    const updateData: Partial<Pick<typeof regulation, 'ai_summary_id' | 'ai_summary_en' | 'ai_summarized_at'>> & { ai_summarized_at: string } = {
      [cacheField]: summary,
      ai_summarized_at: new Date().toISOString()
    }

    await supabase
      .from('regulations')
      .update(updateData)
      .eq('id', regulationId)

    return NextResponse.json({
      summary,
      cached: false
    })

  } catch (error) {
    console.error('[AI Summarize Error]', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat ringkasan. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
