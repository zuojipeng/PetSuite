<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">申请成为商家</h1>
      <p class="text-gray-600">
        成为 PetSuite 认证商家，在平台上销售您的宠物产品，触达更多宠物主人
      </p>
    </div>

    <!-- 已经是商家 -->
    <div v-if="isMerchant" class="bg-green-50 border border-green-200 rounded-lg p-6">
      <div class="flex items-center gap-3 mb-4">
        <span class="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
        <h2 class="text-xl font-semibold text-green-900">您已经是认证商家</h2>
      </div>
      <p class="text-green-700 mb-4">
        恭喜！您已经拥有商家权限，可以开始在平台上销售产品了。
      </p>
      <router-link
        to="/merchant/dashboard"
        class="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
      >
        前往商家中心
      </router-link>
    </div>

    <!-- 申请审核中 -->
    <div v-else-if="applicationStatus === 'pending'" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <div class="flex items-center gap-3 mb-4">
        <span class="material-symbols-outlined text-yellow-600 text-3xl">pending</span>
        <h2 class="text-xl font-semibold text-yellow-900">申请审核中</h2>
      </div>
      <p class="text-yellow-700 mb-2">
        您的商家申请正在审核中，我们会尽快处理。
      </p>
      <p class="text-sm text-yellow-600">
        申请时间: {{ formatDate(applicationDate) }}
      </p>
    </div>

    <!-- 申请被拒绝 -->
    <div v-else-if="applicationStatus === 'rejected'" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
      <div class="flex items-center gap-3 mb-4">
        <span class="material-symbols-outlined text-red-600 text-3xl">cancel</span>
        <h2 class="text-xl font-semibold text-red-900">申请未通过</h2>
      </div>
      <p class="text-red-700 mb-4">
        很遗憾，您的商家申请未通过审核。您可以修改信息后重新申请。
      </p>
      <button
        @click="applicationStatus = null"
        class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
      >
        重新申请
      </button>
    </div>

    <!-- 申请表单 -->
    <div v-else class="bg-white rounded-lg shadow-md p-8">
      <!-- 未连接钱包提示 -->
      <div v-if="!connected" class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div class="flex items-center gap-3 mb-4">
          <span class="material-symbols-outlined text-blue-600 text-3xl">account_balance_wallet</span>
          <h2 class="text-xl font-semibold text-blue-900">请先连接钱包</h2>
        </div>
        <p class="text-blue-700 mb-4">
          您需要连接钱包才能申请成为商家
        </p>
        <button
          @click="connectWallet"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          连接钱包
        </button>
      </div>

      <!-- 商家权益 -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">商家权益</h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-purple-600">storefront</span>
            <div>
              <h4 class="font-medium text-gray-900">独立店铺</h4>
              <p class="text-sm text-gray-600">拥有专属店铺页面和品牌展示</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-purple-600">inventory_2</span>
            <div>
              <h4 class="font-medium text-gray-900">产品管理</h4>
              <p class="text-sm text-gray-600">自主上架和管理商品</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-purple-600">smart_toy</span>
            <div>
              <h4 class="font-medium text-gray-900">AI 推荐</h4>
              <p class="text-sm text-gray-600">产品被 AI 智能推荐给用户</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-purple-600">card_giftcard</span>
            <div>
              <h4 class="font-medium text-gray-900">NFT 权益</h4>
              <p class="text-sm text-gray-600">为 NFT 持有者提供专属折扣</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 申请表单 -->
      <form v-if="connected" @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            店铺名称 *
          </label>
          <input
            v-model="form.storeName"
            type="text"
            required
            maxlength="50"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="输入您的店铺名称"
          />
          <p class="text-xs text-gray-500 mt-1">
            {{ form.storeName.length }}/50 字符
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            店铺简介
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            maxlength="500"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="介绍您的店铺特色、经营理念等"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            {{ form.description.length }}/500 字符
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            店铺 Logo URL（可选）
          </label>
          <input
            v-model="form.logo"
            type="url"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="https://example.com/logo.png"
          />
          <p class="text-xs text-gray-500 mt-1">
            请输入有效的图片 URL
          </p>
        </div>

        <!-- Logo 预览 -->
        <div v-if="form.logo" class="border border-gray-200 rounded-lg p-4">
          <p class="text-sm font-medium text-gray-700 mb-2">Logo 预览:</p>
          <img
            :src="form.logo"
            alt="Logo preview"
            class="w-32 h-32 object-cover rounded-lg"
            @error="logoError = true"
          />
          <p v-if="logoError" class="text-xs text-red-500 mt-2">
            无法加载图片，请检查 URL 是否正确
          </p>
        </div>

        <!-- 服务条款 -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div class="flex items-start gap-2">
            <input
              v-model="agreedToTerms"
              type="checkbox"
              id="terms"
              class="mt-1"
            />
            <label for="terms" class="text-sm text-gray-700">
              我已阅读并同意
              <a href="/terms" target="_blank" class="text-purple-600 hover:underline">
                PetSuite 商家服务条款
              </a>
              和
              <a href="/privacy" target="_blank" class="text-purple-600 hover:underline">
                隐私政策
              </a>
            </label>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="flex gap-4">
          <button
            type="button"
            @click="$router.go(-1)"
            class="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            返回
          </button>
          <button
            type="submit"
            :disabled="loading || !agreedToTerms || !form.storeName"
            class="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? '提交中...' : '提交申请' }}
          </button>
        </div>
      </form>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- 成功提示 -->
    <div v-if="success" class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <p class="text-green-600">{{ success }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWeb3 } from '../composables/useWeb3'
