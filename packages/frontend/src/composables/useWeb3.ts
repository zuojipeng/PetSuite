import { ref } from 'vue'
import { ethers } from 'ethers'
import { useAppStore } from '../store'

declare global {
  interface Window {
    ethereum?: any
  }
}

const provider = ref<ethers.BrowserProvider | null>(null)
const address = ref('')
const connected = ref(false)

export function useWeb3() {
  const store = useAppStore()

  async function connect() {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this app')
      return
    }

    try {
      provider.value = new ethers.BrowserProvider(window.ethereum)
      await provider.value.send('eth_requestAccounts', [])

      const signer = await provider.value.getSigner()
      address.value = await signer.getAddress()
      connected.value = true

      store.setWallet(address.value)

      try {
        await switchToMonad()
      } catch (error) {
        console.warn('Network switch failed, staying connected:', error)
        alert('已连接钱包，但切换网络失败，请手动切换到 Monad 测试网')
      }

      console.log('Connected to wallet:', address.value)
    } catch (error: any) {
      console.error('Failed to connect wallet:', error)
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
