import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { storage } from '@/db/httpStorage'
import { useChatStore } from '@/stores/chatStore'
import { useSettingsStore } from '@/stores/settingsStore'
import type { PersonaVersion } from '@/types'

export default function ChatPage() {
  const { versionId } = useParams<{ versionId: string }>()
  const navigate = useNavigate()
  const chatStore = useChatStore()
  const { config, isConfigured } = useSettingsStore()
  const [version, setVersion] = useState<PersonaVersion | null>(null)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (versionId) initChat()
  }, [versionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatStore.messages])

  const initChat = async () => {
    if (!versionId) return
    const v = (await storage.versions.get(versionId)) as PersonaVersion | null
    if (!v) { navigate('/'); return }
    setVersion(v)
    if (v.generatedSkill) chatStore.setSystemPrompt(v.generatedSkill.content)
    await chatStore.loadSessions(versionId)
    if (chatStore.sessions.length === 0) {
      const session = await chatStore.createSession(versionId, `与 ${v.name || '人格'} 的对话`)
      chatStore.selectSession(session)
    } else {
      await chatStore.selectSession(chatStore.sessions[0])
    }
  }

  const handleSend = async () => {
    if (!input.trim() || chatStore.streaming) return
    if (!isConfigured) { alert('请先在设置中配置 API Key'); navigate('/settings'); return }
    if (!chatStore.currentSession) {
      if (!versionId) return
      const session = await chatStore.createSession(versionId)
      chatStore.selectSession(session)
    }
    const msg = input.trim()
    setInput('')
    await chatStore.sendMessage(msg)
    inputRef.current?.focus()
  }

  const handleNewSession = async () => {
    if (!versionId) return
    const session = await chatStore.createSession(versionId, `对话 ${chatStore.sessions.length + 1}`)
    await chatStore.selectSession(session)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  if (!version) {
    return <div className="flex items-center justify-center min-h-screen text-gray-400">加载中...</div>
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/persona/${version.personaId}`)} className="text-gray-400 hover:text-gray-600">&larr;</button>
          <div>
            <h1 className="font-semibold text-gray-900">{chatStore.currentSession?.title || `与 ${version.name} 聊天`}</h1>
            <p className="text-xs text-gray-400">{version.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleNewSession} className="text-xs px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">新对话</button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {chatStore.messages.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">&#x1f4ac;</div>
            <p>开始和 &ldquo;{version.name}&rdquo; 对话吧</p>
            <p className="text-xs mt-2">此 AI 人格基于你填写的问卷数据生成</p>
          </div>
        )}
        {chatStore.sessions.length > 1 && (
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            {chatStore.sessions.map((s) => (
              <button key={s.id} onClick={() => chatStore.selectSession(s)}
                className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  s.id === chatStore.currentSession?.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}>{s.title.slice(0, 20)}</button>
            ))}
          </div>
        )}
        {chatStore.messages.filter((m) => m.role !== 'system').map((msg) => (
          <div key={msg.id} className={`mb-6 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
            }`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-indigo-200' : 'text-gray-300'}`}>
                {new Date(msg.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {chatStore.streaming && (
          <div className="flex justify-start mb-6">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown} placeholder="输入消息..." disabled={chatStore.streaming}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:opacity-50" autoFocus />
          <button onClick={handleSend} disabled={!input.trim() || chatStore.streaming || !isConfigured}
            className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        {!isConfigured && <p className="text-xs text-red-400 text-center mt-2">请先<a href="/settings" className="underline">配置 API Key</a></p>}
      </div>
    </div>
  )
}
