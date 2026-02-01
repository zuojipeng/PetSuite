import axios from 'axios'
import type { AIMessage, AIResponse, AIRequestConfig } from '@petsuite/shared'
import { BaseAIService } from './base'

/**
 * Moonshot (Kimi) AI 服务实现
 * 文档: https://platform.moonshot.cn/docs
 */
export class KimiService extends BaseAIService {
  constructor(apiKey: string) {
    super(
      apiKey,
      'https://api.moonshot.cn/v1',
      'moonshot-v1-8k'
    )
  }

  async chat(
    messages: AIMessage[],
    config?: Partial<AIRequestConfig>
  ): Promise<AIResponse<string>> {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: config?.model || this.defaultModel,
          messages,
          temperature: config?.temperature ?? 0.7,
          max_tokens: config?.maxTokens || 2000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 30000,
        }
      )

      const content = response.data.choices[0].message.content

      return {
        success: true,
        data: content,
        usage: {
          promptTokens: response.data.usage.prompt_tokens,
          completionTokens: response.data.usage.completion_tokens,
          totalTokens: response.data.usage.total_tokens,
        },
      }
    } catch (error: any) {
      console.error('Kimi API error:', error)
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || 'Kimi API 调用失败',
      }
    }
  }

  async chatStructured<T = any>(
    messages: AIMessage[],
    schema: any,
    config?: Partial<AIRequestConfig>
  ): Promise<AIResponse<T>> {
    try {
      // Kimi 暂不支持原生 JSON 模式，使用提示词引导
      const systemMessage: AIMessage = {
        role: 'system',
        content: `你必须返回严格符合以下 JSON Schema 的响应，不要包含任何其他文本，只返回纯 JSON：\n${JSON.stringify(schema, null, 2)}`,
      }

      const enhancedMessages: AIMessage[] = [systemMessage, ...messages]
      const response = await this.chat(enhancedMessages, config)

      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || '获取响应失败',
        }
      }

      try {
        let jsonStr = response.data.trim()

        // 移除可能的 markdown 代码块标记
        if (jsonStr.startsWith('```json')) {
          jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }

        const parsedData = JSON.parse(jsonStr)

        return {
          success: true,
          data: parsedData as T,
          usage: response.usage,
        }
      } catch (parseError) {
        console.error('JSON 解析失败:', parseError)
        console.error('原始响应:', response.data)
        return {
          success: false,
          error: 'AI 返回的格式不正确，无法解析为 JSON',
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '结构化请求失败',
      }
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.chat([
        { role: 'user', content: 'ping' },
      ])
      return response.success
    } catch {
      return false
    }
  }
}
