# 🐾 PetSuite - AI 驱动的宠物护理平台

> 包含所有 PetSuite 组件的 Monorepo：后端 AI 智能体、前端界面和智能合约

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D8.0.0-orange)](https://pnpm.io)

## 📦 Monorepo 结构

```
petsulte/
├── packages/
│   ├── backend/          # AI 智能体系统 (Node.js + LangChain)
│   ├── frontend/         # Web 界面 (Vue 3 + Vite)
│   ├── contracts/        # 智能合约 (Solidity + Hardhat)
│   └── shared/           # 共享类型、常量和工具函数
├── docs/                 # 文档
├── scripts/              # 开发脚本
└── .github/workflows/    # CI/CD 流水线
```

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Git**

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourteam/petsuite.git
cd petsuite

# 运行安装脚本（推荐）
./scripts/setup.sh

# 或手动安装
pnpm install
pnpm --filter @petsuite/shared build
```

### 开发

**启动所有服务：**
```bash
./scripts/dev-all.sh
```

**或分别启动各个服务：**
```bash
# 终端 1：后端 (http://localhost:3000)
pnpm dev:backend

# 终端 2：前端 (http://localhost:5173)
pnpm dev:frontend

# 终端 3：共享包（监听模式）
pnpm dev:shared
```

### 构建

```bash
# 构建所有包
pnpm build:all

# 构建特定包
pnpm build:backend
pnpm build:frontend
pnpm build:shared
```

### 智能合约

```bash
# 编译合约
pnpm compile:contracts

# 运行测试
pnpm test:contracts

# 部署到 Monad 测试网
pnpm deploy:contracts
```

## 📚 包详情

### [@petsuite/backend](packages/backend)
由 LangChain 和 OpenAI 驱动的 AI 智能体后端系统。

**核心功能：**
- 多智能体编排
- 推理树生成
- 链上验证集成
- 实时 WebSocket 通信

**技术栈：** Node.js, Express, LangChain, MongoDB, Redis

---

### [@petsuite/frontend](packages/frontend)
面向宠物主人和商家的现代化 Web 界面。

**核心功能：**
- 宠物档案管理
- AI 驱动的推荐系统
- Web3 钱包集成
- 实时智能体推理可视化

**技术栈：** Vue 3, Vite, Tailwind CSS, Ethers.js

---

### [@petsuite/contracts](packages/contracts)
部署在 Monad 区块链上的智能合约。

**合约：**
- `PetNFT.sol` - 宠物档案的动态 NFT
- `RecommendationVault.sol` - AI 推荐存储
- `AIServicePayment.sol` - 流式支付系统

**技术栈：** Solidity 0.8.20, Hardhat, OpenZeppelin

---

### [@petsuite/shared](packages/shared)
共享的 TypeScript 类型、常量和工具函数。

**导出内容：**
- 类型定义（Agent、Pet、Recommendation）
- 合约地址和 ABI
- 工具函数（哈希、ID 生成）

## 🔧 可用命令

### 根目录命令

| 命令 | 描述 |
|------|------|
| `pnpm dev:backend` | 以开发模式启动后端 |
| `pnpm dev:frontend` | 以开发模式启动前端 |
| `pnpm dev:shared` | 监听共享包变更 |
| `pnpm build:all` | 构建所有包 |
| `pnpm test:all` | 运行所有测试 |
| `pnpm clean` | 清理所有构建产物 |
| `pnpm format` | 使用 Prettier 格式化代码 |

### 包特定命令

```bash
# 在特定包中运行命令
pnpm --filter @petsuite/backend <命令>
pnpm --filter @petsuite/frontend <命令>
pnpm --filter @petsuite/contracts <命令>
```

## 🌐 环境变量

在每个包中创建 `.env` 文件：

**packages/backend/.env**
```env
OPENAI_API_KEY=your_openai_key
MONGODB_URI=mongodb://localhost:27017/petsuite
REDIS_URL=redis://localhost:6379
MONAD_RPC_URL=https://testnet.monad.xyz
```

**packages/frontend/.env**
```env
VITE_BACKEND_URL=http://localhost:3000
VITE_MONAD_CHAIN_ID=80002
```

查看每个包中的 `.env.example` 文件以获取完整配置。

## 📖 文档

- [产品需求文档 (PRD)](docs/PetSuite_Hackathon_PRD_v2.md)
- [智能体架构](docs/AGENT.md)
- [技术栈](docs/TECH_STACK.md)
- [任务清单 (TODO)](docs/TODO.md)
- [赛道策略](docs/Track_Strategy.md)

## 🏗️ 架构

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   前端      │─────▶│    后端      │─────▶│   Monad     │
│  (Vue 3)    │      │  (AI 智能体)  │      │   区块链    │
└─────────────┘      └──────────────┘      └─────────────┘
       │                    │                       │
       │                    │                       │
       └────────────────────┴───────────────────────┘
                      Web3 集成
```

**数据流：**
1. 用户通过前端提交宠物数据
2. 后端使用 AI 智能体处理（LangChain）
3. 生成推理树并哈希
4. 结果存储到链上（Monad）
5. 铸造/更新动态 NFT
6. 前端展示结果和推理透明度

## 🧪 测试

```bash
# 运行所有测试
pnpm test:all

# 测试特定包
pnpm --filter @petsuite/backend test
pnpm --filter @petsuite/contracts test
```

## 🚢 部署

### 后端
```bash
cd packages/backend
pnpm build
# 部署到你喜欢的托管平台（Railway、Render 等）
```

### 前端
```bash
cd packages/frontend
pnpm build
# 将 dist/ 部署到 Vercel、Netlify 等
```

### 合约
```bash
pnpm deploy:contracts --network monad
# 在 packages/shared/constants/contracts.ts 中更新合约地址
```

## 🛠️ 开发工作流

### 添加新依赖

```bash
# 给特定包添加依赖
pnpm --filter @petsuite/backend add express

# 添加开发依赖
pnpm --filter @petsuite/frontend add -D vitest

# 给共享包添加依赖
pnpm --filter @petsuite/shared add lodash
```

### 运行包内命令

```bash
# 在特定包中运行任意脚本
pnpm --filter @petsuite/backend <脚本名>

# 在所有包中运行
pnpm -r <脚本名>

# 并行运行
pnpm -r --parallel test
```

### 构建顺序

共享包必须先构建，因为其他包依赖它：

```bash
# 1. 首先构建共享包
pnpm --filter @petsuite/shared build

# 2. 然后构建其他包
pnpm build:backend
pnpm build:frontend

# 或一次性构建所有（会自动处理依赖顺序）
pnpm build:all
```

## 🎯 Monorepo 优势

1. **代码共享：** 类型和常量无重复
2. **类型安全：** TypeScript 类型跨包共享
3. **原子提交：** 相关改动在一个 commit 中
4. **高效 CI：** 仅测试受影响的包
5. **易于上手：** 一个命令完成新人设置
6. **未来可拆分：** 需要时可轻松拆分成独立仓库

## 📋 常见任务

### 初次设置

```bash
# 1. 克隆项目
git clone <你的仓库地址>
cd petsuite

# 2. 运行自动设置脚本
./scripts/setup.sh

# 3. 启动开发服务器
pnpm dev:backend    # 终端 1
pnpm dev:frontend   # 终端 2
```

### 检查项目结构

```bash
# 验证 Monorepo 配置是否正确
./scripts/check-structure.sh
```

### 清理项目

```bash
# 清理所有构建产物和缓存
pnpm clean

# 完全重新安装
rm -rf node_modules packages/*/node_modules
pnpm install
```

## 🐛 故障排除

### 问题：找不到 '@petsuite/shared' 模块

**解决方案：** 先构建共享包
```bash
pnpm --filter @petsuite/shared build
```

### 问题：前端构建失败（vue-tsc 错误）

**解决方案：** 更新 vue-tsc 版本
```bash
pnpm --filter @petsuite/frontend add -D vue-tsc@latest
```

### 问题：后端类型错误

**说明：** 这些是代码本身的问题，与 Monorepo 迁移无关

**解决方案：** 修复代码中的类型错误或调整 tsconfig 配置

### 问题：pnpm 命令找不到

**解决方案：** 安装 pnpm
```bash
npm install -g pnpm
# 或使用 nvm
nvm use 22  # 确保使用正确的 Node 版本
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支（`git checkout -b feature/amazing-feature`）
3. 提交你的改动（`git commit -m 'Add amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 开启 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- 为 [Monad Madness 黑客松](https://monad.xyz) 构建
- 赛道 3：Agent-powered Apps
- 由 OpenAI、LangChain 和 Monad 区块链驱动

## 📞 联系方式

- 网站：[petsuite.xyz](https://petsuite.xyz)
- Twitter：[@PetSuiteAI](https://twitter.com/PetSuiteAI)
- Discord：[加入我们的社区](https://discord.gg/petsuite)

## 🔗 相关文档

- [Monorepo 迁移指南](MONOREPO_MIGRATION.md) - 详细的迁移文档和故障排除
- [快速开始指南](QUICKSTART.md) - 简化版入门指南
- [项目实现总结](IMPLEMENTATION_SUMMARY.md) - 技术实现细节

---

用 ❤️ 打造，PetSuite 团队出品 🐾