import { useAuthStore } from '../store/auth'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const router = useRouter()
const { connected, address, connect } = useWeb3()
const authStore = useAuthStore()

const form = ref({
  storeName: '',
  description: '',
  logo: '',
})

const loading = ref(false)
const error = ref('')
const success = ref('')
const agreedToTerms = ref(false)
const logoError = ref(false)
const applicationStatus = ref<string | null>(null)
const applicationDate = ref<Date | null>(null)

const isMerchant = computed(() => authStore.isMerchant)

onMounted(async () => {
  // 检查是否已有申请记录
  if (address.value) {
    await checkApplicationStatus()
  }
})

const connectWallet = async () => {
  try {
    await connect()
    await checkApplicationStatus()
  } catch (err) {
    console.error('Failed to connect wallet:', err)
  }
}

const checkApplicationStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/users/${address.value}`)
    if (response.data.success && response.data.data.merchantProfile) {
      const profile = response.data.data.merchantProfile
      applicationStatus.value = profile.applicationStatus
      applicationDate.value = profile.applicationDate ? new Date(profile.applicationDate) : null

      // 如果申请已通过，更新 auth store
      if (profile.applicationStatus === 'approved') {
        authStore.addRole('merchant')
        authStore.setMerchantProfile(profile)
        authStore.saveToStorage()
      }
    }
  } catch (err) {
    console.error('Failed to check application status:', err)
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  logoError.value = false

  try {
    if (!address.value) {
      throw new Error('Please connect your wallet first')
    }

    if (!form.value.storeName.trim()) {
      throw new Error('Store name is required')
    }

    const response = await axios.post(
      `${API_URL}/api/users/${address.value}/apply-merchant`,
      {
        storeName: form.value.storeName.trim(),
        description: form.value.description.trim(),
        logo: form.value.logo.trim(),
      }
    )

    if (response.data.success) {
      success.value = '申请提交成功！我们会尽快审核您的申请。'
      applicationStatus.value = 'pending'
      applicationDate.value = new Date()

      // 清空表单
      form.value = {
        storeName: '',
        description: '',
        logo: '',
      }
      agreedToTerms.value = false

      // 3秒后刷新页面状态
      setTimeout(() => {
        checkApplicationStatus()
      }, 3000)
    } else {
      throw new Error(response.data.error || 'Failed to submit application')
    }
  } catch (err: any) {
    console.error('Failed to submit application:', err)
    error.value = err.response?.data?.error || err.message || '提交申请失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const formatDate = (date: Date | null) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
