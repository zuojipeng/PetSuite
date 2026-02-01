<template>
  <div class="flex min-h-screen bg-background-dark gradient-mesh">
    <!-- 侧边栏 -->
    <DarkSidebar :active-page="currentRoute" @navigate="handleNavigation" />

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- 顶部导航 -->
      <DarkHeader />

      <!-- 页面内容 -->
      <main class="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DarkSidebar from '../components/DarkSidebar.vue'
import DarkHeader from '../components/DarkHeader.vue'

const route = useRoute()
const router = useRouter()

const currentRoute = computed(() => route.name as string || 'Home')

const handleNavigation = (page: string) => {
  router.push({ name: page })
}
</script>
