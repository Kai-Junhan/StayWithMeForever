import type {
  LLMConfig,
  LLMCompletionRequest,
  LLMCompletionResponse,
  LLMProvider,
} from '@/types'

const DEFAULT_MODELS: Record<LLMProvider, string> = {
  deepseek: 'deepseek-chat',
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-4-20250514',
  ollama: 'llama3',
}

const DEFAULT_BASE_URLS: Record<LLMProvider, string> = {
  deepseek: 'https://api.deepseek.com',
  openai: 'https://api.openai.com/v1',
  anthropic: 'https://api.anthropic.com',
  ollama: 'http://localhost:11434',
}

function getStoredConfig(): LLMConfig | null {
  const stored = localStorage.getItem('swmf-llm-config')
  if (!stored) return null
  try {
    return JSON.parse(stored) as LLMConfig
  } catch {
    return null
  }
}

export function getLLMConfig(): LLMConfig {
  const stored = getStoredConfig()
  if (stored) return stored

  return {
    provider: 'deepseek',
    apiKey: '',
    model: DEFAULT_MODELS.deepseek,
    baseUrl: DEFAULT_BASE_URLS.deepseek,
  }
}

export function saveLLMConfig(config: LLMConfig): void {
  localStorage.setItem('swmf-llm-config', JSON.stringify(config))
}

export function getDefaultModel(provider: LLMProvider): string {
  return DEFAULT_MODELS[provider]
}

export function getDefaultBaseUrl(provider: LLMProvider): string {
  return DEFAULT_BASE_URLS[provider]
}

function buildPrompt(systemPrompt: string, userPrompt: string): string {
  return `${systemPrompt}\n\nUser: ${userPrompt}\n\nAssistant:`
}

export async function completion(
  request: LLMCompletionRequest,
  config?: LLMConfig,
): Promise<LLMCompletionResponse> {
  const llmConfig = config || getLLMConfig()

  if (!llmConfig.apiKey && llmConfig.provider !== 'ollama') {
    throw new Error(
      `API Key for ${llmConfig.provider} is not set. Please configure it in Settings.`,
    )
  }

  switch (llmConfig.provider) {
    case 'deepseek':
      return deepseekCompletion(request, llmConfig)
    case 'openai':
      return openaiCompletion(request, llmConfig)
    case 'anthropic':
      return anthropicCompletion(request, llmConfig)
    case 'ollama':
      return ollamaCompletion(request, llmConfig)
  }
}

async function deepseekCompletion(
  request: LLMCompletionRequest,
  config: LLMConfig,
): Promise<LLMCompletionResponse> {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URLS.deepseek
  const body = {
    model: config.model || DEFAULT_MODELS.deepseek,
    messages: [
      { role: 'system', content: request.systemPrompt },
      { role: 'user', content: request.userPrompt },
    ],
    temperature: request.temperature ?? 0.7,
    max_tokens: request.maxTokens ?? 4096,
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`DeepSeek API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  return {
    content: data.choices[0]?.message?.content || '',
    model: data.model,
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
    },
  }
}

async function openaiCompletion(
  request: LLMCompletionRequest,
  config: LLMConfig,
): Promise<LLMCompletionResponse> {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URLS.openai
  const body = {
    model: config.model || DEFAULT_MODELS.openai,
    messages: [
      { role: 'system', content: request.systemPrompt },
      { role: 'user', content: request.userPrompt },
    ],
    temperature: request.temperature ?? 0.7,
    max_tokens: request.maxTokens ?? 4096,
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenAI API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  return {
    content: data.choices[0]?.message?.content || '',
    model: data.model,
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
    },
  }
}

async function anthropicCompletion(
  request: LLMCompletionRequest,
  config: LLMConfig,
): Promise<LLMCompletionResponse> {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URLS.anthropic
  const body = {
    model: config.model || DEFAULT_MODELS.anthropic,
    max_tokens: request.maxTokens ?? 4096,
    system: request.systemPrompt,
    messages: [{ role: 'user', content: request.userPrompt }],
  }

  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Anthropic API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  return {
    content: data.content?.[0]?.text || '',
    model: data.model,
    usage: {
      promptTokens: data.usage?.input_tokens || 0,
      completionTokens: data.usage?.output_tokens || 0,
    },
  }
}

async function ollamaCompletion(
  request: LLMCompletionRequest,
  config: LLMConfig,
): Promise<LLMCompletionResponse> {
  const baseUrl = config.baseUrl || DEFAULT_BASE_URLS.ollama
  const body = {
    model: config.model || DEFAULT_MODELS.ollama,
    prompt: buildPrompt(request.systemPrompt, request.userPrompt),
    options: {
      temperature: request.temperature ?? 0.7,
    },
    stream: false,
  }

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Ollama error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  return {
    content: data.response || '',
    model: data.model,
    usage: {
      promptTokens: data.prompt_eval_count || 0,
      completionTokens: data.eval_count || 0,
    },
  }
}

export async function testConnection(config: LLMConfig): Promise<boolean> {
  try {
    await completion(
      {
        systemPrompt: 'Reply with just the word "OK".',
        userPrompt: 'Test',
        maxTokens: 10,
      },
      config,
    )
    return true
  } catch {
    return false
  }
}
