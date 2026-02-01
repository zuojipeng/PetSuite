<template>
  <aside class="w-20 lg:w-24 shrink-0 bg-black/40 border-r border-white/10 flex flex-col items-center py-8 gap-8 backdrop-blur-md">
    <!-- Logo -->
    <div
      class="size-12 lg:size-14 bg-primary-bright rounded-2xl flex items-center justify-center text-black shadow-lg shadow-primary/30 transition-transform hover:scale-105 cursor-pointer"
      @click="$router.push('/')"
    >
      <span class="material-symbols-outlined font-black text-3xl">pets</span>
    </div>

    <!-- 导航菜单 -->
    <nav class="flex flex-col gap-6">
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="$emit('navigate', item.id)"
        :title="item.label"
        :class="[
          'size-12 lg:size-14 flex items-center justify-center rounded-2xl transition-all',
          activePage === item.id
            ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-110'
            : 'text-slate-500 hover:bg-white/5 hover:text-white'
        ]"
      >
        <span class="material-symbols-outlined text-[28px]">{{ item.icon }}</span>
      </button>
    </nav>

    <!-- 底部帮助按钮 -->
    <div class="mt-auto flex flex-col gap-4">
      <button class="size-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
        <span class="material-symbols-outlined text-xl">help</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface NavItem {
  id: string
  icon: string
  label: string
}

defineProps<{
  activePage: string
}>()

defineEmits<{
  navigate: [page: string]
}>()

const navItems: NavItem[] = [
  { id: 'Home', icon: 'home', label: '首页' },
  { id: 'MyPets', icon: 'pets', label: '我的宠物' },
  { id: 'AIAdvisor', icon: 'smart_toy', label: 'AI 助手' },
  { id: 'MyNFTs', icon: 'account_balance_wallet', label: 'NFT 资产' },
  { id: 'Marketplace', icon: 'store', label: '商城' },
]
</script>
