<template>
  <div class="settings-page">
    <div class="page-header">
      <h1 class="page-title">店铺设置</h1>
      <p class="page-subtitle">管理你的商家信息和店铺配置</p>
    </div>

    <!-- Merchant Registration Card (if not registered) -->
    <div v-if="!isMerchant" class="registration-card">
      <div class="registration-icon">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h2>成为商家</h2>
      <p>注册成为商家，开始在平台上销售宠物商品和服务</p>
      <button @click="showRegistration = true" class="btn-primary">立即注册</button>
    </div>

    <!-- Merchant Settings Form (if registered) -->
    <div v-else class="settings-container">
      <form @submit.prevent="handleSave" class="settings-form">
        <!-- Basic Info -->
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>

          <div class="form-group">
            <label class="form-label required">店铺名称</label>
            <input
              v-model="formData.storeName"
              type="text"
              placeholder="例如：萌宠优选商城"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">店铺简介</label>
            <textarea
              v-model="formData.description"
              rows="4"
              placeholder="介绍你的店铺特色、经营理念等..."
              class="form-input"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">店铺 Logo URL</label>
              <input
                v-model="formData.logo"
                type="text"
                placeholder="https://..."
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">封面图 URL</label>
              <input
                v-model="formData.coverImage"
                type="text"
                placeholder="https://..."
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">经营品类</label>
            <div class="category-checkboxes">
              <label v-for="cat in availableCategories" :key="cat.value" class="checkbox-label">
                <input
                  v-model="formData.category"
                  type="checkbox"
                  :value="cat.value"
                />
                <span>{{ cat.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Store Stats (Read-only) -->
        <div class="form-section">
          <h3 class="section-title">店铺数据</h3>

          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-label">商品数量</div>
                <div class="stat-value">{{ merchantProfile.stats.productCount }}</div>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-label">总订单数</div>
                <div class="stat-value">{{ merchantProfile.totalOrders }}</div>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-label">总收入</div>
                <div class="stat-value">{{ merchantProfile.stats.totalRevenue }} ETH</div>
              </div>
            </div>

            <div class="stat-item">
              <div class="stat-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-label">客户数</div>
                <div class="stat-value">{{ merchantProfile.stats.customerCount }}</div>
              </div>
            </div>
          </div>

          <div class="verification-status">
            <span v-if="merchantProfile.isVerified" class="verified-badge">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd" />
              </svg>
              已认证商家
            </span>
            <span v-else class="unverified-badge">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              未认证
            </span>
            <span class="rating">
              店铺评分: {{ merchantProfile.rating.toFixed(1) }} / 5.0
            </span>
          </div>
        </div>

        <!-- Wallet Info (Read-only) -->
        <div class="form-section">
          <h3 class="section-title">钱包信息</h3>
          <div class="wallet-info">
            <div class="wallet-label">商家钱包地址</div>
            <div class="wallet-address">{{ merchantProfile.walletAddress }}</div>
            <p class="wallet-hint">所有交易收入将发送到此地址</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button type="button" @click="resetForm" class="btn-secondary">重置</button>
          <button type="submit" :disabled="saving" class="btn-primary">
            <span v-if="saving">保存中...</span>
            <span v-else>保存设置</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Registration Modal -->
    <div v-if="showRegistration" class="modal-overlay" @click.self="showRegistration = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>商家注册</h2>
          <button @click="showRegistration = false" class="btn-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleRegister" class="modal-body">
          <div class="form-group">
            <label class="form-label required">店铺名称</label>
            <input
              v-model="registrationData.storeName"
              type="text"
              placeholder="输入店铺名称"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">店铺简介</label>
            <textarea
              v-model="registrationData.description"
              rows="3"
              placeholder="简单介绍你的店铺..."
              class="form-input"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">选择经营品类（至少选一项）</label>
            <div class="category-checkboxes">
              <label v-for="cat in availableCategories" :key="cat.value" class="checkbox-label">
                <input
                  v-model="registrationData.category"
                  type="checkbox"
                  :value="cat.value"
                />
                <span>{{ cat.label }}</span>
              </label>
            </div>
          </div>

          <div class="registration-hint">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>注册后，你将可以创建商品并在平台上销售</span>
          </div>

          <div class="form-actions">
            <button type="button" @click="showRegistration = false" class="btn-secondary">取消</button>
            <button type="submit" :disabled="registering" class="btn-primary">
              <span v-if="registering">注册中...</span>
              <span v-else>确认注册</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { MerchantProfile } from '@petsuite/shared/types/user'

const isMerchant = ref(false)
const showRegistration = ref(false)
const saving = ref(false)
const registering = ref(false)

const availableCategories = [
  { value: 'cat', label: '猫咪用品' },
  { value: 'dog', label: '狗狗用品' },
  { value: 'bird', label: '鸟类用品' },
  { value: 'fish', label: '水族用品' },
  { value: 'small-pet', label: '小宠用品' },
  { value: 'reptile', label: '爬宠用品' }
]

const merchantProfile = reactive<MerchantProfile>({
  walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
  storeName: '',
  description: '',
  logo: '',
  coverImage: '',
  category: [],
  isVerified: false,
  rating: 0,
  totalSales: 0,
  totalOrders: 0,
  stats: {
    totalRevenue: '0',
    avgOrderValue: '0',
    productCount: 0,
    customerCount: 0
  },
  createdAt: new Date(),
  updatedAt: new Date()
})

const formData = reactive({
  storeName: '',
  description: '',
  logo: '',
  coverImage: '',
  category: [] as string[]
})

const registrationData = reactive({
  storeName: '',
  description: '',
  category: [] as string[]
})

const loadMerchantProfile = async () => {
  try {
    // TODO: API call to check if user is merchant
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock: Simulate merchant exists
    isMerchant.value = true

    // Mock data
    Object.assign(merchantProfile, {
      storeName: '萌宠优选商城',
      description: '专注高品质宠物用品，为你的爱宠提供最好的产品和服务',
      logo: 'https://via.placeholder.com/100',
      coverImage: 'https://via.placeholder.com/800x200',
      category: ['cat', 'dog'],
      isVerified: true,
      rating: 4.8,
      totalOrders: 156,
      stats: {
        totalRevenue: '15.234',
        avgOrderValue: '0.098',
        productCount: 24,
        customerCount: 89
      }
    })

    // Sync to form
    Object.assign(formData, {
      storeName: merchantProfile.storeName,
      description: merchantProfile.description,
      logo: merchantProfile.logo,
      coverImage: merchantProfile.coverImage,
      category: [...merchantProfile.category]
    })
  } catch (error) {
    console.error('Failed to load merchant profile:', error)
  }
}

const handleRegister = async () => {
  if (registrationData.category.length === 0) {
    alert('请至少选择一个经营品类')
    return
  }

  registering.value = true
  try {
    // TODO: API call to register merchant
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Merchant registered:', registrationData)

    // Update state
    isMerchant.value = true
    Object.assign(merchantProfile, {
      storeName: registrationData.storeName,
      description: registrationData.description,
      category: [...registrationData.category],
      isVerified: false,
      rating: 0
    })

    Object.assign(formData, {
      storeName: registrationData.storeName,
      description: registrationData.description,
      category: [...registrationData.category]
    })

    showRegistration.value = false
    alert('注册成功！欢迎成为商家')
  } catch (error) {
    console.error('Failed to register:', error)
    alert('注册失败，请重试')
  } finally {
    registering.value = false
  }
}

const handleSave = async () => {
  saving.value = true
  try {
    // TODO: API call to update merchant profile
    await new Promise(resolve => setTimeout(resolve, 1000))

    Object.assign(merchantProfile, {
      storeName: formData.storeName,
      description: formData.description,
      logo: formData.logo,
      coverImage: formData.coverImage,
      category: [...formData.category],
      updatedAt: new Date()
    })

    console.log('Merchant profile updated:', merchantProfile)
    alert('保存成功！')
  } catch (error) {
    console.error('Failed to save:', error)
    alert('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  Object.assign(formData, {
    storeName: merchantProfile.storeName,
    description: merchantProfile.description,
    logo: merchantProfile.logo,
    coverImage: merchantProfile.coverImage,
    category: [...merchantProfile.category]
  })
}

onMounted(() => {
  loadMerchantProfile()
})
</script>

<style scoped>
.settings-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
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
  margin: 0;
}

.registration-card {
  background: white;
  padding: 3rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

.registration-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #667eea;
}

.registration-card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
}

.registration-card p {
  color: #6b7280;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.settings-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.settings-form {
  max-width: 800px;
}

.form-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-group {
  margin-bottom: 1.5rem;
  flex: 1;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-label.required::after {
  content: ' *';
  color: #ef4444;
}

.form-input {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea.form-input {
  resize: vertical;
}

.category-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.checkbox-label:hover {
  background: #f9fafb;
  border-color: #667eea;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0.5rem;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.verification-status {
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.verified-badge,
.unverified-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.verified-badge {
  background: #d1fae5;
  color: #065f46;
}

.unverified-badge {
  background: #fef3c7;
  color: #92400e;
}

.rating {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.wallet-info {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.wallet-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.wallet-address {
  font-family: ui-monospace, monospace;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.wallet-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
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
  max-width: 600px;
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

.registration-hint {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
}

.registration-hint svg {
  flex-shrink: 0;
  color: #3b82f6;
}

.registration-hint span {
  font-size: 0.875rem;
  color: #1e40af;
  line-height: 1.5;
}

.w-12 {
  width: 3rem;
  height: 3rem;
}

.w-6 {
  width: 1.5rem;
  height: 1.5rem;
}

.w-5 {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
