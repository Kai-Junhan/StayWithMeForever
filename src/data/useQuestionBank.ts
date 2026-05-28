import type { Question, QuestionSection } from '@/types'
import * as fullBank from '@/data/questionBank'
import * as miniBank from '@/data/questionBankMini'

function isMini(): boolean {
  return localStorage.getItem('swmf-question-mode') === 'mini'
}

export function getActiveBank() {
  return isMini() ? miniBank : fullBank
}

export function getAllQuestions(): Question[] {
  return getActiveBank().allQuestions
}

export function getQuestionsBySection(section: QuestionSection): Question[] {
  return getActiveBank().getQuestionsBySection(section)
}

export function getSectionOrder(): QuestionSection[] {
  return getActiveBank().SECTION_ORDER
}

export function getSectionLabels(): Record<QuestionSection, string> {
  return getActiveBank().SECTION_LABELS as Record<QuestionSection, string>
}
