import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePersonaStore } from '@/stores/personaStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { storage } from '@/db/httpStorage'
import { createMockPersonaVersion } from '@/data/mockData'
import ImportSkillModal from '@/components/ImportSkillModal'

export default function HomePage() {
  const { personas, loading, loadPersonas, createPersona, deletePersona } = usePersonaStore()
  const { load: loadSettings } = useSettingsStore()
  const navigate = useNavigate()
  const [useMini, setUseMini] = useState(() => localStorage.getItem('swmf-question-mode') === 'mini')
  const [showImport, setShowImport] = useState(false)

  useEffect(() => {
    loadPersonas()
    loadSettings()
  }, [])

  const toggleMode = () => {
    const next = !useMini
    setUseMini(next)
    localStorage.setItem('swmf-question-mode', next ? 'mini' : 'full')
  }

  const handleCreateMock = async () => {
    const persona = await createPersona('Dev Test User')
    const version = createMockPersonaVersion(persona.id, persona.name)
    await storage.versions.create(version as unknown as Record<string, unknown>)
    navigate(`/skill/${version.id}`)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Stay With Me Forever
          </span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          用问卷提炼一个人的思维模式，生成可互动的 AI 人格。
        </p>
        <div className="mt-6 max-w-lg mx-auto space-y-3 text-sm text-gray-400 leading-relaxed">
          <p>
            邀请或导入你重视的那个人，让人格成为关系的延续。
          </p>
          <p>
            记录不同时间的自己，让过去的"你"永远可以被对话。
          </p>
          <p className="text-indigo-400 font-medium">
            总之，请和我永远在一起。
          </p>
        </div>
      </header>

      <div className="flex justify-center mb-4 gap-4">
        <button onClick={() => navigate('/create')} className="btn-primary text-lg px-8 py-4">
          + 蒸馏一个人
        </button>
        <button onClick={() => setShowImport(true)} className="btn-secondary text-lg px-8 py-4">
          导入 Skill
        </button>
        <button onClick={() => navigate('/settings')} className="btn-secondary text-lg px-8 py-4">
          设置 API
        </button>
      </div>

      <div className="flex justify-center mb-8 gap-3 text-sm items-center">
        <button onClick={toggleMode} className={`px-3 py-1 rounded-full border transition-colors ${useMini ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-gray-50 border-gray-200 text-gray-500'
          }`}>
          题库: {useMini ? '精简版 (~20题)' : '完整版 (106题)'}
        </button>
        <button onClick={handleCreateMock} className="px-3 py-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
          开发: 生成测试数据
        </button>
      </div>

      {loading && (
        <div className="text-center text-gray-400 py-12">加载中...</div>
      )}

      {!loading && personas.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-50 flex items-center justify-center">
            <span className="text-4xl">&#x2728;</span>
          </div>
          <p className="text-gray-400 text-base">
            还没有蒸馏过任何人
          </p>
          <p className="text-gray-300 text-sm mt-1">
            点击上方按钮开始你的第一次蒸馏
          </p>
        </div>
      )}

      {!loading && personas.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gray-200" />
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
              已蒸馏的人格
            </h2>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {personas.map((persona) => (
              <div
                key={persona.id}
                className="card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                onClick={() => navigate(`/persona/${persona.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {persona.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(persona.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-400 group-hover:text-indigo-500 transition-colors">
                    查看详情 \u2192
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`确定删除「${persona.name}」吗？相关数据将被永久删除。`)) {
                        deletePersona(persona.id)
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="text-center text-xs text-gray-300 mt-20 pb-6">
        StayWithMeForever \u00b7 本地优先 \u00b7 数据存储在项目 data/ 文件夹中
      </footer>

      {showImport && <ImportSkillModal onClose={() => setShowImport(false)} />}
    </div>
  )
}
