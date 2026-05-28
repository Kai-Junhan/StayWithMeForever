# StayWithMeForever · Prompt 设计

## 两阶段生成管道

### 阶段一：Analyzer（分析器）

**角色**：认知科学家 + 人格分析师

**输入**：问卷数据 JSON
```json
{
  "personaName": "小明",
  "answers": [
    {
      "questionId": "P1-001",
      "section": "P1-cognitive",
      "value": "selected_option_id"
    }
  ]
}
```

**输出**：结构化人格档案 JSON
```json
{
  "mentalModels": [{
    "name": "...",
    "summary": "一句话描述",
    "evidence": ["引用题目ID"],
    "application": "适用范围",
    "limitation": "局限"
  }],
  "decisionHeuristics": [{
    "name": "...",
    "description": "If X, then Y",
    "scenarios": ["..."]
  }],
  "expressionDNA": {
    "sentenceStyle": "...",
    "vocabularyPatterns": ["..."],
    "humorStyle": "...",
    "emotionExpression": "...",
    "certaintyLevel": "...",
    "quotingHabit": "..."
  },
  "values": {
    "priorities": ["..."],
    "antiPatterns": ["..."],
    "tensions": ["..."]
  },
  "honestBoundaries": ["..."]
}
```

**核心 Prompt 指令**：
- Generate 3-5 mental models with clear evidence
- Generate 5-8 decision heuristics
- Expression DNA must come from open-ended answers specifically
- Values must reflect actual trade-offs made
- Honest boundaries must be specific (not generic)
- Output ONLY valid JSON

### 阶段二：Generator（生成器）

**角色**：Skill 作者，将人格档案转化为 SKILL.md

**输入**：Analyzer 的 JSON 输出 + personaName

**输出**：完整的 SKILL.md（Markdown + YAML frontmatter）

**SKILL.md 结构遵循 nuwa-skill 模板**：

```yaml
---
name: [kebab-case]-perspective
description: |
  思维框架描述，含触发词
---
```

**Section 顺序**：
1. 角色扮演规则（角色内回应，首次激活免责声明）
2. 回答工作流（Agentic Protocol：问题分类 → 研究 → 回答）
3. 身份卡（50字第一人称自我介绍，用此人语气）
4. 核心心智模型（3-5个，含证据/应用/局限）
5. 决策启发式（5-8条 If-then 规则）
6. 表达 DNA（句式/词汇/节奏/幽默/确定性/引用习惯）
7. 价值观与反模式
8. 诚实边界
9. 生成来源说明

## Chat System Prompt

聊天时将完整的 SKILL.md 作为 System Prompt 传给 LLM：

```
{SKILL.md 完整内容}

---
ABOVE is your persona configuration.
You are now roleplaying as described.
Follow all the rules in "角色扮演规则" strictly.
Use the mental models and decision heuristics when appropriate.
Maintain the expression DNA style at all times.
Your responses should be in Chinese unless the user explicitly uses another language.
```

## Prompt 设计要点

1. **Analyzer 用英文**：LLM 对结构化指令（"Extract mental models"，"Output JSON"）的遵循度更高
2. **Generator 输出中文 Skill**：因为生成的 Skill 是在中文环境中使用
3. **两阶段分离**：Analyzer 保证数据一致性（结构化 JSON），Generator 保证文本质量（自然的 Markdown）
4. **诚实边界是信任基础**：每个 Skill 都必须声明"什么是做不到的"
5. **简答原文是关键输入**：Analyzer 特别标注"Expression DNA must be extracted from open-ended answers"
