import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { generateAIStream } from '@/utils/ai-client'

const CHATBOT_SYSTEM_PROMPT = `Kamu adalah asisten hukum Indonesia yang berpengetahuan luas.
Tugasmu adalah membantu pengguna memahami hukum Indonesia dengan bahasa yang jelas dan mudah dipahami.

Panduan:
- Jawab dalam bahasa yang sama dengan pertanyaan user (ID atau EN)
- Selalu sertakan disclaimer: "Ini adalah informasi hukum umum, bukan nasihat hukum profesional. Konsultasikan dengan advokat untuk kasus spesifik Anda."
- Jika merujuk peraturan, sebutkan nomor dan tahunnya
- Jika tidak tahu, katakan tidak tahu — jangan mengarang
- Maksimum 500 kata per jawaban kecuali diminta lebih detail
- Gunakan format yang mudah dibaca dengan bullet points jika poinnya banyak`

// Batasi beban input: kirim maksimal 20 pesan terakhir,
// masing-masing maksimal 8.000 karakter.
const MAX_MESSAGES = 20
const MAX_MESSAGE_CHARS = 8000

function sanitizeMessages(raw: unknown): { role: 'user' | 'assistant'; content: string }[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (m): m is { role: string; content: unknown } =>
        typeof m === 'object' && m !== null &&
        (m as { role?: unknown }).role !== 'system' &&
        typeof (m as { content?: unknown }).content === 'string' &&
        (m.role === 'user' || m.role === 'assistant')
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: (m.content as string).slice(0, MAX_MESSAGE_CHARS),
    }))
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    const messages = sanitizeMessages(body?.messages)
    const sessionId =
      typeof body?.sessionId === 'string' && body.sessionId.length > 0 && body.sessionId.length <= 100
        ? body.sessionId
        : null

    const lastUserMessage = messages[messages.length - 1]
    if (!lastUserMessage || lastUserMessage.role !== 'user' || !sessionId) {
      return NextResponse.json({ error: 'Payload tidak valid.' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Silakan login terlebih dahulu.' }, { status: 401 })
    }

    // Kuota dicek dan dikonsumsi secara atomik di database SEBELUM
    // generasi berjalan — mencegah race condition dan biaya menganggur.
    const { data: allowed, error: quotaError } = await supabase.rpc('consume_ai_quota', {
      p_kind: 'chat',
    })

    if (quotaError) {
      console.error('[AI Chat] Quota check failed:', quotaError.message)
      return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
    }

    if (!allowed) {
      return NextResponse.json(
        { error: 'Batas harian tercapai', message: 'Anda telah mencapai batas 5 pertanyaan hari ini.', upgrade: true },
        { status: 429 }
      )
    }

    await supabase.from('ai_chat_history').insert({
      user_id: user.id, session_id: sessionId, role: 'user', content: lastUserMessage.content
    })

    const { provider: aiProvider, stream } = await generateAIStream({
      messages,
      systemPrompt: CHATBOT_SYSTEM_PROMPT,
      maxTokens: 1024
    })

    let assistantContent = ''

    if (aiProvider === 'openai') {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || ''
        assistantContent += delta
      }
    } else {
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          assistantContent += event.delta.text
        }
      }
    }

    await supabase.from('ai_chat_history').insert({
      user_id: user.id, session_id: sessionId, role: 'assistant', content: assistantContent
    })

    return NextResponse.json({ content: assistantContent }, {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
    })

  } catch (error) {
    console.error('[AI Chat Error]', error)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}

// GET - Retrieve chat history
export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionId = req.nextUrl.searchParams.get('sessionId')

    let query = supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (sessionId) {
      query = query.eq('session_id', sessionId)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ data })

  } catch (error) {
    console.error('[AI Chat History Error]', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil riwayat chat.' },
      { status: 500 }
    )
  }
}
