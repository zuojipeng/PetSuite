<template>
  <div class="glass-card rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
    <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

    <div class="relative z-10">
      <!-- 标题 -->
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-2xl font-black text-white flex items-center gap-3">
          <span class="material-symbols-outlined text-3xl text-primary">toll</span>
          数据挖矿奖励
        </h3>
        <button class="text-slate-400 hover:text-white transition-colors">
          <span class="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      <!-- 奖励金额展示 -->
      <div class="mb-8">
        <div class="flex items-baseline gap-2 mb-2">
          <div class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {{ amount }}
          </div>
          <div class="text-2xl font-black text-slate-400">PET</div>
        </div>
        <p class="text-sm text-slate-400 font-bold">本周累计收益</p>
      </div>

      <!-- 收益趋势 -->
      <div class="bg-black/30 rounded-2xl p-4 mb-6">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs text-slate-400 font-bold uppercase">收益趋势</span>
          <span class="flex items-center gap-1 text-accent-mint text-sm font-black">
            <span class="material-symbols-outlined text-base">trending_up</span>
            +18.5%
          </span>
        </div>

        <!-- 简易趋势图 -->
        <div class="flex items-end justify-between gap-2 h-16">
          <div
            v-for="(value, i) in trendData"
            :key="i"
            class="flex-1 bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all duration-500 hover:opacity-80"
            :style="{ height: `${value}%` }"
          ></div>
        </div>

        <div class="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-bold">
          <span>周一</span>
          <span>周三</span>
          <span>周五</span>
          <span>周日</span>
        </div>
      </div>

      <!-- 挖矿活动 -->
      <div class="space-y-3 mb-6">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-400 font-bold">健康数据上传</span>
          <span class="text-white font-black">+120 PET</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-400 font-bold">AI 分析反馈</span>
          <span class="text-white font-black">+80 PET</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-400 font-bold">社区贡献</span>
          <span class="text-white font-black">+50 PET</span>
        </div>
      </div>

      <!-- 领取按钮 -->
      <button class="w-full py-4 bg-gradient-to-r from-primary to-accent text-black font-black rounded-2xl hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-105 flex items-center justify-center gap-2">
        <span class="material-symbols-outlined">account_balance_wallet</span>
        <span>领取奖励</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  amount: number
}>()

// 模拟趋势数据
const trendData = ref([45, 60, 55, 75, 80, 70, 85])
</script>
