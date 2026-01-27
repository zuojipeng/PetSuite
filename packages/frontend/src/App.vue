<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-purple-600">
              🐾 PetSuite
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <router-link
              to="/"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
            >
              Home
            </router-link>
            <router-link
              to="/create-profile"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
            >
              Create Profile
            </router-link>
            <router-link
              to="/ai-advisor"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
            >
              AI Advisor
            </router-link>
            <router-link
              to="/my-nfts"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
            >
              My NFTs
            </router-link>

            <button
              v-if="!connected"
              @click="connectWallet"
              class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Connect Wallet
            </button>
            <div v-else class="text-sm text-gray-600">
              {{ shortAddress }}
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWeb3 } from './composables/useWeb3'

const { connected, address, connect } = useWeb3()

const shortAddress = computed(() => {
  if (!address.value) return ''
  return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
})

const connectWallet = async () => {
  try {
    await connect()
  } catch (error) {
    console.error('Failed to connect wallet:', error)
  }
}
</script>
