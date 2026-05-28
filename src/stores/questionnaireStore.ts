import { create } from 'zustand'
import type { Answer, Question, QuestionSection, QuestionnaireProgress } from '@/types'
import { storage } from '@/db/httpStorage'
import { getAllQuestions, getQuestionsBySection, getSectionOrder } from '@/data/useQuestionBank'

interface QuestionnaireState {
  progress: QuestionnaireProgress | null
  currentQuestion: Question | null
  answers: Answer[]
  loading: boolean
  error: string | null

  initQuestionnaire: (personaVersionId: string) => Promise<void>
  loadProgress: (personaVersionId: string) => Promise<void>
  answerQuestion: (questionId: string, value: string | string[]) => void
  goToNext: () => void
  goToPrevious: () => void
  jumpToSection: (section: QuestionSection) => void
  saveProgress: () => Promise<void>
  getCompletionRatio: () => number
}

export const useQuestionnaireStore = create<QuestionnaireState>((set, get) => ({
  progress: null,
  currentQuestion: null,
  answers: [],
  loading: false,
  error: null,

  initQuestionnaire: async (personaVersionId) => {
    set({ loading: true, error: null })

    const existing = (await storage.progress.get(personaVersionId)) as QuestionnaireProgress | null
    if (existing) {
      const currentQ = getCurrentQuestion(existing.currentSection, existing.answers)
      set({
        progress: existing,
        answers: existing.answers,
        currentQuestion: currentQ,
        loading: false,
      })
      return
    }

    const progress: QuestionnaireProgress = {
      personaVersionId,
      currentSection: getSectionOrder()[0],
      currentQuestionIndex: 0,
      answers: [],
      startedAt: Date.now(),
      totalQuestions: getAllQuestions().length,
      completedQuestions: 0,
    }

    const firstQ = getAllQuestions()[0]
    set({
      progress,
      answers: [],
      currentQuestion: firstQ,
      loading: false,
    })
  },

  loadProgress: async (personaVersionId) => {
    set({ loading: true })
    const progress = (await storage.progress.get(personaVersionId)) as QuestionnaireProgress | null
    if (progress) {
      const currentQ = getCurrentQuestion(progress.currentSection, progress.answers)
      set({ progress, answers: progress.answers, currentQuestion: currentQ, loading: false })
    } else {
      set({ loading: false, error: 'No progress found' })
    }
  },

  answerQuestion: (questionId, value) => {
    const state = get()
    const existingIndex = state.answers.findIndex((a) => a.questionId === questionId)
    const answer: Answer = {
      questionId,
      section: state.currentQuestion!.section,
      type: state.currentQuestion!.type,
      value,
      timestamp: Date.now(),
    }

    const newAnswers =
      existingIndex >= 0
        ? state.answers.map((a, i) => (i === existingIndex ? answer : a))
        : [...state.answers, answer]

    set({
      answers: newAnswers,
      progress: state.progress
        ? { ...state.progress, answers: newAnswers, completedQuestions: newAnswers.length }
        : null,
    })
  },

  goToNext: () => {
    const state = get()
    if (!state.progress || !state.currentQuestion) return

    const allQs = getAllQuestions()
    const currentIdx = allQs.findIndex((q) => q.id === state.currentQuestion!.id)
    if (currentIdx < 0 || currentIdx >= allQs.length - 1) return

    const nextQ = allQs[currentIdx + 1]
    set({
      currentQuestion: nextQ,
      progress: {
        ...state.progress,
        currentSection: nextQ.section,
        currentQuestionIndex: currentIdx + 1,
      },
    })
  },

  goToPrevious: () => {
    const state = get()
    if (!state.progress || !state.currentQuestion) return

    const allQs = getAllQuestions()
    const currentIdx = allQs.findIndex((q) => q.id === state.currentQuestion!.id)
    if (currentIdx <= 0) return

    const prevQ = allQs[currentIdx - 1]
    set({
      currentQuestion: prevQ,
      progress: {
        ...state.progress,
        currentSection: prevQ.section,
        currentQuestionIndex: currentIdx - 1,
      },
    })
  },

  jumpToSection: (section) => {
    const state = get()
    const sectionQuestions = getQuestionsBySection(section)
    if (sectionQuestions.length === 0) return

    const firstQ = sectionQuestions[0]
    const allIdx = getAllQuestions().findIndex((q) => q.id === firstQ.id)
    set({
      currentQuestion: firstQ,
      progress: state.progress
        ? {
            ...state.progress,
            currentSection: section,
            currentQuestionIndex: allIdx >= 0 ? allIdx : 0,
          }
        : null,
    })
  },

  saveProgress: async () => {
    const state = get()
    if (!state.progress) return
    await storage.progress.save(state.progress.personaVersionId, state.progress)
  },

  getCompletionRatio: () => {
    const state = get()
    return state.answers.length / getAllQuestions().length
  },
}))

function getCurrentQuestion(
  section: QuestionSection,
  answers: Answer[],
): Question | null {
  const sectionQuestions = getQuestionsBySection(section)
  const answeredIds = new Set(answers.map((a) => a.questionId))
  const unanswered = sectionQuestions.filter((q) => !answeredIds.has(q.id))
  if (unanswered.length > 0) return unanswered[0]

  const currentSectionIdx = getSectionOrder().indexOf(section)
  for (let i = currentSectionIdx + 1; i < getSectionOrder().length; i++) {
    const nextQs = getQuestionsBySection(getSectionOrder()[i])
    const nextUnanswered = nextQs.filter((q) => !answeredIds.has(q.id))
    if (nextUnanswered.length > 0) return nextUnanswered[0]
  }

  return sectionQuestions[0]
}
