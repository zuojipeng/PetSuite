<template>
  <div class="max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">My Pet NFTs</h1>

    <div v-if="!connected" class="bg-yellow-50 p-6 rounded-lg">
      <p class="text-yellow-800">
        Please connect your wallet to view your Pet NFTs.
      </p>
    </div>

    <div v-else-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading your NFTs...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 p-6 rounded-lg">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else-if="nfts.length === 0" class="bg-gray-50 p-12 rounded-lg text-center">
      <p class="text-gray-600 mb-4">You don't have any Pet NFTs yet.</p>
      <router-link
        to="/create-profile"
        class="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
      >
        Create Your First Pet Profile
      </router-link>
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="nft in nfts"
        :key="nft.tokenId"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
      >
        <div class="bg-gradient-to-br from-purple-100 to-blue-100 h-48 flex items-center justify-center">
          <span class="text-6xl">{{ nft.species === 'cat' ? '🐱' : '🐶' }}</span>
        </div>

        <div class="p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-xl font-bold">{{ nft.petName }}</h3>
            <span class="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
              #{{ nft.tokenId }}
            </span>
          </div>

          <div class="space-y-2 text-sm text-gray-700">
            <p><strong>Species:</strong> {{ nft.species }}</p>
            <p><strong>Breed:</strong> {{ nft.breed || 'Unknown' }}</p>
            <p>
              <strong>Health Score:</strong>
              <span
                :class="{
                  'text-green-600': nft.healthScore > 80,
                  'text-yellow-600': nft.healthScore >= 60 && nft.healthScore <= 80,
                  'text-red-600': nft.healthScore < 60,
                }"
              >
                {{ nft.healthScore }}/100
              </span>
            </p>
          </div>

          <button
            @click="viewDetails(nft.tokenId)"
            class="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>

    <!-- Details Modal -->
    <div
      v-if="selectedNFT"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="selectedNFT = null"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-2xl font-bold">Pet NFT Details</h2>
          <button
            @click="selectedNFT = null"
            class="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-600">Token ID</p>
            <p class="font-semibold">{{ selectedNFT.tokenId }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-600">Owner</p>
            <p class="font-mono text-sm break-all">{{ selectedNFT.owner }}</p>
          </div>

          <div v-if="selectedNFT.petEvolution">
            <p class="text-sm text-gray-600">Life Stage</p>
            <p class="font-semibold">{{ selectedNFT.petEvolution.stage }}</p>
          </div>

          <div v-if="selectedNFT.petEvolution">
            <p class="text-sm text-gray-600">AI Consult Count</p>
            <p class="font-semibold">{{ selectedNFT.petEvolution.aiConsultCount }}</p>
          </div>

          <div>
            <p class="text-sm text-gray-600">Member Discount</p>
            <p class="font-semibold text-green-600">{{ selectedNFT.discount }}%</p>
          </div>

          <div v-if="selectedNFT.metadataURI">
            <p class="text-sm text-gray-600">Metadata URI</p>
            <p class="text-xs font-mono break-all text-gray-700">
              {{ selectedNFT.metadataURI }}
            </p>
          </div>

          <a
            :href="`https://testnet.explorer.monad.xyz/token/${contractAddress}/instance/${selectedNFT.tokenId}`"
            target="_blank"
            class="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            View on Monad Explorer
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAPI } from '../composables/useAPI'
import { useWeb3 } from '../composables/useWeb3'

const api = useAPI()
const { connected, address } = useWeb3()

const nfts = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const selectedNFT = ref<any>(null)

const contractAddress = import.meta.env.VITE_PET_NFT_ADDRESS || ''

onMounted(async () => {
  if (connected.value && address.value) {
    await loadNFTs()
  }
})

const loadNFTs = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.getUserNFTs(address.value)

    if (response.success) {
      nfts.value = response.nfts
    } else {
      error.value = response.error || 'Failed to load NFTs'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}

const viewDetails = async (tokenId: number) => {
  try {
    const response = await api.getNFT(tokenId)

    if (response.success) {
      selectedNFT.value = response
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || 'Failed to load NFT details'
  }
}
</script>
