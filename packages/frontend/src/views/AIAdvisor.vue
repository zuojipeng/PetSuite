<template>
  <div class="max-w-5xl mx-auto py-8">
    <!-- Header - 温暖友好设计 -->
    <div class="mb-12">
      <h1 class="text-6xl md:text-7xl font-black text-warm-dark mb-4 tracking-tight leading-none">
        AI 智能助手 🤖
      </h1>
      <p class="text-xl text-warm-text/70 font-medium">让AI帮您找到最适合宠物的产品和建议</p>
    </div>

    <!-- Pet Profile Selection -->
    <div class="bg-gradient-to-r from-secondary/20 to-primary/20 backdrop-blur-sm p-8 rounded-[2rem] mb-8 border-2 border-warm-gray" v-if="!petProfile">
      <div class="flex items-start gap-4">
        <span class="text-4xl">⚠️</span>
        <div>
          <p class="text-lg font-bold text-warm-dark mb-2">
            {{ t('aiAdvisor.warning') }}
          </p>
          <router-link to="/create-profile" class="text-primary hover:text-primary-dark font-black underline text-lg">
            {{ t('aiAdvisor.createProfileLink') }} →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Current Profile Card -->
    <div v-else class="bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] mb-8 border-2 border-warm-gray shadow-lg">
      <div class="flex items-center gap-6">
        <div class="text-7xl">{{ petProfile.species === 'cat' ? '🐱' : '🐶' }}</div>
        <div class="flex-1">
          <h2 class="text-sm font-black text-warm-text/60 uppercase tracking-wider mb-1">{{ t('aiAdvisor.currentProfile') }}</h2>
          <p class="text-3xl font-black text-warm-dark mb-2">{{ petProfile.name }}</p>
          <p class="text-base text-warm-text/70 font-medium">{{ petProfile.species }} · {{ petProfile.breed }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-warm-text/60 font-bold mb-1">{{ t('aiAdvisor.healthScore') }}</p>
          <p class="text-4xl font-black text-primary">{{ petProfile.healthScore }}/100</p>
        </div>
      </div>
    </div>

    <!-- Query Form -->
    <div class="bg-white/80 backdrop-blur-sm p-10 rounded-[2rem] mb-8 border-2 border-warm-gray shadow-lg">
      <form @submit.prevent="handleQuery" class="space-y-8">
        <!-- Quick Questions -->
        <div v-if="petProfile">
          <p class="text-lg font-black text-warm-dark mb-4">💡 快速提问</p>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="question in quickQuestions"
              :key="question"
              type="button"
              class="px-6 py-3 rounded-full text-base border-2 border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-bold hover:scale-105"
              @click="applyQuickQuestion(question)"
            >
              {{ question }}
            </button>
          </div>
        </div>

        <!-- Main Query -->
        <div>
          <label class="block text-2xl font-black text-warm-dark mb-4">
            {{ t('aiAdvisor.form.label') }}
          </label>
          <textarea
            v-model="query"
            rows="4"
            class="w-full px-6 py-4 border-2 border-warm-gray rounded-2xl focus:ring-4 focus:ring-primary/30 focus:border-primary transition-all text-lg font-medium bg-warm-bg resize-none"
            :placeholder="t('aiAdvisor.form.placeholder')"
            :disabled="!petProfile"
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="loading || !petProfile || !query.trim()"
          class="w-full bg-gradient-to-r from-primary to-accent text-white py-5 rounded-full font-black text-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg shadow-primary/30"
        >
          {{ loading ? t('aiAdvisor.form.submitting') : t('aiAdvisor.form.submit') }}
        </button>
      </form>
    </div>

    <!-- AI Reasoning Process (显示推理过程) -->
    <div v-if="loading || result?.reasoning" class="bg-white/80 backdrop-blur-sm p-10 rounded-[2rem] mb-8 border-2 border-warm-gray shadow-lg">
      <h2 class="text-4xl font-black text-warm-dark mb-6">🧠 AI 推理过程</h2>

      <!-- Loading State - 推理步骤 -->
      <div v-if="loading" class="space-y-4">
        <div v-for="(step, idx) in reasoningSteps" :key="idx"
             class="flex items-start gap-4 p-6 rounded-2xl transition-all"
             :class="step.status === 'completed' ? 'bg-soft-green/10' : step.status === 'active' ? 'bg-primary/10 animate-pulse' : 'bg-warm-bg/50'">
          <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
               :class="step.status === 'completed' ? 'bg-soft-green text-white' : step.status === 'active' ? 'bg-primary text-white' : 'bg-warm-gray text-warm-text'">
            <span v-if="step.status === 'completed'">✓</span>
            <span v-else-if="step.status === 'active'">⏳</span>
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <div class="flex-1">
            <p class="text-lg font-black text-warm-dark mb-1">{{ step.title }}</p>
            <p class="text-base text-warm-text/70 font-medium">{{ step.description }}</p>
          </div>
        </div>
      </div>

      <!-- Completed Reasoning Tree -->
      <div v-else-if="result?.reasoning?.root" class="space-y-4">
        <div class="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-2xl border-2 border-primary/30">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-black">
              🎯
            </div>
            <div class="flex-1">
              <p class="text-xl font-black text-warm-dark mb-2">{{ result.reasoning.root.content }}</p>
              <div class="flex items-center gap-4 text-sm">
                <span class="px-3 py-1 bg-white/60 rounded-full font-bold text-warm-dark">
                  置信度: {{ (result.reasoning.root.confidence * 100).toFixed(0) }}%
                </span>
                <span class="text-warm-text/60 font-medium">
                  分析节点: {{ result.reasoning.totalNodes }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Child reasoning nodes -->
        <div v-if="result.reasoning.root.children?.length" class="ml-12 space-y-3">
          <div v-for="(child, idx) in result.reasoning.root.children" :key="child.id"
               class="flex items-start gap-4 p-5 rounded-xl bg-warm-bg border-l-4 border-primary/40">
            <div class="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black text-sm">
              {{ idx + 1 }}
            </div>
            <div class="flex-1">
              <p class="text-base font-bold text-warm-dark mb-1">{{ child.content }}</p>
              <div class="inline-block px-2 py-1 bg-primary/10 rounded text-xs font-bold text-primary">
                {{ (child.confidence * 100).toFixed(0) }}% 匹配
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="result" class="space-y-8">
      <!-- Top Recommendation -->
      <div v-if="topRecommendation" class="bg-gradient-to-br from-primary-light to-primary rounded-[2rem] p-10 shadow-2xl text-white">
        <div class="flex items-start justify-between gap-6 mb-8">
          <div>
            <p class="text-sm font-black uppercase tracking-widest mb-2 text-white/80">{{ t('aiAdvisor.result.summaryTitle') }}</p>
            <h2 class="text-5xl font-black mb-3">{{ topRecommendation.product.name }}</h2>
            <p class="text-xl text-white/90 font-medium">{{ topRecommendation.product.brand }} · ${{ topRecommendation.product.price }}</p>
          </div>
          <span
            class="px-6 py-3 rounded-full text-base font-black shadow-lg text-white"
            :class="{
              'bg-soft-green': topRecommendation.suitability === 'high',
              'bg-secondary': topRecommendation.suitability === 'medium',
              'bg-warm-gray': topRecommendation.suitability === 'low',
            }"
          >
            {{ topRecommendation.suitability.toUpperCase() }}
          </span>
        </div>

        <p class="text-lg text-white/90 font-medium mb-8">
          {{ topRecommendation.reasoning.matchDetails }}
        </p>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <p class="text-sm font-black uppercase tracking-wider mb-3 text-white/90">✓ {{ t('aiAdvisor.result.keyPros') }}</p>
            <ul class="space-y-2">
              <li v-for="(pro, i) in (topRecommendation.reasoning?.pros || []).slice(0, 3)" :key="i" class="text-base text-white/90 font-medium flex items-start gap-2">
                <span class="text-soft-green text-xl">•</span>
                <span>{{ pro }}</span>
              </li>
            </ul>
          </div>
          <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
            <p class="text-sm font-black uppercase tracking-wider mb-3 text-white/90">⚠ {{ t('aiAdvisor.result.keyCons') }}</p>
            <ul class="space-y-2">
              <li v-for="(con, i) in (topRecommendation.reasoning?.cons || []).slice(0, 2)" :key="i" class="text-base text-white/90 font-medium flex items-start gap-2">
                <span class="text-accent-coral text-xl">•</span>
                <span>{{ con }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- All Recommendations -->
      <div class="bg-white/80 backdrop-blur-sm p-10 rounded-[2rem] border-2 border-warm-gray shadow-lg">
        <h2 class="text-4xl font-black text-warm-dark mb-8">{{ t('aiAdvisor.result.recommendations') }}</h2>

        <div v-if="result.data.recommendations?.length" class="space-y-6">
          <div
            v-for="rec in result.data.recommendations"
            :key="rec.rank"
            class="border-4 rounded-3xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            :class="{
              'border-soft-green bg-gradient-to-br from-soft-green/10 to-soft-green/5': rec.suitability === 'high',
              'border-secondary bg-gradient-to-br from-secondary/10 to-secondary/5': rec.suitability === 'medium',
              'border-warm-gray bg-warm-bg': rec.suitability === 'low',
            }"
          >
            <div class="flex justify-between items-start mb-6">
              <div class="flex-1">
                <h3 class="text-3xl font-black text-warm-dark mb-2">
                  #{{ rec.rank }} {{ rec.product.name }}
                </h3>
                <p class="text-lg text-warm-text/70 font-medium">
                  {{ rec.product.brand }} · ${{ rec.product.price }}
                </p>
              </div>
              <span
                class="px-5 py-2 rounded-full text-sm font-black"
                :class="{
                  'bg-soft-green text-white': rec.suitability === 'high',
                  'bg-secondary text-warm-dark': rec.suitability === 'medium',
                  'bg-warm-gray text-warm-text': rec.suitability === 'low',
                }"
              >
                {{ rec.suitability.toUpperCase() }}
              </span>
            </div>

            <!-- Match Score -->
            <div class="mb-6">
              <div class="w-full bg-warm-gray rounded-full h-4">
                <div
                  class="bg-gradient-to-r from-primary to-accent h-4 rounded-full transition-all duration-500"
                  :style="{ width: `${rec.score}%` }"
                ></div>
              </div>
              <p class="text-sm text-warm-text/60 mt-2 font-bold">{{ t('aiAdvisor.result.matchScore') }}: {{ rec.score }}/100</p>
            </div>

            <!-- Reasoning Details -->
            <div class="space-y-4">
              <div v-if="rec.reasoning.pros.length" class="bg-soft-green/10 rounded-2xl p-6">
                <p class="text-base font-black text-warm-dark mb-3">{{ t('aiAdvisor.result.pros') }}:</p>
                <ul class="space-y-2">
                  <li v-for="(pro, i) in rec.reasoning.pros" :key="i" class="text-base text-warm-text flex items-start gap-2 font-medium">
                    <span class="text-soft-green font-bold">✓</span>
                    {{ pro }}
                  </li>
                </ul>
              </div>

              <div v-if="rec.reasoning.cons.length" class="bg-accent-coral/10 rounded-2xl p-6">
                <p class="text-base font-black text-warm-dark mb-3">{{ t('aiAdvisor.result.cons') }}:</p>
                <ul class="space-y-2">
                  <li v-for="(con, i) in rec.reasoning.cons" :key="i" class="text-base text-warm-text flex items-start gap-2 font-medium">
                    <span class="text-accent-coral font-bold">×</span>
                    {{ con }}
                  </li>
                </ul>
              </div>

              <p class="text-base text-warm-text/70 italic font-medium">
                {{ rec.reasoning.matchDetails }}
              </p>
            </div>
          </div>
        </div>

        <!-- Products to Avoid -->
        <div v-if="result.data.avoid?.length" class="mt-8 bg-accent-coral/10 border-2 border-accent-coral/30 p-8 rounded-2xl">
          <h3 class="text-2xl font-black text-warm-dark mb-4">⚠️ {{ t('aiAdvisor.result.productsToAvoid') }}</h3>
          <ul class="space-y-3">
            <li v-for="(item, i) in result.data.avoid" :key="i" class="text-base text-warm-text font-medium">
              <strong class="text-warm-dark">{{ item.product }}</strong> - {{ item.reason }}
            </li>
          </ul>
        </div>

        <!-- General Advice -->
        <div v-if="result.data.generalAdvice" class="mt-8 bg-gradient-to-r from-soft-blue/20 to-primary/10 p-8 rounded-2xl border-2 border-soft-blue/30">
          <h3 class="text-2xl font-black text-warm-dark mb-4">💡 {{ t('aiAdvisor.result.generalAdvice') }}</h3>
          <p class="text-lg text-warm-text leading-relaxed font-medium">{{ result.data.generalAdvice }}</p>
        </div>
      </div>

      <!-- Metadata -->
      <div class="bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] border-2 border-warm-gray">
        <h3 class="text-2xl font-black text-warm-dark mb-6">{{ t('aiAdvisor.result.analysisDetails') }}</h3>
        <div class="grid grid-cols-2 gap-6 text-base">
          <div class="bg-warm-bg rounded-2xl p-6">
            <p class="text-warm-text/60 font-bold mb-2">{{ t('aiAdvisor.result.confidence') }}</p>
            <p class="text-3xl font-black text-primary">{{ (result.confidence * 100).toFixed(0) }}%</p>
          </div>
          <div class="bg-warm-bg rounded-2xl p-6">
            <p class="text-warm-text/60 font-bold mb-2">{{ t('aiAdvisor.result.executionTime') }}</p>
            <p class="text-3xl font-black text-primary">{{ result.metadata.executionTime }}ms</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="bg-accent-coral/20 border-2 border-accent-coral p-8 rounded-2xl">
      <p class="text-lg text-warm-dark font-bold">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAPI } from '../composables/useAPI'
