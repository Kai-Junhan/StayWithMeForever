import type { Question, QuestionSection } from '@/types'

export const SECTION_ORDER: QuestionSection[] = [
  'P0-basic',
  'P1-cognitive',
  'P2-values',
  'P3-expression',
  'P4-relationship',
  'P5-open',
]

export const SECTION_LABELS: Record<QuestionSection, string> = {
  'P0-basic': '基础画像',
  'P1-cognitive': '认知模式',
  'P2-values': '价值观',
  'P3-expression': '表达与情感',
  'P4-relationship': '社交与关系',
  'P5-open': '自由表达',
}

export const allQuestions: Question[] = [
  /* ================================================================
   * P0-basic: 基础画像 (4题)
   * ================================================================ */
  {
    id: 'P0-001', section: 'P0-basic', type: 'info', order: 1, required: true,
    title: '你的名字？',
  },
  {
    id: 'P0-002', section: 'P0-basic', type: 'single-choice', order: 2, required: true,
    title: '你的 MBTI 类型？',
    options: [
      { id: 'INTJ', label: 'INTJ - 建筑师' }, { id: 'INTP', label: 'INTP - 逻辑学家' },
      { id: 'ENTJ', label: 'ENTJ - 指挥官' }, { id: 'ENTP', label: 'ENTP - 辩论家' },
      { id: 'INFJ', label: 'INFJ - 提倡者' }, { id: 'INFP', label: 'INFP - 调停者' },
      { id: 'ENFJ', label: 'ENFJ - 主人公' }, { id: 'ENFP', label: 'ENFP - 竞选者' },
      { id: 'ISTJ', label: 'ISTJ - 物流师' }, { id: 'ISFJ', label: 'ISFJ - 守卫者' },
      { id: 'ESTJ', label: 'ESTJ - 总经理' }, { id: 'ESFJ', label: 'ESFJ - 执政官' },
      { id: 'ISTP', label: 'ISTP - 鉴赏家' }, { id: 'ISFP', label: 'ISFP - 探险家' },
      { id: 'ESTP', label: 'ESTP - 企业家' }, { id: 'ESFP', label: 'ESFP - 表演者' },
      { id: 'UNKNOWN', label: '不太清楚' },
    ],
  },
  {
    id: 'P0-003', section: 'P0-basic', type: 'single-choice', order: 3, required: false,
    title: '你的年龄范围？',
    options: [
      { id: '18-24', label: '18-24 岁' }, { id: '25-34', label: '25-34 岁' },
      { id: '35-44', label: '35-44 岁' }, { id: '45+', label: '45 岁以上' },
    ],
  },
  {
    id: 'P0-004', section: 'P0-basic', type: 'single-choice', order: 4, required: false,
    title: '你的职业领域？',
    options: [
      { id: 'TECH', label: '技术 / 开发' }, { id: 'DESIGN', label: '设计 / 创意' },
      { id: 'BUSINESS', label: '商业 / 创业' }, { id: 'STUDENT', label: '学生' },
      { id: 'OTHER', label: '其他' },
    ],
  },

  /* ================================================================
   * P1-cognitive: 认知模式 (4题)
   * ================================================================ */
  {
    id: 'P1-001', section: 'P1-cognitive', type: 'single-choice', order: 1, required: true,
    title: '面对一个复杂的未知问题，你通常第一步做什么？',
    options: [
      { id: 'SEARCH', label: '先搜索资料' },
      { id: 'DECOMPOSE', label: '拆解成小问题逐个分析' },
      { id: 'INTUITION', label: '凭直觉猜方向再验证' },
      { id: 'PROTOTYPE', label: '直接动手试，边做边调' },
    ],
  },
  {
    id: 'P1-002', section: 'P1-cognitive', type: 'single-choice', order: 2, required: true,
    title: '学习新技能时，你更偏向？',
    options: [
      { id: 'TUTORIAL', label: '系统看教程，先理解理论' },
      { id: 'PROJECT', label: '直接做项目，遇到问题再查' },
      { id: 'BOOK', label: '先啃完一本权威书' },
    ],
  },
  {
    id: 'P1-003', section: 'P1-cognitive', type: 'single-choice', order: 3, required: true,
    title: '你的思维更像？',
    options: [
      { id: 'MAP', label: '世界地图 - 先看全局再填细节' },
      { id: 'PUZZLE', label: '拼图 - 先积累碎片再拼全貌' },
      { id: 'TREE', label: '树状 - 主干到末梢' },
    ],
  },
  {
    id: 'P1-004', section: 'P1-cognitive', type: 'single-choice', order: 4, required: true,
    title: '给你1万元闲钱投资，最倾向？',
    options: [
      { id: 'STOCK', label: '买你看好的股票' },
      { id: 'ETF', label: '指数基金，稳健' },
      { id: 'DEPOSIT', label: '存定期，安全第一' },
      { id: 'SELF', label: '投资自己，学个技能' },
    ],
  },

  /* ================================================================
   * P2-values: 价值观 (4题)
   * ================================================================ */
  {
    id: 'P2-001', section: 'P2-values', type: 'ranking', order: 1, required: true,
    title: '对你来说哪个最重要？请排序。',
    options: [
      { id: 'FREEDOM', label: '自由' }, { id: 'SECURITY', label: '安全感' },
      { id: 'GROWTH', label: '成长' }, { id: 'CONNECTION', label: '深度关系' },
      { id: 'MEANING', label: '意义感' },
    ],
  },
  {
    id: 'P2-002', section: 'P2-values', type: 'single-choice', order: 2, required: true,
    title: '朋友创业失败欠债向你借钱，你的第一反应？',
    options: [
      { id: 'LEND', label: '借，能帮就帮' },
      { id: 'ANALYZE', label: '帮他分析问题' },
      { id: 'EMOTIONAL', label: '先安慰情绪' },
    ],
  },
  {
    id: 'P2-003', section: 'P2-values', type: 'single-choice', order: 3, required: true,
    title: '关于"善意的谎言"，你怎么看？',
    options: [
      { id: 'OK', label: '完全可以，保护感受更重要' },
      { id: 'RARE', label: '极少用' },
      { id: 'NEVER', label: '不该说谎' },
    ],
  },
  {
    id: 'P2-004', section: 'P2-values', type: 'single-choice', order: 4, required: true,
    title: '如果必须在名声和财富之间放弃一个？',
    options: [
      { id: 'FAME', label: '放弃名声' },
      { id: 'WEALTH', label: '放弃财富' },
    ],
  },

  /* ================================================================
   * P3-expression: 表达与情感 (3题)
   * ================================================================ */
  {
    id: 'P3-001', section: 'P3-expression', type: 'single-choice', order: 1, required: true,
    title: '描述你的幽默类型？',
    options: [
      { id: 'DRY', label: '冷幽默' }, { id: 'SELF_DEPRECATING', label: '自嘲型' },
      { id: 'ABSURD', label: '荒诞型' }, { id: 'OBSERVATION', label: '观察型' },
      { id: 'NOT_FUNNY', label: '不太幽默' },
    ],
  },
  {
    id: 'P3-002', section: 'P3-expression', type: 'single-choice', order: 2, required: true,
    title: '生气时你通常怎么表达？',
    options: [
      { id: 'EXPLODE', label: '直接爆发' }, { id: 'COLD', label: '冷暴力' },
      { id: 'CALM', label: '冷静下来再谈' }, { id: 'HIDE', label: '压抑自己' },
    ],
  },
  {
    id: 'P3-003', section: 'P3-expression', type: 'single-choice', order: 3, required: true,
    title: '你说话更喜欢？',
    options: [
      { id: 'BOTTOM_LINE', label: '直接说结论' },
      { id: 'BUILD_UP', label: '先铺垫再说结论' },
      { id: 'STORY', label: '用例子和故事表达' },
    ],
  },

  /* ================================================================
   * P4-relationship: 社交与关系 (3题)
   * ================================================================ */
  {
    id: 'P4-001', section: 'P4-relationship', type: 'single-choice', order: 1, required: true,
    title: '陌生人社交后，你的状态？',
    options: [
      { id: 'ENERGIZED', label: '充满能量' },
      { id: 'NEUTRAL', label: '还行' },
      { id: 'DRAINED', label: '精疲力尽' },
    ],
  },
  {
    id: 'P4-002', section: 'P4-relationship', type: 'single-choice', order: 2, required: true,
    title: '聊天中你更常是？',
    options: [
      { id: 'TALKER', label: '主要说话的人' },
      { id: 'LISTENER', label: '主要倾听的人' },
      { id: 'BALANCED', label: '差不多平均' },
    ],
  },
  {
    id: 'P4-003', section: 'P4-relationship', type: 'single-choice', order: 3, required: true,
    title: '对"独处"的态度？',
    options: [
      { id: 'ESSENTIAL', label: '必需品' },
      { id: 'NICE', label: '有更好，没也行' },
      { id: 'AVOID', label: '尽量回避独处' },
    ],
  },

  /* ================================================================
   * P5-open: 自由表达 (2题)
   * ================================================================ */
  {
    id: 'P5-001', section: 'P5-open', type: 'open-ended', order: 1, required: true,
    title: '你最好的朋友失恋了，在微信上找你倾诉。请写下你会发的消息。',
  },
  {
    id: 'P5-002', section: 'P5-open', type: 'open-ended', order: 2, required: true,
    title: '描述一下你理想中一个完美的周末。',
  },
]

export function getQuestionsBySection(section: QuestionSection): Question[] {
  return allQuestions.filter((q) => q.section === section)
}

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find((q) => q.id === id)
}
