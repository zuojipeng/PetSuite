<template>
  <div class="products-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">商品管理</h1>
        <p class="page-subtitle">管理你的商品库存和定价</p>
      </div>
      <button @click="showProductForm = true" class="btn-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        创建商品
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="filter-group">
        <label>状态</label>
        <select v-model="filters.status" @change="fetchProducts" class="filter-select">
          <option value="">全部</option>
          <option value="active">在售</option>
          <option value="inactive">下架</option>
          <option value="soldout">售罄</option>
        </select>
      </div>
      <div class="filter-group">
        <label>分类</label>
        <select v-model="filters.category" @change="fetchProducts" class="filter-select">
          <option value="">全部</option>
          <option value="food">食品</option>
          <option value="toy">玩具</option>
          <option value="health">健康</option>
          <option value="service">服务</option>
          <option value="accessory">配件</option>
          <option value="other">其他</option>
        </select>
      </div>
      <div class="filter-group flex-grow">
        <label>搜索</label>
        <input
          v-model="searchQuery"
          @input="debounceSearch"
          type="text"
          placeholder="搜索商品名称或标签..."
          class="filter-input"
        />
      </div>
    </div>

    <!-- Products Table -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="products.length === 0" class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3>暂无商品</h3>
      <p>创建你的第一个商品开始销售</p>
      <button @click="showProductForm = true" class="btn-primary mt-4">创建商品</button>
    </div>

    <div v-else class="products-table-container">
      <table class="products-table">
        <thead>
          <tr>
            <th>商品信息</th>
            <th>分类</th>
            <th>价格</th>
            <th>库存</th>
            <th>已售</th>
            <th>NFT 折扣</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <td>
              <div class="product-info">
                <img
                  :src="product.images[0] || '/placeholder.png'"
                  :alt="product.name"
                  class="product-image"
                />
                <div>
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-desc">{{ truncate(product.description, 50) }}</div>
                </div>
              </div>
            </td>
            <td>
              <span class="category-badge" :class="`category-${product.category}`">
                {{ getCategoryLabel(product.category) }}
              </span>
            </td>
            <td class="font-mono">{{ product.price }} ETH</td>
            <td>
              <span :class="{ 'text-red-600': product.inventory < 10 }">
                {{ product.inventory }}
              </span>
            </td>
            <td>{{ product.soldCount }}</td>
            <td>
              <span v-if="product.nftBenefit.enabled" class="nft-badge">
                -{{ product.nftBenefit.discountPercent }}%
              </span>
              <span v-else class="text-gray-400">未启用</span>
            </td>
            <td>
              <span class="status-badge" :class="`status-${product.status}`">
                {{ getStatusLabel(product.status) }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="editProduct(product)" class="btn-icon" title="编辑">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="toggleStatus(product)"
                  class="btn-icon"
                  :title="product.status === 'active' ? '下架' : '上架'"
                >
                  <svg v-if="product.status === 'active'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button @click="deleteProduct(product)" class="btn-icon text-red-600" title="删除">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Product Form Modal -->
    <ProductForm
      v-if="showProductForm"
      :product="editingProduct"
      @close="closeProductForm"
      @saved="handleProductSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Product, ProductStatus, ProductCategory } from '@petsuite/shared/types/product'
import ProductForm from '../../components/ProductForm.vue'

const products = ref<Product[]>([])
const loading = ref(false)
const showProductForm = ref(false)
const editingProduct = ref<Product | null>(null)

const filters = ref({
  status: '' as ProductStatus | '',
  category: '' as ProductCategory | ''
})

const searchQuery = ref('')
let searchTimeout: NodeJS.Timeout

const fetchProducts = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock data for now
    products.value = [
      {
        _id: '1',
        merchantAddress: '0x123',
        name: '天然有机猫粮 5kg',
        description: '采用新鲜鸡肉和天然谷物制作，无添加剂，适合成年猫',
        category: 'food',
        price: '0.05',
        currency: 'ETH',
        images: ['https://via.placeholder.com/100'],
        inventory: 120,
        soldCount: 45,
        nftBenefit: {
          enabled: true,
          discountPercent: 10,
          minHealthScore: 80
        },
        tags: ['有机', '无谷物', '猫粮'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '2',
        merchantAddress: '0x123',
        name: '互动智能猫玩具',
        description: '自动激光逗猫玩具，支持 App 控制',
        category: 'toy',
        price: '0.02',
        currency: 'ETH',
        images: ['https://via.placeholder.com/100'],
        inventory: 5,
        soldCount: 28,
        nftBenefit: {
          enabled: true,
          discountPercent: 15
        },
        tags: ['智能', '玩具'],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    loading.value = false
  }
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchProducts()
  }, 500)
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  showProductForm.value = true
}

const toggleStatus = async (product: Product) => {
  try {
    const newStatus = product.status === 'active' ? 'inactive' : 'active'
    // TODO: API call to update status
    product.status = newStatus
    console.log('Status toggled:', product.name, newStatus)
  } catch (error) {
    console.error('Failed to toggle status:', error)
  }
}

const deleteProduct = async (product: Product) => {
  if (!confirm(`确定要删除商品「${product.name}」吗？`)) return

  try {
    // TODO: API call to delete
    products.value = products.value.filter(p => p._id !== product._id)
    console.log('Product deleted:', product.name)
  } catch (error) {
    console.error('Failed to delete product:', error)
  }
}

const closeProductForm = () => {
  showProductForm.value = false
  editingProduct.value = null
}

const handleProductSaved = (product: Product) => {
  if (editingProduct.value) {
    // Update existing
    const index = products.value.findIndex(p => p._id === product._id)
    if (index !== -1) {
      products.value[index] = product
    }
  } else {
    // Add new
    products.value.unshift(product)
  }
  closeProductForm()
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

const getStatusLabel = (status: ProductStatus): string => {
  const labels: Record<ProductStatus, string> = {
    active: '在售',
    inactive: '下架',
    soldout: '售罄'
  }
  return labels[status]
}

const truncate = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + '...' : text
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.products-page {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.page-subtitle {
  color: #6b7280;
  margin: 0.5rem 0 0 0;
}

.btn-primary {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.empty-state p {
  color: #6b7280;
  margin: 0.5rem 0 0 0;
}

.products-table-container {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th {
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

.products-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
}

.products-table tbody tr:hover {
  background: #f9fafb;
}

.product-info {
  display: flex;
  gap: 1rem;
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

.product-desc {
  font-size: 0.75rem;
  color: #6b7280;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.category-food { background: #dbeafe; color: #1e40af; }
.category-toy { background: #fce7f3; color: #be185d; }
.category-health { background: #d1fae5; color: #065f46; }
.category-service { background: #fef3c7; color: #92400e; }
.category-accessory { background: #e0e7ff; color: #3730a3; }
.category-other { background: #f3f4f6; color: #374151; }

.nft-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-active { background: #d1fae5; color: #065f46; }
.status-inactive { background: #f3f4f6; color: #6b7280; }
.status-soldout { background: #fee2e2; color: #991b1b; }

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f3f4f6;
  color: #1a1a1a;
}

.btn-icon.text-red-600:hover {
  background: #fee2e2;
  color: #dc2626;
}

.text-red-600 {
  color: #dc2626;
}

.text-gray-400 {
  color: #9ca3af;
}

.font-mono {
  font-family: ui-monospace, monospace;
}

.mt-4 {
  margin-top: 1rem;
}
</style>
