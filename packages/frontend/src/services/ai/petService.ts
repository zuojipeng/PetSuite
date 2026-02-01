import type {
  PetProfile,
  PetHealthAnalysis,
  ProductRecommendation,
  AgentOutput
} from '@petsuite/shared'
import { AIServiceFactory } from './factory'

/**
 * 宠物 AI 业务服务层
 * 封装宠物相关的 AI 功能
 */
export class PetAIService {
  private aiService = AIServiceFactory.getDefaultService()

  /**
   * 分析宠物健康状况
   * @param pet 宠物档案
   * @returns 健康分析结果
   */
  async analyzePetHealth(pet: PetProfile): Promise<PetHealthAnalysis> {
    const schema = {
      type: 'object',
      properties: {
        summary: { type: 'string', description: '整体健康摘要' },
        recommendation: { type: 'string', description: '喂食推荐' },
        alert: { type: 'string', description: '健康警示' },
        healthScore: { type: 'number', description: '健康评分 (0-100)' },
        nutritionAdvice: { type: 'string', description: '营养建议' },
        exerciseAdvice: { type: 'string', description: '运动建议' },
      },
      required: ['summary', 'recommendation', 'alert', 'healthScore', 'nutritionAdvice', 'exerciseAdvice'],
    }

    const prompt = `
你是一位专业的宠物健康顾问。请分析以下宠物的健康状况：

宠物信息：
- 名称：${pet.name}
- 物种：${pet.species === 'cat' ? '猫' : '狗'}
- 品种：${pet.breed}
- 年龄：${pet.age} 岁
- 体重：${pet.weight || '未知'} kg
- 健康评分：${pet.healthScore}/100
- 过敏史：${pet.allergies?.join(', ') || '无'}
- 健康问题：${pet.healthIssues?.join(', ') || '无'}
- 饮食限制：${pet.dietaryRestrictions?.join(', ') || '无'}

请提供详细的健康分析和建议。
    `.trim()

    const response = await this.aiService.chatStructured<PetHealthAnalysis>(
      [{ role: 'user', content: prompt }],
      schema
    )

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to analyze pet health')
    }

    return response.data
  }

  /**
   * 获取产品推荐
   * @param pet 宠物档案
   * @param query 用户查询
   * @returns 推荐结果
   */
  async getProductRecommendations(
    pet: PetProfile,
    query: string
  ): Promise<AgentOutput> {
    const startTime = Date.now()

    const schema = {
      type: 'object',
      properties: {
        recommendations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              rank: { type: 'number' },
              product: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  brand: { type: 'string' },
                  price: { type: 'number' },
                  category: { type: 'string' },
                },
              },
              score: { type: 'number' },
              reasoning: {
                type: 'object',
                properties: {
                  pros: { type: 'array', items: { type: 'string' } },
                  cons: { type: 'array', items: { type: 'string' } },
                  matchDetails: { type: 'string' },
                },
              },
              suitability: { type: 'string', enum: ['high', 'medium', 'low'] },
            },
          },
        },
        avoid: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              product: { type: 'string' },
              reason: { type: 'string' },
            },
          },
        },
        generalAdvice: { type: 'string' },
      },
      required: ['recommendations', 'avoid', 'generalAdvice'],
    }

    const prompt = `
你是一位专业的宠物产品推荐顾问。请根据以下宠物信息和用户问题，推荐合适的产品：

宠物信息：
- 名称：${pet.name}
- 物种：${pet.species === 'cat' ? '猫' : '狗'}
- 品种：${pet.breed}
- 年龄：${pet.age} 岁
- 体重：${pet.weight || '未知'} kg
- 健康评分：${pet.healthScore}/100
- 过敏史：${pet.allergies?.join(', ') || '无'}
- 健康问题：${pet.healthIssues?.join(', ') || '无'}
- 饮食限制：${pet.dietaryRestrictions?.join(', ') || '无'}

用户问题：${query}

请推荐 3-5 个合适的产品，并说明推荐理由。为每个产品分配一个唯一的 id（使用 prod_1, prod_2 等格式）。
    `.trim()

    const response = await this.aiService.chatStructured<{
      recommendations: ProductRecommendation[]
      avoid: Array<{ product: string; reason: string }>
      generalAdvice: string
    }>(
      [{ role: 'user', content: prompt }],
      schema
    )

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get recommendations')
    }

    const executionTime = Date.now() - startTime

    // 构造 AgentOutput 格式的响应
    const agentOutput: AgentOutput = {
      success: true,
      data: response.data,
      reasoning: {
        root: {
          id: 'root',
          type: 'analysis',
          content: '分析宠物需求和产品匹配度',
          confidence: 0.85,
          children: response.data.recommendations.map((rec, idx) => ({
            id: `rec_${idx}`,
            type: 'decision',
            content: `推荐 ${rec.product.name}`,
            confidence: rec.score / 100,
          })),
        },
        totalNodes: response.data.recommendations.length + 1,
        createdAt: Date.now(),
      },
      confidence: 0.85,
      metadata: {
        agentId: 'pet-advisor',
        timestamp: Date.now(),
        executionTime,
      },
    }

    return agentOutput
  }

  /**
   * 更换 AI 服务提供商
   * @param provider 新的提供商
   */
  switchProvider(provider: 'deepseek' | 'kimi' | 'glm' | 'qwen'): void {
    this.aiService = AIServiceFactory.getService(provider)
  }
}

// 导出单例
export const petAIService = new PetAIService()
