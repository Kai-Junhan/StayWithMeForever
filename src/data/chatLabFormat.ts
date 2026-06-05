export interface ChatLabHeader {
  chatlab: {
    version: string
    exportedAt: number
    generator?: string
    description?: string
  }
  meta: {
    name: string
    platform: string
    type: 'group' | 'private'
    groupId?: string
    groupAvatar?: string
    ownerId?: string
  }
}

export interface ChatLabMember {
  platformId: string
  accountName: string
  groupNickname?: string
  aliases?: string[]
  avatar?: string
  roles?: Array<{ id: string; name?: string }>
}

export interface ChatLabMessage {
  sender: string
  accountName: string
  groupNickname?: string
  timestamp: number
  type: number
  content: string | null
  platformMessageId?: string
  replyToMessageId?: string
  _type?: 'header' | 'member' | 'message'
}

export interface ChatLabFile {
  header: ChatLabHeader
  members: ChatLabMember[]
  messages: ChatLabMessage[]
}

export type Participant = {
  platformId: string
  accountName: string
  messageCount: number
  groupNickname?: string
}

const MESSAGE_TYPE_LABELS: Record<number, string> = {
  0: '[文字]',
  1: '[图片]',
  2: '[语音]',
  3: '[视频]',
  4: '[文件]',
  5: '[表情]',
  7: '[链接]',
  8: '[位置]',
  20: '[红包]',
  21: '[转账]',
  22: '[拍一拍]',
  23: '[通话]',
  24: '[分享]',
  25: '[回复]',
  26: '[转发]',
  27: '[名片]',
  80: '[系统消息]',
  81: '[撤回]',
  99: '[其他]',
}

function nonTextLabel(type: number): string {
  return MESSAGE_TYPE_LABELS[type] || '[其他]'
}

export function parseChatLabJSON(text: string): ChatLabFile | null {
  try {
    const data = JSON.parse(text) as Record<string, unknown>
    if (!data.chatlab || !data.meta || !data.messages) return null
    return data as unknown as ChatLabFile
  } catch {
    return null
  }
}

export function parseJSONL(text: string): ChatLabFile | null {
  try {
    const lines = text.trim().split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'))
    if (lines.length === 0) return null

    let header: ChatLabHeader | null = null
    const members: ChatLabMember[] = []
    const messages: ChatLabMessage[] = []

    for (const line of lines) {
      const obj = JSON.parse(line) as ChatLabMessage & Partial<ChatLabHeader> & Partial<ChatLabMember>
      if (obj._type === 'header') {
        header = { chatlab: obj.chatlab!, meta: obj.meta! }
      } else if (obj._type === 'member') {
        members.push(obj as unknown as ChatLabMember)
      } else {
        messages.push(obj as ChatLabMessage)
      }
    }

    if (!header) {
      const first = JSON.parse(lines[0]) as Record<string, unknown>
      if (first.chatlab && first.meta) {
        header = first as unknown as ChatLabHeader
        for (let i = 1; i < lines.length; i++) {
          const obj = JSON.parse(lines[i]) as Record<string, unknown>
          if (obj.sender && obj.timestamp !== undefined) {
            messages.push(obj as unknown as ChatLabMessage)
          }
        }
      } else {
        return null
      }
    }

    if (!header || messages.length === 0) return null
    return { header, members, messages }
  } catch {
    return null
  }
}

export function getParticipants(messages: ChatLabMessage[], members: ChatLabMember[]): Participant[] {
  const map = new Map<string, { accountName: string; count: number; groupNickname?: string }>()

  for (const msg of messages) {
    const existing = map.get(msg.sender)
    if (existing) {
      existing.count++
    } else {
      const member = members.find((m) => m.platformId === msg.sender)
      map.set(msg.sender, {
        accountName: msg.accountName || member?.accountName || msg.sender,
        count: 1,
        groupNickname: msg.groupNickname || member?.groupNickname,
      })
    }
  }

  return Array.from(map.entries())
    .map(([platformId, info]) => ({
      platformId,
      accountName: info.accountName,
      messageCount: info.count,
      groupNickname: info.groupNickname,
    }))
    .sort((a, b) => b.messageCount - a.messageCount)
}

export function formatMessageForPrompt(
  msg: ChatLabMessage,
  participantNames: Map<string, string>,
): string {
  const sender = participantNames.get(msg.sender) || msg.accountName || msg.sender
  const time = new Date(msg.timestamp * 1000).toLocaleString('zh-CN')
  const content = msg.type === 0 ? (msg.content || '') : nonTextLabel(msg.type)
  return `[${time}] ${sender}: ${content}`
}

export function filterTargetMessages(
  messages: ChatLabMessage[],
  targetPlatformId: string,
  maxMessages: number,
): ChatLabMessage[] {
  const all = messages.filter((m) => m.sender === targetPlatformId)
  if (maxMessages > 0 && all.length > maxMessages) {
    return all.slice(-maxMessages)
  }
  return all
}

export function filterContextMessages(
  allMessages: ChatLabMessage[],
  targetPlatformId: string,
  targetMessages: ChatLabMessage[],
): ChatLabMessage[] {
  const targetSet = new Set(targetMessages.map((m) => m.timestamp))
  return allMessages.filter(
    (m) => targetSet.has(m.timestamp) || m.sender === targetPlatformId,
  )
}
