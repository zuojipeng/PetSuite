import { http } from '../../utils/http'
import { API_ENDPOINTS } from '../../config/api'
import type { PetProfile, ProductRecommendation } from '@petsuite/shared/types/pet'
import type { PetHealthAnalysis } from '@petsuite/shared/types/ai'

/**
 * AI 服务 API
 */
export const aiApi = {
  /**
   * AI 产品推荐
   */
  async getRecommendations(params: {
    petProfile: PetProfile
    userId?: string
    query?: string
  }): Promise<{
    success: boolean
    data?: {
      recommendations: ProductRecommendation[]
      metadata: {
        totalScanned: number
        totalRecommended: number
        executionTime: number
        confidence: number
      }
    }
    error?: string
  }> {
    return http.post(API_ENDPOINTS.ai.recommend, params)
  },

  /**
   * AI 健康分析
   */
  async analyzePetHealth(params: {
    petProfile: PetProfile
    userId?: string
  }): Promise<{
    success: boolean
    data?: PetHealthAnalysis
    error?: string
  }> {
    return http.post(API_ENDPOINTS.ai.analyze, params)
  },

  /**
   * 获取 AI 分析历史
   */
  async getAnalysisHistory(userId: string) {
    return http.get(API_ENDPOINTS.ai.history(userId))
  },

  /**
   * 获取 AI 使用统计
   */
  async getAnalytics(userId: string) {
    return http.get(API_ENDPOINTS.ai.analytics(userId))
  },
}
