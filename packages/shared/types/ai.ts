// AI 服务提供商
export type AIProvider = 'deepseek' | 'kimi' | 'glm' | 'qwen'

// AI 请求配置
export interface AIRequestConfig {
  provider: AIProvider
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

// AI 消息格式
export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// AI 响应格式
export interface AIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// 宠物健康分析结果
export interface PetHealthAnalysis {
  summary: string           // 整体健康摘要
  recommendation: string    // 喂食推荐
  alert: string            // 健康警示
  healthScore: number      // 健康评分 (0-100)
  nutritionAdvice: string  // 营养建议
  exerciseAdvice: string   // 运动建议
}

// Note: ProductRecommendation 和 ReasoningNode 已在 pet.ts 和 agent.ts 中定义
