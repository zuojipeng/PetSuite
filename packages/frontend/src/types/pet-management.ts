// PetSuite AI Management Center - Type Definitions

export interface Pet {
  id: string
  name: string
  breed: string
  level: number
  health: number
  growthStage: string
  image: string
  status: 'monitoring' | 'analyzing' | 'ready'
  statusLabel: string
  age?: string
  birthday?: string
  gender?: string
  weight?: string
}

export interface Agent {
  id: string
  name: string
  role: string
  status: 'running' | 'analyzing' | 'idle'
  lastAction: string
  icon: string
  color: string
}

export interface LogEntry {
  id: string
  timestamp: string
  agentName: string
  agentColor: string
  message: string
  type: 'transaction' | 'analysis' | 'info'
}

export type ManagementPage = 'dashboard' | 'pets' | 'details' | 'agents'

// Gemini AI Service Response Types
export interface PetInsight {
  summary: string
  recommendation: string
  alert: string
}
