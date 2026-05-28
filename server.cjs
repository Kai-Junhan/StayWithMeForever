const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3001

const DATA_DIR = path.join(__dirname, 'data')

app.use(cors())
app.use(express.json({ limit: '10mb' }))

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e.message)
    return null
  }
}

function writeJSON(filePath, data) {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

function listDir(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) return []
    return fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(f => f.isFile() && f.name.endsWith('.json'))
      .map(f => readJSON(path.join(dirPath, f.name)))
      .filter(Boolean)
  } catch (e) {
    console.error(`Error listing ${dirPath}:`, e.message)
    return []
  }
}

function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    return true
  } catch (e) {
    console.error(`Error deleting ${filePath}:`, e.message)
    return false
  }
}

function deleteDir(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      fs.readdirSync(dirPath).forEach(f => {
        const full = path.join(dirPath, f)
        if (fs.statSync(full).isDirectory()) deleteDir(full)
        else fs.unlinkSync(full)
      })
      fs.rmdirSync(dirPath)
    }
    return true
  } catch (e) {
    console.error(`Error deleting dir ${dirPath}:`, e.message)
    return false
  }
}

ensureDir(DATA_DIR)
ensureDir(path.join(DATA_DIR, 'personas'))
ensureDir(path.join(DATA_DIR, 'versions'))
ensureDir(path.join(DATA_DIR, 'chats'))
ensureDir(path.join(DATA_DIR, 'progress'))

// ================ PERSONAS ================

app.get('/api/personas', (req, res) => {
  const personas = listDir(path.join(DATA_DIR, 'personas'))
  res.json(personas)
})

app.get('/api/personas/:id', (req, res) => {
  const file = path.join(DATA_DIR, 'personas', `${req.params.id}.json`)
  const data = readJSON(file)
  if (!data) return res.status(404).json({ error: 'Not found' })
  res.json(data)
})

app.post('/api/personas', (req, res) => {
  const persona = req.body
  if (!persona.id) persona.id = String(Date.now())
  persona.createdAt = persona.createdAt || Date.now()
  persona.updatedAt = persona.updatedAt || Date.now()
  const file = path.join(DATA_DIR, 'personas', `${persona.id}.json`)
  writeJSON(file, persona)
  res.json(persona)
})

app.put('/api/personas/:id', (req, res) => {
  const file = path.join(DATA_DIR, 'personas', `${req.params.id}.json`)
  const existing = readJSON(file)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const updated = { ...existing, ...req.body, updatedAt: Date.now() }
  writeJSON(file, updated)
  res.json(updated)
})

app.delete('/api/personas/:id', (req, res) => {
  const file = path.join(DATA_DIR, 'personas', `${req.params.id}.json`)
  const deleted = deleteFile(file)
  deleteDir(path.join(DATA_DIR, 'versions', req.params.id))
  res.json({ deleted })
})

// ================ VERSIONS ================

app.get('/api/personas/:personaId/versions', (req, res) => {
  const dir = path.join(DATA_DIR, 'versions', req.params.personaId)
  const versions = listDir(dir)
  res.json(versions)
})

app.get('/api/versions/:id', (req, res) => {
  const allVers = listAllVersions()
  const v = allVers.find(v => v.id === req.params.id)
  if (!v) return res.status(404).json({ error: 'Not found' })
  res.json(v)
})

app.post('/api/versions', (req, res) => {
  const version = req.body
  if (!version.id) version.id = String(Date.now())
  if (!version.personaId) return res.status(400).json({ error: 'personaId required' })
  version.createdAt = version.createdAt || Date.now()
  const dir = path.join(DATA_DIR, 'versions', version.personaId)
  ensureDir(dir)
  const file = path.join(dir, `${version.id}.json`)
  writeJSON(file, version)
  res.json(version)
})

