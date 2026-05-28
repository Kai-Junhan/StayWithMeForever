import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePersonaStore } from '@/stores/personaStore'
import { storage } from '@/db/httpStorage'
import type { PersonaVersion, BaseProfile } from '@/types'

export default function PersonaDetailPage() {
  const { personaId } = useParams<{ personaId: string }>()
  const navigate = useNavigate()
  const { personas, loadPersonas, renamePersona } = usePersonaStore()
  const [versions, setVersions] = useState<PersonaVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [editingVersion, setEditingVersion] = useState<{ id: string; name: string } | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  const persona = personas.find((p) => p.id === personaId)

  useEffect(() => {
    if (personaId) {
      loadData()
    }
  }, [personaId])

  useEffect(() => {
    if (editingVersion) {
      editInputRef.current?.focus()
      editInputRef.current?.select()
    }
  }, [editingVersion])

  const loadData = async () => {
    if (!personaId) return
    setLoading(true)
    await loadPersonas()
    const v = (await storage.versions.listByPersona(personaId)) as PersonaVersion[]
    setVersions(v || [])
    setLoading(false)
  }

  const makeEmptyVersion = (personaId: string, name: string): PersonaVersion => ({
    id: crypto.randomUUID(),
    personaId,
    name,
    createdAt: Date.now(),
    baseProfile: {} as BaseProfile,
    answers: [],
    personalityTraits: [],
    cognitiveProfile: {
      decisionStyle: '',
      informationProcessing: '',
      problemSolving: '',
      riskAttitude: '',
      scores: {},
    },
    valueProfile: { priorities: [], scores: {}, dilemmas: [] },
    expressionDNA: {
      sentenceStyle: '',
      vocabularyPatterns: [],
      humorStyle: '',
      emotionExpression: '',
      certaintyLevel: '',
      openEndedSamples: [],
    },
    relationshipProfile: {
      withFriends: '',
      withLovers: '',
      withFamily: '',
      withColleagues: '',
      scores: {},
    },
    generatedSkill: null,
  })

  const handleStartQuestionnaire = async () => {
    if (!personaId) return
    const latest = versions.length > 0 ? versions[versions.length - 1] : null
    let version: PersonaVersion

    if (latest) {
      const name = prompt(
        `「${persona?.name}」已有问卷记录（${latest.name}）。\n\n给新版本取个名字（如"2026年的我"），留空则覆盖最新版本：`,
      )
      if (name === null) return
      if (!name?.trim()) {
        navigate(`/questionnaire/${latest.id}`)
        return
      }
      version = makeEmptyVersion(personaId, name.trim())
    } else {
      version = makeEmptyVersion(personaId, `${persona?.name || ''} 的基础画像`)
    }

    await storage.versions.create(version)
    setVersions((prev) => [...prev, version])
    navigate(`/questionnaire/${version.id}`)
  }

  const handleStartChat = async (versionId: string) => {
    const version = versions.find((v) => v.id === versionId)
    if (!version?.generatedSkill) {
      alert('该版本尚未生成 Skill，请先完成问卷。')
      return
    }
    navigate(`/chat/${versionId}`)
  }

  const handleRename = async () => {
    if (!persona) return
    const name = window.prompt('新名称：', persona.name)
    if (!name?.trim()) return
    await renamePersona(persona.id, name.trim())
  }

  const handleRenameVersion = (versionId: string, currentName: string) => {
    setEditingVersion({ id: versionId, name: currentName })
  }

  const handleSaveRename = async () => {
    if (!editingVersion) return
    const name = editingVersion.name.trim()
    if (!name) return
    await storage.versions.update(editingVersion.id, { name })
    setEditingVersion(null)
    await loadData()
  }

  const handleCancelRename = () => {
    setEditingVersion(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        加载中...
      </div>
    )
  }

  if (!persona) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">未找到此人格。</p>
        <button onClick={() => navigate('/')} className="btn-secondary">
          返回首页
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
        &larr; 返回首页
      </button>

      <header className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">{persona.name}</h1>
          <button onClick={handleRename} className="text-gray-300 hover:text-gray-500 text-sm">
            重命名
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          创建于 {new Date(persona.createdAt).toLocaleDateString('zh-CN')}
        </p>
      </header>

      <section className="mb-8">
        <div className="flex gap-4">
          <button onClick={handleStartQuestionnaire} className="btn-primary">
            {versions.length > 0 ? '+ 新版本问卷' : '开始问卷'}
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          人格版本 ({versions.length})
        </h2>

        {versions.length === 0 && (
          <div className="card text-center py-12 text-gray-400">
            还没有任何版本记录。
            <br />
            点击"开始问卷"创建第一个版本。
          </div>
        )}

        <div className="space-y-3">
          {versions
            .slice()
            .reverse()
            .map((version) => (
              <div key={version.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    {editingVersion?.id === version.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          ref={editInputRef}
                          value={editingVersion.name}
                          onChange={(e) => setEditingVersion({ ...editingVersion, name: e.target.value })}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveRename(); if (e.key === 'Escape') handleCancelRename() }}
                          className="input-field py-1 px-2 text-sm w-48"
                        />
                        <button onClick={handleSaveRename} className="text-xs text-green-600 hover:text-green-700">保存</button>
                        <button onClick={handleCancelRename} className="text-xs text-gray-400 hover:text-gray-600">取消</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{version.name}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRenameVersion(version.id, version.name)
                          }}
                          className="text-gray-300 hover:text-gray-500 text-xs"
                        >
                          重命名
                        </button>
                      </div>
                    )}
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(version.createdAt).toLocaleDateString('zh-CN')}
                      {' · '}
                      {version.answers.length} 题已答
                      {' · '}
                      {version.generatedSkill ? 'Skill 已生成' : '尚未生成 Skill'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {version.generatedSkill && (
                      <>
                        <button
                          onClick={() => handleStartChat(version.id)}
                          className="text-sm px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          聊天
                        </button>
                        <button
                          onClick={() => navigate(`/skill/${version.id}`)}
                          className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          查看 Skill
                        </button>
                      </>
                    )}
                    {!version.generatedSkill && version.answers.length > 0 && (
                      <button
                        onClick={() => navigate(`/skill/${version.id}`)}
                        className="text-sm px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        生成 Skill
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/questionnaire/${version.id}`)}
                      className="text-sm px-3 py-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      继续答题
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}
