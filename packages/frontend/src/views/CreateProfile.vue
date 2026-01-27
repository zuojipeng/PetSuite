<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Create Pet Profile</h1>

    <form @submit.prevent="handleSubmit" class="bg-white p-8 rounded-lg shadow-md space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Pet Name *
        </label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="e.g., Pudding"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Species *
        </label>
        <select
          v-model="form.species"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Select species</option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Age (years)
        </label>
        <input
          v-model.number="form.age"
          type="number"
          min="0"
          max="30"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="e.g., 3"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          v-model="form.description"
          required
          rows="4"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Describe your pet: breed, personality, health conditions, dietary needs, etc."
        ></textarea>
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Analyzing...' : 'Create Profile with AI' }}
      </button>
    </form>

    <!-- Results -->
    <div v-if="result" class="mt-8 bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4 text-green-600">✓ Profile Created!</h2>

      <div class="space-y-4">
        <div>
          <h3 class="font-semibold text-lg">Pet Information</h3>
          <div class="mt-2 space-y-1 text-gray-700">
            <p><strong>Name:</strong> {{ result.data.name }}</p>
            <p><strong>Species:</strong> {{ result.data.species }}</p>
            <p><strong>Breed:</strong> {{ result.data.breed }}</p>
            <p><strong>Age:</strong> {{ result.data.age }} years</p>
            <p><strong>Health Score:</strong> {{ result.data.healthScore }}/100</p>
          </div>
        </div>

        <div v-if="result.data.recommendations">
          <h3 class="font-semibold text-lg">AI Recommendations</h3>
          <div class="mt-2 space-y-2">
            <div v-if="result.data.recommendations.diet?.length">
              <p class="font-medium">Diet:</p>
              <ul class="list-disc list-inside text-gray-700">
                <li v-for="(item, i) in result.data.recommendations.diet" :key="i">{{ item }}</li>
              </ul>
            </div>
            <div v-if="result.data.recommendations.exercise?.length">
              <p class="font-medium">Exercise:</p>
              <ul class="list-disc list-inside text-gray-700">
                <li v-for="(item, i) in result.data.recommendations.exercise" :key="i">{{ item }}</li>
              </ul>
            </div>
            <div v-if="result.data.recommendations.checkups?.length">
              <p class="font-medium">Checkups:</p>
              <ul class="list-disc list-inside text-gray-700">
                <li v-for="(item, i) in result.data.recommendations.checkups" :key="i">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h3 class="font-semibold text-lg">Analysis Confidence</h3>
          <div class="mt-2">
            <div class="w-full bg-gray-200 rounded-full h-4">
              <div
                class="bg-green-500 h-4 rounded-full"
                :style="{ width: `${result.confidence * 100}%` }"
              ></div>
            </div>
            <p class="text-sm text-gray-600 mt-1">
              {{ (result.confidence * 100).toFixed(0) }}% confidence
            </p>
          </div>
        </div>

        <div class="pt-4 border-t">
          <p class="text-sm text-gray-500">
            Execution time: {{ result.metadata.executionTime }}ms
          </p>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="mt-8 bg-red-50 p-4 rounded-lg">
      <p class="text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAPI } from '../composables/useAPI'
import { useAppStore } from '../store'

const api = useAPI()
const store = useAppStore()

const form = ref({
  name: '',
  species: '',
  age: 1,
  description: '',
})

const loading = ref(false)
const result = ref<any>(null)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  result.value = null

  try {
    const response = await api.createProfile(form.value)

    if (response.success) {
      result.value = response
      store.setPetProfile(response.data)
    } else {
      error.value = response.error || 'Failed to create profile'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>
