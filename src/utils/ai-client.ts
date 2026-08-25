import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'

interface AIParams {
  messages: { role: string; content: string }[]
  systemPrompt: string
  maxTokens?: number
}

// Helper to determine which provider to use based on env variables
export function getAIProviderConfig() {
  const provider = process.env.AI_PROVIDER?.toLowerCase() || 'anthropic'
  return {
    provider,
    model: process.env.AI_MODEL_NAME || (provider === 'openai' ? 'gpt-4o-mini' : 'claude-sonnet-4-20250514')
  }
}

// Generate Text for Summarizer
export async function generateAIText({ messages, systemPrompt, maxTokens = 2048 }: AIParams): Promise<string> {
  const { provider, model } = getAIProviderConfig()

  if (provider === 'openai' || provider === 'kimi' || provider === 'moonshot') {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.KIMI_API_KEY || process.env.MINIMAX_API_KEY || 'dummy_key',
      baseURL: process.env.OPENAI_BASE_URL, // e.g. https://api.moonshot.cn/v1 for Kimi
    })

    const response = await openai.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.filter(m => m.role !== 'system')
      ] as any[]
    })
    
    return response.choices[0]?.message?.content || ''
  }

  // Fallback to Anthropic (supports Anthropic and Minimax Anthropic-API)
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || process.env.MINIMAX_API_KEY || 'dummy_key',
    baseURL: process.env.ANTHROPIC_BASE_URL, // e.g. https://api.minimax.io/anthropic
  })

  const claudeMessages = messages.filter(m => m.role !== 'system')

  const message = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: claudeMessages as any
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}

// Generate Stream for Chatbot
export async function generateAIStream({ messages, systemPrompt, maxTokens = 1024 }: AIParams) {
  const { provider, model } = getAIProviderConfig()

  if (provider === 'openai' || provider === 'kimi' || provider === 'moonshot') {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.KIMI_API_KEY || process.env.MINIMAX_API_KEY || 'dummy_key',
      baseURL: process.env.OPENAI_BASE_URL,
    })

    const stream = await openai.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.filter(m => m.role !== 'system')
      ] as any[],
      stream: true
    })

    return { provider: 'openai', stream: stream as AsyncIterable<any> }
  }

  // Anthropic / Minimax
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || process.env.MINIMAX_API_KEY || 'dummy_key',
    baseURL: process.env.ANTHROPIC_BASE_URL,
  })

  const claudeMessages = messages.filter(m => m.role !== 'system')

  const stream = await anthropic.messages.stream({
    model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: claudeMessages as any
  })

  return { provider: 'anthropic', stream }
}
