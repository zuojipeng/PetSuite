import { http } from '../../utils/http'
import { API_ENDPOINTS } from '../../config/api'
import type { Product, ProductCategory, CreateProductDto } from '@petsuite/shared/types/product'

/**
 * 产品 API 服务
 */
export const productApi = {
  /**
   * 获取产品列表（支持筛选）
   */
  async getProducts(params?: {
    category?: ProductCategory
    species?: 'cat' | 'dog'
    merchantAddress?: string
    minPrice?: number
    maxPrice?: number
    tags?: string[]
    limit?: number
    skip?: number
  }) {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','))
          } else {
            queryParams.append(key, String(value))
          }
        }
      })
    }
    const url = `${API_ENDPOINTS.products.list}?${queryParams.toString()}`
    return http.get<Product[]>(url)
  },

  /**
   * 搜索产品
   */
  async searchProducts(query: string, limit?: number) {
    const params = new URLSearchParams({ q: query })
    if (limit) params.append('limit', String(limit))
    const url = `${API_ENDPOINTS.products.search}?${params.toString()}`
    return http.get<Product[]>(url)
  },

  /**
   * 获取产品详情
   */
  async getProductById(id: string) {
    return http.get<Product>(API_ENDPOINTS.products.getById(id))
  },

  /**
   * 创建产品
   */
  async createProduct(productData: CreateProductDto & { merchantAddress: string }) {
    return http.post<Product>(API_ENDPOINTS.products.create, productData)
  },

  /**
   * 更新产品
   */
  async updateProduct(id: string, updates: Partial<Product>) {
    return http.put<Product>(API_ENDPOINTS.products.update(id), updates)
  },

  /**
   * 删除产品
   */
  async deleteProduct(id: string) {
    return http.delete(API_ENDPOINTS.products.delete(id))
  },
}
