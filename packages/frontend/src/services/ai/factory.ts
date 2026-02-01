import type { AIProvider } from '@petsuite/shared'
import { BaseAIService } from './base'
import { DeepSeekService } from './deepseek'
import { KimiService } from './kimi'

/**
 * AI 服务工厂
 * 负责创建和管理不同的 AI 服务实例
 */
export class AIServiceFactory {
  private static instances: Map<AIProvider, BaseAIService> = new Map()

  /**
   * 获取 AI 服务实例（单例模式）
   * @param provider AI 服务提供商
   * @returns AI 服务实例
   */
  static getService(provider: AIProvider = 'deepseek'): BaseAIService {
    // 如果已有实例，直接返回
    if (this.instances.has(provider)) {
      return this.instances.get(provider)!
    }

    // 获取 API Key
    const apiKey = this.getApiKey(provider)
    if (!apiKey) {
      console.warn(`未配置 ${provider} 的 API Key，将使用 mock 模式`)
      // 如果没有 API Key，可以返回一个 mock 服务或抛出错误
      // 这里我们先使用 DeepSeek 作为默认值（即使没有key也创建实例）
    }

    let service: BaseAIService

    switch (provider) {
      case 'deepseek':
        service = new DeepSeekService(apiKey || 'mock-key')
        break
      case 'kimi':
        service = new KimiService(apiKey || 'mock-key')
        break
      case 'glm':
        // TODO: 实现 GLM 服务
        throw new Error('GLM service not implemented yet')
      case 'qwen':
        // TODO: 实现通义千问服务
        throw new Error('Qwen service not implemented yet')
      default:
        throw new Error(`Unsupported AI provider: ${provider}`)
    }

    // 缓存实例
    this.instances.set(provider, service)
    return service
  }

  /**
   * 从环境变量获取 API Key
   * @param provider AI 服务提供商
   * @returns API Key
   */
  private static getApiKey(provider: AIProvider): string | undefined {
    const envKey = `VITE_${provider.toUpperCase()}_API_KEY`
    const apiKey = import.meta.env[envKey]
    console.log(`[AIServiceFactory] 尝试加载 ${envKey}:`, apiKey ? '✓ 已配置' : '✗ 未配置')
    return apiKey
  }

  /**
   * 清除所有服务实例
   */
  static clearInstances(): void {
    this.instances.clear()
  }

  /**
   * 获取默认服务（优先级：DeepSeek > Kimi）
   */
  static getDefaultService(): BaseAIService {
    const defaultProvider = (import.meta.env.VITE_DEFAULT_AI_PROVIDER || 'deepseek') as AIProvider
    return this.getService(defaultProvider)
  }
}
