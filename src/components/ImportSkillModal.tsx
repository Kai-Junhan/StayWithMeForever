import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePersonaStore } from '@/stores/personaStore'
import { storage } from '@/db/httpStorage'
import type { PersonaVersion, BaseProfile } from '@/types'

function parseSkillFrontmatter(text: string): { name: string; description: string; body: string } | null {
  const trimmed = text.trim()
  if (!trimmed.startsWith('---')) return null

  const secondSep = trimmed.indexOf('---', 3)
  if (secondSep === -1) return null

  const frontmatter = trimmed.slice(3, secondSep).trim()
  const body = trimmed.slice(secondSep + 3).trim()

  const lines = frontmatter.split('\n')
  let name = ''
  let description = ''

  for (const line of lines) {
    const nameMatch = line.match(/^name:\s*(.+)$/)
    if (nameMatch) {
      name = nameMatch[1].trim().replace(/-perspective$/, '')
    }
    if (line.startsWith('description:') || line.startsWith('description: ')) {
      description = line.replace(/^description:\s*\|?\s*/, '').trim()
    }
  }

  if (!name) return null

  return { name, description, body }
}

export default function ImportSkillModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const { createPersona } = usePersonaStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [importing, setImporting] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setImporting(true)

    try {
      const text = await file.text()
      const parsed = parseSkillFrontmatter(text)

      if (!parsed) {
        setError('不是有效的 SKILL.md 格式。文件必须包含 YAML frontmatter (---)，且至少包含 name 字段。')
        setImporting(false)
        return
      }

      const persona = await createPersona(parsed.name)
      const displayName = parsed.name.replace(/-/g, ' ')

      const version: PersonaVersion = {
        id: crypto.randomUUID(),
        personaId: persona.id,
        name: `导入: ${displayName}`,
        createdAt: Date.now(),
        baseProfile: { name: displayName, createdAt: Date.now() } as BaseProfile,
        answers: [],
        personalityTraits: [],
        cognitiveProfile: { decisionStyle: '', informationProcessing: '', problemSolving: '', riskAttitude: '', scores: {} },
        valueProfile: { priorities: [], scores: {}, dilemmas: [] },
        expressionDNA: { sentenceStyle: '', vocabularyPatterns: [], humorStyle: '', emotionExpression: '', certaintyLevel: '', openEndedSamples: [] },
        relationshipProfile: { withFriends: '', withLovers: '', withFamily: '', withColleagues: '', scores: {} },
        generatedSkill: {
          content: text,
          generatedAt: Date.now(),
          modelUsed: 'imported',
        },
      }

      await storage.versions.create(version)
      navigate(`/persona/${persona.id}`)
    } catch {
      setError('文件读取失败，请重试。')
      setImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 w-full">
        <h2 className="text-xl font-semibold mb-2">导入 SKILL.md</h2>
        <p className="text-sm text-gray-400 mb-6">
          选择一个符合 Agent Skills 协议的 SKILL.md 文件。
          文件须包含 <code className="bg-gray-100 px-1 rounded">---</code> YAML frontmatter，
          且至少包含 <code className="bg-gray-100 px-1 rounded">name:</code> 字段。
        </p>

        <input
          ref={fileRef}
          type="file"
          accept=".md,.SKILL.md"
          onChange={handleFile}
          className="hidden"
        />

        <button
          onClick={() => fileRef.current?.click()}
          disabled={importing}
          className="btn-primary w-full"
        >
          {importing ? '导入中...' : '选择文件'}
        </button>

        {error && (
          <p className="text-sm text-red-500 mt-4">{error}</p>
        )}

        <button onClick={onClose} className="btn-secondary w-full mt-3">
          取消
        </button>
      </div>
    </div>
  )
}
