const API_BASE = '/api'

async function request(method: string, path: string, body?: unknown): Promise<unknown> {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body !== undefined) {
    options.body = JSON.stringify(body)
  }
  const res = await fetch(`${API_BASE}${path}`, options)
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Storage API ${method} ${path} failed (${res.status}): ${err}`)
  }
  const text = await res.text()
  if (!text) return null
  return JSON.parse(text)
}

export const storage = {
  // PERSONAS
  personas: {
    list: () => request('GET', '/personas'),
    get: (id: string) => request('GET', `/personas/${id}`),
    create: (data: Record<string, unknown>) => request('POST', '/personas', data),
    update: (id: string, data: Record<string, unknown>) => request('PUT', `/personas/${id}`, data),
    delete: (id: string) => request('DELETE', `/personas/${id}`),
  },

  // VERSIONS
  versions: {
    listByPersona: (personaId: string) => request('GET', `/personas/${personaId}/versions`),
    get: (id: string) => request('GET', `/versions/${id}`),
    create: (data: Record<string, unknown>) => request('POST', '/versions', data),
    update: (id: string, data: Record<string, unknown>) => request('PUT', `/versions/${id}`, data),
    delete: (id: string) => request('DELETE', `/versions/${id}`),
  },

  // CHAT SESSIONS
  sessions: {
    listByVersion: (versionId: string) => request('GET', `/versions/${versionId}/sessions`),
    create: (versionId: string, data: Record<string, unknown>) => request('POST', `/versions/${versionId}/sessions`, data),
    update: (id: string, data: Record<string, unknown>) => request('PUT', `/sessions/${id}`, data),
    delete: (id: string) => request('DELETE', `/sessions/${id}`),
  },

  // CHAT MESSAGES
  messages: {
    listBySession: (sessionId: string) => request('GET', `/sessions/${sessionId}/messages`),
    create: (sessionId: string, data: Record<string, unknown>) => request('POST', `/sessions/${sessionId}/messages`, data),
  },

  // PROGRESS
  progress: {
    get: (versionId: string) => request('GET', `/progress/${versionId}`),
    save: (versionId: string, data: Record<string, unknown>) => request('PUT', `/progress/${versionId}`, data),
  },

  clearAll: () => request('DELETE', '/clear-data'),
}
