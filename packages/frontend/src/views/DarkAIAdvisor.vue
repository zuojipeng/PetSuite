<template>
  <div class="space-y-8 animate-in fade-in">
    <!-- 页面标题 -->
    <div class="mb-12">
      <div class="flex items-center gap-4 mb-4">
        <div class="size-16 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30">
          <span class="material-symbols-outlined text-4xl text-black font-black">smart_toy</span>
        </div>
        <div>
          <h1 class="text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
            AI 智能顾问
          </h1>
          <p class="text-lg text-slate-400 font-bold mt-2">基于深度学习的宠物健康和产品推荐系统</p>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
      <!-- 左侧主内容 -->
      <div class="xl:col-span-8 space-y-8">
        <!-- 宠物选择 -->
        <PetQuickSelect
          :pets="pets"
          :selected-pet-id="selectedPetId"
          @select="handlePetSelect"
          @add="handleAddPet"
        />

        <!-- AI 查询表单 -->
        <div class="glass-card rounded-[3rem] p-10 shadow-2xl">
          <h2 class="text-3xl font-black text-white mb-6 flex items-center gap-3">
            <span class="material-symbols-outlined text-4xl text-primary">psychology</span>
            向 AI 提问
          </h2>

          <form @submit.prevent="handleQuery" class="space-y-6">
            <!-- 快速问题 -->
            <div v-if="selectedPet">
              <p class="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">快速提问</p>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="question in quickQuestions"
                  :key="question"
                  type="button"
                  class="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-primary hover:border-primary hover:text-black transition-all font-bold text-sm hover:scale-105"
                  @click="query = question"
                >
                  {{ question }}
                </button>
              </div>
            </div>

            <!-- 主查询输入 -->
            <div>
              <label class="block text-lg font-black text-white mb-3">
                您的问题
              </label>
              <textarea
                v-model="query"
                rows="4"
                class="w-full px-6 py-4 bg-black/30 border-2 border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/30 focus:border-primary transition-all text-white placeholder-slate-500 font-medium resize-none"
                placeholder="例如: 我的猫最近食欲不振,应该选择什么样的猫粮?"
                :disabled="!selectedPet"
              ></textarea>
              <p v-if="!selectedPet" class="text-sm text-slate-500 mt-2 font-medium">
                请先选择一个宠物
              </p>
            </div>

            <!-- 提交按钮 -->
            <button
              type="submit"
              :disabled="loading || !selectedPet || !query.trim()"
              class="w-full bg-gradient-to-r from-primary to-accent text-black py-5 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 flex items-center justify-center gap-3"
            >
              <span class="material-symbols-outlined text-2xl">auto_awesome</span>
              <span>{{ loading ? '分析中...' : '获取 AI 建议' }}</span>
            </button>
          </form>
        </div>

        <!-- AI 推荐结果 -->
        <div v-if="result" class="space-y-8">
          <!-- 顶部推荐卡片 -->
          <div v-if="topRecommendation" class="glass-card rounded-[3rem] p-10 shadow-2xl border-2 border-primary/30 relative overflow-hidden">
            <!-- 背景装饰 -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none"></div>

            <div class="relative z-10">
              <div class="flex items-start justify-between gap-6 mb-8">
                <div>
                  <p class="text-sm font-black uppercase tracking-widest mb-2 text-primary">
                    🏆 最佳推荐
                  </p>
                  <h2 class="text-4xl font-black text-white mb-3">{{ topRecommendation.product.name }}</h2>
                  <p class="text-xl text-slate-300 font-medium">
                    {{ topRecommendation.product.brand }} · ${{ topRecommendation.product.price }}
                  </p>
                </div>
                <span
                  class="px-6 py-3 rounded-2xl text-base font-black shadow-lg"
                  :class="{
                    'bg-accent-mint text-black': topRecommendation.suitability === 'high',
                    'bg-primary text-black': topRecommendation.suitability === 'medium',
                    'bg-slate-600 text-white': topRecommendation.suitability === 'low',
                  }"
                >
                  {{ getSuitabilityText(topRecommendation.suitability) }}
                </span>
              </div>

              <p class="text-lg text-slate-300 font-medium mb-8 leading-relaxed">
                {{ topRecommendation.reasoning.matchDetails }}
              </p>

              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <p class="text-sm font-black uppercase tracking-wider mb-3 text-accent-mint flex items-center gap-2">
                    <span class="material-symbols-outlined">check_circle</span>
                    优势
                  </p>
                  <ul class="space-y-2">
                    <li v-for="(pro, i) in topRecommendation.reasoning.pros.slice(0, 3)" :key="i" class="text-base text-slate-300 font-medium flex items-start gap-2">
                      <span class="text-accent-mint text-xl">•</span>
                      <span>{{ pro }}</span>
                    </li>
                  </ul>
                </div>
                <div class="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <p class="text-sm font-black uppercase tracking-wider mb-3 text-yellow-400 flex items-center gap-2">
                    <span class="material-symbols-outlined">info</span>
                    注意事项
                  </p>
                  <ul class="space-y-2">
                    <li v-for="(con, i) in topRecommendation.reasoning.cons.slice(0, 2)" :key="i" class="text-base text-slate-300 font-medium flex items-start gap-2">
                      <span class="text-yellow-400 text-xl">•</span>
                      <span>{{ con }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 所有推荐列表 -->
          <div class="glass-card rounded-[3rem] p-10 shadow-2xl">
            <h2 class="text-3xl font-black text-white mb-8 flex items-center gap-3">
              <span class="material-symbols-outlined text-4xl text-primary">list_alt</span>
              全部推荐
            </h2>

            <div class="space-y-6">
              <div
                v-for="rec in result.data.recommendations"
                :key="rec.rank"
                class="bg-white/5 border-2 rounded-3xl p-8 transition-all duration-300 hover:bg-white/10 hover:scale-105"
                :class="{
                  'border-accent-mint': rec.suitability === 'high',
                  'border-primary': rec.suitability === 'medium',
                  'border-white/10': rec.suitability === 'low',
                }"
              >
                <div class="flex justify-between items-start mb-6">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="text-5xl font-black text-primary">{{ rec.rank }}</span>
                      <h3 class="text-2xl font-black text-white">
                        {{ rec.product.name }}
                      </h3>
                    </div>
                    <p class="text-lg text-slate-400 font-medium">
                      {{ rec.product.brand }} · ${{ rec.product.price }}
                    </p>
                  </div>
                  <span
                    class="px-5 py-2 rounded-full text-sm font-black"
                    :class="{
                      'bg-accent-mint text-black': rec.suitability === 'high',
                      'bg-primary text-black': rec.suitability === 'medium',
                      'bg-slate-600 text-white': rec.suitability === 'low',
                    }"
                  >
                    {{ getSuitabilityText(rec.suitability) }}
                  </span>
                </div>

                <!-- 匹配度 -->
                <div class="mb-6">
                  <div class="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      class="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                      :style="{ width: `${rec.score}%` }"
                    ></div>
                  </div>
                  <p class="text-sm text-slate-400 mt-2 font-bold">匹配度: {{ rec.score }}/100</p>
                </div>

                <!-- 推荐详情 -->
                <div class="space-y-4">
                  <div v-if="rec.reasoning.pros.length" class="bg-accent-mint/10 rounded-2xl p-6 border border-accent-mint/20">
                    <p class="text-base font-black text-white mb-3 flex items-center gap-2">
                      <span class="material-symbols-outlined text-accent-mint">check_circle</span>
                      优势
                    </p>
                    <ul class="space-y-2">
                      <li v-for="(pro, i) in rec.reasoning.pros" :key="i" class="text-sm text-slate-300 flex items-start gap-2 font-medium">
                        <span class="text-accent-mint font-bold">✓</span>
                        {{ pro }}
                      </li>
                    </ul>
                  </div>

                  <div v-if="rec.reasoning.cons.length" class="bg-yellow-500/10 rounded-2xl p-6 border border-yellow-500/20">
                    <p class="text-base font-black text-white mb-3 flex items-center gap-2">
                      <span class="material-symbols-outlined text-yellow-400">info</span>
                      注意事项
                    </p>
                    <ul class="space-y-2">
                      <li v-for="(con, i) in rec.reasoning.cons" :key="i" class="text-sm text-slate-300 flex items-start gap-2 font-medium">
                        <span class="text-yellow-400 font-bold">⚠</span>
                        {{ con }}
                      </li>
                    </ul>
                  </div>

                  <p class="text-base text-slate-400 italic font-medium">
                    {{ rec.reasoning.matchDetails }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 避免的产品 -->
            <div v-if="result.data.avoid?.length" class="mt-8 bg-red-500/10 border-2 border-red-500/30 p-8 rounded-3xl">
              <h3 class="text-2xl font-black text-white mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-red-400">warning</span>
                不推荐产品
              </h3>
              <ul class="space-y-3">
                <li v-for="(item, i) in result.data.avoid" :key="i" class="text-base text-slate-300 font-medium">
                  <strong class="text-white">{{ item.product }}</strong> - {{ item.reason }}
                </li>
              </ul>
            </div>

            <!-- 通用建议 -->
            <div v-if="result.data.generalAdvice" class="mt-8 bg-primary/10 p-8 rounded-3xl border-2 border-primary/30">
              <h3 class="text-2xl font-black text-white mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">lightbulb</span>
                通用建议
              </h3>
              <p class="text-lg text-slate-300 leading-relaxed font-medium">{{ result.data.generalAdvice }}</p>
            </div>
          </div>

          <!-- 分析详情 -->
          <div class="glass-card rounded-[3rem] p-8 shadow-2xl">
            <h3 class="text-2xl font-black text-white mb-6">分析详情</h3>
            <div class="grid grid-cols-2 gap-6">
              <div class="bg-white/5 rounded-2xl p-6">
                <p class="text-slate-400 font-bold mb-2 text-sm">置信度</p>
                <p class="text-4xl font-black text-primary">{{ (result.confidence * 100).toFixed(0) }}%</p>
              </div>
              <div class="bg-white/5 rounded-2xl p-6">
                <p class="text-slate-400 font-bold mb-2 text-sm">处理时间</p>
                <p class="text-4xl font-black text-primary">{{ result.metadata.executionTime }}ms</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="glass-card rounded-[3rem] p-8 bg-red-500/10 border-2 border-red-500/30">
          <div class="flex items-center gap-4">
            <span class="material-symbols-outlined text-4xl text-red-400">error</span>
            <div>
              <h3 class="text-xl font-black text-white mb-2">出错了</h3>
              <p class="text-slate-300 font-medium">{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧智能体面板 -->
      <div class="xl:col-span-4">
        <AgentCenter :agents="agents" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAPI } from '../composables/useAPI'
import PetQuickSelect from '../components/dashboard/PetQuickSelect.vue'
import AgentCenter from '../components/dashboard/AgentCenter.vue'

const router = useRouter()
const api = useAPI()

const pets = ref<any[]>([])
const selectedPetId = ref<string>('')
const selectedPet = computed(() => pets.value.find(p => p.id === selectedPetId.value))

const query = ref('')
const loading = ref(false)
const result = ref<any>(null)
const error = ref('')

const quickQuestions = [
  '推荐适合我的宠物的优质猫粮/狗粮',
  '我的宠物最近不太活跃,需要什么营养补充?',
  '有什么适合敏感肠胃的食物?',
  '如何选择适合幼年期的食品?'
]

const agents = ref([
  {
    id: '1',
    name: '宠医博士',
    role: 'AI 健康顾问',
    status: 'running' as const,
    lastAction: '2分钟前',
    icon: 'medical_services',
    color: '#4f46e5'
  },
  {
    id: '2',
    name: '营养专家',
    role: 'AI 营养师',
    status: 'analyzing' as const,
    lastAction: '5分钟前',
    icon: 'restaurant',
    color: '#10b981'
  },
  {
    id: '3',
    name: '行为分析师',
    role: 'AI 行为专家',
    status: 'idle' as const,
    lastAction: '10分钟前',
    icon: 'psychology',
    color: '#ee8c2b'
  }
])

const topRecommendation = computed(() => result.value?.data?.recommendations?.[0] || null)

const handlePetSelect = (pet: any) => {
  selectedPetId.value = pet.id
  console.log('Selected pet:', pet)
}

const handleAddPet = () => {
  router.push({ name: 'DarkMyPets' })
}

const handleQuery = async () => {
  if (!selectedPet.value) {
    error.value = '请先选择一个宠物'
    return
  }

  loading.value = true
  error.value = ''
  result.value = null

  try {
    const response = await api.getRecommendation({
      petProfile: selectedPet.value,
      query: query.value,
    })

    if (response.success) {
      result.value = response
    } else {
      error.value = response.error || '获取推荐失败'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || '请求失败'
  } finally {
    loading.value = false
  }
}

const getSuitabilityText = (suitability: string) => {
  switch (suitability) {
    case 'high':
      return '高度适配'
    case 'medium':
      return '中度适配'
    case 'low':
      return '低度适配'
    default:
      return suitability
  }
}

const loadData = () => {
  const stored = localStorage.getItem('petsuite_pets')
  if (stored) {
    pets.value = JSON.parse(stored)
    if (pets.value.length > 0) {
      selectedPetId.value = pets.value[0].id
    }
  }
}

onMounted(() => {
  loadData()
})
</script>
