import { ref, shallowRef, markRaw } from 'vue'
import { ethers } from 'ethers'
import { useAppStore } from '../store'
import { useAuthStore } from '../store/auth'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

declare global {
  interface Window {
    ethereum?: any
  }
}

const provider = shallowRef<ethers.BrowserProvider | null>(null)
const address = ref('')
const connected = ref(false)

export function useWeb3() {
  const store = useAppStore()
  const authStore = useAuthStore()

  async function connect() {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this app')
      return
    }

    try {
      provider.value = markRaw(new ethers.BrowserProvider(window.ethereum))
      await provider.value.send('eth_requestAccounts', [])

      const signer = await provider.value.getSigner()
      address.value = await signer.getAddress()
      connected.value = true

      store.setWallet(address.value)
      authStore.setWalletAddress(address.value)
      if (!authStore.userProfile) {
        authStore.setUserProfile({
          walletAddress: address.value.toLowerCase(),
          displayName: `User ${address.value.slice(0, 6)}`,
          roles: ['user'],
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
      authStore.saveToStorage()

      try {
        await switchToMonad()
      } catch (error) {
        console.warn('Network switch failed, staying connected:', error)
        alert('已连接钱包，但切换网络失败，请手动切换到 Monad 测试网')
      }

      // 注册或获取用户信息
      try {
        await registerOrGetUser(address.value)
      } catch (error) {
        console.error('Failed to register/get user:', error)
        // 不阻塞连接流程，只是记录错误
      }

      console.log('Connected to wallet:', address.value)
    } catch (error: any) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  async function registerOrGetUser(walletAddress: string) {
    try {
      // 调用后端注册或获取用户
      const response = await axios.post(`${API_URL}/api/users/register`, {
        walletAddress: walletAddress.toLowerCase(),
      })

      if (response.data.success) {
        const userData = response.data.data

        // 更新 auth store
        authStore.setWalletAddress(userData.walletAddress)
        authStore.setUserProfile({
          walletAddress: userData.walletAddress,
          displayName: userData.displayName,
          email: userData.email,
          roles: userData.roles,
        })

        // 如果是商家，设置商家信息
        if (userData.merchantProfile && userData.roles.includes('merchant')) {
          authStore.setMerchantProfile(userData.merchantProfile)
        }

        // 保存到 localStorage
        authStore.saveToStorage()

        console.log('✅ User registered/retrieved:', userData)
      }
    } catch (error: any) {
      console.error('❌ Failed to register/get user:', error)
      throw error
    }
  }

  async function switchToMonad() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x138822' }],
      })
    } catch (error: any) {
      // Chain not added, try to add it
      if (error.code === 4902) {
        await addMonadNetwork()
      } else {
        throw error
      }
    }
  }

  async function addMonadNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x138822',
            chainName: 'Monad Testnet',
            rpcUrls: ['https://testnet.rpc.monad.xyz'],
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            blockExplorerUrls: ['https://testnet.explorer.monad.xyz'],
          },
        ],
      })
    } catch (error: any) {
      console.error('Failed to add Monad network:', error)
      throw error
    }
  }

  async function getSigner() {
    if (!provider.value) {
      throw new Error('Wallet not connected')
    }
    return provider.value.getSigner()
  }

  return {
    provider,
    address,
    connected,
    connect,
    getSigner,
  }
}
