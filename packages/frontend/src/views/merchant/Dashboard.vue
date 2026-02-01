<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">商家仪表盘</h1>
      <p class="text-gray-600 mt-2">欢迎回来，{{ storeName }}</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">总销售额</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">0.00 ETH</p>
          </div>
          <span class="material-symbols-outlined text-4xl text-purple-600">payments</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">订单数量</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">0</p>
          </div>
          <span class="material-symbols-outlined text-4xl text-blue-600">shopping_cart</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">商品数量</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">0</p>
          </div>
          <span class="material-symbols-outlined text-4xl text-green-600">inventory_2</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">客户数量</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">0</p>
          </div>
          <span class="material-symbols-outlined text-4xl text-orange-600">people</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">快速操作</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link
          to="/merchant/products"
          class="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition"
        >
          <span class="material-symbols-outlined text-3xl text-purple-600 mb-2">add_box</span>
          <span class="text-sm font-medium">创建商品</span>
        </router-link>

        <router-link
          to="/merchant/orders"
          class="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
        >
          <span class="material-symbols-outlined text-3xl text-blue-600 mb-2">receipt_long</span>
          <span class="text-sm font-medium">查看订单</span>
        </router-link>

        <router-link
          to="/merchant/customers"
          class="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition"
        >
          <span class="material-symbols-outlined text-3xl text-green-600 mb-2">people</span>
          <span class="text-sm font-medium">客户管理</span>
        </router-link>

        <router-link
          to="/merchant/analytics"
          class="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition"
        >
          <span class="material-symbols-outlined text-3xl text-orange-600 mb-2">analytics</span>
          <span class="text-sm font-medium">数据分析</span>
        </router-link>
      </div>
    </div>

    <!-- Recent Orders (Placeholder) -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4">最近订单</h2>
      <div class="text-center py-12 text-gray-500">
        <span class="material-symbols-outlined text-6xl mb-4">inbox</span>
        <p>暂无订单数据</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../../store/auth'

const authStore = useAuthStore()

const storeName = computed(() => {
  return authStore.merchantProfile?.storeName || '店铺名称'
})
</script>
