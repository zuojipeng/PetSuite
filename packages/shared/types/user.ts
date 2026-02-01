// User Role and Authentication Types

export enum UserRole {
  USER = 'user',           // C 端用户（宠物主人）
  MERCHANT = 'merchant',   // B 端商家
  ADMIN = 'admin'          // 管理员（可选）
}

export interface UserProfile {
  walletAddress: string    // 钱包地址（唯一标识）
  roles: UserRole[]        // 支持一个地址多角色
  displayName?: string
  email?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface MerchantProfile {
  walletAddress: string
  storeName: string
  description?: string
  logo?: string
  coverImage?: string
  category: string[]       // 经营品类：['cat', 'dog', 'bird', ...]
  isVerified: boolean      // 是否认证
  rating: number          // 评分（0-5）
  totalSales: number      // 总销售额（ETH，单位 wei）
  totalOrders: number     // 总订单数
  stats: {
    totalRevenue: string     // ETH 字符串格式
    avgOrderValue: string    // 平均订单价值
    productCount: number     // 商品数量
    customerCount: number    // 客户数量
  }
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  isConnected: boolean
  walletAddress: string | null
  userProfile: UserProfile | null
  merchantProfile: MerchantProfile | null
  roles: UserRole[]
}

export interface SignaturePayload {
  message: string
  signature: string
  address: string
  timestamp: number
}
