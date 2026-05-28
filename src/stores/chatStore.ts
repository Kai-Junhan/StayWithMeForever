import { create } from 'zustand'
import type { ChatSession, ChatMessage } from '@/types'
import { storage } from '@/db/httpStorage'
import { completion, getLLMConfig } from '@/llm/adapter'

interface ChatState {
  sessions: ChatSession[]
  currentSession: ChatSession | null
  messages: ChatMessage[]
  loading: boolean
  streaming: boolean
  systemPrompt: string

  setSystemPrompt: (prompt: string) => void
  loadSessions: (versionId: string) => Promise<void>
  createSession: (versionId: string, title?: string) => Promise<ChatSession>
  deleteSession: (id: string) => Promise<void>
  selectSession: (session: ChatSession) => Promise<void>
  sendMessage: (content: string) => Promise<void>
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  currentSession: null,
  messages: [],
  loading: false,
  streaming: false,
  systemPrompt: '',

  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),

  loadSessions: async (versionId) => {
    const sessions = (await storage.sessions.listByVersion(versionId)) as ChatSession[]
    set({ sessions: sessions || [] })
  },

  createSession: async (versionId, title) => {
    const session: ChatSession = {
      id: crypto.randomUUID(),
      personaVersionId: versionId,
      title: title || `Chat ${new Date().toLocaleString()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    await storage.sessions.create(versionId, session)
    set((s) => ({
      sessions: [session, ...s.sessions],
      currentSession: session,
      messages: [],
    }))
    return session
  },

  deleteSession: async (id) => {
    await storage.sessions.delete(id)
    set((s) => ({
      sessions: s.sessions.filter((cs) => cs.id !== id),
      currentSession: s.currentSession?.id === id ? null : s.currentSession,
      messages: s.currentSession?.id === id ? [] : s.messages,
    }))
  },

  selectSession: async (session) => {
    const messages = (await storage.messages.listBySession(session.id)) as ChatMessage[]
    set({ currentSession: session, messages: messages || [] })
  },

  sendMessage: async (content) => {
    const state = get()
    if (!state.currentSession) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sessionId: state.currentSession.id,
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    await storage.messages.create(state.currentSession.id, userMsg)
    const updatedMessages = [...state.messages, userMsg]
    set({ messages: updatedMessages, streaming: true })

    try {
      const llmConfig = getLLMConfig()
      const response = await completion(
        { systemPrompt: state.systemPrompt, userPrompt: content },
        llmConfig,
      )

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sessionId: state.currentSession.id,
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
      }
      await storage.messages.create(state.currentSession.id, assistantMsg)

      await storage.sessions.update(state.currentSession.id, { updatedAt: Date.now() })

      set((s) => ({
        messages: [...s.messages, assistantMsg],
        streaming: false,
      }))
    } catch (err: unknown) {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sessionId: state.currentSession.id,
        role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : String(err)}`,
        timestamp: Date.now(),
      }
      await storage.messages.create(state.currentSession.id, errorMsg)
      set((s) => ({ messages: [...s.messages, errorMsg], streaming: false }))
    }
  },
}))
