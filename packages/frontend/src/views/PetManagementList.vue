<template>
  <div class="animate-in fade-in duration-500">
    <header class="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
      <div>
        <h1 class="text-5xl font-black text-white tracking-tighter">我的萌宠库</h1>
        <p class="text-slate-400 mt-2 flex items-center gap-2 font-medium">
          <span class="size-3 rounded-full bg-accent-mint shadow-[0_0_12px_#22d3ee] animate-pulse"></span>
          管理您的 Web3 AI 宠物资产
        </p>
      </div>
      <button class="bg-primary hover:bg-white text-black px-8 py-4 rounded-3xl font-black transition-all flex items-center gap-2 shadow-xl shadow-primary/20 group">
        <span class="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">add_circle</span>
        铸造新宠物
      </button>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10">
      <div
        v-for="pet in pets"
        :key="pet.id"
        @click="selectPet(pet)"
        class="glass-card rounded-4xl p-7 transition-all duration-300 relative overflow-hidden group hover:-translate-y-2 hover:border-primary cursor-pointer shadow-2xl"
      >
        <div class="absolute top-5 left-7 z-20">
          <div class="flex items-center gap-2 px-3 py-1 bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-full">
            <span
              :class="[
                'size-2 rounded-full shadow-[0_0_8px]',
                pet.status === 'monitoring' ? 'bg-accent-mint shadow-accent-mint/50' : 'bg-primary shadow-primary/50'
              ]"
            ></span>
            <span
              :class="[
                'text-[10px] font-black uppercase tracking-wider',
                pet.status === 'monitoring' ? 'text-accent-mint' : 'text-primary'
              ]"
            >
              {{ pet.statusLabel }}
            </span>
          </div>
        </div>

        <div class="aspect-square w-full bg-slate-800/50 rounded-3xl mb-8 flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
          <img :src="pet.image" :alt="pet.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>

        <div class="space-y-5">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-3xl font-black text-white leading-tight">{{ pet.name }}</h3>
              <p class="text-slate-500 text-sm font-bold mt-1">{{ pet.breed }}</p>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-black text-slate-600 block uppercase">等级</span>
              <span class="text-3xl font-black text-primary tracking-tighter">{{ pet.level }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 py-5 border-y border-white/10">
            <div class="space-y-1.5">
              <span class="text-[11px] text-slate-500 font-black uppercase tracking-widest block">健康评分</span>
              <div class="flex items-center gap-2">
                <div
                  :class="[
                    'size-3 rounded-full shadow-lg',
                    pet.health > 80 ? 'bg-accent-mint shadow-accent-mint/30' : 'bg-primary shadow-primary/30'
                  ]"
                ></div>
                <span class="text-xl font-black text-white">{{ pet.health }}/100</span>
              </div>
            </div>
            <div class="space-y-1.5">
              <span class="text-[11px] text-slate-500 font-black uppercase tracking-widest block">成长阶段</span>
              <span class="text-xl font-black text-peach">{{ pet.growthStage }}</span>
            </div>
          </div>

          <button class="w-full py-4 bg-white/5 hover:bg-primary hover:text-black border border-white/10 hover:border-transparent rounded-3xl font-black transition-all flex items-center justify-center gap-2 group-hover:shadow-2xl">
            查看详情
            <span class="material-symbols-outlined font-black text-xl">arrow_forward</span>
          </button>
        </div>
      </div>

      <button class="border-4 border-dashed border-white/10 rounded-4xl p-8 flex flex-col items-center justify-center gap-6 hover:border-primary/40 hover:bg-primary/5 transition-all group min-h-[500px]">
        <div class="size-24 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all shadow-inner">
          <span class="material-symbols-outlined text-5xl font-black">add</span>
        </div>
        <div class="text-center">
          <h4 class="font-black text-2xl text-white mb-2 tracking-tight">铸造新成员</h4>
          <p class="text-slate-500 font-bold max-w-[200px] leading-snug">扩展您的元宇宙宠物家庭,开启全新 AI 管理路径</p>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Pet } from '../types/pet-management'
import { MOCK_PETS } from '../constants/mock-data'

const router = useRouter()
const pets = ref(MOCK_PETS)

const selectPet = (pet: Pet) => {
  // TODO: Navigate to pet detail page with pet ID
  console.log('Selected pet:', pet)
  router.push(`/pet-management/${pet.id}`)
}
</script>

<style scoped>
.glass-card {
  @apply bg-slate-900/60 backdrop-blur-xl border border-white/10;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-in {
  animation: fade-in 0.5s ease-out;
}
</style>
