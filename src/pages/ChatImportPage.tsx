import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePersonaStore } from '@/stores/personaStore'
import { useChatStore } from '@/stores/chatStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { storage } from '@/db/httpStorage'
import { completion, getLLMConfig } from '@/llm/adapter'
import { buildChatAnalyzerPrompt, buildGeneratorPrompt } from '@/llm/prompts'
import {
  parseChatLabJSON,
  parseJSONL,
  getParticipants,
  formatMessageForPrompt,
  filterTargetMessages,
  filterContextMessages,
} from '@/data/chatLabFormat'
import type { ChatLabFile, ChatLabMessage, Participant } from '@/data/chatLabFormat'
import type { PersonaVersion, BaseProfile } from '@/types'

type Stage = 'upload' | 'preview' | 'analyzing' | 'generating' | 'done' | 'error'

export default function ChatImportPage() {
  const navigate = useNavigate()
  const { createPersona } = usePersonaStore()
  const chatStore = useChatStore()
  const { config, isConfigured } = useSettingsStore()

  const [stage, setStage] = useState<Stage>('upload')
  const [chatFile, setChatFile] = useState<ChatLabFile | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [selectedPerson, setSelectedPerson] = useState<string>('')
  const [maxMessages, setMaxMessages] = useState(5000)
  const [useAll, setUseAll] = useState(true)
  const [skillContent, setSkillContent] = useState('')
  const [error, setError] = useState('')
  const [statusText, setStatusText] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setError('')

    try {
      const text = await file.text()
      let data: ChatLabFile | null = null

      if (file.name.endsWith('.jsonl')) {
        data = parseJSONL(text)
      } else {
        data = parseChatLabJSON(text)
      }

      if (!data) {
        setError('无法识别该文件格式。请使用 ChatLab 标准化格式的 JSON/JSONL 文件。')
        return
      }

      setChatFile(data)
      const parts = getParticipants(data.messages, data.members)
      setParticipants(parts)
      if (parts.length > 0) setSelectedPerson(parts[0].platformId)
      setStage('preview')
    } catch {
      setError('文件读取失败，请检查文件是否损坏。')
    }
  }

  const handleAnalyze = async () => {
    if (!chatFile || !selectedPerson) return
    if (!isConfigured) { alert('请先在设置中配置 API Key'); navigate('/settings'); return }

    setStage('analyzing')
    setStatusText('正在分析对话风格...')

    try {
      const participant = participants.find((p) => p.platformId === selectedPerson)
      const personName = participant?.accountName || selectedPerson

      const targetMsgs = filterTargetMessages(
        chatFile.messages,
        selectedPerson,
        useAll ? 0 : maxMessages,
      )

      if (targetMsgs.length === 0) {
        setError('所选人物的发言为空，请检查选择。')
        setStage('error')
        return
      }

      const allFiltered = filterContextMessages(chatFile.messages, selectedPerson, targetMsgs)
      const nameMap = new Map<string, string>()
      for (const p of participants) nameMap.set(p.platformId, p.accountName)

      const formattedLines = allFiltered.map((m) => formatMessageForPrompt(m, nameMap))
      const chatText = formattedLines.join('\n')

      const llmConfig = getLLMConfig()
      const analyzerPrompt = buildChatAnalyzerPrompt(chatText, personName)

      const analyzerResult = await completion(
        { systemPrompt: analyzerPrompt, userPrompt: 'Analyze this chat data and return JSON.', maxTokens: 8192 },
        llmConfig,
      )

      let analyzerJson: string
      try {
        JSON.parse(analyzerResult.content)
        analyzerJson = analyzerResult.content
      } catch {
        analyzerJson = analyzerResult.content.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        JSON.parse(analyzerJson)
      }

      setStage('generating')
      setStatusText('正在生成 SKILL.md...')

      const generatorPrompt = buildGeneratorPrompt(analyzerJson, personName)
      const generatorResult = await completion(
        { systemPrompt: generatorPrompt, userPrompt: 'Generate the complete SKILL.md file.', maxTokens: 8192 },
        llmConfig,
      )

      const content = generatorResult.content
      setSkillContent(content)

      const persona = await createPersona(personName)
      const version: PersonaVersion = {
        id: crypto.randomUUID(),
        personaId: persona.id,
        name: `聊天记录蒸馏: ${personName}`,
        createdAt: Date.now(),
        baseProfile: { name: personName, createdAt: Date.now() } as BaseProfile,
        answers: [],
        personalityTraits: [],
        cognitiveProfile: { decisionStyle: '', informationProcessing: '', problemSolving: '', riskAttitude: '', scores: {} },
        valueProfile: { priorities: [], scores: {}, dilemmas: [] },
        expressionDNA: { sentenceStyle: '', vocabularyPatterns: [], humorStyle: '', emotionExpression: '', certaintyLevel: '', openEndedSamples: [] },
        relationshipProfile: { withFriends: '', withLovers: '', withFamily: '', withColleagues: '', scores: {} },
        generatedSkill: { content, generatedAt: Date.now(), modelUsed: llmConfig.model },
      }
      await storage.versions.create(version)

      chatStore.setSystemPrompt(content)
      setStage('done')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setStage('error')
    }
  }

  const selectedParticipant = participants.find((p) => p.platformId === selectedPerson)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
        &larr; 返回
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">从聊天记录蒸馏</h1>
      <p className="text-sm text-gray-400 mb-8">
        上传 ChatLab 标准化格式的聊天记录 JSON/JSONL 文件，AI 将分析对话内容并提取人格特征。
      </p>

      {stage === 'upload' && (
        <div className="card text-center py-12">
          <input ref={fileRef} type="file" accept=".json,.jsonl" onChange={handleFile} className="hidden" />
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors"
          >
            <div className="text-4xl mb-4">&#x1f4c1;</div>
            <p className="text-gray-500 font-medium">点击选择文件</p>
            <p className="text-xs text-gray-400 mt-2">支持 .json 和 .jsonl 格式</p>
          </div>
          {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
          <p className="text-xs text-gray-300 mt-6">
            兼容 ChatLab 标准化格式（v0.0.2）。JSON 或 JSONL 均可。
          </p>
        </div>
      )}

      {stage === 'preview' && chatFile && (
        <div className="space-y-6">
          <div className="card">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">对话名称</span>
                <p className="font-medium text-gray-800">{chatFile.header.meta.name}</p>
              </div>
              <div>
                <span className="text-gray-400">平台</span>
                <p className="font-medium text-gray-800">{chatFile.header.meta.platform}</p>
              </div>
              <div>
                <span className="text-gray-400">类型</span>
                <p className="font-medium text-gray-800">{chatFile.header.meta.type === 'group' ? '群聊' : '私聊'}</p>
              </div>
              <div>
                <span className="text-gray-400">消息总数</span>
                <p className="font-medium text-gray-800">{chatFile.messages.length.toLocaleString()} 条</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">时间跨度</span>
                <p className="font-medium text-gray-800">
                  {new Date(chatFile.messages[0].timestamp * 1000).toLocaleDateString('zh-CN')}
                  {' — '}
                  {new Date(chatFile.messages[chatFile.messages.length - 1].timestamp * 1000).toLocaleDateString('zh-CN')}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-gray-800 mb-3">选择要蒸馏的人</h2>
            <div className="space-y-2">
              {participants.map((p) => (
                <button
                  key={p.platformId}
                  onClick={() => setSelectedPerson(p.platformId)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedPerson === p.platformId
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-800">{p.accountName}</span>
                      {p.groupNickname && (
                        <span className="text-xs text-gray-400 ml-2">({p.groupNickname})</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">{p.messageCount.toLocaleString()} 条发言</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-gray-800 mb-3">消息范围</h2>
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="radio" checked={useAll} onChange={() => setUseAll(true)} className="text-indigo-600" />
                全部消息
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="radio" checked={!useAll} onChange={() => setUseAll(false)} className="text-indigo-600" />
                最近
                <input
                  type="number"
                  value={maxMessages}
                  onChange={(e) => setMaxMessages(Math.max(100, Number(e.target.value)))}
                  disabled={useAll}
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                />
                条
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              所选人物共有 {selectedParticipant?.messageCount.toLocaleString() || 0} 条发言。
              {!useAll && maxMessages > (selectedParticipant?.messageCount || 0) && (
                <span className="text-amber-500 ml-1">实际可用数量少于设定值。</span>
              )}
            </p>
          </div>

          <button onClick={handleAnalyze} className="btn-primary w-full" disabled={!isConfigured}>
            开始蒸馏
          </button>
          {!isConfigured && (
            <p className="text-xs text-red-400 text-center">请先在设置中配置 API Key</p>
          )}

          <button onClick={() => { setStage('upload'); setChatFile(null); setFileName('') }} className="btn-secondary w-full">
            重新选择文件
          </button>
        </div>
      )}

      {(stage === 'analyzing' || stage === 'generating') && (
        <div className="card text-center py-12">
          <div className="animate-pulse text-gray-500 mb-2">{statusText}</div>
          <p className="text-xs text-gray-300">处理大量消息时可能需要 1-3 分钟</p>
        </div>
      )}

      {stage === 'error' && (
        <div className="card text-center py-8 border-red-200">
          <p className="text-red-500 mb-2">分析失败</p>
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <button onClick={() => setStage('preview')} className="btn-primary">返回预览</button>
          <button onClick={() => { setStage('upload'); setChatFile(null) }} className="btn-secondary mt-2 block w-full">重新选择文件</button>
        </div>
      )}

      {stage === 'done' && skillContent && (
        <div className="space-y-4">
          <div className="card border-green-200 bg-green-50 text-center py-6">
            <div className="text-3xl mb-2">&#x2705;</div>
            <p className="text-green-700 font-semibold">蒸馏完成</p>
            <p className="text-sm text-green-600 mt-1">AI 人格已生成，可以开始对话或下载 SKILL.md</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => {
              const blob = new Blob([skillContent], { type: 'text/markdown' })
              const a = document.createElement('a')
              a.href = URL.createObjectURL(blob)
              a.download = `${(selectedParticipant?.accountName || 'persona').replace(/\s+/g, '-').toLowerCase()}-perspective.SKILL.md`
              a.click()
            }} className="btn-secondary flex-1 text-sm">
              下载 SKILL.md
            </button>
            <button onClick={() => navigate('/')} className="btn-primary flex-1 text-sm">
              返回首页
            </button>
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="bg-gray-800 text-gray-300 text-xs px-4 py-2 font-mono">
              {(selectedParticipant?.accountName || 'persona').replace(/\s+/g, '-').toLowerCase()}-perspective.SKILL.md
            </div>
            <div className="p-4 max-h-[400px] overflow-y-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap text-gray-700 leading-relaxed">
                {skillContent.slice(0, 5000)}
                {skillContent.length > 5000 && '\n\n... (内容较长，已截断显示)'}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
