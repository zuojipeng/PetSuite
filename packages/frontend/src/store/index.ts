import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const walletAddress = ref('')
  const petProfile = ref<any>(null)
  const recommendations = ref<any[]>([])

  function setWallet(address: string) {
    walletAddress.value = address
  }

  function setPetProfile(profile: any) {
    petProfile.value = profile
  }

  function addRecommendation(rec: any) {
    recommendations.value.unshift(rec)
  }

  function clearRecommendations() {
    recommendations.value = []
  }

  return {
    walletAddress,
    petProfile,
    recommendations,
    setWallet,
    setPetProfile,
    addRecommendation,
    clearRecommendations,
  }
})
