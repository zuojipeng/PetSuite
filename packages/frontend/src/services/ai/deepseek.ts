import axios from 'axios'
import type { AIMessage, AIResponse, AIRequestConfig } from '@petsuite/shared'
import { BaseAIService } from './base'

/**
 * DeepSeek AI 服务实现
 * 文档: https://platform.deepseek.com/api-docs/
 */
export class DeepSeekService extends BaseAIService {
  constructor(apiKey: string) {
    super(
      apiKey,
      'https://api.deepseek.com/v1',
      'deepseek-chat'
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
          stream: false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          timeout: 60000, // 60秒超时
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
      console.error('[DeepSeek] API 调用失败:', error)

      // 详细的错误信息
      let errorMessage = 'DeepSeek API 调用失败'

      if (error.code === 'ECONNABORTED') {
        errorMessage = '请求超时，请检查网络连接'
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = '网络错误，无法连接到 DeepSeek API'
      } else if (error.response) {
        // 服务器返回了错误响应
        errorMessage = error.response?.data?.error?.message || `服务器错误 (${error.response.status})`
        console.error('[DeepSeek] 服务器响应:', error.response.data)
      } else if (error.request) {
        // 请求已发送但没有收到响应
        errorMessage = '未收到服务器响应，请检查网络或 API 服务状态'
        console.error('[DeepSeek] 无响应:', error.request)
      } else {
        errorMessage = error.message || 'DeepSeek API 调用失败'
      }

      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  async chatStructured<T = any>(
    messages: AIMessage[],
    schema: any,
    config?: Partial<AIRequestConfig>
  ): Promise<AIResponse<T>> {
    try {
      // 在 system message 中添加 JSON 格式要求
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
        // 尝试提取 JSON（处理可能的 markdown 代码块）
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
