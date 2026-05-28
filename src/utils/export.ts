export function downloadSkillMarkdown(content: string, personaName: string): void {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const name = personaName.replace(/\s+/g, '-').toLowerCase()
  a.download = `${name}-perspective.SKILL.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function copySkillContent(content: string): Promise<void> {
  return navigator.clipboard.writeText(content)
}
