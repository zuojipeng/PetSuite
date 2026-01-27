/**
 * Smart Contract Addresses
 * Update these after deployment to Monad testnet
 */
export const CONTRACT_ADDRESSES = {
  PET_NFT: process.env.PET_NFT_ADDRESS || '0x0000000000000000000000000000000000000000',
  RECOMMENDATION_VAULT: process.env.RECOMMENDATION_VAULT_ADDRESS || '0x0000000000000000000000000000000000000000',
  AI_SERVICE_PAYMENT: process.env.AI_SERVICE_PAYMENT_ADDRESS || '0x0000000000000000000000000000000000000000',
} as const;

/**
 * Network Configuration
 */
export const NETWORK_CONFIG = {
  MONAD_TESTNET: {
    chainId: 80002,
    name: 'Monad Testnet',
    rpcUrl: process.env.MONAD_RPC_URL || 'https://testnet.monad.xyz',
    blockExplorer: 'https://explorer.testnet.monad.xyz',
  },
} as const;

/**
 * AI Service Fee (in wei)
 */
export const AI_SERVICE_FEE = '100000000000000'; // 0.0001 ETH
