import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettingsStore } from '@/stores/settingsStore'
import { testConnection } from '@/llm/adapter'
import { storage } from '@/db/httpStorage'
import type { LLMProvider } from '@/types'

const PROVIDERS: { id: LLMProvider; name: string; defaultModel: string }[] = [
  { id: 'deepseek', name: 'DeepSeek', defaultModel: 'deepseek-chat' },
  { id: 'openai', name: 'OpenAI', defaultModel: 'gpt-4o' },
  { id: 'anthropic', name: 'Anthropic', defaultModel: 'claude-sonnet-4-20250514' },
  { id: 'ollama', name: 'Ollama (本地)', defaultModel: 'llama3' },
]

export default function SettingsPage() {
  const navigate = useNavigate()
  const { config, isConfigured, setProvider, setApiKey, setModel, setBaseUrl, load } = useSettingsStore()
  const [testResult, setTestResult] = useState<'idle' | 'testing' | 'success' | 'fail'>('idle')
  const [keyVisible, setKeyVisible] = useState(false)

  useEffect(() => {
    load()
  }, [load])

  const handleTest = async () => {
    setTestResult('testing')
    const ok = await testConnection(config)
    setTestResult(ok ? 'success' : 'fail')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
        &larr; 返回首页
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">设置</h1>

      <div className="card mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">LLM 提供商</h2>
        <p className="text-sm text-gray-400 mb-4">
          API Key 仅存储在浏览器本地，不会上传到任何服务器。
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">提供商</label>
            <div className="flex gap-2 flex-wrap">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    config.provider === p.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <div className="flex gap-2">
              <input
                type={keyVisible ? 'text' : 'password'}
                value={config.apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={config.provider === 'ollama' ? '本地运行无需 Key' : `输入你的 ${PROVIDERS.find((p) => p.id === config.provider)?.name} API Key`}
                className="input-field flex-1"
                disabled={config.provider === 'ollama'}
              />
              <button
                onClick={() => setKeyVisible(!keyVisible)}
                className="px-3 py-2 text-gray-400 hover:text-gray-600 text-sm"
              >
                {keyVisible ? '隐藏' : '显示'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">模型</label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => setModel(e.target.value)}
              className="input-field"
              placeholder="模型名称"
            />
            <p className="text-xs text-gray-400 mt-1">
              默认: {PROVIDERS.find((p) => p.id === config.provider)?.defaultModel}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base URL
              <span className="text-gray-400 font-normal ml-2">(选填)</span>
            </label>
            <input
              type="text"
              value={config.baseUrl || ''}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="input-field"
              placeholder="默认地址"
            />
            <p className="text-xs text-gray-400 mt-1">
              如果你有自定义代理，可在此填入
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={handleTest}
          disabled={testResult === 'testing' || (!config.apiKey && config.provider !== 'ollama')}
          className="btn-secondary"
        >
          {testResult === 'testing' ? '测试中...' : '测试连接'}
        </button>
      </div>

      {testResult === 'success' && (
        <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
          连接成功
        </div>
      )}
      {testResult === 'fail' && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          连接失败。请检查 API Key、模型名称和网络连接。
        </div>
      )}

      <div className="card mt-8">
        <h2 className="font-semibold text-gray-800 mb-2">关于</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          StayWithMeForever 是一个本地优先的数字人格构建工具。
          所有数据以 JSON 文件存储在项目根目录的 data/ 文件夹中，不会上传到任何服务器。
          LLM API 调用直接从浏览器发往提供商，不经过中间服务器。
        </p>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={async () => {
              if (confirm('确定清除所有本地数据吗？此操作将清空 data/ 文件夹。')) {
                try { await storage.clearAll() } catch { /* fallback */ }
                localStorage.clear()
                window.location.href = '/'
              }
            }}
            className="text-sm text-red-400 hover:text-red-600"
          >
            清除所有本地数据
          </button>
        </div>
      </div>
    </div>
  )
}
