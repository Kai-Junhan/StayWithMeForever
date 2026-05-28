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

export const SECTION_DESCRIPTIONS: Record<QuestionSection, string> = {
  'P0-basic': '快速设置基本身份标签。如果你已经知道自己的 MBTI 类型，可直接输入，无需重新测试。',
  'P1-cognitive': '了解你如何做决策、处理信息和解决问题的方式。',
  'P2-values': '通过情境两难题，发现你的价值排序和权衡倾向。',
  'P3-expression': '探索你的沟通风格、情感表达和幽默偏好。',
  'P4-relationship': '了解你在不同社交角色中展现的行为模式。',
  'P5-open': '自由表达自己。这会帮助 AI 捕捉你独特的语言风格和表达 DNA。',
}

export const allQuestions: Question[] = [
  /* ================================================================
   * P0-basic: 基础画像 (10题)
   * ================================================================ */
  {
    id: 'P0-001', section: 'P0-basic', type: 'info', order: 1, required: true,
    title: '你的名字（或你希望 AI 记住的称呼）是什么？',
    description: '这将作为你数字人格的标识。可以是真名、昵称或化名。',
  },
  {
    id: 'P0-002', section: 'P0-basic', type: 'single-choice', order: 2, required: true,
    title: '你的 MBTI 类型是？',
    description: '如果你已经知道自己的 MBTI 类型，直接选择即可；不确定可以选"不太清楚"。',
    options: [
      { id: 'INTJ', label: 'INTJ - 建筑师' },
      { id: 'INTP', label: 'INTP - 逻辑学家' },
      { id: 'ENTJ', label: 'ENTJ - 指挥官' },
      { id: 'ENTP', label: 'ENTP - 辩论家' },
      { id: 'INFJ', label: 'INFJ - 提倡者' },
      { id: 'INFP', label: 'INFP - 调停者' },
      { id: 'ENFJ', label: 'ENFJ - 主人公' },
      { id: 'ENFP', label: 'ENFP - 竞选者' },
      { id: 'ISTJ', label: 'ISTJ - 物流师' },
      { id: 'ISFJ', label: 'ISFJ - 守卫者' },
      { id: 'ESTJ', label: 'ESTJ - 总经理' },
      { id: 'ESFJ', label: 'ESFJ - 执政官' },
      { id: 'ISTP', label: 'ISTP - 鉴赏家' },
      { id: 'ISFP', label: 'ISFP - 探险家' },
      { id: 'ESTP', label: 'ESTP - 企业家' },
      { id: 'ESFP', label: 'ESFP - 表演者' },
      { id: 'UNKNOWN', label: '不太清楚 / 没测过' },
    ],
  },
  {
    id: 'P0-003', section: 'P0-basic', type: 'single-choice', order: 3, required: false,
    title: '你的年龄范围？',
    options: [
      { id: '18-24', label: '18-24 岁' },
      { id: '25-34', label: '25-34 岁' },
      { id: '35-44', label: '35-44 岁' },
      { id: '45-54', label: '45-54 岁' },
      { id: '55+', label: '55 岁以上' },
      { id: 'SECRET', label: '不想透露' },
    ],
  },
  {
    id: 'P0-004', section: 'P0-basic', type: 'single-choice', order: 4, required: false,
    title: '你的职业领域是？',
    options: [
      { id: 'TECH', label: '技术 / 开发 / 工程' },
      { id: 'DESIGN', label: '设计 / 创意 / 艺术' },
      { id: 'BUSINESS', label: '商业 / 管理 / 创业' },
      { id: 'EDUCATION', label: '教育 / 研究' },
      { id: 'MEDICAL', label: '医疗 / 健康' },
      { id: 'FINANCE', label: '金融 / 咨询' },
      { id: 'MEDIA', label: '媒体 / 内容创作' },
      { id: 'STUDENT', label: '学生' },
      { id: 'OTHER', label: '其他' },
    ],
  },
  {
    id: 'P0-005', section: 'P0-basic', type: 'single-choice', order: 5, required: true,
    title: '你觉得自己是偏内向还是偏外向？',
    options: [
      { id: 'STRONG_I', label: '非常内向 - 社交让我消耗能量，独处让我充电' },
      { id: 'MODERATE_I', label: '偏内向 - 可以社交但更喜欢独处或小圈子' },
      { id: 'BALANCED', label: '中间 - 看情况和状态，两者差不多' },
      { id: 'MODERATE_E', label: '偏外向 - 喜欢和人在一起，偶尔独处也OK' },
      { id: 'STRONG_E', label: '非常外向 - 独处让我难受，人群中充满活力' },
    ],
  },
  {
    id: 'P0-006', section: 'P0-basic', type: 'single-choice', order: 6, required: true,
    title: '你做决定时更多靠逻辑分析还是直觉感受？',
    options: [
      { id: 'STRONG_T', label: '几乎总是逻辑分析 - 先看数据和事实' },
      { id: 'MODERATE_T', label: '偏逻辑 - 理性优先但也会考虑感受' },
      { id: 'BALANCED', label: '两者兼顾 - 看具体情况切换' },
      { id: 'MODERATE_F', label: '偏感受 - 情感和价值观常常主导' },
      { id: 'STRONG_F', label: '几乎总是感受优先 - 先问内心的感觉' },
    ],
  },
  {
    id: 'P0-007', section: 'P0-basic', type: 'single-choice', order: 7, required: true,
    title: '你大多数时候更开放冒险还是保守稳定？',
    options: [
      { id: 'STRONG_OPEN', label: '非常开放 - 热爱新事物，越新鲜越好' },
      { id: 'MODERATE_OPEN', label: '偏开放 - 愿意尝试但要有个基本框架' },
      { id: 'BALANCED', label: '中间 - 既要新鲜感也要安全感' },
      { id: 'MODERATE_CON', label: '偏保守 - 喜欢熟悉的节奏，偶尔尝鲜' },
      { id: 'STRONG_CON', label: '非常保守 - 稳定和可预测让我安心' },
    ],
  },
  {
    id: 'P0-008', section: 'P0-basic', type: 'single-choice', order: 8, required: false,
    title: '给自己在"共情能力"上打个分（1-10）？',
    options: [
      { id: '1-2', label: '1-2 分：真的不太能感知别人的情绪' },
      { id: '3-4', label: '3-4 分：有时能，但需要别人明显表达' },
      { id: '5-6', label: '5-6 分：中等，看和谁' },
      { id: '7-8', label: '7-8 分：比较能感知他人情绪' },
      { id: '9-10', label: '9-10 分：几乎本能地感知，甚至有时过度' },
    ],
  },
  {
    id: 'P0-009', section: 'P0-basic', type: 'single-choice', order: 9, required: false,
    title: '给自己在"自律/条理"上打个分（1-10）？',
    options: [
      { id: '1-2', label: '1-2 分：随心所欲，计划是什么？' },
      { id: '3-4', label: '3-4 分：有愿望但执行常跟不上的类型' },
      { id: '5-6', label: '5-6 分：重要的事会有计划，小事随缘' },
      { id: '7-8', label: '7-8 分：大多数时候有条理有节奏' },
      { id: '9-10', label: '9-10 分：日程精确到小时，不按计划来不舒服' },
    ],
  },
  {
    id: 'P0-010', section: 'P0-basic', type: 'single-choice', order: 10, required: false,
    title: '面对压力时，你最常怎么做？',
    options: [
      { id: 'ACTION', label: '立刻行动 - 把压力转化为做事的力量' },
      { id: 'PLAN', label: '制定计划 - 列出所有要做的事，有序推进' },
      { id: 'THINK', label: '反复思考 - 在脑内推演各种可能性' },
      { id: 'TALK', label: '找人聊聊 - 说出来会好很多' },
      { id: 'ESCAPE', label: '暂时逃避 - 看电影/打游戏/睡觉/吃东西' },
    ],
  },

  /* ================================================================
   * P1-cognitive: 认知模式 (25题)
   * ================================================================ */
  {
    id: 'P1-001', section: 'P1-cognitive', type: 'single-choice', order: 1, required: true,
    title: '面对一个复杂的未知问题，你通常第一步做什么？',
    options: [
      { id: 'SEARCH', label: '先搜索资料，看看别人怎么解决的' },
      { id: 'DECOMPOSE', label: '把问题拆解成小的子问题，逐个分析' },
      { id: 'INTUITION', label: '凭直觉先猜一个方向，然后验证' },
      { id: 'ASK', label: '问身边有经验的人' },
      { id: 'PROTOTYPE', label: '直接动手试，边做边调' },
    ],
  },
  {
    id: 'P1-002', section: 'P1-cognitive', type: 'single-choice', order: 2, required: true,
    title: '有两份工作机会：A 薪资高但成长空间不明确，B 薪资一般但能学到很多。你更可能选？',
    options: [
      { id: 'A', label: '选 A - 当前收益优先，成长可以在别处补' },
      { id: 'B', label: '选 B - 长期成长 > 短期收益' },
      { id: 'NEGOTIATE', label: '两个都试试，看能不能把 A 也谈出成长空间' },
      { id: 'BOTH', label: '成年人不做选择，想都要' },
    ],
  },
  {
    id: 'P1-003', section: 'P1-cognitive', type: 'single-choice', order: 3, required: true,
    title: '学习一个新技能时，你更偏向哪种方式？',
    options: [
      { id: 'TUTORIAL', label: '系统看教程 - 先理解框架和理论' },
      { id: 'PROJECT', label: '直接上手做项目 - 遇到问题再查' },
      { id: 'MENTOR', label: '找个有经验的人带着学' },
      { id: 'BOOK', label: '先啃完一本权威的书/文档' },
      { id: 'MIX', label: '多种方式混合，看学什么' },
    ],
  },
  {
    id: 'P1-004', section: 'P1-cognitive', type: 'single-choice', order: 4, required: true,
    title: '在团队工作中，如果你和同事对方案有严重分歧，你通常怎么做？',
    options: [
      { id: 'DEBATE', label: '辩论到底 - 摆数据讲逻辑，直到有一方被说服' },
      { id: 'COMPROMISE', label: '寻找折中方案 - 各让一步' },
      { id: 'AUTHORITY', label: '让更有权威的人或老板裁决' },
      { id: 'YIELD', label: '如果对方特别坚持，我就让步 - 关系比方案重要' },
      { id: 'WAIT', label: '不急着争 - 等情绪平复，各自再想想，下次聊' },
    ],
  },
  {
    id: 'P1-005', section: 'P1-cognitive', type: 'single-choice', order: 5, required: true,
    title: '你的思维更像哪一种？',
    options: [
      { id: 'MAP', label: '世界地图 - 先看全局框架，再填入细节' },
      { id: 'PUZZLE', label: '拼图 - 先积累碎片，慢慢拼出全貌' },
      { id: 'TREE', label: '树状结构 - 从主干开始，逐步分叉到末梢' },
      { id: 'SPIRAL', label: '螺旋 - 反复回到同一个问题，每次都更深一层' },
    ],
  },
  {
    id: 'P1-006', section: 'P1-cognitive', type: 'single-choice', order: 6, required: true,
    title: '看到一则新闻说"最新研究表明喝咖啡能延年益寿"，你的第一反应是？',
    options: [
      { id: 'SKEPTIC', label: '保持怀疑 - 研究样本多大？谁资助的？其他因素排除了吗？' },
      { id: 'ACCEPT', label: '倾向于相信 - 既然是正式研究，应该有道理' },
      { id: 'IGNORE', label: '不太关注 - 今天说这个明天说那个，信了也没用' },
      { id: 'SHARE', label: '觉得有趣，想分享给朋友听听他们的看法' },
      { id: 'DIG', label: '马上去查原始论文，自己验证' },
    ],
  },
  {
    id: 'P1-007', section: 'P1-cognitive', type: 'single-choice', order: 7, required: true,
    title: '你的电脑桌面通常是什么样的？',
    options: [
      { id: 'CLEAN', label: '几乎空的 - 只有几个必要文件夹' },
      { id: 'ORGANIZED', label: '有条理的 - 文件都分了类，可能有很多层文件夹' },
      { id: 'MESSY', label: '堆满了文件图标 - 但是我能找到我要的' },
      { id: 'CHAOTIC', label: '完全没规律 - 找不到就搜索' },
      { id: 'TEMP', label: '临时堆放区 - 定期会清理整理一次' },
    ],
  },
  {
    id: 'P1-008', section: 'P1-cognitive', type: 'single-choice', order: 8, required: true,
    title: '规划一次旅行，你的风格是？',
    options: [
      { id: 'ITINERARY', label: '精确到小时 - 酒店、交通、餐厅、景点全部预订好' },
      { id: 'FRAMEWORK', label: '有个大纲 - 定了机票酒店和几个必去点，其他的灵活' },
      { id: 'SPONTANEOUS', label: '随性 - 只订第一天，到了再说' },
      { id: 'DELEGATE', label: '同行的人安排，我跟着走就行' },
    ],
  },
  {
    id: 'P1-009', section: 'P1-cognitive', type: 'single-choice', order: 9, required: true,
    title: '你在大脑里思考时，"内部声音"是怎样的？',
    options: [
      { id: 'WORDS', label: '有清晰的语言 - 像在心里和自己对话' },
      { id: 'IMAGES', label: '更多是画面或图表 - 不太用语言' },
      { id: 'FEELINGS', label: '更多是一种"感觉"或直觉 - 难以用语言描述' },
      { id: 'MIX', label: '语言和画面混合 - 看思考什么内容' },
    ],
  },
  {
    id: 'P1-010', section: 'P1-cognitive', type: 'single-choice', order: 10, required: true,
    title: '面对截止日期的压力，你通常？',
    options: [
      { id: 'EARLY', label: '提前完成，不拖到最后一刻' },
      { id: 'CRUNCH', label: '最后冲刺 - 压力反而让我高效' },
      { id: 'STEADY', label: '平摊工作量 - 每天做一点' },
      { id: 'NEGOTIATE', label: '争取延期 - 质量比按时更重要' },
    ],
  },
  {
    id: 'P1-011', section: 'P1-cognitive', type: 'single-choice', order: 11, required: true,
    title: '给你1万元闲钱去投资，你最倾向哪种？',
    options: [
      { id: 'STOCK', label: '买你看好的公司股票 - 高回报潜力' },
      { id: 'ETF', label: '买指数基金 - 稳健但不平庸' },
      { id: 'DEPOSIT', label: '存定期 - 安全第一' },
      { id: 'CRYPTO', label: '试水高波动资产 - 高风险高回报' },
      { id: 'SELF', label: '投资自己 - 报个课、学个技能' },
    ],
  },
  {
    id: 'P1-012', section: 'P1-cognitive', type: 'ranking', order: 12, required: true,
    title: '选择朋友时，以下品质你最看重哪个？请排序。',
    description: '拖拽排序，最上面 = 最重要',
    options: [
      { id: 'HONEST', label: '诚实 - 不骗我，不虚伪' },
      { id: 'FUN', label: '有趣 - 在一起不无聊' },
      { id: 'RELIABLE', label: '可靠 - 需要的时候一定在' },
      { id: 'SMART', label: '聪明 - 能启发我、拓展认知' },
      { id: 'KIND', label: '善良 - 不会主动伤害人' },
    ],
  },
  {
    id: 'P1-013', section: 'P1-cognitive', type: 'single-choice', order: 13, required: true,
    title: '你发现自己的观点和大家完全不同，你更可能？',
    options: [
      { id: 'VOICE', label: '说出来 - 哪怕只有我一个人这么想' },
      { id: 'QUESTION', label: '先质疑自己 - 可能是我了解不够全面' },
      { id: 'SILENT', label: '不说话 - 不想成为异类或者争论' },
      { id: 'NUANCE', label: '柔和地表达 - 先肯定大家的部分，再提出我的视角' },
    ],
  },
  {
    id: 'P1-014', section: 'P1-cognitive', type: 'single-choice', order: 14, required: true,
    title: '你如何看待"运气"在成功中的作用？',
    options: [
      { id: 'HUGE', label: '运气极其重要 - 生对时代、遇到对的人>个人努力' },
      { id: 'MIX', label: '运气和努力各一半 - 努力让你在运气来的时候能抓住' },
      { id: 'MINOR', label: '运气影响很小 - 长期来看能力和选择决定一切' },
      { id: 'COMPLEX', label: '没法简单归因 - 每个案例都不一样' },
    ],
  },
  {
    id: 'P1-015', section: 'P1-cognitive', type: 'single-choice', order: 15, required: true,
    title: '你更倾向于坚持还是放弃一条走不通的路？',
    options: [
      { id: 'PERSIST', label: '坚持 - 可能只是方法不对，换个角度再试' },
      { id: 'PIVOT', label: '快速转向 - 如果本质问题无解，不如去别处' },
      { id: 'CALCULATE', label: '计算沉没成本 - 衡量已投入 vs 成功概率再决定' },
      { id: 'FEEL', label: '听从内心 - 还感兴趣就继续，不感兴趣就算了' },
    ],
  },
  {
    id: 'P1-016', section: 'P1-cognitive', type: 'single-choice', order: 16, required: true,
    title: '一场重要会议中，你发现自己准备的材料有个小错误，但可能没人注意到，你会？',
    options: [
      { id: 'ADMIT', label: '主动指出 - 诚实和准确比面子重要' },
      { id: 'SILENT', label: '不说 - 等有人发现了再承认并纠正' },
      { id: 'FIX', label: '找一个自然的机会修正 - 不让会议节奏被打断' },
      { id: 'IGNORE', label: '忽略 - 小错误不耽误大局' },
    ],
  },
  {
    id: 'P1-017', section: 'P1-cognitive', type: 'single-choice', order: 17, required: true,
    title: '你如何评价自己的"执行力"？',
    options: [
      { id: 'DOER', label: '行动派 - 想法一出来就马上开干' },
      { id: 'PLANNER_DOER', label: '先计划再行动 - 但不会无限期规划' },
      { id: 'PERFECTIONIST', label: '想做到完美 - 有时因此迟迟不动手' },
      { id: 'PROCRASTINATOR', label: '经常拖延 - 知道该做但启动困难' },
    ],
  },
  {
    id: 'P1-018', section: 'P1-cognitive', type: 'single-choice', order: 18, required: true,
    title: '失眠的时候，你的大脑通常在做什么？',
    options: [
      { id: 'WORRY', label: '反复想白天的事或明天的待办' },
      { id: 'IDEA', label: '冒出各种创意和想法，越想越兴奋' },
      { id: 'RECALL', label: '回忆过去的事，设想如果当时做了不同选择' },
      { id: 'BLANK', label: '什么都没想，但就是睡不着' },
      { id: 'FUTURE', label: '构想未来的各种可能性' },
    ],
  },
  {
    id: 'P1-019', section: 'P1-cognitive', type: 'single-choice', order: 19, required: true,
    title: '别人夸你"你看得好透彻"，你通常是怎么想的？',
    options: [
      { id: 'PATTERN', label: '我善于发现不同事情之间的共同模式' },
      { id: 'DEEP', label: '我会习惯性地追问"这到底意味着什么"' },
      { id: 'EXPERIENCE', label: '不是聪明，只是踩过类似的坑' },
      { id: 'LOGIC', label: '我只是把逻辑链条推得比较远' },
    ],
  },
  {
    id: 'P1-020', section: 'P1-cognitive', type: 'single-choice', order: 20, required: true,
    title: '哪种情况让你最不安？',
    options: [
      { id: 'UNCERTAINTY', label: '未来不确定，无法预判走向' },
      { id: 'CONFLICT', label: '周围有人发生激烈冲突' },
      { id: 'FAILURE', label: '自己付出了很大努力但失败了' },
      { id: 'BOREDOM', label: '长期重复、乏味、没有新刺激' },
      { id: 'INJUSTICE', label: '看到不公平的事发生' },
    ],
  },
  {
    id: 'P1-021', section: 'P1-cognitive', type: 'single-choice', order: 21, required: true,
    title: '你怎么看待"后悔"这种情绪？',
    options: [
      { id: 'LEARN', label: '后悔是学习材料 - 告诉我下次该怎么做' },
      { id: 'WASTE', label: '无意义的情绪 - 改变不了过去，不如向前看' },
      { id: 'DWELL', label: '很难释怀 - 常常会反复想"如果当时..."' },
      { id: 'RARE', label: '我很少后悔 - 我做了选择就接受后果' },
    ],
  },
  {
    id: 'P1-022', section: 'P1-cognitive', type: 'single-choice', order: 22, required: true,
    title: '你如何获取新知？请描述你最近一次学到新东西的过程？',
    options: [
      { id: 'READ', label: '通过阅读书籍/长文章，系统学习' },
      { id: 'VIDEO', label: '看视频/教程，跟着实践' },
      { id: 'SOCIAL', label: '和别人聊天/讨论，碰撞出新认知' },
      { id: 'DO', label: '动手做项目，从实践中总结' },
      { id: 'MIX', label: '几种方式结合，根据主题切换' },
    ],
  },
  {
    id: 'P1-023', section: 'P1-cognitive', type: 'single-choice', order: 23, required: true,
    title: '你更相信"真理越辩越明"还是"争论只会让大家更固执"？',
    options: [
      { id: 'YES_ARGUE', label: '前者 - 充分辩论能逼近真相' },
      { id: 'DEPENDS', label: '取决于人 - 和开放的人辩论有效，和固执的人无意义' },
      { id: 'NO_ARGUE', label: '后者 - 争论通常只会消耗情感和关系' },
      { id: 'LISTEN', label: '我倾向于听和提问，而不是争论' },
    ],
  },
  {
    id: 'P1-024', section: 'P1-cognitive', type: 'single-choice', order: 24, required: true,
    title: '如果突然有了3个月完全自由的时间，没有责任也没有经济压力，你最可能怎么用？',
    options: [
      { id: 'LEARN_SKILL', label: '学一个一直想学的技能' },
      { id: 'TRAVEL', label: '到处旅行，体验不同的生活' },
      { id: 'CREATE', label: '做一个自己的项目（书/产品/艺术）' },
      { id: 'REST', label: '什么都不做，好好休息，放空自己' },
      { id: 'CONNECT', label: '陪家人和朋友，修复和加深关系' },
    ],
  },
  {
    id: 'P1-025', section: 'P1-cognitive', type: 'single-choice', order: 25, required: true,
    title: '描述你对"效率"的执念程度？',
    options: [
      { id: 'OBSESSED', label: '很在意 - 做事的路径和方法经常优化，不喜欢浪费时间' },
      { id: 'MODERATE', label: '一定程度 - 重要的事追求高效，其他随缘' },
      { id: 'LOOSE', label: '不太在意 - 过程本身的体验比效率重要' },
      { id: 'CHILL', label: '比较佛系 - 事情注定要做那么久，急也没用' },
    ],
  },

  /* ================================================================
   * P2-values: 价值观 (20题)
   * ================================================================ */
  {
    id: 'P2-001', section: 'P2-values', type: 'ranking', order: 1, required: true,
    title: '对你来说，以下哪个最重要？请排序。',
    options: [
      { id: 'FREEDOM', label: '自由 - 不被束缚，自主决定生活' },
      { id: 'SECURITY', label: '安全感 - 物质和精神上的稳定' },
      { id: 'GROWTH', label: '成长 - 不断变得更好' },
      { id: 'CONNECTION', label: '关系 - 与重要的人深度连接' },
      { id: 'MEANING', label: '意义 - 做的事有价值、有目的' },
      { id: 'RECOGNITION', label: '认可 - 被看见、被肯定' },
    ],
  },
  {
    id: 'P2-002', section: 'P2-values', type: 'single-choice', order: 2, required: true,
    title: '你最好的朋友创业失败，欠了债向你借钱。你的第一反应是什么？',
    options: [
      { id: 'LEND', label: '借 - 朋友有难，能帮就帮' },
      { id: 'LEND_PART', label: '借一部分 - 在自己不影响生活的范围内' },
      { id: 'ANALYZE', label: '帮他分析问题 - 给钱不如给思路' },
      { id: 'EMOTIONAL', label: '先安慰情绪 - 钱的事后面再说' },
      { id: 'TOUGH_LOVE', label: '让他面对现实 - 有些坑必须自己爬出来' },
    ],
  },
  {
    id: 'P2-003', section: 'P2-values', type: 'single-choice', order: 3, required: true,
    title: '有人公开说了一句话，严重伤害了你的尊严。你更可能？',
    options: [
      { id: 'CONFRONT', label: '当场怼回去 - 有些线不能踩' },
      { id: 'COOL', label: '先不说话 - 等情绪平复，再考虑怎么处理' },
      { id: 'IGNORE', label: '不在意 - 别人的话定义不了我的价值' },
      { id: 'HUMOR', label: '幽默化解 - 化解敌意是更高级的赢' },
      { id: 'CUT', label: '拉黑远离 - 不值得花精力' },
    ],
  },
  {
    id: 'P2-004', section: 'P2-values', type: 'single-choice', order: 4, required: true,
    title: '你觉得人生的意义主要来自哪里？',
    options: [
      { id: 'CREATE', label: '创造 - 做出一些东西，留下痕迹' },
      { id: 'EXPERIENCE', label: '体验 - 尽可能多地感受世界' },
      { id: 'LOVE', label: '爱与关系 - 深度连接让一切有意义' },
      { id: 'SERVE', label: '奉献 - 让别人的生活因我而更好' },
      { id: 'SELF', label: '自我实现 - 成为我想成为的人' },
      { id: 'NONE', label: '没有固定答案 - 意义是自己定义的，也可以不定义' },
    ],
  },
  {
    id: 'P2-005', section: 'P2-values', type: 'single-choice', order: 5, required: true,
    title: '有两句名言，你更认同哪句？',
    options: [
      { id: 'JUSTICE', label: '"宁可放过一千，不可错杀一个" - 保护无辜比惩罚有罪重要' },
      { id: 'MERIT', label: '"付出多少就该得到多少" - 公平是努力的回报' },
      { id: 'BOTH', label: '两者都有道理，看具体场景' },
      { id: 'NEITHER', label: '各有问题，现实比名言复杂得多' },
    ],
  },
  {
    id: 'P2-006', section: 'P2-values', type: 'single-choice', order: 6, required: true,
    title: '你怎么看"white lie"（善意的谎言）？',
    options: [
      { id: 'OK', label: '完全可以 - 保护他人感受比绝对的诚实重要' },
      { id: 'RARE', label: '极少使用 - 只有在后果非常严重时才考虑' },
      { id: 'NEVER', label: '不该说谎 - 真相可能伤人但更值得尊重' },
      { id: 'NUANCE', label: '看关系 - 对亲近的人我要求更高诚实度' },
    ],
  },
  {
    id: 'P2-007', section: 'P2-values', type: 'single-choice', order: 7, required: true,
    title: '如果必须在下面两个中放弃一个，你放弃哪个？',
    options: [
      { id: 'FAME', label: '放弃名声/社会地位' },
      { id: 'WEALTH', label: '放弃财富/经济自由' },
      { id: 'PAIN', label: '两个都不想放弃' },
    ],
  },
  {
    id: 'P2-008', section: 'P2-values', type: 'single-choice', order: 8, required: true,
    title: '看到一个陌生人在公共场合被不公平地对待（比如收银员被顾客辱骂），你会？',
    options: [
      { id: 'INTERVENE', label: '站出来帮ta说句话' },
      { id: 'WATCH', label: '旁观，心里不舒服但不确定该不该介入' },
      { id: 'MOVE', label: '走开 - 我不想卷入别人的冲突' },
      { id: 'LATER', label: '事后和那个被欺负的人表达关心' },
    ],
  },
  {
    id: 'P2-009', section: 'P2-values', type: 'single-choice', order: 9, required: true,
    title: '朋友在你面前说另一个朋友的坏话，你通常怎么做？',
    options: [
      { id: 'STOP', label: '让他不要说 - 在背后评判不太好' },
      { id: 'LISTEN', label: '不表态地听 - 每个人都有权利表达感受' },
      { id: 'DEFEND', label: '为不在场的朋友辩护' },
      { id: 'REDIRECT', label: '把话题引导到解决问题上，而非抱怨' },
    ],
  },
  {
    id: 'P2-010', section: 'P2-values', type: 'single-choice', order: 10, required: true,
    title: '你怎么看待社交媒体上"晒"的行为（晒旅行/晒成就/晒生活）？',
    options: [
      { id: 'NORMAL', label: '正常的分享 - 开心的事当然可以分享' },
      { id: 'NEEDY', label: '多少有些寻求认可的成分在' },
      { id: 'STORY', label: '这是在构建自己的故事 - 不是什么坏事' },
      { id: 'ANNOYING', label: '看多了有点烦 - 但我可以滑走' },
      { id: 'COMPLEX', label: '分情况，有些分享真诚，有些是炫耀' },
    ],
  },
  {
    id: 'P2-011', section: 'P2-values', type: 'single-choice', order: 11, required: true,
    title: '如果十年后的你给现在的你写信，你觉得这封信的主题最可能是什么？',
    options: [
      { id: 'COURAGE', label: '放胆去做 - 不要怕' },
      { id: 'SLOW', label: '慢一点 - 不要那么急' },
      { id: 'GRATITUDE', label: '珍惜眼前人 - 有些人在你未来的生活里不再出现' },
      { id: 'DIFFERENT', label: '你的烦恼其实微不足道 - 人生有更大的惊喜和挑战' },
    ],
  },
  {
    id: 'P2-012', section: 'P2-values', type: 'single-choice', order: 12, required: true,
    title: '你如何对待"敌人的敌人就是朋友"这种实用主义逻辑？',
    options: [
      { id: 'REJECT', label: '不认同 - 朋友的核心是价值观一致，不是利益联盟' },
      { id: 'PRAGMATIC', label: '可以合作但不会成为真正的朋友' },
      { id: 'ACCEPT', label: '认可 - 世界复杂，结盟是必要的' },
    ],
  },
  {
    id: 'P2-013', section: 'P2-values', type: 'single-choice', order: 13, required: true,
    title: '被要求做一件违背你价值观但能获巨大收益的事。你最接近的反应是？',
    options: [
      { id: 'REJECT', label: '不做 - 有些东西比收益重要' },
      { id: 'STRUGGLE', label: '会挣扎很久 - 视违背的程度而定' },
      { id: 'RATIONALIZE', label: '可能做 - 我会找到让自己心安的理由' },
      { id: 'NEVER_BE_ASKED', label: '觉得自己不会遇到这种极端情况' },
    ],
  },
  {
    id: 'P2-014', section: 'P2-values', type: 'single-choice', order: 14, required: true,
    title: '你怎么看待"逃避"？',
    options: [
      { id: 'WEAK', label: '一种软弱 - 问题不会因为你逃跑就消失' },
      { id: 'SELF_CARE', label: '有时是必要的自我保护 - 不是所有战役都值得打' },
      { id: 'SHAME', label: '自己经常这样，有些自我厌恶' },
      { id: 'TOOL', label: '一种工具 - 暂时逃避积蓄能量再面对是有效的' },
    ],
  },
  {
    id: 'P2-015', section: 'P2-values', type: 'single-choice', order: 15, required: true,
    title: '工作中，同事把错误推给了你，你是背锅了。你怎么办？',
    options: [
      { id: 'EVIDENCE', label: '拿出证据澄清 - 事实不容扭曲' },
      { id: 'PRIVATE', label: '私下和同事沟通 - 给他一个承认的机会' },
      { id: 'ACCEPT', label: '认了这个锅 - 但下次绝不再给他机会' },
      { id: 'BOSS', label: '直接找领导说明情况' },
    ],
  },
  {
    id: 'P2-016', section: 'P2-values', type: 'single-choice', order: 16, required: true,
    title: '你对"金钱"的态度是？',
    options: [
      { id: 'TOOL', label: '工具 - 能让我做想做的事、过上想要的生活' },
      { id: 'FREEDOM', label: '自由 - 钱越多，说不的能力越强' },
      { id: 'METRIC', label: '标尺 - 一定程度上反映能力和选择是否正确' },
      { id: 'LOW_PRIORITY', label: '不太重要 - 够用就行，多了是负担' },
    ],
  },
  {
    id: 'P2-017', section: 'P2-values', type: 'single-choice', order: 17, required: true,
    title: '如果你只能在"聪明的混蛋"和"善良的平庸"中选一个做合伙人，你选哪个？',
    options: [
      { id: 'SMART', label: '聪明的混蛋 - 能力第一，人品可以管控' },
      { id: 'KIND', label: '善良的平庸 - 长期来看人品比能力更重要' },
      { id: 'NEITHER', label: '两个都不选，我相信有既聪明又善良的人' },
    ],
  },
  {
    id: 'P2-018', section: 'P2-values', type: 'single-choice', order: 18, required: true,
    title: '你更在意外表还是内在？',
    options: [
      { id: 'INNER', label: '内在远大于外表 - 外表会老，内在会深' },
      { id: 'BOTH', label: '两者都重要 - 外表反映了一个人对自己的管理' },
      { id: 'DYNAMIC', label: '不同关系要求不同 - 伴侣要两者兼顾，朋友内在足够' },
    ],
  },
  {
    id: 'P2-019', section: 'P2-values', type: 'single-choice', order: 19, required: true,
    title: '描述你对"原谅"的态度？',
    options: [
      { id: 'FREELY', label: '容易原谅别人 - 也是放过自己' },
      { id: 'GRADUAL', label: '可以原谅但需要时间 - 不能假装没事' },
      { id: 'HARD', label: '不太会原谅 - 有些伤害不该被忘记' },
      { id: 'DEPENDS', label: '看伤害程度和行为是否重复' },
    ],
  },
  {
    id: 'P2-020', section: 'P2-values', type: 'single-choice', order: 20, required: true,
    title: '你认为一个月多长时间留给自己独处最合适？',
    options: [
      { id: 'MOST', label: '大部分时间 - 独处给我能量和创造力' },
      { id: 'HALF', label: '一半一半 - 社交和独处各占50%左右' },
      { id: 'SOME', label: '二到三成就够 - 我更需要和人在一起' },
      { id: 'NONE', label: '几乎不需要独处 - 一个人反而容易胡思乱想' },
    ],
  },

  /* ================================================================
   * P3-expression: 表达与情感 (25题)
   * ================================================================ */
  {
    id: 'P3-001', section: 'P3-expression', type: 'single-choice', order: 1, required: true,
    title: '你与朋友交流时，最常使用哪种方式？',
    options: [
      { id: 'TEXT', label: '文字消息为主 - 微信/短信/社交媒体私信' },
      { id: 'VOICE', label: '语音消息 - 不喜欢打太多字' },
      { id: 'CALL', label: '直接打电话 - 听到声音更能沟通' },
      { id: 'IN_PERSON', label: '约见面聊 - 面对面最有温度' },
    ],
  },
  {
    id: 'P3-002', section: 'P3-expression', type: 'single-choice', order: 2, required: true,
    title: '描述你的幽默类型？',
    options: [
      { id: 'DRY', label: '冷幽默 - 不动声色地幽默，别人反应慢半拍才懂' },
      { id: 'SELF_DEPRECATING', label: '自嘲型 - 拿自己开玩笑最安全也最搞笑' },
      { id: 'ABSURD', label: '荒诞型 - 把逻辑推到极致得出荒诞结论' },
      { id: 'OBSERVATION', label: '观察型 - 发现生活中的荒谬和不协调' },
      { id: 'NOT_FUNNY', label: '我不太幽默 - 但我会被幽默的人吸引' },
    ],
  },
  {
    id: 'P3-003', section: 'P3-expression', type: 'single-choice', order: 3, required: true,
    title: '你说话时更喜欢哪种风格？',
    options: [
      { id: 'BOTTOM_LINE', label: '直接 - 先说结论，再说理由' },
      { id: 'BUILD_UP', label: '铺垫型 - 先讲背景和过程，再说结论' },
      { id: 'STORY', label: '叙事型 - 喜欢用例子和故事来表达' },
      { id: 'QUESTION', label: '启发型 - 喜欢先问对方问题' },
    ],
  },
  {
    id: 'P3-004', section: 'P3-expression', type: 'single-choice', order: 4, required: true,
    title: '你的句子通常多长？',
    options: [
      { id: 'SHORT', label: '短句为主 - 一行之内能说完的事不拖成两行' },
      { id: 'MEDIUM', label: '中等 - 恰好的长度，不刻意压缩或延伸' },
      { id: 'LONG', label: '长句较多 - 喜欢把逻辑嵌套清楚，一句话可能有很多从句' },
      { id: 'VARIED', label: '变化 - 看情绪和场合调整' },
    ],
  },
  {
    id: 'P3-005', section: 'P3-expression', type: 'single-choice', order: 5, required: true,
    title: '当你生气时，通常如何表达？',
    options: [
      { id: 'EXPLODE', label: '直接爆发 - 说出来，甚至吵起来' },
      { id: 'COLD', label: '冷暴力 - 不说话，不理人，让对方自己感受' },
      { id: 'CALM', label: '冷静下来再谈 - 不想在情绪中说出不可挽回的话' },
      { id: 'WRITE', label: '写出来 - 文字比口头更能精确表达' },
      { id: 'HIDE', label: '压抑自己 - 很难直接表达愤怒' },
    ],
  },
  {
    id: 'P3-006', section: 'P3-expression', type: 'single-choice', order: 6, required: true,
    title: '朋友失恋了找你倾诉。你更倾向哪种回应？',
    options: [
      { id: 'HUG', label: '陪伴和倾听 - 不需要给答案，在就好' },
      { id: 'SOLVE', label: '分析问题 - 给对方分析为什么会这样，下次怎么避免' },
      { id: 'DISTRACT', label: '转移注意力 - 带对方出去玩，聊别的话题' },
      { id: 'BLUNT', label: '直接说 - 这个人本来就不适合你，分了好' },
    ],
  },
  {
    id: 'P3-007', section: 'P3-expression', type: 'single-choice', order: 7, required: true,
    title: '你习惯用什么方式处理和消化负面情绪？',
    options: [
      { id: 'ALONE', label: '自己消化 - 独处、思考、写日记' },
      { id: 'VENT', label: '找信任的人倾诉 - 说出来会好很多' },
      { id: 'ACTION', label: '转化为行动 - 运动/工作/创作来转移' },
      { id: 'ART', label: '艺术表达 - 听音乐/画画/唱歌/写作' },
      { id: 'SIT', label: '就坐着感受 - 让情绪流过自己' },
    ],
  },
  {
    id: 'P3-008', section: 'P3-expression', type: 'single-choice', order: 8, required: true,
    title: '你的文字表情包/颜文字使用习惯？',
    options: [
      { id: 'FREQUENT', label: '经常用 - 没有表情包不叫聊天 😂' },
      { id: 'MODERATE', label: '适当用 - 有些地方需要，有些不需要' },
      { id: 'RARE', label: '偶尔用 - 其实不太会用流行表情' },
      { id: 'NEVER', label: '几乎不用 - 纯文字足够表达' },
    ],
  },
  {
    id: 'P3-009', section: 'P3-expression', type: 'single-choice', order: 9, required: true,
    title: '别人和你说话时突然停顿，你会？',
    options: [
      { id: 'FILL', label: '帮ta补充或接话 - 我不怕冷场' },
      { id: 'WAIT', label: '安静等待 - 给对方思考的空间' },
      { id: 'NERVOUS', label: '觉得有些尴尬 - 想找话题打破沉默' },
      { id: 'UNNOTICED', label: '几乎不觉得有什么 - 停顿很正常' },
    ],
  },
  {
    id: 'P3-010', section: 'P3-expression', type: 'single-choice', order: 10, required: true,
    title: '你听到一首很感动你的歌，你最可能？',
    options: [
      { id: 'SHARE', label: '分享给特定的人 - "这首歌让我想到你"' },
      { id: 'REPLAY', label: '一个人反复循环 - 沉浸在自己的感受里' },
      { id: 'POST', label: '发朋友圈或社交动态 - 配上歌词' },
      { id: 'NOTHING', label: '就继续听 - 不太会做什么特别的事' },
    ],
  },
  {
    id: 'P3-011', section: 'P3-expression', type: 'single-choice', order: 11, required: true,
    title: '你更喜欢怎样的被爱方式？',
    options: [
      { id: 'WORDS', label: '被热情地赞美和肯定 - 语言有魔力' },
      { id: 'ACTIONS', label: '用行动表达 - 说得好听不如做得贴心' },
      { id: 'TIME', label: '高质量的陪伴 - 把注意力完全给我' },
      { id: 'TOUCH', label: '身体亲密度 - 拥抱和碰触让我感到被爱' },
      { id: 'GIFTS', label: '精心准备的小惊喜 - 不太在乎价钱，在于用心' },
    ],
  },
  {
    id: 'P3-012', section: 'P3-expression', type: 'single-choice', order: 12, required: true,
    title: '对方突然不回你消息，你第一反应是？',
    options: [
      { id: 'ANXIOUS', label: '我是不是说错了什么？开始过度解读' },
      { id: 'BUSY', label: 'ta可能在忙 - 等一等就好' },
      { id: 'ANGER', label: '觉得很不尊重 - 至少应该说一声' },
      { id: 'DETACH', label: '无所谓 - 别人有别人的节奏' },
    ],
  },
  {
    id: 'P3-013', section: 'P3-expression', type: 'single-choice', order: 13, required: true,
    title: '你看一部很感人的电影时，最常有的反应？',
    options: [
      { id: 'CRY_EASY', label: '容易哭 - 我泪点很低' },
      { id: 'CRY_RARE', label: '很少哭 - 但真的触动时会' },
      { id: 'INSIDE', label: '内心波涛汹涌，表面很平静 - 不太外显情绪' },
      { id: 'NOT_CRY', label: '从不哭 - 但我以其他方式被感动' },
    ],
  },
  {
    id: 'P3-014', section: 'P3-expression', type: 'single-choice', order: 14, required: true,
    title: '你的"道歉"方式通常是？',
    options: [
      { id: 'DIRECT', label: '直接说对不起 - 不绕弯' },
      { id: 'EXPLAIN', label: '先解释原因 - "我这么做是因为...但我知道我错了"' },
      { id: 'ACTION', label: '用行动弥补 - 说对不起没意义，做点什么' },
      { id: 'HARD', label: '很难开口说对不起 - 自尊心在作怪' },
      { id: 'TIME', label: '需要一些时间才能说出来' },
    ],
  },
  {
    id: 'P3-015', section: 'P3-expression', type: 'single-choice', order: 15, required: true,
    title: '在你的表达中，"我觉得"和"我认为"使用比例？',
    options: [
      { id: 'FEEL', label: '偏"我觉得" - 更多表达感受和个人立场' },
      { id: 'THINK', label: '偏"我认为" - 更多表达分析和判断' },
      { id: 'BOTH', label: '差不多 - 看情境' },
    ],
  },
  {
    id: 'P3-016', section: 'P3-expression', type: 'single-choice', order: 16, required: true,
    title: '什么情况下你会变得特别沉默？',
    options: [
      { id: 'SAD', label: '很难过的时候 - 说不出来' },
      { id: 'THINKING', label: '深度思考的时候 - 外界暂时无吸引力' },
      { id: 'OVERWHELMED', label: '信息过载 - 需要消化' },
      { id: 'ANGRY', label: '极端生气时 - 不说话以免失控' },
      { id: 'BORED', label: '对当前话题或人不感兴趣时' },
    ],
  },
  {
    id: 'P3-017', section: 'P3-expression', type: 'single-choice', order: 17, required: true,
    title: '你形容事物时使用比喻的频率？',
    options: [
      { id: 'OFTEN', label: '经常 - 比喻是我理解世界的主要工具' },
      { id: 'SOMETIMES', label: '偶尔 - 为了让对方更容易理解' },
      { id: 'RARELY', label: '很少 - 我更习惯直接描述' },
    ],
  },
  {
    id: 'P3-018', section: 'P3-expression', type: 'single-choice', order: 18, required: true,
    title: '你更喜欢收到怎样的赞美？',
    options: [
      { id: 'TRAIT', label: '对我这个人本身的赞美 - "你是个很善良的人"' },
      { id: 'RESULT', label: '对我付出或成果的肯定 - "你做的这个真的很厉害"' },
      { id: 'IMPACT', label: '对我对你产生的影响 - "你的话让我改变了很多"' },
      { id: 'NOT_NEED', label: '不需要赞美 - 我自己心里有数' },
    ],
  },
  {
    id: 'P3-019', section: 'P3-expression', type: 'single-choice', order: 19, required: true,
    title: '你怎么看待自己写的文字被陌生人"分析"？',
    options: [
      { id: 'CURIOUS', label: '有意思 - 我想看看自己是什么样' },
      { id: 'UNCOMFORTABLE', label: '有些不自在 - 像被看穿了一样' },
      { id: 'INDIFFERENT', label: '无所谓 - 写出来就是可以被看的' },
      { id: 'EXCITED', label: '很期待 - 这也是我认真写这段话的原因' },
    ],
  },
  {
    id: 'P3-020', section: 'P3-expression', type: 'single-choice', order: 20, required: true,
    title: '你在表达时，动词和名词的比例大致是？',
    options: [
      { id: 'VERB', label: '动词多 - "做、跑、推、写"，行动性强' },
      { id: 'NOUN', label: '名词多 - "概念、框架、意义、本质"，抽象名词多' },
      { id: 'ADJ', label: '形容词多 - "温暖的、复杂的、有趣的"，描述性强' },
      { id: 'UNSURE', label: '我没注意过这个问题' },
    ],
  },
  {
    id: 'P3-021', section: 'P3-expression', type: 'single-choice', order: 21, required: true,
    title: '一段令你印象深刻的记忆，你更倾向于记起什么？',
    options: [
      { id: 'EMOTION', label: '情绪 - 那个瞬间的感受最清晰' },
      { id: 'DETAIL', label: '细节 - 画面、声音、味道都很清楚' },
      { id: 'MEANING', label: '意义 - 这件事对我后来的影响' },
      { id: 'PEOPLE', label: '人 - 谁在场，谁说了什么' },
    ],
  },
  {
    id: 'P3-022', section: 'P3-expression', type: 'single-choice', order: 22, required: true,
    title: '你会主动表达关心和爱意吗？',
    options: [
      { id: 'YES', label: '经常主动 - 我要让我在乎的人感受到' },
      { id: 'SOMETIMES', label: '看心情和人 - 不是所有人都值得' },
      { id: 'AWKWARD', label: '想说但不知道怎么说 - 说出来怪怪的' },
      { id: 'ACTIONS', label: '我做多于说 - 行动比语言更自然' },
    ],
  },
  {
    id: 'P3-023', section: 'P3-expression', type: 'single-choice', order: 23, required: true,
    title: '你写作时（发朋友圈/写邮件/做报告），最在意什么？',
    options: [
      { id: 'CLARITY', label: '清晰 - 读者不会产生误解' },
      { id: 'BREVITY', label: '简洁 - 不浪费读者时间' },
      { id: 'STYLE', label: '风格 - 有独特的语感和美' },
      { id: 'LOGIC', label: '逻辑 - 每一个结论都有支撑' },
      { id: 'IMPACT', label: '影响力 - 能不能让读者有反应' },
    ],
  },
  {
    id: 'P3-024', section: 'P3-expression', type: 'single-choice', order: 24, required: true,
    title: '你最常引用的"类型"是什么？',
    options: [
      { id: 'BOOK', label: '书里的句子 - 阅读是重要的参照系' },
      { id: 'FILM', label: '电影/剧里的台词 - 影像语言更有感染力' },
      { id: 'PERSONAL', label: '自己或朋友说过的话 - 身边的人最真实' },
      { id: 'MUSIC', label: '歌词 - 音乐是情感的开关' },
      { id: 'SELDOM', label: '几乎不引用 - 我以为自己的想法更值得被听到' },
    ],
  },
  {
    id: 'P3-025', section: 'P3-expression', type: 'single-choice', order: 25, required: true,
    title: '你如何应对"长时间不被理解"的状态？',
    options: [
      { id: 'KEEP_TALKING', label: '继续解释 - 只是表达方式还不够好' },
      { id: 'ACCEPT', label: '接受 - 有些东西不是每个人都理解' },
      { id: 'LONELY', label: '感到孤独 - 但保留这种孤独感' },
      { id: 'FIND', label: '去寻找有相同频率的人' },
    ],
  },

  /* ================================================================
   * P4-relationship: 社交与关系 (20题)
   * ================================================================ */
  {
    id: 'P4-001', section: 'P4-relationship', type: 'single-choice', order: 1, required: true,
    title: '你有多少真正意义上的"好朋友"？',
    options: [
      { id: '0-1', label: '0-1个 - 深度比数量重要' },
      { id: '2-3', label: '2-3个 - 少数但高品质' },
      { id: '4-6', label: '4-6个 - 一个小圈子' },
      { id: '7+', label: '7个以上 - 朋友多多益善' },
    ],
  },
  {
    id: 'P4-002', section: 'P4-relationship', type: 'single-choice', order: 2, required: true,
    title: '和一群不太熟悉的人社交后，你的状态一般是？',
    options: [
      { id: 'ENERGIZED', label: '充满能量 - 认识新朋友很兴奋' },
      { id: 'NEUTRAL', label: '还好 - 没有特别的感觉' },
      { id: 'DRAINED', label: '精疲力尽 - 需要恢复一段时间' },
      { id: 'MIXED', label: '既兴奋又疲惫 - 复杂的感觉' },
    ],
  },
  {
    id: 'P4-003', section: 'P4-relationship', type: 'single-choice', order: 3, required: true,
    title: '你如何面对朋友之间的疏远？',
    options: [
      { id: 'FIGHT', label: '主动联系挽回 - 不想失去' },
      { id: 'SAD', label: '难过但不动 - 觉得缘尽就该放手' },
      { id: 'THINK', label: '分析原因 - 是不是我做错了什么' },
      { id: 'NATURAL', label: '接受 - 人生就是这样，有人来有人走' },
    ],
  },
  {
    id: 'P4-004', section: 'P4-relationship', type: 'single-choice', order: 4, required: true,
    title: '在伴侣关系中，如果产生矛盾，你倾向于？',
    options: [
      { id: 'TALK_NOW', label: '立刻沟通 - 不能让问题过夜' },
      { id: 'WAIT', label: '各自冷静一阵 - 等合适的时机再聊' },
      { id: 'AVOID', label: '回避冲突 - 过段时间自然就好了' },
      { id: 'WRITE', label: '文字沟通 - 避免当面情绪失控' },
    ],
  },
  {
    id: 'P4-005', section: 'P4-relationship', type: 'single-choice', order: 5, required: true,
    title: '你怎么判断一段关系是否值得继续？',
    options: [
      { id: 'GROWTH', label: '这段关系是否让我在成长 - 哪怕有摩擦' },
      { id: 'HAPPY', label: '大部分时间是否感到快乐 - 情感是最直接的尺子' },
      { id: 'EFFORT', label: '双方投入是否平衡 - 我不当单向输出的人' },
      { id: 'TRUST', label: '是否能信任 - 这是底线' },
    ],
  },
  {
    id: 'P4-006', section: 'P4-relationship', type: 'single-choice', order: 6, required: true,
    title: '在团队中，你最常扮演的角色？',
    options: [
      { id: 'LEADER', label: '领导者 - 设定方向和节奏' },
      { id: 'EXECUTOR', label: '执行者 - 把事情稳稳落地' },
      { id: 'IDEA', label: '创意来源 - 提出新想法和可能性' },
      { id: 'HARMONIZER', label: '调和者 - 维护团队氛围和关系' },
      { id: 'OBSERVER', label: '观察者 - 不主动参与但洞察全局' },
    ],
  },
  {
    id: 'P4-007', section: 'P4-relationship', type: 'single-choice', order: 7, required: true,
    title: '有人对你示好（非友谊），你不喜欢ta。你的做法是？',
    options: [
      { id: 'CLEAR', label: '明确拒绝 - 不暧昧不浪费彼此时间' },
      { id: 'HINT', label: '暗示对方 - 用间接方式让ta知难而退' },
      { id: 'GHOST', label: '慢慢远离 - 不忍心当面拒绝' },
      { id: 'FRIEND', label: '表示可以做朋友 - 保持关系但设界限' },
    ],
  },
  {
    id: 'P4-008', section: 'P4-relationship', type: 'single-choice', order: 8, required: true,
    title: '对你来说，"忠诚"在感情中是？',
    options: [
      { id: 'ABSOLUTE', label: '绝对必要条件 - 不忠不可原谅' },
      { id: 'HIGH', label: '极其重要 - 但具体情况可以讨论' },
      { id: 'MODERATE', label: '重要但非唯一 - 还有比忠诚更重要的元素' },
      { id: 'COMPLEX', label: '人性复杂 - 不能简单地一刀切' },
    ],
  },
  {
    id: 'P4-009', section: 'P4-relationship', type: 'single-choice', order: 9, required: true,
    title: '你和一个重要的人在闲聊。你更常处于哪种角色？',
    options: [
      { id: 'TALKER', label: '主要说话的人 - 我喜欢分享' },
      { id: 'LISTENER', label: '主要倾听的人 - 我更享受听和观察' },
      { id: 'BALANCED', label: '差不多平均 - 我也说说，也听听' },
    ],
  },
  {
    id: 'P4-010', section: 'P4-relationship', type: 'single-choice', order: 10, required: true,
    title: '你和家人（父母/至亲）的互动模式是怎样的？',
    options: [
      { id: 'OPEN', label: '开放交流 - 大部分事都可以聊' },
      { id: 'SELECTIVE', label: '选择性分享 - 有些话题不聊' },
      { id: 'SURFACE', label: '停留在表面 - 不太深入交流内心' },
      { id: 'DISTANT', label: '比较疏远 - 很少深度交流' },
    ],
  },
  {
    id: 'P4-011', section: 'P4-relationship', type: 'single-choice', order: 11, required: true,
    title: '面对权威（老板/老师/领导），你通常表现是？',
    options: [
      { id: 'CHALLENGE', label: '敢于质疑 - 若有不同意见我说出来' },
      { id: 'RESPECT', label: '尊重但保持距离 - 做自己的事就好' },
      { id: 'NERVOUS', label: '有些紧张 - 说话前会多想几遍' },
      { id: 'EQUAL', label: '当一般人相处 - 大家只是角色不同' },
    ],
  },
  {
    id: 'P4-012', section: 'P4-relationship', type: 'single-choice', order: 12, required: true,
    title: '你给朋友提建议时，倾向于？',
    options: [
      { id: 'DIRECT_ADVICE', label: '直接给建议 - "你应该这样做"' },
      { id: 'ASK_QUESTIONS', label: '先问问题 - 帮他理清思路，让他自己做决定' },
      { id: 'SHARE_EXPERIENCE', label: '分享自己的经历 - 让ta参考而非指示' },
      { id: 'AVOID_ADVICE', label: '不给建议 - 除非对方明确要求' },
    ],
  },
  {
    id: 'P4-013', section: 'P4-relationship', type: 'single-choice', order: 13, required: true,
    title: '你如何描述自己与"独处"的关系？',
    options: [
      { id: 'ESSENTIAL', label: '必需品 - 没有独处时间我会崩溃' },
      { id: 'NICE', label: '锦上添花 - 但没有也能撑' },
      { id: 'AVOID', label: '尽量避免独处 - 一个人的时候容易失控' },
      { id: 'NEUTRAL', label: '平常 - 不需要特别安排' },
    ],
  },
  {
    id: 'P4-014', section: 'P4-relationship', type: 'single-choice', order: 14, required: true,
    title: '你怎么看待在感情中保持独立空间？',
    options: [
      { id: 'MUST', label: '必须 - 即使在一起也要有自己的世界' },
      { id: 'AS_MUCH_AS_POSSIBLE', label: '理想情况 - 但可以有些重合' },
      { id: 'TOGETHER', label: '尽量在一起 - 相处越融合越好' },
      { id: 'DYNAMIC', label: '看对方需求 - 有些人需要空间，有些不需要' },
    ],
  },
  {
    id: 'P4-015', section: 'P4-relationship', type: 'single-choice', order: 15, required: true,
    title: '朋友约你出去但你不想去。你更可能？',
    options: [
      { id: 'HONEST', label: '直接说不 - 真实比礼貌重要' },
      { id: 'EXCUSE', label: '找个体面的借口 - 不伤人也不委屈自己' },
      { id: 'FORCE', label: '勉强去 - 不想让别人失望' },
      { id: 'RESCHEDULE', label: '改天再约 - 表示愿意但今天不行' },
    ],
  },
  {
    id: 'P4-016', section: 'P4-relationship', type: 'single-choice', order: 16, required: true,
    title: '如果一个朋友长期不主动联系你，你通常怎么想？',
    options: [
      { id: 'OK', label: '这很正常 - 各自忙碌而已' },
      { id: 'SAD', label: '有点失望 - 友情需要双方维系' },
      { id: 'REACH_OUT', label: '我会主动联系 - ta不找我，我找ta' },
      { id: 'DRIFT', label: '渐渐就淡了 - 单向的友情维持不久' },
    ],
  },
  {
    id: 'P4-017', section: 'P4-relationship', type: 'single-choice', order: 17, required: true,
    title: '在一段感情中，你更容易"粘人"还是"需要空间"？',
    options: [
      { id: 'CLINGY', label: '偏粘人 - 喜欢经常在一起' },
      { id: 'SPACE', label: '需要空间 - 太近了会不舒服' },
      { id: 'BALANCED', label: '适度的 - 能调节' },
      { id: 'N_A', label: '没有恋爱经验 / 说不清' },
    ],
  },
  {
    id: 'P4-018', section: 'P4-relationship', type: 'single-choice', order: 18, required: true,
    title: '你和一个新认识的人产生分歧。你更可能？',
    options: [
      { id: 'DEBATE', label: '温和争论 - 不同观点才有意思' },
      { id: 'HIDE', label: '先隐藏自己的观点 - 怕初见面就冲突' },
      { id: 'AGREE', label: '表面同意 - 不值得为小事伤了和气' },
      { id: 'CHANGE', label: '换个话题 - 第一次见面不想深究' },
    ],
  },
  {
    id: 'P4-019', section: 'P4-relationship', type: 'single-choice', order: 19, required: true,
    title: '你最讨厌的人在社交场合中出现了，你的反应？',
    options: [
      { id: 'IGNORE', label: '当ta不存在 - 不消耗多余精力' },
      { id: 'POLITE', label: '礼貌打招呼然后走开 - 基本的教养要有' },
      { id: 'LEAVE', label: '找机会离开 - 不给自己添堵' },
      { id: 'CONFRONT', label: '如果ta冒犯我我会当面说' },
    ],
  },
  {
    id: 'P4-020', section: 'P4-relationship', type: 'single-choice', order: 20, required: true,
    title: '你的"社交电池"多久需要充一次？',
    options: [
      { id: 'DAILY', label: '每天都需要独处恢复 - 我电量很小' },
      { id: 'WEEKLY', label: '大约每周一次大的社交之后就差不多了' },
      { id: 'LARGE', label: '能量充足 - 连续见人也不太累' },
      { id: 'VARIES', label: '看和谁在一起 - 对的人给我充电' },
    ],
  },

  /* ================================================================
   * P5-open: 自由表达 (6题)
   * ================================================================ */
  {
    id: 'P5-001', section: 'P5-open', type: 'open-ended', order: 1, required: true,
    title: '你的朋友失恋了，在微信上找你。请写下你会发的消息。',
    description: '直接写出你真实会说的话，不要管"应该说什么"。这能帮助 AI 理解你的安慰方式和同理心模式。',
  },
  {
    id: 'P5-002', section: 'P5-open', type: 'open-ended', order: 2, required: true,
    title: '同事让你帮忙做一个你完全不想接的杂活，你怎么拒绝？请写下你会发的消息。',
    description: '这帮助 AI 理解你的边界感和拒绝风格。是委婉还是直接？是给理由还是不给？',
  },
  {
    id: 'P5-003', section: 'P5-open', type: 'open-ended', order: 3, required: true,
    title: '向一个完全不懂电脑的亲戚解释"为什么他的电脑变慢了"，请写一段话。',
    description: '这帮助 AI 理解你解释复杂概念的方式——用什么比喻？降维到什么程度？',
  },
  {
    id: 'P5-004', section: 'P5-open', type: 'open-ended', order: 4, required: true,
    title: '描述一下你理想中一个完美的周末，从周五晚上开始。',
    description: '自然状态下的语言会暴露很多细节：节奏感、细节深度、情感色彩。',
  },
  {
    id: 'P5-005', section: 'P5-open', type: 'open-ended', order: 5, required: true,
    title: '网上有人说了句你非常不认同的话（比如"读书无用论"），请写一段你的回应。',
    description: '帮助 AI 理解你的论证风格——是先反驳逻辑还是先讲故事？语气是否尖锐？',
  },
  {
    id: 'P5-006', section: 'P5-open', type: 'open-ended', order: 6, required: true,
    title: '最近半年，你觉得自己最大的一个变化是什么？为什么会有这个变化？',
    description: '帮助 AI 理解你的自我认知深度、语言中的时间观和成长叙事方式。',
  },
]

export function getQuestionsBySection(section: QuestionSection): Question[] {
  return allQuestions.filter((q) => q.section === section)
}

export function getSectionQuestionCount(section: QuestionSection): number {
  return getQuestionsBySection(section).length
}

export function getTotalQuestionCount(): number {
  return allQuestions.length
}

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find((q) => q.id === id)
}