app.put('/api/versions/:id', (req, res) => {
  const allVers = listAllVersions()
  const existing = allVers.find(v => v.id === req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const updated = { ...existing, ...req.body }
  const dir = path.join(DATA_DIR, 'versions', updated.personaId || existing.personaId)
  const file = path.join(dir, `${req.params.id}.json`)
  writeJSON(file, updated)
  res.json(updated)
})

app.delete('/api/versions/:id', (req, res) => {
  const allVers = listAllVersions()
  const existing = allVers.find(v => v.id === req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const dir = path.join(DATA_DIR, 'versions', existing.personaId)
  const file = path.join(dir, `${req.params.id}.json`)
  deleteFile(file)
  deleteDir(path.join(DATA_DIR, 'chats', req.params.id))
  deleteFile(path.join(DATA_DIR, 'progress', `${req.params.id}.json`))
  res.json({ deleted: true })
})

// ================ CHAT SESSIONS ================

app.get('/api/versions/:versionId/sessions', (req, res) => {
  const dir = path.join(DATA_DIR, 'chats', req.params.versionId, 'sessions')
  const sessions = listDir(dir)
  res.json(sessions)
})

app.post('/api/versions/:versionId/sessions', (req, res) => {
  const session = req.body
  if (!session.id) session.id = String(Date.now())
  session.personaVersionId = req.params.versionId
  session.createdAt = session.createdAt || Date.now()
  session.updatedAt = session.updatedAt || Date.now()
  const dir = path.join(DATA_DIR, 'chats', req.params.versionId, 'sessions')
  ensureDir(dir)
  writeJSON(path.join(dir, `${session.id}.json`), session)
  res.json(session)
})

app.put('/api/sessions/:id', (req, res) => {
  const allSessions = listAllSessions()
  const existing = allSessions.find(s => s.id === req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const updated = { ...existing, ...req.body, updatedAt: Date.now() }
  const dir = path.join(DATA_DIR, 'chats', existing.personaVersionId, 'sessions')
  writeJSON(path.join(dir, `${req.params.id}.json`), updated)
  res.json(updated)
})

app.delete('/api/sessions/:id', (req, res) => {
  const allSessions = listAllSessions()
  const existing = allSessions.find(s => s.id === req.params.id)
  if (!existing) return res.status(404).json({ error: 'Not found' })
  const dir = path.join(DATA_DIR, 'chats', existing.personaVersionId, 'sessions')
  const msgDir = path.join(DATA_DIR, 'chats', existing.personaVersionId, 'messages', req.params.id)
  deleteFile(path.join(dir, `${req.params.id}.json`))
  deleteDir(msgDir)
  res.json({ deleted: true })
})

// ================ CHAT MESSAGES ================

app.get('/api/sessions/:sessionId/messages', (req, res) => {
  const allMsgs = listAllMessages()
  const messages = allMsgs
    .filter(m => m.sessionId === req.params.sessionId)
    .sort((a, b) => a.timestamp - b.timestamp)
  res.json(messages)
})

app.post('/api/sessions/:sessionId/messages', (req, res) => {
  const message = req.body
  if (!message.id) message.id = String(Date.now())
  message.sessionId = req.params.sessionId
  message.timestamp = message.timestamp || Date.now()
  const allSessions = listAllSessions()
  const session = allSessions.find(s => s.id === req.params.sessionId)
  if (!session) return res.status(404).json({ error: 'Session not found' })
  const dir = path.join(DATA_DIR, 'chats', session.personaVersionId, 'messages', req.params.sessionId)
  ensureDir(dir)
  writeJSON(path.join(dir, `${message.id}.json`), message)
  res.json(message)
})

// ================ PROGRESS ================

app.get('/api/progress/:versionId', (req, res) => {
  const file = path.join(DATA_DIR, 'progress', `${req.params.versionId}.json`)
  const data = readJSON(file)
  if (!data) return res.json(null)
  res.json(data)
})

app.put('/api/progress/:versionId', (req, res) => {
  const file = path.join(DATA_DIR, 'progress', `${req.params.versionId}.json`)
  const data = { ...req.body, personaVersionId: req.params.versionId }
  writeJSON(file, data)
  res.json(data)
})

// ================ CLEAR ALL DATA ================

app.delete('/api/clear-data', (req, res) => {
  try {
    deleteDir(DATA_DIR)
    ensureDir(DATA_DIR)
    ensureDir(path.join(DATA_DIR, 'personas'))
    ensureDir(path.join(DATA_DIR, 'versions'))
    ensureDir(path.join(DATA_DIR, 'chats'))
    ensureDir(path.join(DATA_DIR, 'progress'))
    res.json({ cleared: true })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ================ HELPERS ================

function listAllVersions() {
  const versions = []
  const personasDir = path.join(DATA_DIR, 'versions')
  if (!fs.existsSync(personasDir)) return versions
  const personaDirs = fs.readdirSync(personasDir, { withFileTypes: true }).filter(d => d.isDirectory())
  for (const pDir of personaDirs) {
    const vDir = path.join(personasDir, pDir.name)
    const files = fs.readdirSync(vDir).filter(f => f.endsWith('.json'))
    for (const f of files) {
      const data = readJSON(path.join(vDir, f))
      if (data) versions.push(data)
    }
  }
  return versions
}

function listAllSessions() {
  const sessions = []
  const chatsDir = path.join(DATA_DIR, 'chats')
  if (!fs.existsSync(chatsDir)) return sessions
  const versionDirs = fs.readdirSync(chatsDir, { withFileTypes: true }).filter(d => d.isDirectory())
  for (const vDir of versionDirs) {
    const sessionsDir = path.join(chatsDir, vDir.name, 'sessions')
    if (fs.existsSync(sessionsDir)) {
      const files = fs.readdirSync(sessionsDir).filter(f => f.endsWith('.json'))
      for (const f of files) {
        const data = readJSON(path.join(sessionsDir, f))
        if (data) sessions.push(data)
      }
    }
  }
  return sessions
}

function listAllMessages() {
  const messages = []
  const chatsDir = path.join(DATA_DIR, 'chats')
  if (!fs.existsSync(chatsDir)) return messages
  const versionDirs = fs.readdirSync(chatsDir, { withFileTypes: true }).filter(d => d.isDirectory())
  for (const vDir of versionDirs) {
    const msgsDir = path.join(chatsDir, vDir.name, 'messages')
    if (!fs.existsSync(msgsDir)) continue
    const sessionDirs = fs.readdirSync(msgsDir, { withFileTypes: true }).filter(d => d.isDirectory())
    for (const sDir of sessionDirs) {
      const msgDir = path.join(msgsDir, sDir.name)
      const files = fs.readdirSync(msgDir).filter(f => f.endsWith('.json'))
      for (const f of files) {
        const data = readJSON(path.join(msgDir, f))
        if (data) messages.push(data)
      }
    }
  }
  return messages
}

app.listen(PORT, () => {
  console.log(`[SWMF Storage] API server running on http://localhost:${PORT}`)
  console.log(`[SWMF Storage] Data directory: ${DATA_DIR}`)
})
