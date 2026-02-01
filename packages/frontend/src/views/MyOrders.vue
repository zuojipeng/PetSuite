<template>
  <div class="my-orders-page">
    <div class="page-header">
      <h1 class="page-title">我的订单</h1>
      <p class="page-subtitle">查看所有购买记录</p>
    </div>

    <!-- Order Filters -->
    <div class="filters-bar">
      <button
        v-for="status in statuses"
        :key="status.value"
        @click="currentStatus = status.value"
        :class="['filter-btn', { active: currentStatus === status.value }]"
      >
        {{ status.label }}
        <span v-if="status.count > 0" class="count">{{ status.count }}</span>
      </button>
    </div>

    <!-- Orders List -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="filteredOrders.length === 0" class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3>暂无订单</h3>
      <p>去商城逛逛，发现好物吧</p>
      <button @click="$router.push('/marketplace')" class="btn-primary">前往商城</button>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in filteredOrders" :key="order._id" class="order-card">
        <div class="order-header">
          <div class="order-number">订单号: {{ order.orderNumber }}</div>
          <span class="order-status" :class="`status-${order.status}`">
            {{ getStatusLabel(order.status) }}
          </span>
        </div>

        <div class="order-content">
          <div class="product-info">
            <img
              :src="order.productSnapshot.image"
              :alt="order.productSnapshot.name"
              class="product-image"
            />
            <div class="product-details">
              <h3>{{ order.productSnapshot.name }}</h3>
              <div class="product-meta">
                <span>{{ getCategoryLabel(order.productSnapshot.category) }}</span>
                <span>×{{ order.quantity }}</span>
              </div>
            </div>
          </div>

          <div class="order-info">
            <div class="info-row">
              <span class="label">下单时间</span>
              <span class="value">{{ formatDate(order.createdAt) }}</span>
            </div>
            <div v-if="order.paidAt" class="info-row">
              <span class="label">支付时间</span>
              <span class="value">{{ formatDate(order.paidAt) }}</span>
            </div>
            <div class="info-row">
              <span class="label">订单金额</span>
              <span class="value amount">{{ order.totalAmount }} ETH</span>
            </div>
            <div v-if="order.discount.applied" class="info-row discount">
              <span class="label">会员优惠</span>
              <span class="value">-{{ order.discount.discountPercent }}% (省{{ order.discount.savedAmount }} ETH)</span>
            </div>
          </div>
        </div>

        <div class="order-actions">
          <button
            v-if="order.txHash"
            @click="viewTransaction(order.txHash)"
            class="btn-action"
          >
            查看交易
          </button>
          <button
            v-if="order.status === 'pending'"
            @click="payOrder(order)"
            class="btn-action btn-primary"
          >
            立即支付
          </button>
          <button
            v-if="order.status === 'completed'"
            @click="buyAgain(order)"
            class="btn-action"
          >
            再次购买
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Order, OrderStatus, ProductCategory } from '@petsuite/shared/types/product'

const router = useRouter()

const orders = ref<Order[]>([])
const loading = ref(false)
const currentStatus = ref<OrderStatus | 'all'>('all')

const statuses = [
  { value: 'all' as const, label: '全部', count: 0 },
  { value: 'pending' as OrderStatus, label: '待支付', count: 0 },
  { value: 'paid' as OrderStatus, label: '已支付', count: 0 },
  { value: 'completed' as OrderStatus, label: '已完成', count: 0 }
]

const filteredOrders = computed(() => {
  if (currentStatus.value === 'all') return orders.value
  return orders.value.filter(order => order.status === currentStatus.value)
})

