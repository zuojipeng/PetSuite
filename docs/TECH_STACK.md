# 🛠️ PetSuite Tech Stack Reference

## 📚 Quick Reference for Development

This document contains all the technical references, code snippets, and examples needed to implement PetSuite.

---

## 🔧 Package Versions

### Backend
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "ethers": "^6.9.0",
    "langchain": "^0.1.0",
    "openai": "^4.20.0",
    "mongodb": "^6.3.0",
    "redis": "^4.6.10",
    "socket.io": "^4.6.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.10.0",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2"
  }
}
```

### Frontend
```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.5",
    "pinia": "^2.1.7",
    "axios": "^1.6.2",
    "ethers": "^6.9.0",
    "@web3modal/wagmi": "^3.5.0",
    "viem": "^1.19.0",
    "@tanstack/vue-query": "^5.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "@vitejs/plugin-vue": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16"
  }
}
```

### Contracts
```json
{
  "devDependencies": {
    "hardhat": "^2.19.0",
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "@openzeppelin/contracts": "^5.0.0"
  }
}
```

---

## 🔌 API Reference

### Agent API

#### POST /api/agents/profile
Create pet profile using AI analysis.

**Request:**
```typescript
{
  name: string;
  species: 'cat' | 'dog';
  age?: number;
  weight?: number;
  description: string;
  healthIssues?: string[];
  allergies?: string[];
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    profile: {
      name: string;
      species: string;
      breed: string;
      age: number;
      healthScore: number;  // 0-100
      recommendations: {
        diet: string[];
        exercise: string[];
        checkups: string[];
      };
    };
  };
  reasoning: ReasoningTree;
  confidence: number;  // 0-1
  metadata: {
    agentId: string;
    timestamp: number;
    executionTime: number;
    txHash?: string;
  };
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/agents/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pudding",
    "species": "cat",
    "age": 3,
    "description": "Ragdoll cat with sensitive stomach"
  }'
```

#### POST /api/agents/recommend
Get product recommendations.

**Request:**
```typescript
{
  petProfile: PetProfile;
  query: string;
  budget?: {
    min: number;
    max: number;
  };
  preferences?: string[];
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    recommendations: Array<{
      rank: number;
      product: {
        id: string;
        name: string;
        brand: string;
        price: number;
        category: string;
      };
      score: number;
      reasoning: {
        pros: string[];
        cons: string[];
      };
      suitability: 'high' | 'medium' | 'low';
    }>;
    avoid: Array<{
      product: string;
      reason: string;
    }>;
    generalAdvice: string;
  };
  reasoning: ReasoningTree;
  metadata: {...};
}
```

#### POST /api/agents/market
Analyze market trends.

**Request:**
```typescript
{
  category: string;
  timeframe: number;  // days
  location?: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    forecast: {
      trend: 'up' | 'down' | 'stable';
      growthRate: number;
      prediction: Array<{
        date: string;
        value: number;
      }>;
    };
    insights: {
      topProducts: string[];
      priceRange: { min: number; max: number };
    };
    strategies: string[];
  };
  reasoning: ReasoningTree;
  metadata: {...};
}
```

### NFT API

#### POST /api/nfts/mint
Mint pet NFT.

**Request:**
```typescript
{
  owner: string;  // Wallet address
  profileData: string;  // IPFS URI
}
```

**Response:**
```typescript
{
  success: boolean;
  tokenId: number;
  txHash: string;
  metadataURI: string;
}
```

#### GET /api/nfts/:tokenId
Get NFT details.

**Response:**
```typescript
{
  tokenId: number;
  owner: string;
  petEvolution: {
    stage: 'Infant' | 'Youth' | 'Adult' | 'Senior';
    birthTime: number;
    healthScore: number;
    aiConsultCount: number;
    lastUpdate: number;
  };
  metadataURI: string;
  discount: number;  // percentage
}
```

#### GET /api/nfts/user/:address
Get user's NFTs.

**Response:**
```typescript
{
  nfts: Array<{
    tokenId: number;
    petName: string;
    species: string;
    healthScore: number;
    stage: string;
  }>;
  total: number;
}
```

---

## 🔐 Smart Contract ABIs

### PetNFT ABI
```typescript
export const PetNFT_ABI = [
  "function createPetProfile(address owner, string memory initialMetadata) external returns (uint256)",
  "function updateHealthScore(uint256 tokenId, uint256 newScore) external",
  "function incrementAIConsult(uint256 tokenId) external",
  "function getPetDiscount(uint256 tokenId) public view returns (uint256)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function petEvolution(uint256) public view returns (uint8 stage, uint256 birthTime, uint256 healthScore, uint256 aiConsultCount, uint256 lastUpdate, string metadataURI)",
  "event PetCreated(uint256 indexed tokenId, address indexed owner)",
  "event PetEvolved(uint256 indexed tokenId, uint8 newStage)",
  "event HealthUpdated(uint256 indexed tokenId, uint256 newScore)"
];
```

### RecommendationVault ABI
```typescript
export const RecommendationVault_ABI = [
  "function storeRecommendation(uint256 petTokenId, bytes32 queryHash, bytes32 resultHash) external returns (uint256)",
  "function getRecommendation(uint256 recommendationId) external view returns (address user, uint256 petTokenId, bytes32 queryHash, bytes32 resultHash, uint256 timestamp, bool verified)",
  "function getUserRecommendations(address user) external view returns (uint256[] memory)",
  "function verifyRecommendation(uint256 recommendationId, bytes32 expectedHash) external view returns (bool)",
  "event RecommendationStored(uint256 indexed recommendationId, address indexed user, uint256 indexed petTokenId, bytes32 resultHash)"
];
```

### AIServicePayment ABI
```typescript
export const AIServicePayment_ABI = [
  "function startAIConsultation() external payable",
  "function stopAIConsultation() external",
  "function getStreamInfo(address user) external view returns (address user, uint256 startTime, uint256 ratePerSecond, uint256 balance, bool active)",
  "function AI_RATE_PER_SECOND() public view returns (uint256)",
  "event ConsultationStarted(address indexed user, uint256 timestamp)",
  "event ConsultationEnded(address indexed user, uint256 duration, uint256 cost)"
];
```

---

## 💻 Code Snippets

### Blockchain Interaction

#### Connect to Monad
```typescript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(
  'https://testnet.rpc.monad.xyz'
);

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Check balance
const balance = await provider.getBalance(wallet.address);
console.log('Balance:', ethers.formatEther(balance));

