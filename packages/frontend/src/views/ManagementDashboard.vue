<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <!-- Main Content -->
      <div class="xl:col-span-8 flex flex-col gap-8">
        <!-- Pet Overview Quick Selection -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-black flex items-center gap-2 text-white">
              <span class="material-symbols-outlined text-primary text-3xl">pets</span>
              我的萌宠
            </h2>
            <button class="text-xs font-black bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-full hover:bg-primary/20 transition-all">
              铸造新成员 +
            </button>
          </div>
          <div class="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            <div
              v-for="pet in pets"
              :key="pet.id"
              @click="selectPet(pet)"
              class="min-w-[320px] glass-card rounded-3xl p-5 flex gap-5 items-center cursor-pointer hover:border-primary/50 transition-all group shadow-xl"
            >
              <div class="size-24 rounded-2xl overflow-hidden shadow-lg border-2 border-white/10 group-hover:scale-105 transition-transform">
                <img :src="pet.image" :alt="pet.name" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-black text-white">{{ pet.name }} #{{ pet.id }}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <span
                    :class="[
                      'text-[10px] px-2 py-0.5 rounded font-black uppercase',
                      pet.status === 'monitoring' ? 'bg-accent-mint text-black' : 'bg-primary text-black'
                    ]"
                  >
                    {{ pet.status === 'monitoring' ? '健康' : '待处理' }}
                  </span>
                  <span class="text-xs text-slate-400 font-bold">等级 {{ pet.level }}</span>
                </div>
                <button class="mt-4 text-xs font-black text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  查看档案 <span class="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Health Report -->
          <div class="glass-card rounded-[2.5rem] p-8 relative overflow-hidden">
            <h3 class="text-xl font-black mb-8 flex justify-between items-center text-white">
              健康日报
              <span class="text-[10px] font-black bg-white/10 px-2 py-1 rounded-md text-primary uppercase">今日更新</span>
            </h3>
            <div class="flex items-center justify-between">
              <div class="relative size-36">
                <svg class="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="65" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="10" />
                  <circle
                    cx="72"
                    cy="72"
                    r="65"
                    fill="none"
                    stroke="#ee8c2b"
                    stroke-width="10"
                    stroke-dasharray="408.4"
                    stroke-dashoffset="61.3"
                    stroke-linecap="round"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-4xl font-black text-white">85</span>
                  <span class="text-[10px] font-bold text-slate-500 uppercase">健康评分</span>
                </div>
              </div>
              <div class="space-y-5">
                <div class="flex items-center gap-4">
                  <div class="size-3 rounded-full bg-primary shadow-lg shadow-primary/40"></div>
                  <div>
                    <span class="block font-bold text-white text-sm">营养摄入达成</span>
                    <span class="text-primary font-bold text-[10px] uppercase">营养汪 正在调配</span>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="size-3 rounded-full bg-accent-mint shadow-lg shadow-accent-mint/40"></div>
                  <div>
                    <span class="block font-bold text-white text-sm">生命体征稳定</span>
                    <span class="text-accent-mint font-bold text-[10px] uppercase">宠医博 已扫描</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Token Rewards -->
          <div class="bg-gradient-to-br from-primary via-orange-500 to-red-600 rounded-[2.5rem] p-8 text-black relative overflow-hidden shadow-2xl shadow-primary/20">
            <div class="relative z-10 h-full flex flex-col">
              <h3 class="text-2xl font-black mb-1">数据挖矿奖励</h3>
              <p class="text-sm font-bold text-black/70 mb-8 tracking-wide">自主收益生成中</p>
              <div class="text-6xl font-black tracking-tighter mt-auto">750 $PET</div>
              <p class="text-[10px] mt-2 font-black bg-black/10 inline-block px-3 py-1.5 rounded-lg self-start">下次发放时间: 2小时 45分</p>
              <div class="w-full h-3 bg-black/20 rounded-full mt-6 overflow-hidden">
                <div class="bg-white h-full w-[75%] shadow-xl"></div>
              </div>
            </div>
            <span class="material-symbols-outlined absolute -right-8 -bottom-8 text-black/10 text-[12rem] pointer-events-none">token</span>
          </div>
        </div>

        <!-- Reasoning Log -->
        <section class="glass-card rounded-[2.5rem] p-8 flex-1">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-3xl font-black">neurology</span>
              <h3 class="text-xl font-black text-white tracking-tight">
                系统自主决策流
                <span class="text-slate-500 font-medium ml-2 text-sm">(Autonomous Log)</span>
              </h3>
            </div>
            <span class="flex items-center gap-2 text-[10px] font-black text-accent-mint px-3 py-1.5 bg-accent-mint/10 border border-accent-mint/30 rounded-full">
              <span class="size-1.5 rounded-full bg-accent-mint animate-pulse"></span>
              实时流
            </span>
          </div>
          <div class="space-y-6 font-mono text-sm">
            <div
              v-for="log in logs"
              :key="log.id"
              class="flex gap-6 items-start border-b border-white/10 pb-5 last:border-0 last:pb-0"
            >
              <span class="text-primary font-bold whitespace-nowrap bg-primary/5 px-2 py-1 rounded">[{{ log.timestamp }}]</span>
              <p class="text-slate-200 leading-relaxed">
                <span
                  class="font-black px-1.5 py-0.5 rounded border border-white/20 mr-2"
                  :style="{ color: log.agentColor }"
                >
                  {{ log.agentName }}
                </span>
                {{ log.message }}
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- Sidebar / Agent Status -->
      <div class="xl:col-span-4 flex flex-col gap-8">
        <div class="glass-card rounded-[3rem] p-8 flex flex-col gap-8 sticky top-32 shadow-2xl">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-black flex items-center gap-3 text-white">
              智能助手中心
              <span class="flex size-3 rounded-full bg-accent-mint animate-pulse shadow-[0_0_10px_#22d3ee]"></span>
            </h2>
            <button class="text-slate-500 hover:text-primary transition-colors">
              <span class="material-symbols-outlined">more_horiz</span>
            </button>
          </div>

          <div class="space-y-4">
            <div
              v-for="agent in agents"
              :key="agent.id"
              class="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <div class="flex items-center justify-between mb-5">
                <div class="flex items-center gap-4">
                  <div
                    class="size-14 rounded-2xl flex items-center justify-center text-black shadow-lg"
                    :style="{ backgroundColor: agent.color }"
                  >
                    <span class="material-symbols-outlined text-3xl font-black">{{ agent.icon }}</span>
                  </div>
                  <div>
                    <h4 class="text-lg font-bold text-white">{{ agent.name }}</h4>
                    <p class="text-[10px] text-slate-400 uppercase tracking-widest font-black">{{ agent.role }}</p>
                  </div>
                </div>
                <div
                  :class="[
                    'px-3 py-1 rounded-full font-black text-[10px]',
                    agent.status === 'running' ? 'bg-accent-mint text-black' : 'bg-primary text-black'
                  ]"
                >
                  {{ agent.status === 'running' ? '运行中' : '分析中' }}
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex justify-between text-[11px] font-black text-slate-500">
                  <span>上次状态更新</span>
                  <span class="text-white">{{ agent.lastAction }}</span>
                </div>
                <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    class="h-full transition-all duration-1000"
                    :style="{
                      width: agent.status === 'running' ? '100%' : '65%',
                      backgroundColor: agent.color
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <button class="w-full py-5 bg-primary text-black font-black text-lg rounded-3xl hover:bg-white hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group mt-4">
            <span class="material-symbols-outlined font-black group-hover:rotate-90 transition-transform">add</span>
            部署新智能助手
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Pet } from '../types/pet-management'
import { MOCK_PETS, MOCK_AGENTS, MOCK_LOGS } from '../constants/mock-data'

const pets = ref(MOCK_PETS)
const agents = ref(MOCK_AGENTS)
const logs = ref(MOCK_LOGS)

const selectPet = (pet: Pet) => {
  console.log('Selected pet:', pet)
  // TODO: Navigate to pet detail page
}
</script>

<style scoped>
.glass-card {
  @apply bg-slate-900/60 backdrop-blur-xl border border-white/10;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-primary/20 rounded-full hover:bg-primary/40 transition-colors;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-in-from-bottom {
  from {
    transform: translateY(1rem);
  }
  to {
    transform: translateY(0);
  }
}

.animate-in {
  animation: fade-in 0.5s ease-out, slide-in-from-bottom 0.5s ease-out;
}
</style>