const fetchOrders = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock data
    orders.value = [
      {
        _id: '1',
        orderNumber: 'ORD-2024-001',
        buyerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
        merchantAddress: '0x123',
        productId: '1',
        productSnapshot: {
          name: '天然有机猫粮 5kg',
          price: '0.05',
          image: 'https://via.placeholder.com/100',
          category: 'food'
        },
        quantity: 2,
        totalAmount: '0.09',
        originalAmount: '0.10',
        discount: {
          applied: true,
          nftTokenId: 'NFT-001',
          discountPercent: 10,
          savedAmount: '0.01'
        },
        status: 'completed',
        txHash: '0xabcdef123456789',
        blockchain: 'monad-testnet',
        createdAt: new Date('2024-01-15T10:30:00'),
        paidAt: new Date('2024-01-15T10:32:00'),
        completedAt: new Date('2024-01-16T14:00:00')
      },
      {
        _id: '2',
        orderNumber: 'ORD-2024-002',
        buyerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
        merchantAddress: '0x456',
        productId: '2',
        productSnapshot: {
          name: '互动智能猫玩具',
          price: '0.02',
          image: 'https://via.placeholder.com/100',
          category: 'toy'
        },
        quantity: 1,
        totalAmount: '0.02',
        originalAmount: '0.02',
        discount: {
          applied: false,
          discountPercent: 0,
          savedAmount: '0'
        },
        status: 'paid',
        txHash: '0x123456abcdef',
        blockchain: 'monad-testnet',
        createdAt: new Date('2024-01-18T15:20:00'),
        paidAt: new Date('2024-01-18T15:22:00')
      }
    ]

    // Update counts
    statuses[0].count = orders.value.length
    statuses[1].count = orders.value.filter(o => o.status === 'pending').length
    statuses[2].count = orders.value.filter(o => o.status === 'paid').length
    statuses[3].count = orders.value.filter(o => o.status === 'completed').length
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  } finally {
    loading.value = false
  }
}

const viewTransaction = (txHash: string) => {
  window.open(`https://explorer.monad.xyz/tx/${txHash}`, '_blank')
}

const payOrder = (order: Order) => {
  router.push({
    name: 'Checkout',
    query: {
      orderId: order._id
    }
  })
}

const buyAgain = (order: Order) => {
  router.push({
    name: 'ProductDetail',
    params: { id: order.productId }
  })
}

const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    pending: '待支付',
    paid: '已支付',
    completed: '已完成',
    cancelled: '已取消',
    refunded: '已退款'
  }
  return labels[status]
}

const getCategoryLabel = (category: ProductCategory): string => {
  const labels: Record<ProductCategory, string> = {
    food: '食品',
    toy: '玩具',
    health: '健康',
    service: '服务',
    accessory: '配件',
    other: '其他'
  }
  return labels[category]
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.my-orders-page {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: #6b7280;
  margin: 0;
}

.filters-bar {
  max-width: 1200px;
  margin: 0 auto 2rem;
  display: flex;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-btn {
  padding: 0.625rem 1.25rem;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-btn:hover {
  background: #f9fafb;
  border-color: #667eea;
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 0.375rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

.filter-btn.active .count {
  background: rgba(255, 255, 255, 0.3);
}

.loading-state,
.empty-state {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.75rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

.orders-list {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.order-number {
  font-size: 0.875rem;
  font-family: ui-monospace, monospace;
  color: #667eea;
  font-weight: 600;
}

.order-status {
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-pending { background: #fef3c7; color: #92400e; }
.status-paid { background: #dbeafe; color: #1e40af; }
.status-completed { background: #d1fae5; color: #065f46; }
.status-cancelled { background: #f3f4f6; color: #6b7280; }

.order-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.product-info {
  display: flex;
  gap: 1rem;
}

.product-image {
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  object-fit: cover;
}

.product-details h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.product-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.info-row .label {
  color: #6b7280;
}

.info-row .value {
  color: #1a1a1a;
  font-weight: 500;
}

.info-row .amount {
  font-family: ui-monospace, monospace;
  font-weight: 700;
  color: #667eea;
}

.info-row.discount .value {
  color: #059669;
  font-weight: 600;
}

.order-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-action {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-action.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.btn-action.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .order-content {
    grid-template-columns: 1fr;
  }
}
</style>
