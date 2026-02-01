<template>
  <div class="marketplace-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">精选好物</h1>
        <p class="hero-subtitle">AI 精选宠物用品，数字会员享专属折扣</p>
      </div>
    </div>

    <div class="marketplace-container">
      <!-- Filters Sidebar -->
      <aside class="filters-sidebar">
        <div class="filter-section">
          <h3 class="filter-title">分类</h3>
          <div class="filter-options">
            <label v-for="cat in categories" :key="cat.value" class="filter-option">
              <input
                v-model="filters.categories"
                type="checkbox"
                :value="cat.value"
                @change="fetchProducts"
              />
              <span>{{ cat.label }}</span>
              <span class="option-count">({{ cat.count }})</span>
            </label>
          </div>
        </div>

        <div class="filter-section">
          <h3 class="filter-title">价格区间 (ETH)</h3>
          <div class="price-range">
            <input
              v-model.number="filters.minPrice"
              type="number"
              step="0.001"
              min="0"
              placeholder="最低价"
              class="price-input"
              @change="fetchProducts"
            />
            <span>-</span>
            <input
              v-model.number="filters.maxPrice"
              type="number"
              step="0.001"
              min="0"
              placeholder="最高价"
              class="price-input"
              @change="fetchProducts"
            />
          </div>
        </div>

        <div class="filter-section">
          <h3 class="filter-title">数字会员优惠</h3>
          <label class="filter-option">
            <input
              v-model="filters.nftBenefitOnly"
              type="checkbox"
              @change="fetchProducts"
            />
            <span>仅显示有会员优惠的商品</span>
          </label>
        </div>

        <button @click="resetFilters" class="reset-filters-btn">
          重置筛选条件
        </button>
      </aside>

      <!-- Products Grid -->
      <main class="products-main">
        <!-- Toolbar -->
        <div class="products-toolbar">
          <div class="search-box">
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              @input="debounceSearch"
              type="text"
              placeholder="搜索商品..."
              class="search-input"
            />
          </div>

          <div class="toolbar-actions">
            <select v-model="sortBy" @change="fetchProducts" class="sort-select">
              <option value="newest">最新上架</option>
              <option value="popular">最受欢迎</option>
              <option value="price-asc">价格从低到高</option>
              <option value="price-desc">价格从高到低</option>
            </select>
          </div>
        </div>

        <!-- Results Info -->
        <div class="results-info">
          <span>找到 {{ totalProducts }} 个商品</span>
          <span v-if="hasMembership" class="nft-indicator">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd" />
            </svg>
            你已是数字会员，可享受会员折扣
          </span>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="products.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3>暂无商品</h3>
          <p>试试调整筛选条件</p>
        </div>

        <!-- Products Grid -->
        <div v-else class="products-grid">
          <div
            v-for="product in products"
            :key="product._id"
            class="product-card"
            @click="goToProduct(product._id!)"
          >
            <div class="product-image-container">
              <img
                :src="product.images[0] || '/placeholder.png'"
                :alt="product.name"
                class="product-image"
              />
              <div v-if="product.nftBenefit.enabled" class="nft-badge">
                会员 -{{ product.nftBenefit.discountPercent }}%
              </div>
              <div v-if="product.inventory < 10" class="low-stock-badge">
                仅剩 {{ product.inventory }} 件
              </div>
            </div>

            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-desc">{{ truncate(product.description, 60) }}</p>

              <div class="product-tags">
                <span v-for="tag in product.tags.slice(0, 3)" :key="tag" class="product-tag">
                  {{ tag }}
                </span>
              </div>

              <div class="product-footer">
                <div class="price-section">
                  <div class="current-price">{{ product.price }} ETH</div>
                  <div v-if="hasMembership && product.nftBenefit.enabled" class="nft-price">
                    会员价: {{ calculateNFTPrice(product.price, product.nftBenefit.discountPercent) }} ETH
                  </div>
                </div>

                <button @click.stop="quickBuy(product)" class="buy-button">
                  立即购买
                </button>
              </div>

              <div class="product-meta">
                <span class="meta-item">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  已售 {{ product.soldCount }}
                </span>
                <span class="meta-item">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  库存 {{ product.inventory }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="page-btn"
          >
            上一页
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="page-btn"
          >
            下一页
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Product, ProductCategory } from '@petsuite/shared/types/product'

