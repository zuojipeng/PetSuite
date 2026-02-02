import type {
  PetProfile,
  PetHealthAnalysis,
  ProductRecommendation,
  AgentOutput
} from '@petsuite/shared'
import { aiApi } from './api'

/**
 * 后端集成的宠物 AI 服务
 * 调用后端 API 而不是直接调用 AI 服务
 */
export class BackendPetAIService {
  /**
   * 分析宠物健康状况
   * @param pet 宠物档案
   * @param userId 用户钱包地址
   * @returns 健康分析结果
   */
  async analyzePetHealth(pet: PetProfile, userId?: string): Promise<PetHealthAnalysis> {
    const response = await aiApi.analyzePetHealth({
      petProfile: pet,
      userId,
    })

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to analyze pet health')
    }

    return response.data
  }

  /**
   * 获取产品推荐
   * @param pet 宠物档案
   * @param query 用户查询
   * @param userId 用户钱包地址
   * @returns 推荐结果
   */
  async getProductRecommendations(
    pet: PetProfile,
    query: string,
    userId?: string
  ): Promise<AgentOutput> {
    const startTime = Date.now()

    const response = await aiApi.getRecommendations({
      petProfile: pet,
      userId,
      query,
    })

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get recommendations')
    }

    const { recommendations, metadata } = response.data

    // 构造 AgentOutput 格式的响应（与前端期望的格式一致）
    const agentOutput: AgentOutput = {
      success: true,
      data: {
        recommendations,
        avoid: [], // 后端暂时没有返回避免的产品
        generalAdvice: `基于 ${pet.name} 的健康状况和特征，为您推荐了 ${recommendations.length} 个产品。`,
      },
      reasoning: {
        root: {
          id: 'root',
          type: 'analysis',
          content: '分析宠物需求和产品匹配度',
          confidence: metadata.confidence || 0.85,
          children: recommendations.map((rec, idx) => ({
            id: `rec_${idx}`,
            type: 'decision',
            content: `推荐 ${rec.product.name}（匹配度: ${rec.score}%）`,
            confidence: rec.score / 100,
          })),
        },
        totalNodes: recommendations.length + 1,
        createdAt: Date.now(),
      },
      confidence: metadata.confidence || 0.85,
      metadata: {
        agentId: 'pet-advisor-backend',
        timestamp: Date.now(),
        executionTime: metadata.executionTime || (Date.now() - startTime),
        backend: {
          totalScanned: metadata.totalScanned,
          totalRecommended: metadata.totalRecommended,
        },
      },
    }

    return agentOutput
  }

  /**
   * 获取用户的 AI 分析历史
   * @param userId 用户钱包地址
   */
  async getAnalysisHistory(userId: string) {
    const response = await aiApi.getAnalysisHistory(userId)
    return response.data || []
  }

  /**
   * 获取用户的 AI 使用统计
   * @param userId 用户钱包地址
   */
  async getAnalytics(userId: string) {
    const response = await aiApi.getAnalytics(userId)
    return response.data
  }
}

// 导出单例
export const backendPetAIService = new BackendPetAIService()
