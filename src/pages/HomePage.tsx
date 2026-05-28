import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePersonaStore } from '@/stores/personaStore'
import { useSettingsStore } from '@/stores/settingsStore'

export default function HomePage() {
  const { personas, loading, loadPersonas, createPersona, deletePersona } = usePersonaStore()
  const { load: loadSettings } = useSettingsStore()
  const navigate = useNavigate()

  useEffect(() => {
    loadPersonas()
    loadSettings()
  }, [loadPersonas, loadSettings])

  const handleCreate = async () => {
    const name = prompt('请输入这个人的名字（或昵称）：')
    if (!name?.trim()) return
    const persona = await createPersona(name.trim())
    navigate(`/persona/${persona.id}`)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Stay With Me Forever
        </h1>
        <p className="text-lg text-gray-500 max-w-lg mx-auto">
          用问卷提炼一个人的思维模式，生成可互动的 AI 人格。
          <br />
          记录不同时间的自己，让过去的"你"永远可以被对话。
        </p>
      </header>

      <div className="flex justify-center mb-12 gap-4">
        <button onClick={handleCreate} className="btn-primary text-lg px-8 py-4">
          + 蒸馏一个人
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="btn-secondary text-lg px-8 py-4"
        >
          设置 API
        </button>
      </div>

      {loading && (
        <div className="text-center text-gray-400 py-12">加载中...</div>
      )}

      {!loading && personas.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">&#x1f31f;</div>
          <p className="text-gray-400 text-lg">
            还没有蒸馏过任何人。
            <br />
            点击上方按钮开始。
          </p>
        </div>
      )}

      {!loading && personas.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">已蒸馏的人格</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {personas.map((persona) => (
              <div
                key={persona.id}
                className="card hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => navigate(`/persona/${persona.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {persona.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(persona.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    点击查看详情
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

      <footer className="text-center text-xs text-gray-300 mt-16">
        StayWithMeForever — 本地优先，数据仅存储在你的浏览器中
      </footer>
    </div>
  )
}
