# 🤖 PetSuite Agent Architecture Design

## 📋 Document Info
- **Version**: 1.0
- **Purpose**: Agent system design and implementation guide
- **Target**: AI coding assistants (Cursor, Windsurf, Copilot)
- **Last Updated**: 2026-01-26

---

## 🎯 Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│                   (Vue 3 + TypeScript)                       │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP/WebSocket
┌────────────────────────────▼────────────────────────────────┐
│                     Agent Orchestrator                       │
│              (Express + LangChain + Redis)                   │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Profile     │  │ Recommend    │  │  Market      │      │
│  │  Agent       │  │ Agent        │  │  Agent       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────────┬────────────────────────────────┘
                             │ Ethers.js
┌────────────────────────────▼────────────────────────────────┐
│                        Monad Blockchain                      │
│              (Smart Contracts + IPFS)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Core Components

### 1. Base Agent Interface
All agents inherit from BaseAgent class with:
- Standard input/output format
- Reasoning tree generation
- On-chain storage capability
- Error handling

### 2. Agent Types
- **PetProfileAgent**: Pet analysis
- **ProductRecommendationAgent**: Product matching
- **MarketAnalysisAgent**: Trend prediction
- **AgentOrchestrator**: Multi-agent coordination

### 3. Supporting Services
- Vision Model (image recognition)
- Knowledge Base (breed traits)
- Product Database (search)
- Blockchain Integration (Monad)

---

## 📦 Technology Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **AI/ML**: LangChain, OpenAI API
- **Database**: MongoDB, Redis
- **Blockchain**: Ethers.js, Monad SDK

### Frontend
- **Framework**: Vue 3 + TypeScript
- **State**: Pinia
- **UI**: TailwindCSS
- **Wallet**: Web3Modal

### Infrastructure
- **Containers**: Docker
- **Cache**: Redis
- **Storage**: IPFS (Pinata)
- **Search**: Elasticsearch (optional)

---

## 🔄 Agent Workflow

### Example: Product Recommendation Flow

```
1. User Query
   ↓
2. AgentOrchestrator receives request
   ↓
3. Call PetProfileAgent (get pet data)
   ↓
4. Call ProductRecommendationAgent (with profile)
   ↓
5. Call MarketAnalysisAgent (verify recommendations)
   ↓
6. Aggregate results
   ↓
7. Generate reasoning tree
   ↓
8. Store hash on Monad blockchain
   ↓
9. Return to user with tx proof
```

---

## 📐 Data Models

### Pet Profile
```typescript
interface PetProfile {
  name: string;
  species: 'cat' | 'dog';
  breed: string;
  age: number;
  weight: number;
  healthScore: number;  // 0-100
  allergies: string[];
  healthIssues: string[];
}
```

### Agent Output
```typescript
interface AgentOutput {
  success: boolean;
  data: any;
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

### Reasoning Tree
```typescript
interface ReasoningNode {
  id: string;
  type: 'decision' | 'constraint' | 'solution';
  content: string;
  children?: ReasoningNode[];
  confidence?: number;
  evidence?: string[];
}
```

---

## 🔐 Blockchain Integration

### Smart Contracts
1. **RecommendationVault.sol**: Store reasoning hashes
2. **PetNFT.sol**: Dynamic NFT for pets
3. **AIServicePayment.sol**: Stream payments

### On-chain Operations
- Store reasoning hash after each agent execution
- Mint NFT when profile created
- Process micro-payments for AI services

---

## 🧪 Testing Strategy

### Unit Tests
- Test each agent independently
- Mock external dependencies
- Verify reasoning tree generation

### Integration Tests
- Test agent orchestration
- Test blockchain interactions
- Test end-to-end workflows

### Load Tests
- Stress test orchestrator
- Verify Monad RPC performance
- Test concurrent agent executions

---

## 🚀 Deployment

### Development
```bash
npm install
npm run dev
```

### Production
```bash
docker-compose up -d
```

### Environment Setup
```bash
OPENAI_API_KEY=sk-...
MONAD_RPC_URL=https://testnet.rpc.monad.xyz
MONGODB_URI=mongodb://localhost:27017/petsuite
REDIS_URL=redis://localhost:6379
```

---

## 📊 Performance Targets

- Agent response time: < 2s
- Reasoning tree generation: < 500ms
- On-chain tx confirmation: < 1s (Monad)
- Concurrent users: 1000+

---

## 🔮 Future Enhancements

1. **Agent Marketplace**: Let developers deploy custom agents
2. **Federated Learning**: Improve agents without centralizing data
3. **Multi-chain**: Support Ethereum, Polygon
4. **Voice Interface**: Integrate speech recognition

---

## 📚 References

- [LangChain Documentation](https://docs.langchain.com)
- [OpenAI API](https://platform.openai.com/docs)
- [Monad Docs](https://docs.monad.xyz)
- [Ethers.js](https://docs.ethers.org)

---

For detailed implementation tasks, see TODO.md
