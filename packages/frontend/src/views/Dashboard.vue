<template>
  <div class="space-y-12 animate-in fade-in py-8">
    <!-- 欢迎标题 - 更大胆、更多留白 -->
    <div class="flex items-center justify-between mb-12">
      <div>
        <h1 class="text-6xl md:text-7xl font-black text-warm-dark mb-4 tracking-tight leading-none">
          欢迎回来 👋
        </h1>
        <p class="text-xl text-warm-text/70 font-medium">今天也要好好照顾毛孩子哦～</p>
      </div>
    </div>

    <!-- 快速统计卡片 - 温暖圆润的设计 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- 宠物总数 -->
      <div class="bg-gradient-to-br from-primary-light to-primary rounded-[2rem] p-8 shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:scale-105">
        <div class="flex items-center justify-between mb-6">
          <div class="text-6xl">🐾</div>
          <span class="text-sm font-black text-white/80 bg-white/20 px-3 py-1 rounded-full">+12%</span>
        </div>
        <h3 class="text-5xl font-black text-white mb-2">{{ stats.totalPets }}</h3>
        <p class="text-lg text-white/80 font-semibold">我的宠物</p>
      </div>

      <!-- 健康评分 -->
      <div class="bg-gradient-to-br from-soft-green to-accent-coral rounded-[2rem] p-8 shadow-2xl shadow-soft-green/20 hover:shadow-soft-green/30 transition-all duration-300 hover:scale-105">
        <div class="flex items-center justify-between mb-6">
          <div class="text-6xl">💚</div>
          <span class="text-sm font-black text-white/80 bg-white/20 px-3 py-1 rounded-full">优秀</span>
        </div>
        <h3 class="text-5xl font-black text-white mb-2">{{ stats.avgHealth }}</h3>
        <p class="text-lg text-white/80 font-semibold">平均健康评分</p>
      </div>

      <!-- AI 分析次数 -->
      <div class="bg-gradient-to-br from-accent to-accent-coral rounded-[2rem] p-8 shadow-2xl shadow-accent/20 hover:shadow-accent/30 transition-all duration-300 hover:scale-105">
        <div class="flex items-center justify-between mb-6">
          <div class="text-6xl">✨</div>
          <span class="text-sm font-black text-white/80 bg-white/20 px-3 py-1 rounded-full">本周</span>
        </div>
        <h3 class="text-5xl font-black text-white mb-2">{{ stats.aiAnalysis }}</h3>
        <p class="text-lg text-white/80 font-semibold">AI 分析次数</p>
      </div>
    </div>

    <!-- 我的宠物快速访问 - 更大标题、更多留白 -->
    <section class="mt-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-5xl font-black flex items-center gap-4 text-warm-dark">
          <span class="text-6xl">🐾</span>
          我的萌宠
        </h2>
        <button
          @click="$router.push({ name: 'DarkMyPets' })"
          class="text-base font-black bg-primary text-white px-8 py-4 rounded-full hover:bg-primary-dark transition-all hover:scale-105 shadow-lg shadow-primary/30"
        >
          查看全部 →
        </button>
      </div>

      <div v-if="pets.length > 0" class="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
        <div
          v-for="pet in pets"
          :key="pet.id"
          class="min-w-[380px] bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 flex gap-6 items-center cursor-pointer hover:bg-white hover:shadow-2xl transition-all duration-300 group border-2 border-warm-gray"
          @click="handlePetClick(pet)"
        >
          <div class="size-32 rounded-3xl overflow-hidden shadow-xl group-hover:scale-110 transition-transform bg-gradient-to-br from-peach to-primary-light flex items-center justify-center">
            <span class="text-7xl">{{ pet.species === 'cat' ? '🐱' : '🐶' }}</span>
          </div>
          <div class="flex-1">
            <h3 class="text-3xl font-black text-warm-dark mb-2">{{ pet.name }}</h3>
            <div class="flex items-center gap-3 mt-2">
              <span class="text-sm px-3 py-1 rounded-full font-black bg-soft-green text-white">
                健康
              </span>
              <span class="text-base text-warm-text/60 font-bold">{{ pet.age }} 岁</span>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <div class="text-sm text-warm-text/60">
                健康评分: <span class="text-warm-dark font-black text-lg">{{ pet.healthScore }}/100</span>
              </div>
              <span class="text-2xl group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white/80 backdrop-blur-sm rounded-[2rem] p-16 text-center border-2 border-warm-gray">
        <div class="text-8xl mb-6">🐾</div>
        <h3 class="text-3xl font-black text-warm-dark mb-4">还没有宠物档案</h3>
        <p class="text-xl text-warm-text/60 mb-8 font-medium">创建您的第一个宠物档案，开始使用AI智能推荐</p>
        <button
          @click="$router.push({ name: 'DarkMyPets' })"
          class="bg-gradient-to-r from-primary to-accent text-white px-12 py-5 rounded-full text-lg font-black hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/30"
        >
          添加我的宠物
        </button>
      </div>
    </section>

    <!-- 功能快捷入口 - 大卡片、圆润设计 -->
    <section class="mt-16">
      <h2 class="text-5xl font-black text-warm-dark mb-8">快捷功能</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <button
          v-for="feature in features"
          :key="feature.name"
          @click="$router.push({ name: feature.route })"
          class="bg-white/80 backdrop-blur-sm rounded-[2rem] p-8 hover:bg-white hover:shadow-2xl transition-all duration-300 group text-left border-2 border-warm-gray hover:scale-105"
        >
          <div class="text-6xl mb-6 group-hover:scale-110 transition-transform">
            {{ feature.emoji }}
          </div>
          <h3 class="text-2xl font-black text-warm-dark mb-2">{{ feature.name }}</h3>
          <p class="text-base text-warm-text/60 font-medium">{{ feature.desc }}</p>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stats = ref({
  totalPets: 0,
  avgHealth: 0,
  aiAnalysis: 0,
})

const pets = ref<any[]>([])

const features = [
  {
    name: 'AI 智能推荐',
    desc: '获取专业建议',
    emoji: '🤖',
    route: 'DarkAIAdvisor'
  },
  {
    name: '我的宠物',
    desc: '管理宠物档案',
    emoji: '🐕',
    route: 'DarkMyPets'
  },
  {
    name: 'NFT 资产',
    desc: '查看数字资产',
    emoji: '💎',
    route: 'DarkMyNFTs'
  },
  {
    name: '商城',
    desc: '精选好物',
    emoji: '🛍️',
    route: 'DarkMarketplace'
  },
]

const handlePetClick = (pet: any) => {
  console.log('Pet clicked:', pet)
  // TODO: 导航到宠物详情页
}

const loadData = () => {
  // 从 localStorage 加载数据
  const stored = localStorage.getItem('petsuite_pets')
  if (stored) {
    pets.value = JSON.parse(stored)
    stats.value.totalPets = pets.value.length

    if (pets.value.length > 0) {
      const totalHealth = pets.value.reduce((sum, pet) => sum + (pet.healthScore || 0), 0)
      stats.value.avgHealth = Math.round(totalHealth / pets.value.length)
    }
  }

  // Mock AI 分析次数
  stats.value.aiAnalysis = 15
}

onMounted(() => {
  loadData()
})
</script>