// Get chain ID
const network = await provider.getNetwork();
console.log('Chain ID:', network.chainId); // 80002
```

#### Call Contract
```typescript
const petNFT = new ethers.Contract(
  PET_NFT_ADDRESS,
  PetNFT_ABI,
  wallet
);

// Mint NFT
const tx = await petNFT.createPetProfile(
  ownerAddress,
  'ipfs://QmXyz...'
);
const receipt = await tx.wait();
console.log('Token ID:', receipt.logs[0].topics[1]);

// Read data
const evolution = await petNFT.petEvolution(tokenId);
console.log('Health Score:', evolution.healthScore);
```

### LangChain Agent

#### Basic Setup
```typescript
import { ChatOpenAI } from "langchain/chat_models/openai";

const llm = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0.3,
  maxTokens: 2000,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const response = await llm.invoke("Analyze this pet profile...");
console.log(response.content);
```

#### Structured Output
```typescript
const prompt = `
Analyze this pet: ${JSON.stringify(petData)}

Return JSON:
{
  "breed": "string",
  "healthScore": number,
  "recommendations": string[]
}
`;

const response = await llm.invoke(prompt);
const parsed = JSON.parse(response.content);
```

### Vue 3 Composition API

#### Web3 Composable
```typescript
// composables/useWeb3.ts
import { ref } from 'vue';
import { ethers } from 'ethers';

