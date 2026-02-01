<template>
  <header class="px-8 lg:px-10 py-6 flex items-center justify-between backdrop-blur-md sticky top-0 z-30 border-b border-white/5">
    <!-- 标题 -->
    <div class="flex flex-col">
      <h1 class="text-3xl lg:text-4xl font-black tracking-tight">
        <span class="text-white bg-clip-text">PetSuite</span>
        <span class="text-xl font-medium text-primary ml-2">智能助手看板</span>
      </h1>
      <p class="text-xs text-primary font-bold uppercase tracking-widest mt-1">
        Web3 驱动的自主宠物管理平台
      </p>
    </div>

    <!-- 右侧操作区 -->
    <div class="flex items-center gap-4 lg:gap-6">
      <!-- 网络状态 -->
      <div class="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
        <span :class="[
          'flex size-2 rounded-full',
          isConnected ? 'bg-accent-mint animate-pulse shadow-[0_0_8px_#22d3ee]' : 'bg-gray-500'
        ]"></span>
        <span class="text-xs font-bold text-slate-300">
          {{ isConnected ? 'Monad 已连接' : '未连接' }}
        </span>
      </div>

      <!-- 钱包连接按钮 -->
      <button
        @click="handleConnect"
        class="bg-primary hover:bg-white text-black font-black px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
      >
        <span class="material-symbols-outlined text-lg">account_balance_wallet</span>
        <span class="hidden md:inline">
          {{ isConnected ? shortenAddress(walletAddress!) : '连接钱包' }}
        </span>
        <span class="md:hidden">连接</span>
      </button>

      <!-- 用户信息 -->
      <div v-if="isConnected" class="flex items-center gap-3">
        <div class="text-right hidden lg:block">
          <p class="text-[10px] text-slate-500 font-bold uppercase">萌宠守护者</p>
          <p class="text-xs font-bold text-white">{{ displayName }}</p>
        </div>
        <div class="size-10 rounded-full border-2 border-primary/50 overflow-hidden shadow-lg bg-gradient-to-br from-primary to-purple-primary">
          <img
            v-if="userAvatar"
            :src="userAvatar"
            alt="Avatar"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="material-symbols-outlined text-white text-xl">person</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../store/auth'
import { useWeb3 } from '../composables/useWeb3'

const authStore = useAuthStore()
const { connect } = useWeb3()

const isConnected = computed(() => authStore.isConnected)
const walletAddress = computed(() => authStore.walletAddress)
const displayName = computed(() => authStore.displayName)
const userAvatar = computed(() => authStore.userProfile?.avatar)

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const handleConnect = async () => {
  if (!isConnected.value) {
    try {
      await connect()
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }
}
</script>