const router = useRouter()

const products = ref<Product[]>([])
const loading = ref(false)
const hasMembership = ref(true) // TODO: Get from auth store
const totalProducts = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 12

const searchQuery = ref('')
const sortBy = ref('newest')

const filters = reactive({
  categories: [] as ProductCategory[],
  minPrice: null as number | null,
  maxPrice: null as number | null,
  nftBenefitOnly: false
})

const categories = [
  { value: 'food' as ProductCategory, label: '食品', count: 45 },
  { value: 'toy' as ProductCategory, label: '玩具', count: 32 },
  { value: 'health' as ProductCategory, label: '健康', count: 28 },
  { value: 'service' as ProductCategory, label: '服务', count: 15 },
  { value: 'accessory' as ProductCategory, label: '配件', count: 38 },
  { value: 'other' as ProductCategory, label: '其他', count: 12 }
]

let searchTimeout: NodeJS.Timeout

const fetchProducts = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock data
    const mockProducts: Product[] = Array.from({ length: 8 }, (_, i) => ({
      _id: `product-${i + 1}`,
      merchantAddress: '0x123',
      name: `商品 ${i + 1}`,
      description: '这是一个优质的宠物商品，采用天然材料制作，安全环保，适合各种宠物使用。',
      category: ['food', 'toy', 'health'][i % 3] as ProductCategory,
      price: (0.01 + i * 0.01).toFixed(3),
      currency: 'ETH',
      images: ['https://via.placeholder.com/300'],
      inventory: Math.floor(Math.random() * 100) + 10,
      soldCount: Math.floor(Math.random() * 200),
      nftBenefit: {
        enabled: i % 2 === 0,
        discountPercent: 10 + (i % 3) * 5
      },
      tags: ['优质', '热销', '推荐'].slice(0, Math.floor(Math.random() * 3) + 1),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    products.value = mockProducts
    totalProducts.value = mockProducts.length
    totalPages.value = Math.ceil(totalProducts.value / pageSize)
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

const resetFilters = () => {
  filters.categories = []
  filters.minPrice = null
  filters.maxPrice = null
  filters.nftBenefitOnly = false
  searchQuery.value = ''
  fetchProducts()
}

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProducts()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToProduct = (productId: string) => {
  router.push(`/marketplace/${productId}`)
}

const quickBuy = (product: Product) => {
  router.push({
    name: 'checkout',
    query: { productId: product._id }
  })
}

const calculateNFTPrice = (price: string, discountPercent: number): string => {
  const original = parseFloat(price)
  const discounted = original * (1 - discountPercent / 100)
  return discounted.toFixed(4)
}

const truncate = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + '...' : text
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.marketplace-page {
  min-height: 100vh;
  background: #f9fafb;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 2rem;
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
}

.hero-subtitle {
  font-size: 1.125rem;
  opacity: 0.95;
  margin: 0;
}

.marketplace-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}

.filters-sidebar {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-section:last-of-type {
  margin-bottom: 1.5rem;
}

.filter-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
}

.filter-option input[type="checkbox"] {
  cursor: pointer;
}

.option-count {
  margin-left: auto;
  font-size: 0.75rem;
  color: #9ca3af;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.price-input:focus {
  outline: none;
  border-color: #667eea;
}

.reset-filters-btn {
  width: 100%;
  padding: 0.625rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-filters-btn:hover {
  background: #e5e7eb;
}

.products-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.products-toolbar {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.toolbar-actions {
  display: flex;
  gap: 1rem;
}

.sort-select {
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.nft-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
}

.loading-state,
.empty-state {
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.product-image-container {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f3f4f6;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nft-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.low-stock-badge {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  padding: 0.375rem 0.75rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.product-info {
  padding: 1.25rem;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.product-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.product-tag {
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.price-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.current-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  font-family: ui-monospace, monospace;
}

.nft-price {
  font-size: 0.75rem;
  color: #667eea;
  font-weight: 600;
  font-family: ui-monospace, monospace;
}

.buy-button {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.buy-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.product-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6b7280;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
}

.page-btn {
  padding: 0.625rem 1.25rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.w-4 {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 1024px) {
  .marketplace-container {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: static;
  }
}
</style>
