import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuestionnaireStore } from '@/stores/questionnaireStore'
import { storage } from '@/db/httpStorage'
import { SECTION_LABELS, SECTION_ORDER, allQuestions } from '@/data/questionBank'
import type { Question } from '@/types'
import QuestionCard from '@/components/QuestionCard'

export default function QuestionnairePage() {
  const { versionId } = useParams<{ versionId: string }>()
  const navigate = useNavigate()
  const store = useQuestionnaireStore()
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (versionId) {
      store.initQuestionnaire(versionId)
    }
    return () => { clearTimeout(autoSaveTimer.current) }
  }, [versionId])

  useEffect(() => {
    if (store.answers.length === 0) return
    clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(async () => {
      await store.saveProgress()
      if (versionId) {
        await storage.personaVersions.update(versionId, { answers: store.answers })
      }
    }, 500)
  }, [store.answers, versionId])

  if (!versionId || store.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        加载中...
      </div>
    )
  }

  if (!store.currentQuestion || !store.progress) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">问卷加载失败，请返回重试。</p>
        <button onClick={() => navigate('/')} className="btn-secondary">
          返回首页
        </button>
      </div>
    )
  }

  const { currentQuestion, progress } = store
  const completionRatio = store.getCompletionRatio()
  const currentIndex = allQuestions.findIndex((q) => q.id === currentQuestion.id)
  const canGoNext = currentIndex < allQuestions.length - 1
  const canGoPrev = currentIndex > 0
  const isComplete = completionRatio >= 1 && !canGoNext

  const sectionQuestions = allQuestions.filter((q) => q.section === currentQuestion.section)
  const sectionIndex = SECTION_ORDER.indexOf(currentQuestion.section)

  const handleAnswer = (value: string | string[]) => {
    store.answerQuestion(currentQuestion.id, value)
  }

  const handleNext = async () => {
    if (isComplete) {
      setShowSubmitConfirm(true)
      return
    }
    await store.saveProgress()
    store.goToNext()
  }

  const handlePrev = async () => {
    await store.saveProgress()
    store.goToPrevious()
  }

  const handleSubmit = async () => {
    await store.saveProgress()
    if (versionId) {
      await storage.personaVersions.update(versionId, { answers: store.answers })
    }
    navigate(`/skill/${versionId}`)
  }

  const handleJumpToSection = async (section: string) => {
    await store.saveProgress()
    store.jumpToSection(section as Question['section'])
  }

  const currentAnswer = store.answers.find((a) => a.questionId === currentQuestion.id)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-gray-600">
            &larr; 返回
          </button>
          <span className="text-sm text-gray-400">
            {store.answers.length} / {allQuestions.length}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRatio * 100}%` }}
          />
        </div>

        <div className="flex gap-1 flex-wrap">
          {SECTION_ORDER.map((section, idx) => {
            const answered = allQuestions
              .filter((q) => q.section === section)
              .filter((q) => store.answers.some((a) => a.questionId === q.id))
            const total = allQuestions.filter((q) => q.section === section).length
            const isCurrent = section === currentQuestion.section
            return (
              <button
                key={section}
                onClick={() => handleJumpToSection(section)}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  isCurrent
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : answered.length === total
                      ? 'bg-green-50 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {SECTION_LABELS[section as keyof typeof SECTION_LABELS]}
                {answered.length > 0 && answered.length < total
                  ? ` ${answered.length}/${total}`
                  : answered.length === total
                    ? ` ✓`
                    : ''}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-6">
        <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
          {SECTION_LABELS[currentQuestion.section]}
          {` — 第 ${sectionQuestions.findIndex((q) => q.id === currentQuestion.id) + 1}/${sectionQuestions.length} 题`}
        </span>
      </div>

      <QuestionCard
        question={currentQuestion}
        value={currentAnswer?.value}
        onAnswer={handleAnswer}
      />

      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrev}
          disabled={!canGoPrev}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            canGoPrev
              ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          &larr; 上一题
        </button>

        <button onClick={handleNext} className="btn-primary">
          {isComplete ? '完成问卷' : '下一题 &rarr;'}
        </button>
      </div>

      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <h3 className="text-xl font-semibold mb-4">确认提交</h3>
            <p className="text-gray-600 mb-6">
              你将提交 {store.answers.length} 道题的回答。
              AI 将据此生成你的数字人格 Skill。
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="btn-secondary"
              >
                再检查一下
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                确认生成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
