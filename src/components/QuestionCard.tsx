import type { Question } from '@/types'

interface Props {
  question: Question
  value: string | string[] | undefined
  onAnswer: (value: string | string[]) => void
}

export default function QuestionCard({ question, value, onAnswer }: Props) {
  const isSelected = (optionId: string) => {
    if (!value) return false
    if (Array.isArray(value)) return value.includes(optionId)
    return value === optionId
  }

  const handleSelect = (optionId: string) => {
    onAnswer(optionId)
  }

  const handleMultiSelect = (optionId: string) => {
    if (!value || !Array.isArray(value)) {
      onAnswer([optionId])
      return
    }
    const current = value as string[]
    if (current.includes(optionId)) {
      onAnswer(current.filter((id) => id !== optionId))
    } else {
      onAnswer([...current, optionId])
    }
  }

  const handleTextChange = (text: string) => {
    onAnswer(text)
  }

  const renderInfo = () => (
    <div className="card">
      <input
        type="text"
        className="input-field text-lg"
        placeholder="请输入..."
        value={(value as string) || ''}
        onChange={(e) => handleTextChange(e.target.value)}
        autoFocus
      />
    </div>
  )

  const renderSingleChoice = () => (
    <div className="space-y-3">
      {question.options?.map((option) => (
        <button
          key={option.id}
          onClick={() => handleSelect(option.id)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${isSelected(option.id)
            ? 'border-indigo-500 bg-indigo-50 shadow-sm'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-5 h-5 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${isSelected(option.id)
                ? 'border-indigo-500 bg-indigo-500'
                : 'border-gray-300'
                }`}
            >
              {isSelected(option.id) && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            <div>
              <span className="text-gray-800">{option.label}</span>
              {option.description && (
                <p className="text-sm text-gray-400 mt-1">{option.description}</p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )

  const renderMultiChoice = () => (
    <div className="space-y-3">
      {question.options?.map((option) => (
        <button
          key={option.id}
          onClick={() => handleMultiSelect(option.id)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${isSelected(option.id)
            ? 'border-indigo-500 bg-indigo-50 shadow-sm'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${isSelected(option.id)
                ? 'border-indigo-500 bg-indigo-500'
                : 'border-gray-300'
                }`}
            >
              {isSelected(option.id) && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <span className="text-gray-800">{option.label}</span>
              {option.description && (
                <p className="text-sm text-gray-400 mt-1">{option.description}</p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )

  const renderRanking = () => (
    <div className="space-y-2">
      <p className="text-sm text-gray-400 mb-4">
        点击选项可按当前顺序排序。已选中的点击可取消。
      </p>
      {question.options
        ?.filter((opt) => isSelected(opt.id))
        .map((option, idx) => (
          <div
            key={option.id}
            className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg"
          >
            <span className="text-indigo-500 font-bold text-sm w-6">{idx + 1}</span>
            <span className="flex-1">{option.label}</span>
            <button
              onClick={() => handleMultiSelect(option.id)}
              className="text-red-400 hover:text-red-600 text-sm"
            >
              移除
            </button>
          </div>
        ))}
      {question.options
        ?.filter((opt) => !isSelected(opt.id))
        .map((option) => (
          <button
            key={option.id}
            onClick={() => handleMultiSelect(option.id)}
            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-300 mr-3 text-sm">
              {((value as string[])?.length || 0) + 1}.
            </span>
            {option.label}
          </button>
        ))}
    </div>
  )

  const renderOpenEnded = () => (
    <div className="card">
      <textarea
        className="input-field min-h-[200px] resize-y"
        placeholder="写下你真实想说的，不需要修饰，不需要正确..."
        value={(value as string) || ''}
        onChange={(e) => handleTextChange(e.target.value)}
        autoFocus
      />
      <p className="text-xs text-gray-400 mt-2">
        {question.description ? (
          <span>&#x1f4a1; {question.description}</span>
        ) : (
          '你的真实表达是 AI 理解你的关键'
        )}
      </p>
    </div>
  )

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {question.title}
      </h2>
      {question.description && question.type !== 'open-ended' && (
        <p className="text-sm text-gray-400 mb-6">{question.description}</p>
      )}
      <div className="mt-6">
        {question.type === 'info' && renderInfo()}
        {question.type === 'single-choice' && renderSingleChoice()}
        {question.type === 'multi-choice' && renderMultiChoice()}
        {question.type === 'ranking' && renderRanking()}
        {question.type === 'open-ended' && renderOpenEnded()}
      </div>
    </div>
  )
}
