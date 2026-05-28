import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import CreatePage from '@/pages/CreatePage'
import QuestionnairePage from '@/pages/QuestionnairePage'
import PersonaDetailPage from '@/pages/PersonaDetailPage'
import SkillEditorPage from '@/pages/SkillEditorPage'
import ChatPage from '@/pages/ChatPage'
import SettingsPage from '@/pages/SettingsPage'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/questionnaire/:versionId" element={<QuestionnairePage />} />
        <Route path="/persona/:personaId" element={<PersonaDetailPage />} />
        <Route path="/skill/:versionId" element={<SkillEditorPage />} />
        <Route path="/chat/:versionId" element={<ChatPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  )
}
