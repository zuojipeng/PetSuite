<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">{{ t('createProfile.title') }}</h1>

    <div class="bg-white p-8 rounded-lg shadow-md">
      <!-- Step Indicator -->
      <div class="flex items-center justify-between mb-8">
        <div v-for="(step, index) in steps" :key="step" class="flex-1 flex items-center">
          <div class="flex flex-col items-center flex-1">
            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                currentStep >= index + 1
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              ]"
            >
              {{ index + 1 }}
            </div>
            <p
              :class="[
                'text-xs mt-2 text-center',
                currentStep >= index + 1 ? 'text-purple-600 font-medium' : 'text-gray-500'
              ]"
            >
              {{ step }}
            </p>
          </div>
          <div
            v-if="index < steps.length - 1"
            :class="[
              'h-1 flex-1 mx-2',
              currentStep > index + 1 ? 'bg-purple-600' : 'bg-gray-200'
            ]"
          ></div>
        </div>
      </div>

      <!-- Step 1: Basic Info -->
      <form v-if="currentStep === 1" @submit.prevent="nextStep" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('createProfile.form.petName') }} *
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            :placeholder="t('createProfile.form.placeholders.name')"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('createProfile.form.species') }} *
          </label>
          <div class="grid grid-cols-2 gap-4">
            <button
              type="button"
              @click="form.species = 'cat'"
              :class="[
                'p-4 border-2 rounded-lg text-center transition',
                form.species === 'cat'
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-300'
              ]"
            >
              <div class="text-4xl mb-2">🐱</div>
              <div class="font-medium">{{ t('createProfile.form.cat') }}</div>
            </button>
            <button
              type="button"
              @click="form.species = 'dog'"
              :class="[
                'p-4 border-2 rounded-lg text-center transition',
                form.species === 'dog'
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-300'
              ]"
            >
              <div class="text-4xl mb-2">🐶</div>
              <div class="font-medium">{{ t('createProfile.form.dog') }}</div>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('createProfile.form.breed') }}
          </label>
          <input
            v-model="form.breed"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            :placeholder="t('createProfile.form.placeholders.breed')"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('createProfile.form.age') }}
          </label>
          <input
            v-model.number="form.age"
            type="number"
            min="0"
            max="30"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            :placeholder="t('createProfile.form.placeholders.age')"
          />
        </div>

        <div class="flex justify-end gap-4">
          <button
            type="submit"
            :disabled="!form.name || !form.species"
            class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('createProfile.form.next') }}
          </button>
        </div>
      </form>

      <!-- Step 2: Health Status -->
      <form v-if="currentStep === 2" @submit.prevent="nextStep" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('createProfile.form.healthDescription') }}
          </label>
          <textarea
            v-model="form.healthDescription"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            :placeholder="t('createProfile.form.placeholders.healthDescription')"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('createProfile.form.dietPreferences') }}
          </label>
          <textarea
            v-model="form.dietPreferences"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            :placeholder="t('createProfile.form.placeholders.dietPreferences')"
          ></textarea>
        </div>

        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="currentStep = 1"
            class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            {{ t('createProfile.form.back') }}
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            {{ t('createProfile.form.next') }}
          </button>
        </div>
      </form>

      <!-- Step 3: Personality & Habits -->
      <form v-if="currentStep === 3" @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('createProfile.form.personality') }}
          </label>
          <textarea
            v-model="form.personality"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            :placeholder="t('createProfile.form.placeholders.personality')"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ t('createProfile.form.habits') }}
          </label>
          <textarea
            v-model="form.habits"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            :placeholder="t('createProfile.form.placeholders.habits')"
          ></textarea>
        </div>

        <!-- AI Smart Fill -->
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-purple-600">auto_awesome</span>
            <div class="flex-1">
              <h4 class="font-medium text-gray-900 mb-1">{{ t('createProfile.aiFill.title') }}</h4>
              <p class="text-sm text-gray-600 mb-3">{{ t('createProfile.aiFill.description') }}</p>
              <button
                type="button"
                @click="aiSmartFill"
                :disabled="aiLoading || !form.species"
                class="text-sm bg-white border border-purple-300 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition disabled:opacity-50"
              >
                {{ aiLoading ? t('createProfile.aiFill.loading') : t('createProfile.aiFill.button') }}
              </button>
              <p v-if="aiSuggestion" class="text-xs text-purple-700 mt-3">
                {{ aiSuggestion }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <button
            type="button"
            @click="currentStep = 2"
            class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            {{ t('createProfile.form.back') }}
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? t('createProfile.form.submitting') : t('createProfile.form.submit') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Error -->
    <div v-if="error" class="mt-6 bg-red-50 p-4 rounded-lg">
      <p class="text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAPI } from '../composables/useAPI'
import { useAppStore } from '../store'

const { t } = useI18n()
const router = useRouter()
const api = useAPI()
const store = useAppStore()

const steps = computed(() => [
  t('createProfile.steps.basic'),
  t('createProfile.steps.health'),
  t('createProfile.steps.personality'),
])

const currentStep = ref(1)
const loading = ref(false)
const aiLoading = ref(false)
const error = ref('')
const aiSuggestion = ref('')

const form = ref({
  name: '',
  species: '',
  breed: '',
  age: null as number | null,
  healthDescription: '',
  dietPreferences: '',
  personality: '',
  habits: '',
})

const nextStep = () => {
  currentStep.value = Math.min(currentStep.value + 1, 3)
}

const aiSmartFill = async () => {
  aiLoading.value = true
  aiSuggestion.value = ''

  setTimeout(() => {
    if (!form.value.breed) {
      form.value.breed =
        form.value.species === 'cat'
          ? t('createProfile.aiFill.defaultBreedCat')
          : t('createProfile.aiFill.defaultBreedDog')
    }
    if (!form.value.age) {
      form.value.age = form.value.species === 'cat' ? 2 : 3
    }
    if (!form.value.personality) {
      form.value.personality = t('createProfile.aiFill.defaultPersonality')
    }
    if (!form.value.habits) {
      form.value.habits = t('createProfile.aiFill.defaultHabits')
    }

    aiSuggestion.value = t('createProfile.aiFill.suggestion', {
      breed: form.value.breed || t('createProfile.aiFill.unknownBreed'),
      age: form.value.age ?? t('createProfile.aiFill.unknownAge'),
    })
    aiLoading.value = false
  }, 1200)
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const description = [
      `${t('createProfile.summary.name')}: ${form.value.name}`,
      `${t('createProfile.summary.species')}: ${form.value.species}`,
      `${t('createProfile.summary.breed')}: ${form.value.breed || t('createProfile.aiFill.unknownBreed')}`,
      `${t('createProfile.summary.age')}: ${form.value.age ?? t('createProfile.aiFill.unknownAge')}`,
      `${t('createProfile.summary.healthDescription')}: ${form.value.healthDescription || t('createProfile.summary.notProvided')}`,
      `${t('createProfile.summary.dietPreferences')}: ${form.value.dietPreferences || t('createProfile.summary.notProvided')}`,
      `${t('createProfile.summary.personality')}: ${form.value.personality || t('createProfile.summary.notProvided')}`,
      `${t('createProfile.summary.habits')}: ${form.value.habits || t('createProfile.summary.notProvided')}`,
    ].join('\n')

    const response = await api.createProfile({
      name: form.value.name,
      species: form.value.species,
      age: form.value.age ?? 1,
      description,
    })

    if (response.success) {
      store.setPetProfile(response.data)
      router.push('/ai-advisor')
    } else {
      error.value = response.error || t('createProfile.error')
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || t('common.error')
  } finally {
    loading.value = false
  }
}
</script>
