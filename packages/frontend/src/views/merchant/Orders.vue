<template>
  <div class="orders-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">订单管理</h1>
        <p class="page-subtitle">查看和管理所有订单</p>
      </div>
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-label">待处理</div>
          <div class="stat-value">{{ stats.pending }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">已完成</div>
          <div class="stat-value">{{ stats.completed }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">总收入</div>
          <div class="stat-value">{{ stats.totalRevenue }} ETH</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="filter-group">
        <label>订单状态</label>
        <select v-model="filters.status" @change="fetchOrders" class="filter-select">
          <option value="">全部</option>
          <option value="pending">待支付</option>
          <option value="paid">已支付</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
          <option value="refunded">已退款</option>
        </select>
      </div>
      <div class="filter-group flex-grow">
        <label>搜索</label>
        <input
          v-model="searchQuery"
          @input="debounceSearch"
          type="text"
          placeholder="搜索订单号、买家地址..."
          class="filter-input"
        />
      </div>
    </div>

    <!-- Orders Table -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="orders.length === 0" class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3>暂无订单</h3>
      <p>当用户购买你的商品后，订单会显示在这里</p>
    </div>

    <div v-else class="orders-table-container">
      <table class="orders-table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>商品信息</th>
            <th>买家</th>
            <th>数量</th>
            <th>金额</th>
            <th>NFT 折扣</th>
            <th>状态</th>
            <th>下单时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id">
            <td>
              <div class="order-number">{{ order.orderNumber }}</div>
            </td>
            <td>
              <div class="product-info">
                <img
                  :src="order.productSnapshot.image"
                  :alt="order.productSnapshot.name"
                  class="product-image"
                />
                <div>
                  <div class="product-name">{{ order.productSnapshot.name }}</div>
                  <div class="product-category">
                    {{ getCategoryLabel(order.productSnapshot.category) }}
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div class="buyer-address" :title="order.buyerAddress">
                {{ truncateAddress(order.buyerAddress) }}
              </div>
            </td>
            <td>{{ order.quantity }}</td>
            <td>
              <div class="amount-info">
                <div class="total-amount">{{ order.totalAmount }} ETH</div>
                <div v-if="order.discount.applied" class="original-amount">
                  原价: {{ order.originalAmount }} ETH
                </div>
              </div>
            </td>
            <td>
              <span v-if="order.discount.applied" class="discount-badge">
                -{{ order.discount.discountPercent }}%
                <span class="saved-amount">省{{ order.discount.savedAmount }} ETH</span>
              </span>
              <span v-else class="text-gray-400">无折扣</span>
            </td>
            <td>
              <span class="status-badge" :class="`status-${order.status}`">
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
            <td>
              <div class="date-info">
                {{ formatDate(order.createdAt) }}
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button
                  v-if="order.status === 'paid'"
                  @click="completeOrder(order)"
                  class="btn-action btn-complete"
                  title="标记完成"
                >
                  完成
                </button>
                <button
                  v-if="order.txHash"
                  @click="viewTransaction(order.txHash)"
                  class="btn-action btn-view"
                  title="查看交易"
                >
                  交易
                </button>
                <button
                  @click="viewOrderDetail(order)"
                  class="btn-action btn-detail"
                  title="查看详情"
                >
                  详情
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Order Detail Modal -->
    <div v-if="selectedOrder" class="modal-overlay" @click.self="selectedOrder = null">
      <div class="modal-content">
        <div class="modal-header">
          <h2>订单详情</h2>
          <button @click="selectedOrder = null" class="btn-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h3>订单信息</h3>
            <div class="detail-row">
              <span class="detail-label">订单号:</span>
              <span class="detail-value">{{ selectedOrder.orderNumber }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">状态:</span>
              <span class="status-badge" :class="`status-${selectedOrder.status}`">
                {{ getStatusLabel(selectedOrder.status) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">下单时间:</span>
              <span class="detail-value">{{ formatDateTime(selectedOrder.createdAt) }}</span>
            </div>
            <div v-if="selectedOrder.paidAt" class="detail-row">
              <span class="detail-label">支付时间:</span>
              <span class="detail-value">{{ formatDateTime(selectedOrder.paidAt) }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h3>商品信息</h3>
            <div class="detail-product">
              <img :src="selectedOrder.productSnapshot.image" :alt="selectedOrder.productSnapshot.name" />
              <div>
                <div class="product-name">{{ selectedOrder.productSnapshot.name }}</div>
                <div class="product-price">单价: {{ selectedOrder.productSnapshot.price }} ETH</div>
                <div class="product-quantity">数量: {{ selectedOrder.quantity }}</div>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3>买家信息</h3>
            <div class="detail-row">
              <span class="detail-label">钱包地址:</span>
              <span class="detail-value mono">{{ selectedOrder.buyerAddress }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h3>费用明细</h3>
            <div class="detail-row">
              <span class="detail-label">商品总价:</span>
              <span class="detail-value">{{ selectedOrder.originalAmount }} ETH</span>
            </div>
            <div v-if="selectedOrder.discount.applied" class="detail-row">
              <span class="detail-label">NFT 折扣 (-{{ selectedOrder.discount.discountPercent }}%):</span>
              <span class="detail-value discount">-{{ selectedOrder.discount.savedAmount }} ETH</span>
            </div>
            <div class="detail-row total">
              <span class="detail-label">实付金额:</span>
              <span class="detail-value">{{ selectedOrder.totalAmount }} ETH</span>
            </div>
          </div>

          <div v-if="selectedOrder.txHash" class="detail-section">
            <h3>区块链信息</h3>
            <div class="detail-row">
              <span class="detail-label">交易哈希:</span>
              <a
                :href="`https://explorer.monad.xyz/tx/${selectedOrder.txHash}`"
                target="_blank"
                class="tx-link"
              >
                {{ selectedOrder.txHash }}
              </a>
            </div>
            <div class="detail-row">
              <span class="detail-label">区块链:</span>
              <span class="detail-value">{{ selectedOrder.blockchain }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { Order, OrderStatus, ProductCategory } from '@petsuite/shared/types/product'

const orders = ref<Order[]>([])
const loading = ref(false)
const selectedOrder = ref<Order | null>(null)

const stats = reactive({
  pending: 0,
  completed: 0,
  totalRevenue: '0'
})

const filters = ref({
  status: '' as OrderStatus | ''
})

const searchQuery = ref('')
let searchTimeout: NodeJS.Timeout

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
        status: 'paid',
        txHash: '0xabcdef123456789',
        blockchain: 'monad-testnet',
        createdAt: new Date('2024-01-15T10:30:00'),
        paidAt: new Date('2024-01-15T10:32:00')
      },
      {
        _id: '2',
        orderNumber: 'ORD-2024-002',
        buyerAddress: '0x853d55Bb7634C0532925a3b844Bc9e7595f0cFc2',
        merchantAddress: '0x123',
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
        status: 'completed',
        txHash: '0x123456abcdef',
        blockchain: 'monad-testnet',
        createdAt: new Date('2024-01-14T15:20:00'),
        paidAt: new Date('2024-01-14T15:22:00'),
        completedAt: new Date('2024-01-14T16:00:00')
      }
    ]

    // Update stats
    stats.pending = orders.value.filter(o => o.status === 'paid').length
    stats.completed = orders.value.filter(o => o.status === 'completed').length
    stats.totalRevenue = orders.value
      .filter(o => o.status === 'completed' || o.status === 'paid')
      .reduce((sum, o) => sum + parseFloat(o.totalAmount), 0)
      .toFixed(4)
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  } finally {
    loading.value = false
  }
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchOrders()
  }, 500)
}

const completeOrder = async (order: Order) => {
  if (!confirm(`确认订单「${order.orderNumber}」已完成？`)) return

  try {
    // TODO: API call
    order.status = 'completed'
    order.completedAt = new Date()
    console.log('Order completed:', order.orderNumber)
  } catch (error) {
    console.error('Failed to complete order:', error)
  }
}

const viewTransaction = (txHash: string) => {
  window.open(`https://explorer.monad.xyz/tx/${txHash}`, '_blank')
}

const viewOrderDetail = (order: Order) => {
  selectedOrder.value = order
}

const truncateAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
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

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateTime = (date: Date): string => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders-page {
  padding: 2rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a1a1a;
}

.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;
}

.filter-group.flex-grow {
  flex-grow: 1;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-select,
.filter-input {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

.orders-table-container {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.orders-table th {
  background: #f9fafb;
  padding: 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

.orders-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
}

.orders-table tbody tr:hover {
  background: #f9fafb;
}

.order-number {
  font-family: ui-monospace, monospace;
  font-weight: 600;
  color: #667eea;
}

.product-info {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.product-image {
  width: 48px;
  height: 48px;
  border-radius: 0.375rem;
  object-fit: cover;
}

.product-name {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.product-category {
  font-size: 0.75rem;
  color: #6b7280;
}

.buyer-address {
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  color: #374151;
}

.amount-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.total-amount {
  font-weight: 600;
  color: #1a1a1a;
  font-family: ui-monospace, monospace;
}

.original-amount {
  font-size: 0.75rem;
  color: #6b7280;
  text-decoration: line-through;
  font-family: ui-monospace, monospace;
}

.discount-badge {
  display: inline-flex;
  flex-direction: column;
  padding: 0.25rem 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.saved-amount {
  font-size: 0.625rem;
  opacity: 0.9;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-pending { background: #fef3c7; color: #92400e; }
.status-paid { background: #dbeafe; color: #1e40af; }
.status-completed { background: #d1fae5; color: #065f46; }
.status-cancelled { background: #f3f4f6; color: #6b7280; }
.status-refunded { background: #fee2e2; color: #991b1b; }

.date-info {
  font-size: 0.875rem;
  color: #6b7280;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-action {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-complete {
  background: #d1fae5;
  color: #065f46;
}

.btn-complete:hover {
  background: #a7f3d0;
}

.btn-view {
  background: #dbeafe;
  color: #1e40af;
}

.btn-view:hover {
  background: #bfdbfe;
}

.btn-detail {
  background: #f3f4f6;
  color: #374151;
}

.btn-detail:hover {
  background: #e5e7eb;
}

.text-gray-400 {
  color: #9ca3af;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.btn-close {
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.375rem;
}

.btn-close:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.detail-section:last-child {
  border-bottom: none;
}

.detail-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.detail-row.total {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 2px solid #e5e7eb;
  font-weight: 600;
}

.detail-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.detail-value {
  color: #1a1a1a;
  font-size: 0.875rem;
}

.detail-value.mono {
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
}

.detail-value.discount {
  color: #059669;
  font-weight: 600;
}

.detail-product {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.detail-product img {
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  object-fit: cover;
}

.product-price,
.product-quantity {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.tx-link {
  color: #667eea;
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  word-break: break-all;
  text-decoration: none;
}

.tx-link:hover {
  text-decoration: underline;
}

.w-6 {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
