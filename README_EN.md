# StayWithMeForever

> **Turn the people around you into talkable AI personas.**
>
> Through 100+ carefully designed behavioral scenario questions, distill a person's cognitive patterns, values, and expression DNA.
> Generate an [Agent Skills protocol](https://github.com/alchaincyf/nuwa-skill) compliant `SKILL.md`,
> run it as a thinking advisor in Claude Code / Cursor / OpenCode, or chat directly in the browser.

## Core Features

- **Local file storage** — All data saved as JSON files in the project `data/` directory; copy the folder to take everything
- **Pure frontend + lightweight backend** — React + Express, no cloud server needed, two commands to run locally
- **Multi-version timeline** — Record "me before graduation" vs "me three years later" for the same person
- **Standard Skill output** — Reuses [nuwa-skill](https://github.com/alchaincyf/nuwa-skill) SKILL.md template; drop-in usable AI persona
- **Built-in chat** — Talk to the generated AI persona directly in the browser, no external Agent Runtime required
- **Multi-LLM support** — DeepSeek (default) | OpenAI | Anthropic | Ollama (local)
- **Auto-save** — Questionnaire progress auto-saves every 500ms; never lose answers on page close

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start (launches file storage API + frontend dev server)
npm run dev

# 3. Open http://localhost:3000
```

> On first use, go to **Settings** and enter your LLM API Key ([DeepSeek](https://platform.deepseek.com) recommended).

---

## Workflow

```
Settings → Enter API Key → Test Connection
 │
 ▼
Home → + Distill a Person → Enter name
 │
 ▼
Questionnaire → 106 questions (multiple-choice + open-ended, ~15-20 min)
                      ├── P0 Basic Profile (10)
                      ├── P1 Cognitive Patterns (25)
                      ├── P2 Values (20)
                      ├── P3 Expression & Emotion (25)
                      ├── P4 Social & Relationships (20)
                      └── P5 Free Expression (6)
 │
 ▼
Skill Page → Click "Generate SKILL.md"
                → Two-stage LLM analysis → Standard Skill output
 │
 ├── Download SKILL.md → Import into Cursor / Claude Code
 │
 └── Start Chat → Talk to AI persona in the browser
```

---

## Project Structure

```
StayWithMeForever/
├── server.cjs                    # File storage API (Express, port 3001)
├── src/
│   ├── components/QuestionCard.tsx   # Multi-type question renderer
│   ├── data/questionBank.ts          # 106 structured questions
│   ├── db/httpStorage.ts             # Frontend storage client
│   ├── llm/
│   │   ├── adapter.ts                # LLM adapter (4 providers)
│   │   └── prompts.ts                # Two-stage prompt templates
│   ├── pages/                        # Page components
│   │   ├── HomePage.tsx              # Persona list
│   │   ├── QuestionnairePage.tsx     # Question flow
│   │   ├── PersonaDetailPage.tsx     # Version management
│   │   ├── SkillEditorPage.tsx       # Skill generation/preview/download
│   │   ├── ChatPage.tsx              # Built-in chat
│   │   └── SettingsPage.tsx          # LLM settings
│   ├── stores/                       # Zustand state management
│   ├── types/index.ts                # Full TypeScript types
│   └── utils/export.ts               # SKILL.md export utility
├── docs/
│   ├── PLAN.md                       # Project planning overview
│   ├── ARCHITECTURE.md               # Architecture docs
│   ├── QUESTIONNAIRE.md              # Question design principles
│   └── PROMPT_DESIGN.md              # Prompt design
├── data/                             # User data (local file storage)
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── .gitignore
```

---

## Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev environment (API + frontend) |
| `npm run dev:api` | Start file storage API only (port 3001) |
| `npm run dev:web` | Start frontend only (port 3000) |
| `npm run build` | Production build → `dist/` |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite 4 |
| Styling | Tailwind CSS 3 |
| State Management | Zustand 4 |
| Backend | Express 4 (local file API) |
| LLM | DeepSeek / OpenAI / Anthropic / Ollama |

---

## Comparison with nuwa-skill

| Dimension | nuwa-skill | StayWithMeForever |
|-----------|------------|-------------------|
| Subject | Public figures (Jobs/Munger/Musk) | People around you (friends/partner/yourself) |
| Data source | Public web materials (Agent swarm) | First-hand questionnaire data |
| Collection | 6 Agents parallel search | User answers (15-20 min) |
| Advantage | Extract deep cognitive architecture of famous minds | Extract private emotional/relational/expression patterns |
| Skill format | Agent Skills protocol SKILL.md | **Fully compatible** |
| Storage | File system | Project `data/` folder |

---

## Design Philosophy

### Five-Layer Persona Model

1. **Trait Layer** — MBTI / Big Five self-assessment, behavioral tendencies
2. **Cognitive Layer** — Decision style, information processing, problem solving
3. **Value Layer** — Priority ranking, moral dilemmas, meaning of life
4. **Expression DNA** — Sentence style, humor, emotional expression, certainty
5. **Relationship Layer** — Behavioral patterns with friends/lovers/family

### Question Design Principles

- **Behavioral projection** — Ask "At parties, you usually..." not "Are you extroverted?"
- **Scenario-driven** — Every question embedded in a concrete context
- **Anti-social-desirability** — Every option has a reasonable motivation
- **Open-ended is key** — 6 free-text questions directly provide "expression DNA" raw material

---

## FAQ

**Q: Where is the data stored? Will it be lost on refresh?**
A: All data is stored as JSON files in the project's `data/` directory. It survives refreshes, shutdowns, and reboots. Copy the project folder to take all your data with you.

**Q: Do I need a server?**
A: No cloud server needed. `npm run dev` starts two local services (Express API on port 3001 + Vite frontend on port 3000), both running on your machine.

**Q: Is my API Key secure?**
A: The API Key is stored only in your browser's localStorage and sent directly from your browser to the LLM provider. It never passes through any intermediary server.

**Q: How much does it cost to generate a Skill?**
A: DeepSeek ~$0.005/skill; GPT-4o ~$0.07/skill. Two-stage generation uses approximately 4K-8K tokens.

---

## License

MIT

---

> Inspired by [nuwa-skill](https://github.com/alchaincyf/nuwa-skill) — Nuwa distills how famous minds think. SWMF distills how people around you think.
