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
              {{ t('nav.home') }}
            </router-link>
            <router-link
              to="/my-pets"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
            >
              {{ t('nav.myPets') }}
            </router-link>
            <router-link
              to="/ai-advisor"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
            >
              {{ t('nav.smartRecommend') }}
            </router-link>
            <router-link
              to="/marketplace"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
            >
              {{ t('nav.marketplace') }}
            </router-link>

            <!-- User Profile Dropdown -->
            <div class="relative" ref="profileDropdownRef">
              <button
                @click="toggleProfileDropdown"
                class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50"
              >
                {{ t('nav.profile') }}
                <span class="material-symbols-outlined text-sm">
                  {{ showProfileDropdown ? 'expand_less' : 'expand_more' }}
                </span>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showProfileDropdown"
                class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <router-link
                  to="/my-orders"
                  @click="showProfileDropdown = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                >
                  {{ t('nav.myOrders') }}
                </router-link>

                <div class="border-t border-gray-100 my-2"></div>

                <div class="px-4 py-2 text-xs text-gray-500 font-medium">
                  {{ t('nav.advancedFeatures') }}
                </div>
                <router-link
                  to="/my-nfts"
                  @click="showProfileDropdown = false"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                >
                  {{ t('nav.myNFTs') }}
                </router-link>

                <div v-if="connected" class="border-t border-gray-100 my-2"></div>
                <router-link
                  v-if="connected && hasRole('merchant')"
                  to="/merchant/dashboard"
                  @click="showProfileDropdown = false"
                  class="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 font-medium"
                >
                  {{ t('nav.merchantCenter') }} →
                </router-link>
                <router-link
                  v-if="connected && !hasRole('merchant')"
                  to="/become-merchant"
                  @click="showProfileDropdown = false"
                  class="block px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 font-medium"
                >
                  🏪 成为商家
                </router-link>
              </div>
            </div>

            <LanguageSwitcher />

            <button
              v-if="!connected"
              @click="connectWallet"
              class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {{ t('nav.connectWallet') }}
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWeb3 } from '../composables/useWeb3'
import { useAuthStore } from '../store/auth'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'

const { t } = useI18n()
const { connected, address, connect } = useWeb3()
const authStore = useAuthStore()

const showProfileDropdown = ref(false)
const profileDropdownRef = ref<HTMLElement | null>(null)

const shortAddress = computed(() => {
  if (!address.value) return ''
  return `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
})

const hasRole = (role: string) => {
  return authStore.hasRole(role)
}

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
}

const handleClickOutside = (event: MouseEvent) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target as Node)) {
    showProfileDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const connectWallet = async () => {
  try {
    await connect()
  } catch (error) {
    console.error('Failed to connect wallet:', error)
  }
}
</script>