import { useAppStore } from '../store'

const { t } = useI18n()
const api = useAPI()
const store = useAppStore()

const petProfile = computed(() => store.petProfile)

const query = ref('')
const loading = ref(false)
const result = ref<any>(null)
const error = ref('')

// 推理步骤状态管理
const reasoningSteps = ref([
  { title: '分析宠物档案', description: '解析宠物的健康状况、过敏史和饮食限制', status: 'pending' },
  { title: '理解用户需求', description: '提取查询意图和关键需求点', status: 'pending' },
  { title: '匹配产品数据库', description: '在产品库中搜索相关产品', status: 'pending' },
  { title: '评估产品适配性', description: '基于宠物特征评分每个产品', status: 'pending' },
  { title: '生成推荐理由', description: '分析优缺点并生成详细说明', status: 'pending' },
])

// 模拟推理步骤进度
const simulateReasoningProgress = () => {
  reasoningSteps.value.forEach(step => step.status = 'pending')

  const stepDurations = [800, 600, 1000, 1200, 800] // 每步的持续时间
  let totalDelay = 0

  reasoningSteps.value.forEach((step, idx) => {
    setTimeout(() => {
      step.status = 'active'
    }, totalDelay)

    totalDelay += stepDurations[idx]

    setTimeout(() => {
      step.status = 'completed'
    }, totalDelay)
  })
}

const quickQuestions = computed(() => [
  t('aiAdvisor.quickQuestions.food'),
  t('aiAdvisor.quickQuestions.health'),
  t('aiAdvisor.quickQuestions.behavior'),
  t('aiAdvisor.quickQuestions.newPet'),
])

const topRecommendation = computed(() => result.value?.data?.recommendations?.[0] || null)

const applyQuickQuestion = (question: string) => {
  query.value = question
}

const handleQuery = async () => {
  if (!petProfile.value) {
    error.value = t('aiAdvisor.error')
    return
  }

  loading.value = true
  error.value = ''
  result.value = null

  // 开始模拟推理步骤
  simulateReasoningProgress()

  try {
    const response = await api.getRecommendation({
      petProfile: petProfile.value,
      query: query.value,
    })

    if (response.success) {
      result.value = response
      store.addRecommendation(response)
    } else {
      error.value = response.error || t('aiAdvisor.error')
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || t('common.error')
  } finally {
    loading.value = false
  }
}
</script>
