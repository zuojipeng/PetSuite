<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <nav class="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-50">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left Side -->
          <div class="flex items-center">
            <!-- Logo -->
            <router-link to="/merchant/dashboard" class="flex items-center">
              <span class="text-2xl font-bold text-purple-600">🐾 PetSuite</span>
              <span class="ml-2 text-sm font-semibold text-gray-500 bg-purple-100 px-2 py-1 rounded">商家版</span>
            </router-link>
          </div>

          <!-- Right Side -->
          <div class="flex items-center space-x-4">
            <!-- Switch to User Mode -->
            <router-link
              to="/"
              class="text-sm text-gray-600 hover:text-purple-600 font-medium flex items-center gap-1"
            >
              <span class="material-symbols-outlined text-lg">arrow_back</span>
              返回用户端
            </router-link>

            <!-- Notifications -->
            <button class="p-2 text-gray-400 hover:text-gray-600 relative">
              <span class="material-symbols-outlined">notifications</span>
              <span class="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <!-- Wallet Address -->
            <div v-if="connected" class="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
              <span class="material-symbols-outlined text-lg text-green-600">account_balance_wallet</span>
              <span class="text-sm font-mono text-gray-700">{{ shortAddress }}</span>
            </div>
            <button
              v-else
              @click="connectWallet"
              class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium"
            >
              连接钱包
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Layout -->
    <div class="flex pt-16">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-sm border-r border-gray-200 fixed h-full overflow-y-auto">
        <nav class="px-3 py-6 space-y-1">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors"
            active-class="bg-purple-100 text-purple-700 font-semibold"
          >
            <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
            <span class="text-sm">{{ item.label }}</span>
          </router-link>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 ml-64 p-8 min-h-screen">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWeb3 } from '../composables/useWeb3'

const { connected, address, connect } = useWeb3()

const shortAddress = computed(() => {
  if (!address.value) return ''
  return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
})

const connectWallet = async () => {
  try {
    await connect()
  } catch (error) {
    console.error('Failed to connect wallet:', error)
  }
}

const menuItems = [
  { path: '/merchant/dashboard', icon: 'dashboard', label: '仪表盘' },
  { path: '/merchant/products', icon: 'inventory_2', label: '商品管理' },
  { path: '/merchant/orders', icon: 'receipt_long', label: '订单管理' },
  { path: '/merchant/customers', icon: 'people', label: '客户管理' },
  { path: '/merchant/payments', icon: 'payments', label: '收款管理' },
  { path: '/merchant/nft-benefits', icon: 'card_giftcard', label: 'NFT 权益' },
  { path: '/merchant/analytics', icon: 'analytics', label: 'AI 分析' },
  { path: '/merchant/settings', icon: 'settings', label: '店铺设置' },
]
</script>

<style scoped>
/* Custom scrollbar */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: #f1f1f1;
}

aside::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
