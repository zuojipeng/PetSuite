import axios from 'axios'
import { petAIService } from '../services/ai/petService'
import type { PetProfile, AgentOutput } from '@petsuite/shared'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function useAPI() {
  async function createProfile(data: any) {
    const response = await api.post('/api/agents/profile', data)
    return response.data
  }

  async function getRecommendation(data: { petProfile: PetProfile; query: string }): Promise<AgentOutput> {
    // 优先使用本地 AI 服务
    try {
      const result = await petAIService.getProductRecommendations(
        data.petProfile,
        data.query
      )
      return result
    } catch (error) {
      console.error('Local AI service failed, falling back to backend API:', error)
      // 降级到后端 API
      const response = await api.post('/api/agents/recommend', data)
      return response.data
    }
  }

  async function getHistory(petName: string) {
    const response = await api.get(`/api/agents/history/${petName}`)
    return response.data
  }

  async function mintNFT(data: any) {
    const response = await api.post('/api/nfts/mint', data)
    return response.data
  }

  async function getNFT(tokenId: number) {
    const response = await api.get(`/api/nfts/${tokenId}`)
    return response.data
  }

  async function getUserNFTs(address: string) {
    const response = await api.get(`/api/nfts/user/${address}`)
    return response.data
  }

  return {
    createProfile,
    getRecommendation,
    getHistory,
    mintNFT,
    getNFT,
    getUserNFTs,
  }
}
