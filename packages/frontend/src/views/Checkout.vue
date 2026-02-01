<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <h1 class="page-title">确认订单</h1>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="product" class="checkout-content">
        <!-- Product Info -->
        <div class="product-section">
          <h2>商品信息</h2>
          <div class="product-card">
            <img :src="product.images[0]" :alt="product.name" class="product-image" />
            <div class="product-details">
              <h3>{{ product.name }}</h3>
              <p>{{ product.description }}</p>
              <div class="quantity-info">数量: {{ quantity }}</div>
            </div>
          </div>
        </div>

        <!-- Price Summary -->
        <div class="summary-section">
          <h2>费用明细</h2>
          <div class="summary-card">
            <div class="summary-row">
              <span>商品单价</span>
              <span>{{ product.price }} ETH</span>
            </div>
            <div class="summary-row">
              <span>数量</span>
              <span>× {{ quantity }}</span>
            </div>
            <div class="summary-row">
              <span>小计</span>
              <span>{{ subtotal }} ETH</span>
            </div>

            <div v-if="membershipActive && product.nftBenefit.enabled" class="nft-discount">
              <div class="summary-row highlight">
                <span>🎉 数字会员折扣 (-{{ product.nftBenefit.discountPercent }}%)</span>
                <span class="discount-amount">-{{ discountAmount }} ETH</span>
              </div>
            </div>

            <div v-if="upgradeToMembership && !hasMembership" class="summary-row">
              <span>数字会员升级</span>
              <span>+{{ membershipFeeAmount }} ETH</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row total">
              <span>应付总额</span>
              <span class="total-amount">{{ totalAmount }} ETH</span>
            </div>

            <div v-if="membershipActive && product.nftBenefit.enabled" class="savings-note">
              您已节省 {{ discountAmount }} ETH
            </div>
          </div>

          <div v-if="!hasMembership" class="membership-upgrade">
            <label class="upgrade-option">
              <input v-model="upgradeToMembership" type="checkbox" />
              <span>升级为数字会员（享永久记录、独家折扣、优先购买）</span>
            </label>
            <p class="upgrade-note">升级后可在「我的」查看数字会员权益</p>
          </div>

          <button @click="handlePayment" class="btn-pay" :disabled="paying">
            <span v-if="paying">处理中...</span>
            <span v-else>确认支付 {{ totalAmount }} ETH</span>
          </button>

          <p class="payment-note">
            支付流程支持演示模式，可后续连接钱包启用增值服务
          </p>
        </div>
      </div>

      <div v-else class="error-state">
        <p>商品信息加载失败</p>
        <button @click="$router.push('/marketplace')" class="btn-back">返回商城</button>
      </div>
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
const paying = ref(false)
const hasMembership = ref(true) // TODO: Get from auth store
const upgradeToMembership = ref(false)
const membershipFee = ref(0.01)
const quantity = ref(Number(route.query.quantity) || 1)

const subtotal = computed(() => {
  if (!product.value) return '0'
  return (parseFloat(product.value.price) * quantity.value).toFixed(4)
})

const membershipActive = computed(() => hasMembership.value || upgradeToMembership.value)

const discountAmount = computed(() => {
  if (!product.value || !product.value.nftBenefit.enabled || !membershipActive.value) return '0'
  const discount = parseFloat(subtotal.value) * (product.value.nftBenefit.discountPercent / 100)
  return discount.toFixed(4)
})

const membershipFeeAmount = computed(() => {
  if (!upgradeToMembership.value || hasMembership.value) return '0'
  return membershipFee.value.toFixed(4)
})

const totalAmount = computed(() => {
  const total =
    parseFloat(subtotal.value) -
    parseFloat(discountAmount.value) +
    parseFloat(membershipFeeAmount.value)
  return total.toFixed(4)
})

const fetchProduct = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock data
    product.value = {
      _id: route.query.productId as string || '1',
      merchantAddress: '0x123',
      name: '天然有机猫粮 5kg',
      description: '采用新鲜鸡肉和天然谷物制作，无添加剂',
      category: 'food',
      price: '0.05',
      currency: 'ETH',
      images: ['https://via.placeholder.com/200'],
      inventory: 120,
      soldCount: 45,
      nftBenefit: {
        enabled: true,
        discountPercent: 10
      },
      tags: ['有机', '猫粮'],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  } catch (error) {
    console.error('Failed to fetch product:', error)
  } finally {
    loading.value = false
  }
}

const handlePayment = async () => {
  paying.value = true
  try {
    // TODO: Call smart contract for payment
    await new Promise(resolve => setTimeout(resolve, 2000))

    alert(upgradeToMembership.value ? '支付成功！已升级为数字会员' : '支付成功！订单已创建')
    router.push('/my-orders')
  } catch (error) {
    console.error('Payment failed:', error)
    alert('支付失败，请重试')
  } finally {
    paying.value = false
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem;
}

.checkout-container {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 2rem 0;
}

.loading,
.error-state {
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

.checkout-content {
  display: grid;
  gap: 2rem;
}

.product-section,
.summary-section {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-section h2,
.summary-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1.5rem 0;
}

.product-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.product-image {
  width: 120px;
  height: 120px;
  border-radius: 0.5rem;
  object-fit: cover;
}

.product-details {
  flex: 1;
}

.product-details h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.product-details p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1rem 0;
}

.quantity-info {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.summary-card {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.membership-upgrade {
  background: #f3f4f6;
  border-radius: 0.75rem;
  padding: 1rem;
  margin: 1rem 0 1.5rem;
}

.upgrade-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #1f2937;
}

.upgrade-note {
  margin: 0.5rem 0 0 2rem;
  font-size: 0.8rem;
  color: #6b7280;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #374151;
}

.summary-row:last-child {
  margin-bottom: 0;
}

.nft-discount {
  margin: 1rem 0;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 0.5rem;
}

.summary-row.highlight {
  color: #667eea;
  font-weight: 600;
}

.discount-amount {
  color: #059669;
  font-weight: 700;
}

.summary-divider {
  height: 2px;
  background: #e5e7eb;
  margin: 1.5rem 0;
}

.summary-row.total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.total-amount {
  font-family: ui-monospace, monospace;
  color: #667eea;
}

.savings-note {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: #059669;
  font-weight: 600;
}

.btn-pay {
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-pay:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
}

.btn-pay:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.payment-note {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.75rem;
  color: #6b7280;
}

.btn-back {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}
</style>
