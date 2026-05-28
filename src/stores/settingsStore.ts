import { create } from 'zustand'
import type { LLMConfig, LLMProvider } from '@/types'
import {
  getLLMConfig as loadConfig,
  saveLLMConfig,
  getDefaultModel,
  getDefaultBaseUrl,
} from '@/llm/adapter'

interface SettingsState {
  config: LLMConfig
  isConfigured: boolean
  setProvider: (provider: LLMProvider) => void
  setApiKey: (key: string) => void
  setModel: (model: string) => void
  setBaseUrl: (url: string) => void
  load: () => void
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  config: { provider: 'deepseek', apiKey: '', model: 'deepseek-chat' },
  isConfigured: false,

  setProvider: (provider) => {
    const state = get()
    const newConfig: LLMConfig = {
      provider,
      apiKey: state.config.apiKey,
      model: getDefaultModel(provider),
      baseUrl: getDefaultBaseUrl(provider),
    }
    saveLLMConfig(newConfig)
    set({ config: newConfig, isConfigured: !!newConfig.apiKey })
  },

  setApiKey: (key) => {
    const state = get()
    const newConfig = { ...state.config, apiKey: key }
    saveLLMConfig(newConfig)
    set({ config: newConfig, isConfigured: !!key })
  },

  setModel: (model) => {
    const state = get()
    const newConfig = { ...state.config, model }
    saveLLMConfig(newConfig)
    set({ config: newConfig })
  },

  setBaseUrl: (url) => {
    const state = get()
    const newConfig = { ...state.config, baseUrl: url || undefined }
    saveLLMConfig(newConfig)
    set({ config: newConfig })
  },

  load: () => {
    const config = loadConfig()
    set({ config, isConfigured: !!config.apiKey })
  },
}))
