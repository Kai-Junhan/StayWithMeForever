# StayWithMeForever

> **把身边的 Ta，变成可对话的 AI 分身。**
>
> 通过 100+ 道精心设计的行为情境题，提炼一个人的认知模式、价值观和表达 DNA，
> 生成符合 [Agent Skills 协议](https://github.com/alchaincyf/nuwa-skill) 的 `SKILL.md`，
> 在 Claude Code / Cursor / OpenCode 中作为思维顾问运行，或直接在浏览器内与 AI 人格聊天。

## 核心特性

- **本地文件存储** — 所有数据以 JSON 文件保存在项目的 `data/` 目录，复制文件夹即带走全部数据
- **纯前端 + 轻量后端** — React + Express，无需云服务器，两个命令即可在本地运行
- **多时间版本** — 为同一个人记录"毕业前的我" vs "三年后的我"，支持回溯对比
- **标准化 Skill 输出** — 复用 [nuwa-skill](https://github.com/alchaincyf/nuwa-skill) 的 SKILL.md 模板，生成即可用的 AI 人格
- **内置聊天** — 直接在网页内与生成的 AI 人格对话，无需外部 Agent Runtime
- **多 LLM 适配** — DeepSeek（默认）| OpenAI | Anthropic | Ollama（本地）
- **中断续答** — 问卷进度 500ms 自动存盘，翻页、关浏览器都不丢

---

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动（同时启动文件存储 API + 前端开发服务器）
npm run dev

# 3. 浏览器打开 http://localhost:3000
```

> 首次使用需要进入**设置页**，填入 LLM API Key（推荐 [DeepSeek](https://platform.deepseek.com)）。

---

## 使用流程

```
设置页 → 填入 API Key → 测试连接
 │
 ▼
首页 → + 蒸馏一个人 → 输入名字
 │
 ▼
问卷页 → 106 道题（选择题 + 简答题，约 15-20 分钟）
                    ├── P0 基础画像（10题）
                    ├── P1 认知模式（25题）
                    ├── P2 价值观（20题）
                    ├── P3 表达与情感（25题）
                    ├── P4 社交与关系（20题）
                    └── P5 自由表达（6题）
 │
 ▼
Skill 页 → 点击"生成 SKILL.md"
              → AI 两阶段分析 → 输出标准化 Skill 文件
 │
 ├── 下载 SKILL.md → 导入 Cursor / Claude Code 使用
 │
 └── 开始聊天 → 在浏览器内与 AI 人格对话
```

---

## 项目结构

```
StayWithMeForever/
├── server.js                     # 文件存储 API（Express，端口 3001）
├── src/
│   ├── components/QuestionCard.tsx   # 多题型渲染
│   ├── data/questionBank.ts          # 106 道结构化问卷
│   ├── db/httpStorage.ts             # 前端存储客户端
│   ├── llm/
│   │   ├── adapter.ts                # LLM 适配器（4 家）
│   │   └── prompts.ts                # 两阶段 Prompt 模版
│   ├── pages/                        # 页面组件
│   │   ├── HomePage.tsx              # 人格列表
│   │   ├── QuestionnairePage.tsx     # 问卷流程
│   │   ├── PersonaDetailPage.tsx     # 版本管理
│   │   ├── SkillEditorPage.tsx       # Skill 生成/预览/下载
│   │   ├── ChatPage.tsx              # 内置聊天
│   │   └── SettingsPage.tsx          # LLM 设置
│   ├── stores/                       # Zustand 状态管理
│   ├── types/index.ts                # 完整 TypeScript 类型
│   └── utils/export.ts               # SKILL.md 导出工具
├── docs/
│   ├── PLAN.md                       # 项目规划总纲
│   ├── ARCHITECTURE.md               # 架构文档
│   ├── QUESTIONNAIRE.md              # 题库设计原理
│   └── PROMPT_DESIGN.md              # Prompt 设计
├── data/                             # 用户数据（本地文件存储）
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── .gitignore
```

---

## 命令

| 命令 | 说明 |
|------|------|
| `npm install` | 安装依赖 |
| `npm run dev` | 启动开发环境（API + 前端） |
| `npm run dev:api` | 仅启动文件存储 API（端口 3001） |
| `npm run dev:web` | 仅启动前端（端口 3000） |
| `npm run build` | 生产构建 → `dist/` |

---

## 技术栈

| 层 | 技术 |
|----|------|
| 前端框架 | React 18 + TypeScript |
| 构建 | Vite 4 |
| 样式 | Tailwind CSS 3 |
| 状态管理 | Zustand 4 |
| 后端 | Express 4（本地文件 API） |
| LLM | DeepSeek / OpenAI / Anthropic / Ollama |

---

## 与 nuwa-skill 的差异

| 维度 | nuwa-skill | StayWithMeForever |
|------|------------|-------------------|
| 蒸馏对象 | 公开名人（乔布斯/芒格/马斯克） | 身边人（朋友/伴侣/自己） |
| 数据源 | 网络公开资料（Agent 并行搜索） | 一手问卷数据（直接采集） |
| 采集方式 | 6 Agent 并行搜索 | 用户答题（15-20 分钟） |
| 优势 | 挖掘名人深层认知架构 | 提取非公开的情感/关系/表达模式 |
| Skill 格式 | Agent Skills 协议 SKILL.md | **完全兼容复用** |
| 数据存储 | 文件系统 | 项目 `data/` 文件夹 |

---

## 设计理念

### 人格建模五层结构

1. **基础人格（Trait）** — MBTI / Big Five 自评，行为倾向
2. **认知模式（Cognitive）** — 决策风格、信息处理、问题解决
3. **价值观（Value）** — 两难排序、道德权衡、人生意义
4. **表达 DNA（Expression）** — 句式、幽默、情感表达、确定性偏好
5. **关系动态（Relationship）** — 对朋友/恋人/家人的不同行为模式

### 问卷设计原则

- **行为投射** — 不问"你外向吗？"，问"聚会上你通常会……"
- **情境化** — 每道题嵌入具体场景，避免抽象自评
- **防社会期许** — 每个选项都有合理动机
- **简答题是核心** — 6 道开放问答直接提供"表达 DNA"原材料

---

## 常见问题

**Q: 数据存在哪里？刷新会丢吗？**
A: 所有数据以 JSON 文件存储在项目根目录的 `data/` 文件夹中。刷新、关机、重启都不会丢失。复制项目文件夹即可带走全部数据。

**Q: 需要服务器吗？**
A: 不需要云服务器。`npm run dev` 会在本地启动两个服务（Express API 端口 3001 + Vite 前端端口 3000），都跑在你的电脑上。

**Q: API Key 安全性？**
A: API Key 仅存储在浏览器的 localStorage 中，从浏览器直接发往 LLM 提供商，不经过任何中间服务器。

**Q: 生成一个 Skill 花多少钱？**
A: DeepSeek 约 0.03 元/次；GPT-4o 约 0.5 元/次。两阶段生成总共消耗约 4K-8K tokens。

---

## 许可证

MIT

---

> 受 [nuwa-skill](https://github.com/alchaincyf/nuwa-skill) 启发 —— 女娲蒸馏名人怎么想，SWMF 蒸馏身边人怎么想。
