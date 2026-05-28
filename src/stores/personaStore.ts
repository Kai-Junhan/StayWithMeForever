import { create } from 'zustand'
import type { Persona } from '@/types'
import { storage } from '@/db/httpStorage'

interface PersonaState {
  personas: Persona[]
  loading: boolean
  loadPersonas: () => Promise<void>
  createPersona: (name: string) => Promise<Persona>
  deletePersona: (id: string) => Promise<void>
  renamePersona: (id: string, name: string) => Promise<void>
}

export const usePersonaStore = create<PersonaState>((set) => ({
  personas: [],
  loading: false,

  loadPersonas: async () => {
    set({ loading: true })
    const personas = (await storage.personas.list()) as Persona[]
    set({ personas: personas || [], loading: false })
  },

  createPersona: async (name) => {
    const persona: Persona = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    await storage.personas.create(persona)
    set((s) => ({ personas: [persona, ...s.personas] }))
    return persona
  },

  deletePersona: async (id) => {
    await storage.personas.delete(id)
    set((s) => ({ personas: s.personas.filter((p) => p.id !== id) }))
  },

  renamePersona: async (id, name) => {
    await storage.personas.update(id, { name, updatedAt: Date.now() })
    set((s) => ({
      personas: s.personas.map((p) =>
        p.id === id ? { ...p, name, updatedAt: Date.now() } : p,
      ),
    }))
  },
}))
