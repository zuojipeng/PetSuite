<template>
  <div class="glass-card rounded-[3rem] p-8 shadow-2xl">
    <!-- 标题 -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-black text-white flex items-center gap-3">
        <span class="material-symbols-outlined text-3xl text-accent-mint">terminal</span>
        系统决策日志
        <span class="flex size-2 rounded-full bg-accent-mint animate-pulse"></span>
      </h2>
      <div class="flex items-center gap-2">
        <button class="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-400 hover:text-white transition-all">
          实时
        </button>
        <button class="text-slate-400 hover:text-white transition-colors">
          <span class="material-symbols-outlined">filter_list</span>
        </button>
      </div>
    </div>

    <!-- 日志流 -->
    <div class="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
      <div
        v-for="log in displayLogs"
        :key="log.id"
        class="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
      >
        <!-- 时间线 -->
        <div class="flex flex-col items-center gap-2 shrink-0">
          <div
            class="size-10 rounded-xl flex items-center justify-center shadow-lg"
            :style="{ backgroundColor: log.agentColor }"
          >
            <span class="material-symbols-outlined text-xl text-black font-black">{{ log.icon }}</span>
          </div>
          <div class="flex-1 w-px bg-white/10"></div>
        </div>

        <!-- 内容 -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-black text-white">{{ log.agentName }}</span>
            <span class="text-[10px] text-slate-500 font-bold">{{ log.timestamp }}</span>
          </div>

          <p class="text-sm text-slate-300 font-medium leading-relaxed mb-2">
            {{ log.message }}
          </p>

          <!-- 日志类型标签 -->
          <div class="flex items-center gap-2">
            <span
              :class="[
                'text-[10px] px-2 py-1 rounded-full font-black uppercase',
                getTypeClass(log.type)
              ]"
            >
              {{ getTypeText(log.type) }}
            </span>

            <!-- 元数据 -->
            <div v-if="log.metadata" class="flex items-center gap-2 text-[10px] text-slate-500">
              <span v-if="log.metadata.txHash" class="flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">link</span>
                {{ log.metadata.txHash.slice(0, 8) }}...
              </span>
              <span v-if="log.metadata.confidence" class="flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">insights</span>
                {{ (log.metadata.confidence * 100).toFixed(0) }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="displayLogs.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4 opacity-30">📝</div>
        <p class="text-slate-400 font-medium">暂无系统日志</p>
      </div>
    </div>

    <!-- 底部统计 -->
    <div class="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs">
      <span class="text-slate-500 font-bold">共 {{ logs.length }} 条日志</span>
      <button class="text-primary hover:text-white font-bold transition-colors flex items-center gap-1">
        <span>查看全部</span>
        <span class="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface LogEntry {
  id: string
  agentId: string
  agentName: string
  agentColor: string
  timestamp: string
  message: string
  type: 'transaction' | 'analysis' | 'info' | 'warning' | 'error'
  icon: string
  metadata?: {
    txHash?: string
    confidence?: number
    [key: string]: any
  }
}

const props = defineProps<{
  logs: LogEntry[]
  maxDisplay?: number
}>()

const displayLogs = computed(() => {
  const max = props.maxDisplay || 5
  return props.logs.slice(0, max)
})

const getTypeClass = (type: string) => {
  switch (type) {
    case 'transaction':
      return 'bg-primary/20 text-primary'
    case 'analysis':
      return 'bg-accent-mint/20 text-accent-mint'
    case 'info':
      return 'bg-blue-500/20 text-blue-400'
    case 'warning':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'error':
      return 'bg-red-500/20 text-red-400'
    default:
      return 'bg-white/10 text-slate-400'
  }
}

const getTypeText = (type: string) => {
  switch (type) {
    case 'transaction':
      return '交易'
    case 'analysis':
      return '分析'
    case 'info':
      return '信息'
    case 'warning':
      return '警告'
    case 'error':
      return '错误'
    default:
      return '未知'
  }
}
</script>
