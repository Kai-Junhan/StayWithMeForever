import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { storage } from '@/db/httpStorage'
import { useQuestionnaireStore } from '@/stores/questionnaireStore'
import { useChatStore } from '@/stores/chatStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { completion, getLLMConfig } from '@/llm/adapter'
import { buildAnalyzerPrompt, buildGeneratorPrompt } from '@/llm/prompts'
import type { PersonaVersion } from '@/types'

type Stage = 'loading' | 'ready' | 'analyzing' | 'generating' | 'done' | 'error'

export default function SkillEditorPage() {
  const { versionId } = useParams<{ versionId: string }>()
  const navigate = useNavigate()
  const store = useQuestionnaireStore()
  const chatStore = useChatStore()
  const { config } = useSettingsStore()
  const [version, setVersion] = useState<PersonaVersion | null>(null)
  const [stage, setStage] = useState<Stage>('loading')
  const [skillContent, setSkillContent] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (versionId) loadVersion()
  }, [versionId])

  const loadVersion = async () => {
    if (!versionId) return
    const v = (await storage.versions.get(versionId)) as PersonaVersion | null
    if (!v) { navigate('/'); return }

    if (v.answers.length === 0) {
      const progress = (await storage.progress.get(versionId)) as { answers?: typeof v.answers } | null
      if (progress?.answers?.length) {
        v.answers = progress.answers
        await storage.versions.update(versionId, { answers: progress.answers })
      }
    }
    setVersion(v)
    if (v.generatedSkill) {
      setSkillContent(v.generatedSkill.content)
      setStage('done')
    } else {
      setStage('ready')
    }
  }

  const handleGenerate = async () => {
    if (!version) return
    const cfg = getLLMConfig()
    if (!cfg.apiKey) { navigate('/settings'); return }

    setStage('analyzing')
    try {
      const profileJson = JSON.stringify({
        personaName: version.name,
        baseProfile: version.baseProfile,
        answers: version.answers.map((a) => ({
          questionId: a.questionId, section: a.section, value: a.value,
        })),
      }, null, 2)

      const analyzerPrompt = buildAnalyzerPrompt(profileJson)
      const ar = await completion({ systemPrompt: analyzerPrompt, userPrompt: 'Analyze and return JSON.', maxTokens: 8192 }, cfg)
      let analyzerJson: string
      try { JSON.parse(ar.content); analyzerJson = ar.content }
      catch { analyzerJson = ar.content.replace(/^```json\s*/, '').replace(/\s*```$/, ''); JSON.parse(analyzerJson) }

      setStage('generating')
      const generatorPrompt = buildGeneratorPrompt(analyzerJson, version.name || 'User')
      const gr = await completion({ systemPrompt: generatorPrompt, userPrompt: 'Generate SKILL.md.', maxTokens: 8192 }, cfg)
      const content = gr.content
      setSkillContent(content)

      await storage.versions.update(version.id, {
        generatedSkill: { content, generatedAt: Date.now(), modelUsed: cfg.model },
      })

      setStage('done')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setStage('error')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([skillContent], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${(version?.name || 'persona').replace(/\s+/g, '-').toLowerCase()}-perspective.SKILL.md`
    a.click()
  }

  const handleStartChat = async () => {
    if (!versionId || !skillContent) return
    chatStore.setSystemPrompt(skillContent)
    navigate(`/chat/${versionId}`)
  }

  if (!version) {
    return <div className="flex items-center justify-center min-h-screen text-gray-400">加载中...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(`/persona/${version.personaId}`)} className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
        &larr; 返回人格详情
      </button>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{version.name} · Skill</h1>
        <p className="text-sm text-gray-400 mt-1">{version.answers.length} 道题的数据 · 生成符合 Agent Skills 协议的 SKILL.md</p>
      </header>

      {stage === 'ready' && version.answers.length < 5 && (
        <div className="card text-center py-12 text-gray-400">
          您已回答了 {version.answers.length} 道题。建议至少完成大部分题目后再生成。
          <br />
          <button onClick={() => navigate(`/questionnaire/${version.id}`)} className="btn-primary mt-4">继续答题</button>
        </div>
      )}

      {stage === 'ready' && version.answers.length >= 5 && (
        <div className="card text-center py-8">
          <p className="text-gray-600 mb-4">已收集 {version.answers.length} 道题的回答，可以开始生成 Skill。</p>
          <button onClick={handleGenerate} className="btn-primary" disabled={!config.apiKey}>生成 SKILL.md</button>
          {!config.apiKey && <p className="text-xs text-red-400 mt-2">请先在设置中配置 API Key</p>}
        </div>
      )}

      {(stage === 'analyzing' || stage === 'generating') && (
        <div className="card text-center py-12">
          <div className="animate-pulse text-gray-500">{stage === 'analyzing' ? '正在分析你的认知模式和表达 DNA...' : '正在生成 SKILL.md...'}</div>
          <p className="text-xs text-gray-300 mt-2">这可能需要 30-60 秒</p>
        </div>
      )}

      {stage === 'error' && (
        <div className="card text-center py-8 border-red-200">
          <p className="text-red-500 mb-2">生成失败</p>
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <button onClick={handleGenerate} className="btn-primary">重试</button>
        </div>
      )}

      {stage === 'done' && skillContent && (
        <div>
          <div className="flex gap-3 mb-6">
            <button onClick={handleDownload} className="btn-secondary text-sm">下载 SKILL.md</button>
            <button onClick={handleStartChat} className="btn-primary text-sm">开始聊天</button>
            <button onClick={handleGenerate} className="btn-secondary text-sm">重新生成</button>
          </div>
          <div className="card p-0 overflow-hidden">
            <div className="bg-gray-800 text-gray-300 text-xs px-4 py-2 font-mono">
              {(version?.name || '').replace(/\s+/g, '-').toLowerCase()}-perspective.SKILL.md
            </div>
            <div className="p-6 max-h-[600px] overflow-y-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap text-gray-700 leading-relaxed">{skillContent}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
