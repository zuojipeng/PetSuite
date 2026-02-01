/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_MONAD_CHAIN_ID: string
  readonly VITE_MONAD_RPC_URL: string
  readonly VITE_PET_NFT_ADDRESS: string

  // AI 服务配置
  readonly VITE_DEEPSEEK_API_KEY?: string
  readonly VITE_KIMI_API_KEY?: string
  readonly VITE_GLM_API_KEY?: string
  readonly VITE_QWEN_API_KEY?: string
  readonly VITE_DEFAULT_AI_PROVIDER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
