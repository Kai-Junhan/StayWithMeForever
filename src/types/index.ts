export interface BaseProfile {
  name: string
  mbti?: string
  bigFive?: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  ageRange?: string
  occupation?: string
  createdAt: number
}

export type QuestionType = 'single-choice' | 'multi-choice' | 'ranking' | 'open-ended' | 'info'

export type QuestionSection = 'P0-basic' | 'P1-cognitive' | 'P2-values' | 'P3-expression' | 'P4-relationship' | 'P5-open'

export interface QuestionOption {
  id: string
  label: string
  description?: string
}

export interface Question {
  id: string
  section: QuestionSection
  type: QuestionType
  title: string
  description?: string
  options?: QuestionOption[]
  required: boolean
  order: number
}

export interface Answer {
  questionId: string
  section: QuestionSection
  type: QuestionType
  value: string | string[]
  timestamp: number
}

export interface PersonalityTrait {
  name: string
  score: number
  description: string
}

export interface CognitiveProfile {
  decisionStyle: string
  informationProcessing: string
  problemSolving: string
  riskAttitude: string
  scores: Record<string, number>
}

export interface ValueProfile {
  priorities: string[]
  scores: Record<string, number>
  dilemmas: Array<{ scenario: string; choice: string; reveals: string }>
}

export interface ExpressionDNA {
  sentenceStyle: string
  vocabularyPatterns: string[]
  humorStyle: string
  emotionExpression: string
  certaintyLevel: string
  openEndedSamples: Array<{ scene: string; response: string }>
}

export interface RelationshipProfile {
  withFriends: string
  withLovers: string
  withFamily: string
  withColleagues: string
  scores: Record<string, number>
}

export interface GeneratedSkill {
  content: string
  generatedAt: number
  modelUsed: string
}

export interface PersonaVersion {
  id: string
  personaId: string
  name: string
  createdAt: number
  baseProfile: BaseProfile
  answers: Answer[]
  personalityTraits: PersonalityTrait[]
  cognitiveProfile: CognitiveProfile
  valueProfile: ValueProfile
  expressionDNA: ExpressionDNA
  relationshipProfile: RelationshipProfile
  generatedSkill: GeneratedSkill | null
}

export interface Persona {
  id: string
  name: string
  avatar?: string
  createdAt: number
  updatedAt: number
}

export interface ChatSession {
  id: string
  personaVersionId: string
  title: string
  createdAt: number
  updatedAt: number
}

export interface ChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export type LLMProvider = 'deepseek' | 'openai' | 'anthropic' | 'ollama'

export interface LLMConfig {
  provider: LLMProvider
  apiKey: string
  baseUrl?: string
  model: string
}

export interface LLMCompletionRequest {
  systemPrompt: string
  userPrompt: string
  temperature?: number
  maxTokens?: number
  signal?: AbortSignal
  timeoutMs?: number
}

export interface LLMCompletionResponse {
  content: string
  model: string
  usage: {
    promptTokens: number
    completionTokens: number
  }
}

export interface QuestionnaireProgress {
  personaVersionId: string
  currentSection: QuestionSection
  currentQuestionIndex: number
  answers: Answer[]
  startedAt: number
  totalQuestions: number
  completedQuestions: number
}
