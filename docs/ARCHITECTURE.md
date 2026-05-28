# StayWithMeForever · 架构文档

## 目录结构

```
persona-distill/
├── docs/                          # 项目文档
│   ├── PLAN.md                    # 规划总纲
│   ├── ARCHITECTURE.md            # 本文件
│   ├── QUESTIONNAIRE.md           # 题库设计
│   └── PROMPT_DESIGN.md           # Prompt 设计
├── public/
│   └── vite.svg                   # Logo
├── src/
│   ├── main.tsx                   # 入口
│   ├── App.tsx                    # 根组件 + 路由
│   ├── index.css                  # 全局样式 + Tailwind
│   ├── vite-env.d.ts              # Vite 类型声明
│   ├── components/                # 通用 UI 组件
│   │   └── QuestionCard.tsx       # 多类型题目渲染
│   ├── pages/                     # 页面级组件
│   │   ├── HomePage.tsx           # 首页（人格列表）
│   │   ├── QuestionnairePage.tsx  # 问卷流程
│   │   ├── PersonaDetailPage.tsx  # 人格详情 + 版本管理
│   │   ├── SkillEditorPage.tsx    # SKILL.md 预览/生成/导出
│   │   ├── ChatPage.tsx           # 内置聊天
│   │   └── SettingsPage.tsx       # LLM 设置
│   ├── stores/                    # Zustand 状态管理
│   │   ├── personaStore.ts        # 人格 CRUD
│   │   ├── questionnaireStore.ts  # 问卷进度与答案
│   │   ├── chatStore.ts           # 聊天会话与消息
│   │   └── settingsStore.ts       # LLM 配置
│   ├── db/                        # 本地数据库层
│   │   └── database.ts            # Dexie Schema + 查询方法
│   ├── data/                      # 静态数据
│   │   └── questionBank.ts        # 100+题目的结构化数据
│   ├── llm/                       # LLM 适配层
│   │   ├── adapter.ts             # 统一接口（适配器模式）
│   │   └── prompts.ts             # Analyzer + Generator + Chat Prompt
│   ├── types/                     # TypeScript 类型定义
│   │   └── index.ts
│   └── utils/
│       └── export.ts              # SKILL.md 下载/复制
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 组件树

```
<App>
  <Routes>
    <HomePage />              # 首页：人格列表 + 创建
    <QuestionnairePage />     # 问卷：多步骤答题
    <PersonaDetailPage />     # 人格详情：版本列表
    <SkillEditorPage />       # Skill：生成/预览/下载
    <ChatPage />              # 聊天：与 AI 人格对话
    <SettingsPage />          # 设置：LLM 配置
  </Routes>
</App>
```

## 数据流

```
用户答题 → Answer[]
           │
           ▼
questionnaireStore (Zustand)
  ● 管理当前问题位置
  ● 管理答案状态
  ● 持久化到 IndexedDB (Dexie)
           │
           ▼ (提交后)
SkillEditorPage
  ● 构建 profileJson
  ● 调用 Analyzer LLM → 人格 JSON
  ● 调用 Generator LLM → SKILL.md
  ● 保存到 PersonaVersion.generatedSkill
           │
           ▼
ChatPage
  ● 读取 SKILL.md 作为 System Prompt
  ● 用户消息 → LLM API
  ● 消息存储到 IndexedDB
```

## 路由设计

| 路由 | 组件 | 说明 |
|------|------|------|
| `/` | HomePage | 首页 |
| `/questionnaire/:versionId` | QuestionnairePage | 问卷 |
| `/persona/:personaId` | PersonaDetailPage | 人格详情 |
| `/skill/:versionId` | SkillEditorPage | Skill 生成 |
| `/chat/:sessionId` | ChatPage | 内置聊天 |
| `/settings` | SettingsPage | 设置 |

注意：聊天页面 URL 用 `sessionId` 参数，但实际传的是 `personaVersionId`（因为一个版本对应一个 Skill / System Prompt）。进入 ChatGPT 后会自动加载或创建第一个 ChatSession。

## IndexedDB Schema

```
Database: StayWithMeForeverDB
Version: 1

Table: personas
  id: string (PK)
  name: string
  avatar?: string
  createdAt: number
  updatedAt: number

Table: personaVersions
  id: string (PK)
  personaId: string (FK → personas.id)
  name: string
  createdAt: number
  baseProfile: object
  answers: object[]
  personalityTraits: object[]
  cognitiveProfile: object
  valueProfile: object
  expressionDNA: object
  relationshipProfile: object
  generatedSkill?: { content: string, generatedAt: number, modelUsed: string }

Table: chatSessions
  id: string (PK)
  personaVersionId: string (FK → personaVersions.id)
  title: string
  createdAt: number
  updatedAt: number

Table: chatMessages
  id: string (PK)
  sessionId: string (FK → chatSessions.id)
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number

Table: questionnaireProgress
  personaVersionId: string (PK)
  currentSection: string
  currentQuestionIndex: number
  answers: object[]
  startedAt: number
  totalQuestions: number
  completedQuestions: number
```

## LLM Adapter 设计（适配器模式）

```
interface Adapter {
  completion(request, config) → Promise<Response>
}

Adapters:
  deepseekCompletion  → api.deepseek.com/chat/completions
  openaiCompletion    → api.openai.com/v1/chat/completions
  anthropicCompletion → api.anthropic.com/v1/messages
  ollamaCompletion    → localhost:11434/api/generate
```

所有 adapter 统一接口，通过 `getLLMConfig()` 从 localStorage 读取配置。
