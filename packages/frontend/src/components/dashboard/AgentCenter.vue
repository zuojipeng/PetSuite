<template>
  <div class="glass-card rounded-[3rem] p-8 flex flex-col gap-8 sticky top-32 shadow-2xl">
    <!-- 标题 -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-black flex items-center gap-3 text-white">
        智能助手中心
        <span class="flex size-3 rounded-full bg-accent-mint animate-pulse shadow-[0_0_10px_#22d3ee]"></span>
      </h2>
      <button class="text-slate-500 hover:text-primary transition-colors">
        <span class="material-symbols-outlined">more_horiz</span>
      </button>
    </div>

    <!-- 智能体列表 -->
    <div class="space-y-4">
      <AgentCard
        v-for="agent in agents"
        :key="agent.id"
        :agent="agent"
      />
    </div>

    <!-- 部署新智能助手按钮 -->
    <button
      class="w-full py-5 bg-primary text-black font-black text-lg rounded-3xl hover:bg-white hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group mt-4"
    >
      <span class="material-symbols-outlined font-black group-hover:rotate-90 transition-transform">add</span>
      部署新智能助手
    </button>
  </div>
</template>

<script setup lang="ts">
import AgentCard from './AgentCard.vue'

interface Agent {
  id: string
  name: string
  role: string
  status: 'running' | 'analyzing' | 'idle' | 'error'
  lastAction: string
  icon: string
  color: string
}

defineProps<{
  agents: Agent[]
}>()
</script>
