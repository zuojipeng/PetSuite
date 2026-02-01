// Product and Order Types

export type ProductCategory = 'food' | 'toy' | 'health' | 'service' | 'accessory' | 'other'

export type ProductStatus = 'active' | 'inactive' | 'soldout'

export interface NFTBenefit {
  enabled: boolean
  discountPercent: number   // 折扣百分比，如 10 表示 10% off
  minHealthScore?: number   // 最低健康分要求（可选）
  minPetLevel?: number      // 最低宠物等级要求（可选）
}

export interface Product {
  _id?: string
  merchantAddress: string
  name: string
  description: string
  category: ProductCategory
  price: string             // ETH 价格（字符串，如 "0.001"）
  currency: 'ETH'
  images: string[]
  inventory: number
  soldCount: number
  nftBenefit: NFTBenefit
  tags: string[]
  status: ProductStatus
  createdAt: Date
  updatedAt: Date
}

export type OrderStatus = 'pending' | 'paid' | 'completed' | 'cancelled' | 'refunded'

export interface OrderDiscount {
  applied: boolean
  nftTokenId?: string
  discountPercent: number
  savedAmount: string       // ETH 节省金额
}

export interface ProductSnapshot {
  name: string
  price: string
  image: string
  category: ProductCategory
}

export interface Order {
  _id?: string
  orderNumber: string       // 唯一订单号
  buyerAddress: string
  merchantAddress: string
  productId: string
  productSnapshot: ProductSnapshot
  quantity: number
  totalAmount: string       // 实际支付金额（应用折扣后）
  originalAmount: string    // 原价
  discount: OrderDiscount
  status: OrderStatus
  txHash?: string           // 支付交易哈希
  blockchain: 'monad-testnet'
  createdAt: Date
  paidAt?: Date
  completedAt?: Date
  cancelledAt?: Date
}

export interface CreateProductDto {
  name: string
  description: string
  category: ProductCategory
  price: string
  images: string[]
  inventory: number
  nftBenefit: NFTBenefit
  tags: string[]
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  status?: ProductStatus
}

export interface CreateOrderDto {
  productId: string
  quantity: number
  nftTokenId?: string       // 可选的 NFT Token ID，用于折扣
}
