import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePersonaStore } from '@/stores/personaStore'
import { storage } from '@/db/httpStorage'
import type { PersonaVersion, BaseProfile } from '@/types'

const MBTI_OPTIONS = [
  { id: 'INTJ', label: 'INTJ - 建筑师' }, { id: 'INTP', label: 'INTP - 逻辑学家' },
  { id: 'ENTJ', label: 'ENTJ - 指挥官' }, { id: 'ENTP', label: 'ENTP - 辩论家' },
  { id: 'INFJ', label: 'INFJ - 提倡者' }, { id: 'INFP', label: 'INFP - 调停者' },
  { id: 'ENFJ', label: 'ENFJ - 主人公' }, { id: 'ENFP', label: 'ENFP - 竞选者' },
  { id: 'ISTJ', label: 'ISTJ - 物流师' }, { id: 'ISFJ', label: 'ISFJ - 守卫者' },
  { id: 'ESTJ', label: 'ESTJ - 总经理' }, { id: 'ESFJ', label: 'ESFJ - 执政官' },
  { id: 'ISTP', label: 'ISTP - 鉴赏家' }, { id: 'ISFP', label: 'ISFP - 探险家' },
  { id: 'ESTP', label: 'ESTP - 企业家' }, { id: 'ESFP', label: 'ESFP - 表演者' },
]

const AGE_OPTIONS = [
  { id: '18-24', label: '18-24 岁' }, { id: '25-34', label: '25-34 岁' },
  { id: '35-44', label: '35-44 岁' }, { id: '45-54', label: '45-54 岁' },
  { id: '55+', label: '55 岁以上' },
]

const OCCUPATION_OPTIONS = [
  { id: 'TECH', label: '技术 / 开发 / 工程' }, { id: 'DESIGN', label: '设计 / 创意 / 艺术' },
  { id: 'BUSINESS', label: '商业 / 管理 / 创业' }, { id: 'EDUCATION', label: '教育 / 研究' },
  { id: 'MEDICAL', label: '医疗 / 健康' }, { id: 'FINANCE', label: '金融 / 咨询' },
  { id: 'MEDIA', label: '媒体 / 内容创作' }, { id: 'STUDENT', label: '学生' },
]

export default function CreatePage() {
  const navigate = useNavigate()
  const { createPersona } = usePersonaStore()
  const [name, setName] = useState('')
  const [mbti, setMbti] = useState('')
  const [age, setAge] = useState('')
  const [occupation, setOccupation] = useState('')
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setCreating(true)
    try {
      const persona = await createPersona(name.trim())

      const version: PersonaVersion = {
        id: crypto.randomUUID(),
        personaId: persona.id,
        name: `${name.trim()} 的基础画像`,
        createdAt: Date.now(),
        baseProfile: {
          name: name.trim(),
          mbti: mbti || undefined,
          ageRange: age || undefined,
          occupation: occupation || undefined,
          createdAt: Date.now(),
        } as BaseProfile,
        answers: [
          { questionId: 'P0-001', section: 'P0-basic', type: 'info', value: name.trim(), timestamp: Date.now() },
          ...(mbti ? [{ questionId: 'P0-002', section: 'P0-basic' as const, type: 'single-choice' as const, value: mbti, timestamp: Date.now() }] : []),
          ...(age ? [{ questionId: 'P0-003', section: 'P0-basic' as const, type: 'single-choice' as const, value: age, timestamp: Date.now() }] : []),
          ...(occupation ? [{ questionId: 'P0-004', section: 'P0-basic' as const, type: 'single-choice' as const, value: occupation, timestamp: Date.now() }] : []),
        ],
        personalityTraits: [],
        cognitiveProfile: { decisionStyle: '', informationProcessing: '', problemSolving: '', riskAttitude: '', scores: {} },
        valueProfile: { priorities: [], scores: {}, dilemmas: [] },
        expressionDNA: { sentenceStyle: '', vocabularyPatterns: [], humorStyle: '', emotionExpression: '', certaintyLevel: '', openEndedSamples: [] },
        relationshipProfile: { withFriends: '', withLovers: '', withFamily: '', withColleagues: '', scores: {} },
        generatedSkill: null,
      }

      await storage.versions.create(version)
      await storage.progress.save(version.id, {
        personaVersionId: version.id,
        currentSection: 'P1-cognitive',
        currentQuestionIndex: 0,
        answers: version.answers,
        startedAt: Date.now(),
        totalQuestions: 0,
        completedQuestions: version.answers.length,
      })
      navigate(`/questionnaire/${version.id}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
        &larr; 返回
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">蒸馏一个人</h1>
      <p className="text-sm text-gray-400 mb-8">填写基本信息后开始问卷，这里的答案会自动作为问卷 P0 的预填内容。</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            名字（必需）<span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入这个人的名字或昵称"
            className="input-field"
            autoFocus
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">MBTI 类型</label>
          <div className="grid grid-cols-4 gap-2">
            {MBTI_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setMbti(mbti === opt.id ? '' : opt.id)}
                className={`text-xs px-2 py-2 rounded-lg border transition-colors ${
                  mbti === opt.id
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {opt.id}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">年龄范围</label>
          <div className="flex gap-2 flex-wrap">
            {AGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAge(age === opt.id ? '' : opt.id)}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  age === opt.id
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">职业领域</label>
          <div className="grid grid-cols-2 gap-2">
            {OCCUPATION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setOccupation(occupation === opt.id ? '' : opt.id)}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors text-left ${
                  occupation === opt.id
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" disabled={creating || !name.trim()} className="btn-primary w-full">
            {creating ? '创建中...' : '创建并开始问卷'}
          </button>
        </div>
      </form>
    </div>
  )
}
