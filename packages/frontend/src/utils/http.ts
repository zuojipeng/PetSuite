import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios'
import { API_BASE_URL, API_TIMEOUT } from '../config/api'

/**
 * API 响应格式
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  count?: number
}

/**
 * 创建 Axios 实例
 */
const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 请求拦截器
 */
httpClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证 token
    // const token = localStorage.getItem('auth_token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
httpClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.data)
    return response
  },
  (error: AxiosError<ApiResponse>) => {
    console.error('[API Response Error]', error.response?.data || error.message)

    // 统一错误处理
    if (error.response) {
      // 服务器返回错误
      const { status, data } = error.response
      switch (status) {
        case 401:
          console.error('Unauthorized - Please login')
          // 可以触发跳转到登录页
          break
        case 403:
          console.error('Forbidden - Access denied')
          break
        case 404:
          console.error('Not Found')
          break
        case 500:
          console.error('Server Error')
          break
        default:
          console.error(`Error ${status}:`, data?.error || data?.message)
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('Network Error - No response received')
    } else {
      // 请求配置出错
      console.error('Request Error:', error.message)
    }

    return Promise.reject(error)
  }
)

/**
 * HTTP 请求方法封装
 */
export const http = {
  /**
   * GET 请求
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await httpClient.get<ApiResponse<T>>(url, config)
    return response.data
  },

  /**
   * POST 请求
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await httpClient.post<ApiResponse<T>>(url, data, config)
    return response.data
  },

  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await httpClient.put<ApiResponse<T>>(url, data, config)
    return response.data
  },

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await httpClient.delete<ApiResponse<T>>(url, config)
    return response.data
  },

  /**
   * PATCH 请求
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await httpClient.patch<ApiResponse<T>>(url, data, config)
    return response.data
  },
}

export default httpClient
