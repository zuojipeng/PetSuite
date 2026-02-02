/**
 * API 配置
 */

// 后端 API 基础 URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// API 端点
export const API_ENDPOINTS = {
  // 宠物相关
  pets: {
    create: '/api/pets',
    getById: (id: string) => `/api/pets/${id}`,
    getByOwner: (address: string) => `/api/pets/owner/${address}`,
    update: (id: string) => `/api/pets/${id}`,
    delete: (id: string) => `/api/pets/${id}`,
  },

  // AI 服务
  ai: {
    recommend: '/api/ai/recommend',
    analyze: '/api/ai/analyze',
    history: (userId: string) => `/api/ai/history/${userId}`,
    analytics: (userId: string) => `/api/ai/analytics/${userId}`,
  },

  // 产品相关
  products: {
    list: '/api/products',
    search: '/api/products/search',
    getById: (id: string) => `/api/products/${id}`,
    create: '/api/products',
    update: (id: string) => `/api/products/${id}`,
    delete: (id: string) => `/api/products/${id}`,
  },

  // 订单相关
  orders: {
    create: '/api/orders',
    getById: (id: string) => `/api/orders/${id}`,
    getByBuyer: (address: string) => `/api/orders/buyer/${address}`,
    getByMerchant: (address: string) => `/api/orders/merchant/${address}`,
    updateStatus: (id: string) => `/api/orders/${id}/status`,
    getByOrderNumber: (orderNumber: string) => `/api/orders/number/${orderNumber}`,
  },

  // 商家相关
  merchant: {
    create: '/api/merchant',
    getByWallet: (address: string) => `/api/merchant/${address}`,
    update: (address: string) => `/api/merchant/${address}`,
    getProducts: (address: string) => `/api/merchant/${address}/products`,
    getOrders: (address: string) => `/api/merchant/${address}/orders`,
    getStats: (address: string) => `/api/merchant/${address}/stats`,
    getVerified: '/api/merchant/verified/list',
  },

  // NFT 相关
  nfts: {
    // 这些端点可能在后续添加
    list: '/api/nfts',
    getByOwner: (address: string) => `/api/nfts/owner/${address}`,
    getByTokenId: (tokenId: string) => `/api/nfts/${tokenId}`,
  },

  // 健康检查
  health: '/health',
} as const

// API 请求超时时间（毫秒）
export const API_TIMEOUT = 30000

// API 错误码
export const API_ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  NETWORK_ERROR: 0,
} as const
