<template>
  <div class="product-detail-page">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="product" class="product-container">
      <!-- Product Images -->
      <div class="product-images">
        <div class="main-image">
          <img :src="currentImage" :alt="product.name" />
        </div>
        <div v-if="product.images.length > 1" class="thumbnail-list">
          <img
            v-for="(img, index) in product.images"
            :key="index"
            :src="img"
            :alt="`${product.name} ${index + 1}`"
            :class="{ active: currentImage === img }"
            @click="currentImage = img"
            class="thumbnail"
          />
        </div>
      </div>

      <!-- Product Info -->
      <div class="product-info">
        <div class="product-header">
          <h1 class="product-title">{{ product.name }}</h1>
          <div class="product-badges">
            <span v-if="product.nftBenefit.enabled" class="nft-badge">
              数字会员 -{{ product.nftBenefit.discountPercent }}%
            </span>
            <span v-if="product.inventory < 10" class="stock-badge">
              仅剩{{ product.inventory }}件
            </span>
          </div>
        </div>

        <div class="product-price-section">
          <div class="price-info">
            <div class="current-price">{{ product.price }} ETH</div>
            <div v-if="hasMembership && product.nftBenefit.enabled" class="nft-price">
              会员价: {{ memberPrice }} ETH
              <span class="save-amount">省 {{ savedAmount }} ETH</span>
            </div>
          </div>

          <div class="product-meta">
            <span>已售 {{ product.soldCount }}</span>
            <span>•</span>
            <span>库存 {{ product.inventory }}</span>
          </div>
        </div>

        <div class="product-description">
          <h3>商品描述</h3>
          <p>{{ product.description }}</p>
        </div>

        <div v-if="product.tags.length > 0" class="product-tags-section">
          <h3>标签</h3>
          <div class="tags">
            <span v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>

        <div v-if="product.nftBenefit.enabled" class="nft-benefit-section">
          <h3>数字会员权益</h3>
          <div class="benefit-details">
            <div class="benefit-item">
              <span>折扣比例:</span>
              <span class="highlight">{{ product.nftBenefit.discountPercent }}% OFF</span>
            </div>
            <div v-if="product.nftBenefit.minHealthScore" class="benefit-item">
              <span>最低健康分:</span>
              <span>{{ product.nftBenefit.minHealthScore }}</span>
            </div>
            <div v-if="product.nftBenefit.minPetLevel" class="benefit-item">
              <span>最低宠物等级:</span>
              <span>{{ product.nftBenefit.minPetLevel }}</span>
            </div>
          </div>
        </div>

        <div class="purchase-section">
          <div class="quantity-selector">
            <label>数量</label>
            <div class="quantity-controls">
              <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
              <input v-model.number="quantity" type="number" min="1" :max="product.inventory" />
              <button @click="increaseQuantity" :disabled="quantity >= product.inventory">+</button>
            </div>
          </div>

          <button @click="handleBuyNow" class="btn-buy-now" :disabled="product.inventory === 0">
            {{ product.inventory === 0 ? '已售罄' : '立即购买' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <p>商品不存在或已下架</p>
      <button @click="$router.push('/marketplace')" class="btn-back">返回商城</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Product } from '@petsuite/shared/types/product'

const route = useRoute()
const router = useRouter()

const product = ref<Product | null>(null)
const loading = ref(true)
const currentImage = ref('')
const quantity = ref(1)
const hasMembership = ref(true) // TODO: Get from auth store

const memberPrice = computed(() => {
  if (!product.value || !product.value.nftBenefit.enabled) return '0'
  const original = parseFloat(product.value.price)
  const discounted = original * (1 - product.value.nftBenefit.discountPercent / 100)
  return discounted.toFixed(4)
})

const savedAmount = computed(() => {
  if (!product.value) return '0'
  const original = parseFloat(product.value.price)
  const saved = original - parseFloat(memberPrice.value)
  return saved.toFixed(4)
})

const fetchProduct = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock data
    product.value = {
      _id: route.params.id as string,
      merchantAddress: '0x123',
      name: '天然有机猫粮 5kg',
      description: '采用新鲜鸡肉和天然谷物制作，无添加剂、无防腐剂。富含蛋白质和必需氨基酸，帮助猫咪健康成长。适合成年猫日常食用，促进毛发亮泽、提升免疫力。',
      category: 'food',
      price: '0.05',
      currency: 'ETH',
      images: [
        'https://via.placeholder.com/600',
        'https://via.placeholder.com/600/FF0000',
        'https://via.placeholder.com/600/00FF00'
      ],
      inventory: 120,
      soldCount: 45,
      nftBenefit: {
        enabled: true,
        discountPercent: 10,
        minHealthScore: 80
      },
      tags: ['有机', '无谷物', '猫粮', '健康'],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    currentImage.value = product.value.images[0]
  } catch (error) {
    console.error('Failed to fetch product:', error)
    product.value = null
  } finally {
    loading.value = false
  }
}

const increaseQuantity = () => {
  if (product.value && quantity.value < product.value.inventory) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handleBuyNow = () => {
  if (!product.value) return

  router.push({
    name: 'Checkout',
    query: {
      productId: product.value._id,
      quantity: quantity.value
    }
  })
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem;
}

.loading-container,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
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

.product-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #f3f4f6;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-list {
  display: flex;
  gap: 0.75rem;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.thumbnail:hover,
.thumbnail.active {
  border-color: #667eea;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.product-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.product-badges {
  display: flex;
  gap: 0.75rem;
}

.nft-badge {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.stock-badge {
  padding: 0.5rem 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.product-price-section {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.75rem;
}

.price-info {
  margin-bottom: 1rem;
}

.current-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  font-family: ui-monospace, monospace;
}

.nft-price {
  font-size: 1.25rem;
  color: #667eea;
  font-weight: 600;
  font-family: ui-monospace, monospace;
  margin-top: 0.5rem;
}

.save-amount {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #059669;
}

.product-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.product-description h3,
.product-tags-section h3,
.nft-benefit-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
}

.product-description p {
  color: #374151;
  line-height: 1.7;
  margin: 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.5rem 1rem;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.nft-benefit-section {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 0.75rem;
}

.benefit-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.benefit-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
}

.benefit-item .highlight {
  color: #667eea;
  font-weight: 600;
}

.purchase-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.quantity-selector label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-controls button {
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.quantity-controls button:hover:not(:disabled) {
  background: #e5e7eb;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-controls input {
  width: 80px;
  padding: 0.5rem;
  text-align: center;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.btn-buy-now {
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-buy-now:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
}

.btn-buy-now:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-back {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
  }
}
</style>
