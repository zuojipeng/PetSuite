<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">AI Advisor</h1>

    <!-- Pet Profile Selection -->
    <div class="bg-yellow-50 p-4 rounded-lg mb-6" v-if="!petProfile">
      <p class="text-yellow-800">
        Please create a pet profile first to get personalized recommendations.
        <router-link to="/create-profile" class="underline font-semibold">
          Create Profile
        </router-link>
      </p>
    </div>

    <div v-else class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="font-semibold mb-2">Current Pet Profile</h2>
      <div class="text-gray-700">
        <p><strong>{{ petProfile.name }}</strong> - {{ petProfile.species }} ({{ petProfile.breed }})</p>
        <p class="text-sm">Health Score: {{ petProfile.healthScore }}/100</p>
      </div>
    </div>

    <!-- Query Form -->
    <div class="bg-white p-8 rounded-lg shadow-md mb-6">
      <form @submit.prevent="handleQuery" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ask AI Advisor
          </label>
          <textarea
            v-model="query"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="e.g., 'Recommend cat food for sensitive stomach' or 'Best toys for senior dogs'"
            :disabled="!petProfile"
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="loading || !petProfile || !query.trim()"
          class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Analyzing...' : 'Get Recommendations' }}
        </button>
      </form>
    </div>

    <!-- Results -->
    <div v-if="result" class="space-y-6">
      <!-- Recommendations -->
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">Recommendations</h2>

        <div v-if="result.data.recommendations?.length" class="space-y-4">
          <div
            v-for="rec in result.data.recommendations"
            :key="rec.rank"
            class="border rounded-lg p-4"
            :class="{
              'border-green-300 bg-green-50': rec.suitability === 'high',
              'border-yellow-300 bg-yellow-50': rec.suitability === 'medium',
              'border-gray-300 bg-gray-50': rec.suitability === 'low',
            }"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-lg">
                #{{ rec.rank }} {{ rec.product.name }}
              </h3>
              <span
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="{
                  'bg-green-200 text-green-800': rec.suitability === 'high',
                  'bg-yellow-200 text-yellow-800': rec.suitability === 'medium',
                  'bg-gray-200 text-gray-800': rec.suitability === 'low',
                }"
              >
                {{ rec.suitability.toUpperCase() }}
              </span>
            </div>

            <p class="text-gray-600 mb-2">
              {{ rec.product.brand }} - ${{ rec.product.price }}
            </p>

            <div class="mb-2">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-purple-500 h-2 rounded-full"
                  :style="{ width: `${rec.score}%` }"
                ></div>
              </div>
              <p class="text-xs text-gray-600 mt-1">Match Score: {{ rec.score }}/100</p>
            </div>

            <div class="mt-3 space-y-2">
              <div v-if="rec.reasoning.pros.length">
                <p class="text-sm font-medium text-green-700">Pros:</p>
                <ul class="list-disc list-inside text-sm text-gray-700">
                  <li v-for="(pro, i) in rec.reasoning.pros" :key="i">{{ pro }}</li>
                </ul>
              </div>

              <div v-if="rec.reasoning.cons.length">
                <p class="text-sm font-medium text-red-700">Cons:</p>
                <ul class="list-disc list-inside text-sm text-gray-700">
                  <li v-for="(con, i) in rec.reasoning.cons" :key="i">{{ con }}</li>
                </ul>
              </div>

              <p class="text-sm text-gray-600 italic">
                {{ rec.reasoning.matchDetails }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="result.data.avoid?.length" class="mt-6 bg-red-50 p-4 rounded-lg">
          <h3 class="font-semibold text-red-700 mb-2">⚠️ Products to Avoid</h3>
          <ul class="list-disc list-inside text-sm text-gray-700">
            <li v-for="(item, i) in result.data.avoid" :key="i">
              <strong>{{ item.product }}</strong> - {{ item.reason }}
            </li>
          </ul>
        </div>

        <div v-if="result.data.generalAdvice" class="mt-6 bg-blue-50 p-4 rounded-lg">
          <h3 class="font-semibold text-blue-700 mb-2">💡 General Advice</h3>
          <p class="text-gray-700">{{ result.data.generalAdvice }}</p>
        </div>
      </div>

      <!-- Metadata -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="font-semibold mb-3">Analysis Details</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-600">Confidence</p>
            <p class="font-semibold">{{ (result.confidence * 100).toFixed(0) }}%</p>
          </div>
          <div>
            <p class="text-gray-600">Execution Time</p>
            <p class="font-semibold">{{ result.metadata.executionTime }}ms</p>
          </div>
          <div v-if="result.metadata.txHash" class="col-span-2">
            <p class="text-gray-600">Blockchain Proof</p>
            <a
              :href="`https://testnet.explorer.monad.xyz/tx/${result.metadata.txHash}`"
              target="_blank"
              class="text-purple-600 hover:underline text-xs break-all"
            >
              {{ result.metadata.txHash }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="bg-red-50 p-4 rounded-lg">
      <p class="text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAPI } from '../composables/useAPI'
import { useAppStore } from '../store'

const api = useAPI()
const store = useAppStore()

const petProfile = computed(() => store.petProfile)

const query = ref('')
const loading = ref(false)
const result = ref<any>(null)
const error = ref('')

const handleQuery = async () => {
  if (!petProfile.value) {
    error.value = 'Please create a pet profile first'
    return
  }

  loading.value = true
  error.value = ''
  result.value = null

  try {
    const response = await api.getRecommendation({
      petProfile: petProfile.value,
      query: query.value,
    })

    if (response.success) {
      result.value = response
      store.addRecommendation(response)
    } else {
      error.value = response.error || 'Failed to get recommendations'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>
