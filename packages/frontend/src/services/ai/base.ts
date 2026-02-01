import type { AIMessage, AIResponse, AIRequestConfig } from '@petsuite/shared'

/**
 * AI 服务基类
 * 所有 AI 服务提供商都需要继承此类并实现抽象方法
 */
export abstract class BaseAIService {
  protected apiKey: string
  protected baseURL: string
  protected defaultModel: string

  constructor(apiKey: string, baseURL: string, defaultModel: string) {
    this.apiKey = apiKey
    this.baseURL = baseURL
    this.defaultModel = defaultModel
  }

  /**
   * 发送聊天请求
   * @param messages 消息列表
   * @param config 可选配置
   */
  abstract chat(
    messages: AIMessage[],
    config?: Partial<AIRequestConfig>
  ): Promise<AIResponse<string>>

  /**
   * 发送结构化请求（JSON 模式）
   * @param messages 消息列表
   * @param schema JSON Schema
   * @param config 可选配置
   */
  abstract chatStructured<T = any>(
    messages: AIMessage[],
    schema: any,
    config?: Partial<AIRequestConfig>
  ): Promise<AIResponse<T>>

  /**
   * 健康检查
   * @returns 服务是否可用
   */
  abstract healthCheck(): Promise<boolean>
}
