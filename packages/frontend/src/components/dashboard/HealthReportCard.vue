<template>
  <div class="glass-card rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 bg-gradient-to-br from-accent-mint/10 to-transparent pointer-events-none"></div>

    <div class="relative z-10">
      <!-- 标题 -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-black text-white flex items-center gap-3">
          <span class="material-symbols-outlined text-3xl text-accent-mint">monitor_heart</span>
          健康日报
        </h3>
        <button class="text-slate-400 hover:text-white transition-colors">
          <span class="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      <!-- 健康评分圆环 -->
      <div class="flex items-center justify-center mb-8">
        <div class="relative">
          <!-- 圆环背景 -->
          <svg class="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="rgba(255, 255, 255, 0.05)"
              stroke-width="16"
              fill="none"
            />
            <!-- 进度圆环 -->
            <circle
              cx="96"
              cy="96"
              r="88"
              :stroke="scoreColor"
              stroke-width="16"
              fill="none"
              :stroke-dasharray="`${circumference}`"
              :stroke-dashoffset="dashOffset"
              stroke-linecap="round"
              class="transition-all duration-1000 ease-out"
              style="filter: drop-shadow(0 0 8px currentColor)"
            />
          </svg>

          <!-- 中心分数 -->
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <div class="text-6xl font-black text-white">{{ healthScore }}</div>
            <div class="text-sm text-slate-400 font-bold uppercase tracking-wider">健康分</div>
          </div>
        </div>
      </div>

      <!-- 状态标签 -->
      <div class="flex items-center justify-center gap-2 mb-6">
        <span
          :class="[
            'px-4 py-2 rounded-full text-sm font-black',
            healthScore >= 80 ? 'bg-accent-mint text-black' :
            healthScore >= 60 ? 'bg-primary text-black' :
            'bg-red-500 text-white'
          ]"
        >
          {{ healthStatus }}
        </span>
      </div>

      <!-- 指标详情 -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-400 font-bold">饮食</span>
          <span class="text-white font-black">优秀</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-400 font-bold">运动</span>
          <span class="text-white font-black">良好</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-400 font-bold">睡眠</span>
          <span class="text-white font-black">正常</span>
        </div>
      </div>

      <!-- 查看详情按钮 -->
      <button class="w-full mt-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all hover:scale-105 flex items-center justify-center gap-2">
        <span>查看详细报告</span>
        <span class="material-symbols-outlined text-lg">arrow_forward</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  healthScore: number
}>()

const circumference = 2 * Math.PI * 88

const dashOffset = computed(() => {
  return circumference - (props.healthScore / 100) * circumference
})

const scoreColor = computed(() => {
  if (props.healthScore >= 80) return '#22d3ee'  // accent-mint
  if (props.healthScore >= 60) return '#ee8c2b'  // primary
  return '#ef4444'  // red
})

const healthStatus = computed(() => {
  if (props.healthScore >= 80) return '健康优秀'
  if (props.healthScore >= 60) return '健康良好'
  return '需要关注'
})
</script>
