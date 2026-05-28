# StayWithMeForever

> *"Stay with me, forever."*

Invite or import someone important to you. Turn their cognitive patterns into a talkable AI persona.
Record yourself at different points in time. Let the past "you" always be reachable.

**中文: [README.md](./README.md)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-Compatible-green)](https://agentskills.io)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org)

---

## Example

```
You             ❯ My best friend just went through a breakup. I don't know how to comfort her.

AI Persona      ❯ I'm really sad to hear that.
                  There's no right or wrong in relationships,
                  but I know nothing I say right now will make it hurt less.
                  If you want to talk or just need someone around in silence, I'm here.
                  Don't rush yourself. Take as long as you need.
```

This isn't AI reciting a generic answer. It's **the cognitive patterns and expression style of a specific person, extracted from 100+ behavioral scenario questions.**

---

## Why StayWithMeForever

[colleague-skill](https://github.com/titanwings/colleague-skill) proved that distilling a person is viable.
[Nuwa](https://github.com/alchaincyf/nuwa-skill) pushed it further — extracting the cognitive operating systems of Jobs, Munger, and Musk from public data.

But one question remained unanswered:

> **The person you want to distill doesn't leave tens of thousands of words online.**
> No podcasts. No Twitter threads. No biographies.
> They're just someone important to you —
> or a version of yourself from another time.

StayWithMeForever was built for exactly this.

**Collect first-hand cognitive data through structured questionnaires** — no public data needed, no agent crawling.
You answer questions for 15-20 minutes. AI extracts their thought patterns. You get a talkable digital persona.

---

## Core Features

- **Local file storage** — Data stored as JSON files in the project's `data/` directory. Copy the folder to take everything.
- **Absolute privacy** — Pure frontend + lightweight local API. Data never leaves your machine.
- **Multi-version timeline** — Record "me before graduation" vs "me three years later". Compare across time.
- **Standard Skill output** — Agent Skills protocol compliant SKILL.md. Import into Cursor / Claude Code / OpenCode.
- **Built-in chat** — Talk to generated AI personas directly in your browser.
- **Import Skill** — Import existing SKILL.md files that follow the protocol. No questionnaire needed.
- **Multi-LLM** — DeepSeek (default) | OpenAI | Anthropic | Ollama (local)

---

## Quick Start

### 1. Get the code

```bash
# Clone with Git (recommended)
git clone https://github.com/Kai-Junhan/StayWithMeForever.git

# Or: click the green "Code" button → Download ZIP → extract
```

### 2. Make sure you have Node.js installed

Run this in your terminal to check (version ≥ 14):

```bash
node --version
```

If not installed, download the LTS version from [nodejs.org](https://nodejs.org).

### 3. Enter the project directory and install dependencies

```bash
cd StayWithMeForever
npm install
```

### 4. Start the app

```bash
npm run dev
```

This launches two local services: the file storage API (port 3001) and the frontend (port 3000).

### 5. Open your browser

Go to **http://localhost:3000** — you'll see the homepage.

> On first use, go to **Settings** and enter your LLM API Key. [DeepSeek](https://platform.deepseek.com) is recommended — free credits on signup, ~$0.005 per skill generation.

---

## Workflow

```
Configure API Key → Test Connection
 │
 ├── + Distill a Person → Fill basic info → Start questionnaire
 │         ├── Full (106 questions, 15-20 min)
 │         └── Mini (~20 questions, 3-5 min)
 │
 ├── Import Skill → Select .md file → Auto-validate → Ready to use
 │
 └── Existing personas → View versions → Generate Skill → Chat / Download
```

---

## Five-Layer Persona Model

SWMF extracts more than surface habits through questionnaires — it extracts the **cognitive operating system**.

| Layer | Description |
|-------|-------------|
| **How they speak** | Expression DNA — sentence style, rhythm, humor, emotional expression |
| **How they think** | Mental models, cognitive frameworks |
| **How they decide** | Decision heuristics, value priorities |
| **What they don't do** | Anti-patterns, ethical boundaries |
| **What they can't do** | Honest boundaries — every Skill states its limitations |

**Work habits can be mimicked through conversation. But what makes Munger and Musk reach different conclusions from the same question is cognitive framework.**

---

## Questionnaire Philosophy

100+ questions aren't random. Each serves a design purpose:

- **Behavioral projection** — Ask "At parties, you usually..." not "Are you extroverted?"
- **Scenario-driven** — Every question embedded in a concrete context
- **Anti-social-desirability** — Every option has a reasonable motivation; no "correct" answer
- **Open-ended is key** — 6 free-text questions provide raw material for expression DNA

Modules: `P0 Basic Profile` → `P1 Cognitive Patterns` → `P2 Values` → `P3 Expression & Emotion` → `P4 Social & Relationships` → `P5 Free Expression`

---

## Project Structure

```
StayWithMeForever/
├── server.cjs                    # Local file storage API (Express)
├── src/
│   ├── components/
│   │   ├── QuestionCard.tsx      # Multi-type question renderer
│   │   └── ImportSkillModal.tsx  # SKILL.md import parser
│   ├── data/
│   │   ├── questionBank.ts       # Full bank (106 questions)
│   │   ├── questionBankMini.ts   # Mini bank (~20 questions)
│   │   ├── useQuestionBank.ts    # Dynamic bank selector
│   │   └── mockData.ts           # Dev test data
│   ├── db/httpStorage.ts         # Local file storage client
│   ├── llm/
│   │   ├── adapter.ts            # LLM adapter (DeepSeek/OpenAI/Anthropic/Ollama)
│   │   └── prompts.ts            # Two-stage prompts (analysis + generation)
│   ├── pages/
│   │   ├── HomePage.tsx          # Home
│   │   ├── CreatePage.tsx        # Create persona (form UI)
│   │   ├── QuestionnairePage.tsx # Questionnaire flow
│   │   ├── PersonaDetailPage.tsx # Persona detail + version management
│   │   ├── SkillEditorPage.tsx   # Skill generation/preview/download
│   │   ├── ChatPage.tsx          # Built-in chat
│   │   └── SettingsPage.tsx      # LLM configuration
│   ├── stores/                   # Zustand state management
│   ├── types/index.ts            # TypeScript type definitions
│   └── utils/export.ts           # SKILL.md export
├── docs/                         # Design documentation
├── data/                         # User data directory (local file storage)
└── README.md
```

---

## Relationship with nuwa-skill

| Dimension | nuwa-skill | StayWithMeForever |
|-----------|------------|-------------------|
| **Subject** | Public figures (Jobs/Munger/Musk) | People around you (friends/partner/yourself) |
| **Data source** | Public web materials (Agent search) | **First-hand questionnaire data** |
| **Collection** | 6 Agents parallel search | Structured questionnaire (15-20 min) |
| **Advantage** | Deep cognitive architecture of famous minds | Private emotional/relational/expression patterns |
| **Skill format** | Agent Skills protocol SKILL.md | **Fully compatible** |

> Nuwa distills how famous minds think. SWMF distills how people around you think.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite 4 |
| Styling | Tailwind CSS 3 |
| State Management | Zustand 4 |
| Backend (local) | Express 4 |
| LLM | DeepSeek / OpenAI / Anthropic / Ollama |
| Data Storage | JSON files (`data/` directory) |

---

## FAQ

**Q: Where is data stored? Will I lose it on refresh?**
A: All data lives as JSON files in the project's `data/` directory. Survives refreshes, shutdowns, and reboots. Copy the project folder to take everything with you.

**Q: Do I need a server?**
A: No. `npm run dev` starts a local Express API (port 3001) + Vite frontend (port 3000), both on your machine.

**Q: Is my API Key secure?**
A: Stored only in browser `localStorage`. Sent directly from your browser to the LLM provider. No intermediary servers.

**Q: How much does generating a Skill cost?**
A: DeepSeek ~$0.005/skill. Two-stage generation uses ~4K-8K tokens.

**Q: Can I import Skills created by others?**
A: Yes. Import any SKILL.md file compliant with the Agent Skills protocol. Auto-validated on import.

---

## License

MIT — use it, modify it, build with it.

---

> *Nuwa distills **how** famous minds think. SWMF distills **how** people around you think.*
> *The next person you want to distill doesn't have to be famous.*
