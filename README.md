# StayWithMeForever

> *「请和我永远在一起。」*

邀请或导入你重视的那个人，让 AI 人格成为关系的延续。
记录不同时间的自己，让过去的"你"永远可以被对话。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-Compatible-green)](https://agentskills.io)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org)

---

## 效果示例

```
你（问卷后）    ❯ 我好朋友失恋了，我不知道怎么安慰她

AI 人格         ❯ 看到你这样说我真的很难过。
                  感情这种事没有对错，但我知道现在说什么都很难让你好受一点。
                  如果你想倾诉或者只是有人陪着不说话，我都在。
                  不需要逼自己很快走出来，难过多久都可以。
```

```
你              ❯ 我想做自媒体、写书、做独立开发，精力完全不够

AI 人格         ❯ 你列了三个方向。不是精力不够，是范围太散。
                  问你自己：哪一个会让你进入心流，忘记时间？
                  不是三选一。是先一，再一，再一。
```

这不是 AI 在说"标准答案"，而是**基于 100+ 道行为情境题提炼出来的、属于那个特定的人的认知模式和表达方式**。

---

## 为什么是 StayWithMeForever

[同事.skill](https://github.com/titanwings/colleague-skill) 证明了一件事：蒸馏一个人是可行的。
[女娲](https://github.com/alchaincyf/nuwa-skill) 把它推向了极致——从公开信息中提取乔布斯、芒格、马斯克的认知操作系统。

但还有一个问题没有被解决：

> **你想蒸馏的那个人，并不在网上留下几万字的公开资料。**
> 他没有播客、没有 Twitter 长文、没有传记。
> 他只是你身边一个很重要的人——
> 或者就是不同时期的你自己。

StayWithMeForever 为此而生。

**通过结构化问卷直接采集一手认知数据**——不需要公开资料，不需要 Agent 爬取。
答题 15-20 分钟，AI 提取他的思维模式，生成一个可对话的数字人格。
> *「听说中国人最爱做题了。」*

---

## 核心特性

- **本地文件存储** — 数据以 JSON 文件保存在项目 `data/` 目录，复制文件夹即带走全部数据
- **隐私绝对安全** — 纯前端 + 轻量本地 API，数据永不上传任何服务器
- **多时间版本** — 记录"毕业前的我"、"三年后的我"，支持回溯与对比
- **标准化 Skill 输出** — 兼容 [Agent Skills 协议](https://agentskills.io)，生成的 SKILL.md 可导入 Cursor / Claude Code / OpenCode
- **内置聊天** — 直接在浏览器与生成的 AI 人格对话
- **导入已有 Skill** — 支持导入符合规范的 SKILL.md 文件，无需重跑问卷
- **多 LLM 适配** — DeepSeek（默认）| OpenAI | Anthropic | Ollama（本地）

---

## 快速开始

### 1. 下载项目

```bash
# 用 Git 克隆（推荐）
git clone https://github.com/Kai-Junhan/StayWithMeForever.git

# 或者：点击页面上方绿色 "Code" 按钮 → Download ZIP → 解压
```

### 2. 确保你已安装 Node.js

在终端里运行以下命令，确认 Node.js 版本 ≥ 14：

```bash
node --version
```

如果没有安装，去 [nodejs.org](https://nodejs.org) 下载 LTS 版本。

### 3. 进入项目目录，安装依赖

```bash
cd StayWithMeForever
npm install
```

### 4. 启动

```bash
npm run dev
```

这会同时启动两个服务：本地文件存储 API（端口 3001）和前端页面（端口 3000）。

### 5. 打开浏览器

访问 **http://localhost:3000**，你会看到首页。

> 首次使用需进入**设置页**，填入 LLM API Key。[DeepSeek](https://platform.deepseek.com) 推荐，注册即送额度，生成一次 Skill 约 0.03 元。

---

## 使用流程

```
设置 API Key → 测试连接
 │
 ├── + 蒸馏一个人 → 填写基本信息 → 开始问卷
 │         ├── 完整性版 (106 题，15-20 分钟)
 │         └── 精简版 (~20 题，3-5 分钟)
 │
 ├── 导入 Skill → 选择 .md 文件 → 自动校验 → 直接可用
 │
 └── 已有的人格 → 查看版本 → 生成 Skill → 聊天 / 下载
```

---

## 人格建模五层结构

SWMF 通过问卷提取比表面习惯更深的东西——**认知操作系统**。

| 层次 | 说明 |
|------|------|
| **怎么说话** | 表达DNA——句式、节奏、幽默、情感表达 |
| **怎么想** | 心智模型、认知框架 |
| **怎么判断** | 决策启发式、价值优先级 |
| **什么不做** | 反模式、价值观底线 |
| **知道局限** | 诚实边界——每个 Skill 标注做不到什么 |

**工作习惯可以通过聊天模仿，但面对同一个问题做出不同判断的，是认知框架。**

---

## 问卷设计哲学

100+ 道题不是随便出的。每条题目背后都有一个设计意图：

- **行为投射** — 不问"你外向吗"，问"聚会上你通常……"
- **情境化** — 每道题嵌入具体场景，收集真实反应
- **防社会期许** — 每个选项都有合理动机，不引导"正确答案"
- **开放问答是核心** — 6 道简答题直接提供表达 DNA 的原始文本

模块覆盖：
`P0 基础画像` → `P1 认知模式` → `P2 价值观` → `P3 表达与情感` → `P4 社交与关系` → `P5 自由表达`

---

## 项目结构

```
StayWithMeForever/
├── server.cjs                    # 本地文件存储 API（Express）
├── src/
│   ├── components/
│   │   ├── QuestionCard.tsx      # 多题型渲染（单选/排序/开放问答）
│   │   └── ImportSkillModal.tsx  # SKILL.md 导入解析器
│   ├── data/
│   │   ├── questionBank.ts       # 完整题库 (106题)
│   │   ├── questionBankMini.ts   # 精简题库 (~20题)
│   │   ├── useQuestionBank.ts    # 动态题库选择器
│   │   └── mockData.ts           # 开发测试数据
│   ├── db/httpStorage.ts         # 本地文件存储客户端
│   ├── llm/
│   │   ├── adapter.ts            # LLM 适配器（DeepSeek/OpenAI/Anthropic/Ollama）
│   │   └── prompts.ts            # 两阶段 Prompt（分析 + 生成）
│   ├── pages/
│   │   ├── HomePage.tsx          # 首页
│   │   ├── CreatePage.tsx        # 创建人格（表单式）
│   │   ├── QuestionnairePage.tsx # 问卷流程
│   │   ├── PersonaDetailPage.tsx # 人格详情 + 版本管理
│   │   ├── SkillEditorPage.tsx   # Skill 生成/预览/下载
│   │   ├── ChatPage.tsx          # 内置聊天
│   │   └── SettingsPage.tsx      # LLM 配置
│   ├── stores/                   # Zustand 状态管理
│   ├── types/index.ts            # TypeScript 类型定义
│   └── utils/export.ts           # SKILL.md 导出
├── docs/                         # 设计文档
│   ├── PLAN.md
│   ├── ARCHITECTURE.md
│   ├── QUESTIONNAIRE.md
│   └── PROMPT_DESIGN.md
├── data/                         # 用户数据目录（本地文件存储）
└── README.md
```

---

## 与 nuwa-skill 的关系

| 维度 | nuwa-skill | StayWithMeForever |
|------|------------|-------------------|
| **蒸馏对象** | 公开名人（乔布斯/芒格/马斯克） | 身边人（朋友/伴侣/自己） |
| **数据来源** | 网络公开资料（Agent 搜索） | **一手问卷数据**（用户答题） |
| **采集方式** | 6 Agent 并行搜索 | 结构化问卷（15-20 分钟） |
| **优势** | 深挖名人的认知架构 | 提取非公开的情感/关系/表达模式 |
| **Skill 格式** | Agent Skills 协议 SKILL.md | **完全兼容** |

> 女娲蒸馏了名人怎么想。SWMF 蒸馏你身边的人怎么想。

---

## 技术栈

| 层 | 技术 |
|----|------|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite 4 |
| 样式 | Tailwind CSS 3 |
| 状态管理 | Zustand 4 |
| 后端（本地） | Express 4 |
| LLM | DeepSeek / OpenAI / Anthropic / Ollama |
| 数据存储 | JSON 文件（`data/` 目录） |

---

## 常见问题

**Q: 数据存在哪里？刷新会丢吗？**
A: 所有数据以 JSON 文件存储在你的项目 `data/` 文件夹中。刷新、关机、重启不会丢失。复制项目文件夹即可带走全部数据。

**Q: 需要服务器吗？**
A: 不需要。`npm run dev` 在本地启动 Express API（端口 3001）+ Vite 前端（端口 3000），都在你的电脑上。

**Q: API Key 安全吗？**
A: 仅存在浏览器 `localStorage` 中，从浏览器直发 LLM 提供商，不经过任何中间服务器。

**Q: 生成一个 Skill 花多少钱？**
A: DeepSeek 约 0.03 元/次，两阶段共约 4K-8K tokens。

**Q: 可以导入别人生成的 Skill 吗？**
A: 支持导入符合 Agent Skills 协议的 SKILL.md 文件，自动校验格式后即可使用。

---

## 许可证

MIT — 随便用，随便改。

---

> *nuwa-skill 蒸馏了名人怎么想。SWMF 蒸馏你身边的人怎么想。*
> *你想蒸馏的下一个人，何必是名人。*
