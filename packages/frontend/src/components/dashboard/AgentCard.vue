<template>
  <div class="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all group">
    <!-- 头部 -->
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
          statusClass
        ]"
      >
        {{ statusText }}
      </div>
    </div>

    <!-- 详情 -->
    <div class="space-y-3">
      <div class="flex justify-between text-[11px] font-black text-slate-500">
        <span>上次状态更新</span>
        <span class="text-white">{{ agent.lastAction }}</span>
      </div>
      <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          class="h-full transition-all duration-1000"
          :style="{
            width: progressWidth,
            backgroundColor: agent.color
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Agent {
  id: string
  name: string
  role: string
  status: 'running' | 'analyzing' | 'idle' | 'error'
  lastAction: string
  icon: string
  color: string
}

const props = defineProps<{
  agent: Agent
}>()

const statusClass = computed(() => {
  switch (props.agent.status) {
    case 'running':
      return 'bg-accent-mint text-black'
    case 'analyzing':
      return 'bg-primary text-black'
    case 'idle':
      return 'bg-slate-500 text-white'
    case 'error':
      return 'bg-red-500 text-white'
    default:
      return 'bg-slate-500 text-white'
  }
})

const statusText = computed(() => {
  switch (props.agent.status) {
    case 'running':
      return '运行中'
    case 'analyzing':
      return '分析中'
    case 'idle':
      return '待命'
    case 'error':
      return '错误'
    default:
      return '未知'
  }
})

const progressWidth = computed(() => {
  switch (props.agent.status) {
    case 'running':
      return '100%'
    case 'analyzing':
      return '65%'
    case 'idle':
      return '0%'
    case 'error':
      return '100%'
    default:
      return '0%'
  }
})
</script>
