<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-12">
      <div>
        <h1 class="text-6xl md:text-7xl font-black text-warm-dark mb-4 tracking-tight leading-none">
          我的萌宠 🐾
        </h1>
        <p class="text-xl text-warm-text/70 font-medium">管理您的宠物档案，让AI帮助照顾它们</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="flex items-center gap-3 bg-gradient-to-r from-primary to-accent text-white px-10 py-5 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 font-black text-lg shadow-lg shadow-primary/30"
      >
        <span class="text-2xl">➕</span>
        添加宠物
      </button>
    </div>

    <!-- Pet List - 温暖卡片设计 -->
    <div v-if="pets.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="pet in pets"
        :key="pet.id"
        class="bg-white/80 backdrop-blur-sm rounded-[2rem] hover:bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-warm-gray group hover:scale-105"
        @click="viewPetDetail(pet)"
      >
        <div class="h-56 bg-gradient-to-br from-peach to-primary-light flex items-center justify-center group-hover:scale-105 transition-transform">
          <span class="text-9xl">{{ pet.species === 'cat' ? '🐱' : '🐶' }}</span>
        </div>
        <div class="p-8">
          <h3 class="text-3xl font-black text-warm-dark mb-3">{{ pet.name }}</h3>
          <div class="space-y-3 text-base text-warm-text/80 font-medium">
            <p><strong class="text-warm-dark">品种:</strong> {{ pet.breed || '未知' }}</p>
            <p><strong class="text-warm-dark">年龄:</strong> {{ pet.age || '未知' }} 岁</p>
            <div class="flex items-center justify-between mt-6 pt-4 border-t-2 border-warm-gray">
              <div>
                <p class="text-sm text-warm-text/60 mb-1">健康评分</p>
                <p class="text-3xl font-black text-primary">{{ pet.healthScore || 0 }}/100</p>
              </div>
              <button
                @click.stop="navigateToRecommendations(pet)"
                class="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary-dark transition-all font-black text-sm shadow-lg hover:scale-105"
              >
                获取推荐 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State - 温暖设计 -->
    <div v-else class="bg-white/80 backdrop-blur-sm rounded-[2rem] p-16 text-center border-2 border-warm-gray">
      <div class="text-9xl mb-8">🐾</div>
      <h3 class="text-4xl font-black text-warm-dark mb-4">还没有宠物档案</h3>
      <p class="text-xl text-warm-text/60 mb-8 font-medium">创建您的第一个宠物档案，开始使用AI智能推荐</p>
      <button
        @click="showCreateModal = true"
        class="bg-gradient-to-r from-primary to-accent text-white px-12 py-5 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 font-black text-lg shadow-lg shadow-primary/30"
      >
        添加我的宠物
      </button>
    </div>

    <!-- Create Pet Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeCreateModal"
    >
      <div class="bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-warm-gray">
        <div class="sticky top-0 bg-gradient-to-r from-primary-light to-primary border-b-2 border-warm-gray px-8 py-6 flex items-center justify-between rounded-t-[2rem]">
          <h2 class="text-3xl font-black text-white">添加宠物档案 🐾</h2>
          <button
            @click="closeCreateModal"
            class="text-white/80 hover:text-white text-3xl hover:scale-110 transition-transform"
          >
            ✕
          </button>
        </div>

        <div class="p-6">
          <!-- Step Indicator -->
          <div class="flex items-center justify-between mb-8">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="flex-1 flex items-center"
            >
              <div class="flex flex-col items-center flex-1">
                <div
                  :class="[
                    'w-14 h-14 rounded-full flex items-center justify-center font-black text-lg shadow-lg transition-all duration-300',
                    currentStep >= index + 1
                      ? 'bg-gradient-to-br from-primary to-accent text-white scale-110'
                      : 'bg-warm-gray text-warm-text/40'
                  ]"
                >
                  {{ index + 1 }}
                </div>
                <p
                  :class="[
                    'text-sm mt-3 text-center font-bold',
                    currentStep >= index + 1 ? 'text-primary' : 'text-warm-text/40'
                  ]"
                >
                  {{ step }}
                </p>
              </div>
              <div
                v-if="index < steps.length - 1"
                :class="[
                  'h-2 flex-1 mx-4 rounded-full transition-all duration-300',
                  currentStep > index + 1 ? 'bg-gradient-to-r from-primary to-accent' : 'bg-warm-gray'
                ]"
              ></div>
            </div>
          </div>

          <!-- Step 1: Basic Info -->
          <form v-if="currentStep === 1" @submit.prevent="nextStep" class="space-y-8">
            <div>
              <label class="block text-lg font-black text-warm-dark mb-3">宠物名称 *</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-6 py-4 border-2 border-warm-gray rounded-2xl focus:ring-4 focus:ring-primary/30 focus:border-primary transition-all text-lg font-medium bg-warm-bg"
                placeholder="例如：布丁"
              />
            </div>

            <div>
              <label class="block text-lg font-black text-warm-dark mb-3">物种 *</label>
              <div class="grid grid-cols-2 gap-6">
                <button
                  type="button"
                  @click="form.species = 'cat'"
                  :class="[
                    'p-8 border-4 rounded-3xl text-center transition-all duration-300 hover:scale-105',
                    form.species === 'cat'
                      ? 'border-primary bg-gradient-to-br from-peach to-primary-light shadow-xl shadow-primary/30'
                      : 'border-warm-gray bg-white/50 hover:border-primary/50'
                  ]"
                >
                  <div class="text-6xl mb-3">🐱</div>
                  <div class="font-black text-xl text-warm-dark">猫</div>
                </button>
                <button
                  type="button"
                  @click="form.species = 'dog'"
                  :class="[
                    'p-8 border-4 rounded-3xl text-center transition-all duration-300 hover:scale-105',
                    form.species === 'dog'
                      ? 'border-primary bg-gradient-to-br from-peach to-primary-light shadow-xl shadow-primary/30'
                      : 'border-warm-gray bg-white/50 hover:border-primary/50'
                  ]"
                >
                  <div class="text-6xl mb-3">🐶</div>
                  <div class="font-black text-xl text-warm-dark">狗</div>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-lg font-black text-warm-dark mb-3">年龄（岁）</label>
              <input
                v-model.number="form.age"
                type="number"
                min="0"
                max="30"
                class="w-full px-6 py-4 border-2 border-warm-gray rounded-2xl focus:ring-4 focus:ring-primary/30 focus:border-primary transition-all text-lg font-medium bg-warm-bg"
                placeholder="例如：3"
              />
            </div>

            <div>
              <label class="block text-lg font-black text-warm-dark mb-3">品种（可选）</label>
              <input
                v-model="form.breed"
                type="text"
                class="w-full px-6 py-4 border-2 border-warm-gray rounded-2xl focus:ring-4 focus:ring-primary/30 focus:border-primary transition-all text-lg font-medium bg-warm-bg"
                placeholder="例如：英短、柯基"
              />
            </div>

            <div class="flex justify-end gap-6 pt-4">
              <button
                type="button"
                @click="closeCreateModal"
                class="px-10 py-4 border-2 border-warm-gray bg-white rounded-full hover:bg-warm-gray transition-all font-black text-base text-warm-dark hover:scale-105"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="!form.name || !form.species"
                class="px-10 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-full hover:shadow-2xl transition-all font-black text-base disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg shadow-primary/30"
              >
                下一步 →
              </button>
            </div>
          </form>

          <!-- Step 2: Health Status -->
          <form v-if="currentStep === 2" @submit.prevent="nextStep" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">健康状况描述</label>
              <textarea
                v-model="form.healthDescription"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="描述宠物的健康状况，如已知疾病、过敏史、体重等..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">饮食偏好</label>
              <textarea
                v-model="form.dietPreferences"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="描述饮食习惯、喜好、禁忌等..."
              ></textarea>
            </div>

            <div class="flex justify-end gap-4">
              <button
                type="button"
                @click="currentStep = 1"
                class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                上一步
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                下一步
              </button>
            </div>
          </form>

          <!-- Step 3: Personality & Habits -->
          <form v-if="currentStep === 3" @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">性格特点</label>
              <textarea
                v-model="form.personality"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="描述宠物的性格，如活泼、安静、粘人等..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">生活习惯与其他信息</label>
              <textarea
                v-model="form.habits"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="描述日常习惯、活动水平、社交情况等..."
              ></textarea>
            </div>

            <!-- AI Smart Fill -->
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-purple-600">auto_awesome</span>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900 mb-1">AI 智能填写</h4>
                  <p class="text-sm text-gray-600 mb-3">识别品种、估算年龄，并补充个性与习惯建议</p>
                  <button
                    type="button"
                    @click="aiSmartFill"
                    :disabled="aiLoading"
                    class="text-sm bg-white border border-purple-300 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition disabled:opacity-50"
                  >
                    {{ aiLoading ? '分析中...' : '使用 AI 智能填写' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-4">
              <button
                type="button"
                @click="currentStep = 2"
                class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                上一步
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? '创建中...' : '完成创建' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../store'

const router = useRouter()
const store = useAppStore()

const pets = ref<any[]>([])
const showCreateModal = ref(false)
const currentStep = ref(1)
const loading = ref(false)
const aiLoading = ref(false)

const steps = ['基本信息', '健康状况', '个性习惯']

const form = ref({
  name: '',
  species: '',
  breed: '',
  age: null,
  healthDescription: '',
  dietPreferences: '',
  personality: '',
  habits: ''
})

const loadPets = () => {
  // Load pets from localStorage or API
  const stored = localStorage.getItem('petsuite_pets')
  if (stored) {
    pets.value = JSON.parse(stored)
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  currentStep.value = 1
  form.value = {
    name: '',
    species: '',
    breed: '',
    age: null,
    healthDescription: '',
    dietPreferences: '',
    personality: '',
    habits: ''
  }
}

const nextStep = () => {
  currentStep.value++
}

const aiSmartFill = async () => {
  aiLoading.value = true
  // Simulate AI processing
  setTimeout(() => {
    if (!form.value.breed) {
      form.value.breed = form.value.species === 'cat' ? '英短' : '柴犬'
    }
    if (!form.value.age) {
      form.value.age = form.value.species === 'cat' ? 2 : 3
    }
    if (!form.value.personality) {
      form.value.personality = `根据${form.value.species === 'cat' ? '猫' : '狗'}的品种特征，建议关注其性格特点...`
    }
    if (!form.value.habits) {
      form.value.habits = `建议每天适量运动，保持健康的生活习惯...`
    }
    aiLoading.value = false
  }, 1500)
}

const handleSubmit = async () => {
  loading.value = true

  try {
    // Create full description for AI analysis
    const description = `
      ${form.value.name}是一只${form.value.age || '未知年龄'}岁的${form.value.species === 'cat' ? '猫' : '狗'}（${form.value.breed || '品种未确定'}）。
      健康状况：${form.value.healthDescription || '未提供'}
      饮食偏好：${form.value.dietPreferences || '未提供'}
      性格特点：${form.value.personality || '未提供'}
      生活习惯：${form.value.habits || '未提供'}
    `.trim()

    // TODO: Call backend API to create profile
    // For now, simulate success
    const newPet = {
      id: Date.now().toString(),
      name: form.value.name,
      species: form.value.species,
      age: form.value.age,
      breed: form.value.breed || '待AI识别',
      healthScore: Math.floor(Math.random() * 20) + 80,
      description,
      createdAt: new Date().toISOString()
    }

    pets.value.push(newPet)
    localStorage.setItem('petsuite_pets', JSON.stringify(pets.value))
    localStorage.setItem('petsuite_current_pet', JSON.stringify(newPet))
    store.setPetProfile(newPet)

    // Close modal and navigate to recommendations
    closeCreateModal()

    // Show success message
    alert('宠物档案创建成功！正在跳转到智能推荐页面...')

    // Navigate to AI recommendations
    setTimeout(() => {
      router.push('/ai-advisor')
    }, 500)
  } catch (error) {
    console.error('Failed to create pet profile:', error)
    alert('创建失败，请重试')
  } finally {
    loading.value = false
  }
}

const viewPetDetail = (pet: any) => {
  localStorage.setItem('petsuite_current_pet', JSON.stringify(pet))
  store.setPetProfile(pet)
  // TODO: Navigate to pet detail page or show detail modal
  console.log('View pet detail:', pet)
}

const navigateToRecommendations = (pet: any) => {
  localStorage.setItem('petsuite_current_pet', JSON.stringify(pet))
  store.setPetProfile(pet)
  router.push('/ai-advisor')
}

onMounted(() => {
  loadPets()
})
</script>