export function useWeb3() {
  const provider = ref<ethers.BrowserProvider | null>(null);
  const address = ref('');
  const connected = ref(false);

  async function connect() {
    if (!window.ethereum) {
      alert('Install MetaMask');
      return;
    }

    provider.value = new ethers.BrowserProvider(window.ethereum);
    await provider.value.send('eth_requestAccounts', []);
    
    const signer = await provider.value.getSigner();
    address.value = await signer.getAddress();
    connected.value = true;

    await switchToMonad();
  }

  async function switchToMonad() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x138822' }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await addMonadNetwork();
      }
    }
  }

  async function addMonadNetwork() {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x138822',
        chainName: 'Monad Testnet',
        rpcUrls: ['https://testnet.rpc.monad.xyz'],
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18,
        },
        blockExplorerUrls: ['https://testnet.explorer.monad.xyz'],
      }],
    });
  }

  return {
    provider,
    address,
    connected,
    connect,
  };
}
```

#### API Composable
```typescript
// composables/useAPI.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useAPI() {
  async function createProfile(data: any) {
    const response = await axios.post(`${API_URL}/api/agents/profile`, data);
    return response.data;
  }

  async function getRecommendation(data: any) {
    const response = await axios.post(`${API_URL}/api/agents/recommend`, data);
    return response.data;
  }

  return {
    createProfile,
    getRecommendation,
  };
}
```

### React (if needed)

#### Web3 Hook
```typescript
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function useWeb3() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [address, setAddress] = useState('');

  async function connect() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    setProvider(provider);
    setAddress(address);
  }

  return { provider, address, connect };
}
```

---

## 🗄️ Database Schemas

### MongoDB Collections

#### pets
```typescript
{
  _id: ObjectId,
  ownerAddress: string,
  tokenId: number,
  name: string,
  species: 'cat' | 'dog',
  breed: string,
  age: number,
  healthScore: number,
  metadataURI: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### recommendations
```typescript
{
  _id: ObjectId,
  userAddress: string,
  petTokenId: number,
  query: string,
  results: {
    recommendations: Array<any>,
    reasoning: ReasoningTree
  },
  txHash: string,
  createdAt: Date
}
```

#### products
```typescript
{
  _id: ObjectId,
  name: string,
  brand: string,
  category: 'food' | 'toy' | 'healthcare' | 'grooming',
  price: number,
  description: string,
  ageGroup: string[],  // ['kitten', 'adult', 'senior']
  species: string[],   // ['cat', 'dog']
  ingredients: string[],
  allergens: string[],
  tags: string[]
}
```

---

## 🎨 UI Components

### Reasoning Tree Visualizer
```vue
<template>
  <div class="reasoning-tree">
    <ReasoningNode
      v-for="node in tree.root.children"
      :key="node.id"
      :node="node"
      :depth="0"
    />
  </div>
</template>

<script setup lang="ts">
import ReasoningNode from './ReasoningNode.vue';

interface Props {
  tree: ReasoningTree;
}

defineProps<Props>();
</script>
```

### ReasoningNode Component
```vue
<template>
  <div class="node" :style="{ marginLeft: `${depth * 20}px` }">
    <div class="node-header" @click="toggle">
      <span class="icon">{{ expanded ? '▼' : '▶' }}</span>
      <span class="type">{{ node.type }}</span>
      <span class="content">{{ node.content }}</span>
      <span v-if="node.confidence" class="confidence">
        {{ (node.confidence * 100).toFixed(0) }}%
      </span>
    </div>
    
    <div v-if="expanded && node.children" class="children">
      <ReasoningNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  node: ReasoningNode;
  depth: number;
}

defineProps<Props>();

const expanded = ref(false);
const toggle = () => {
  expanded.value = !expanded.value;
};
</script>

<style scoped>
.node {
  margin: 4px 0;
}
.node-header {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  cursor: pointer;
}
.type {
  font-weight: bold;
  color: #8b5cf6;
}
.confidence {
  margin-left: auto;
  color: #10b981;
}
</style>
```

---

## 🔑 Environment Variables

### Backend (.env)
```bash
# Server
PORT=3000
NODE_ENV=development

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Monad
MONAD_RPC_URL=https://testnet.rpc.monad.xyz
MONAD_CHAIN_ID=80002
PRIVATE_KEY=0x...

# Contracts
PET_NFT_ADDRESS=0x...
RECOMMENDATION_VAULT_ADDRESS=0x...
AI_SERVICE_PAYMENT_ADDRESS=0x...

# Database
MONGODB_URI=mongodb://localhost:27017/petsuite
REDIS_URL=redis://localhost:6379

# IPFS
PINATA_API_KEY=...
PINATA_SECRET_KEY=...
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3000
VITE_MONAD_CHAIN_ID=80002
VITE_MONAD_RPC_URL=https://testnet.rpc.monad.xyz
VITE_PET_NFT_ADDRESS=0x...
```

---

## 🚀 Scripts

### Start Development
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: MongoDB (if local)
mongod --dbpath ./data

# Terminal 4: Redis (if local)
redis-server
```

### Deploy Contracts
```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.ts --network monad
```

### Run Tests
```bash
# Backend
cd backend
npm test

# Contracts
cd contracts
npx hardhat test

# Frontend
cd frontend
npm run test
```

---

## 📊 Performance Benchmarks

### Target Metrics
- Agent response time: < 2s
- Contract tx confirmation: < 1s (Monad)
- Frontend load time: < 1s
- API latency: < 200ms

### Monitoring
```typescript
// Add to agent execution
const startTime = Date.now();
// ... agent logic
const executionTime = Date.now() - startTime;
console.log(`Agent executed in ${executionTime}ms`);
```

---

## 🐛 Debug Commands

### Check Backend Health
```bash
curl http://localhost:3000/health
```

### Test OpenAI API
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Check Monad RPC
```bash
curl https://testnet.rpc.monad.xyz \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### Query MongoDB
```javascript
// In mongo shell
use petsuite
db.pets.find({}).pretty()
db.recommendations.countDocuments()
```

---

## 📚 Additional Resources

- [Monad Docs](https://docs.monad.xyz)
- [LangChain Docs](https://docs.langchain.com)
- [Ethers.js Docs](https://docs.ethers.org)
- [Vue 3 Docs](https://vuejs.org)
- [Hardhat Docs](https://hardhat.org/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

**Ready to code! 🚀**
