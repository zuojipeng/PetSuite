import { defineStore } from 'pinia'
import type { UserRole, UserProfile, MerchantProfile, AuthState } from '@petsuite/shared'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isConnected: false,
    walletAddress: null,
    userProfile: null,
    merchantProfile: null,
    roles: [],
  }),

  getters: {
    hasRole: (state) => (role: UserRole | string) => {
      return state.roles.includes(role as UserRole)
    },

    isMerchant: (state) => {
      return state.roles.includes('merchant' as UserRole)
    },

    isUser: (state) => {
      return state.roles.includes('user' as UserRole)
    },

    displayName: (state) => {
      if (state.merchantProfile?.storeName) {
        return state.merchantProfile.storeName
      }
      if (state.userProfile?.displayName) {
        return state.userProfile.displayName
      }
      if (state.walletAddress) {
        return `${state.walletAddress.slice(0, 6)}...${state.walletAddress.slice(-4)}`
      }
      return 'Guest'
    },
  },

  actions: {
    setWalletAddress(address: string) {
      this.walletAddress = address
      this.isConnected = true
    },

    setUserProfile(profile: UserProfile) {
      this.userProfile = profile
      this.roles = profile.roles
    },

    setMerchantProfile(profile: MerchantProfile) {
      this.merchantProfile = profile
    },

    addRole(role: UserRole) {
      if (!this.roles.includes(role)) {
        this.roles.push(role)
        if (this.userProfile) {
          this.userProfile.roles = this.roles
        }
      }
    },

    removeRole(role: UserRole) {
      const index = this.roles.indexOf(role)
      if (index > -1) {
        this.roles.splice(index, 1)
        if (this.userProfile) {
          this.userProfile.roles = this.roles
        }
      }
    },

    disconnect() {
      this.isConnected = false
      this.walletAddress = null
      this.userProfile = null
      this.merchantProfile = null
      this.roles = []
    },

    // 从本地存储加载状态
    loadFromStorage() {
      try {
        const stored = localStorage.getItem('petsuite_auth')
        if (stored) {
          const data = JSON.parse(stored)
          this.isConnected = data.isConnected || false
          this.walletAddress = data.walletAddress || null
          this.userProfile = data.userProfile || null
          this.merchantProfile = data.merchantProfile || null
          this.roles = data.roles || []
        }
      } catch (error) {
        console.error('Failed to load auth state from storage:', error)
      }
    },

    // 保存到本地存储
    saveToStorage() {
      try {
        const data = {
          isConnected: this.isConnected,
          walletAddress: this.walletAddress,
          userProfile: this.userProfile,
          merchantProfile: this.merchantProfile,
          roles: this.roles,
        }
        localStorage.setItem('petsuite_auth', JSON.stringify(data))
      } catch (error) {
        console.error('Failed to save auth state to storage:', error)
      }
    },
  },
})
