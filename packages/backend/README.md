# PetSuite Backend API

PetSuite 的后端 API 服务，提供宠物管理、产品推荐、订单处理和商家管理等功能。

## 🚀 快速开始

### 环境要求

- Node.js >= 18.x
- MongoDB >= 6.0
- pnpm (推荐) 或 npm

### 安装依赖

```bash
# 从项目根目录
pnpm install

# 或者只安装 backend
cd packages/backend
pnpm install
```

### 配置环境变量

创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下变量：

```env
# MongoDB 连接
MONGODB_URI=mongodb://localhost:27017/petsuite

# 服务器端口
PORT=3000

# AI API Keys (可选)
OPENAI_API_KEY=your_openai_key
DEEPSEEK_API_KEY=your_deepseek_key
KIMI_API_KEY=your_kimi_key
```

### 启动 MongoDB

```bash
# 使用 Docker (推荐)
docker run -d -p 27017:27017 --name petsuite-mongo mongo:latest

# 或使用本地 MongoDB
mongod --dbpath ./data
```

### 初始化数据

导入示例产品数据：

```bash
# 构建项目
pnpm build

# 运行数据导入脚本
node dist/scripts/seed-products.js
```

### 启动开发服务器

```bash
# 开发模式（热重载）
pnpm dev

# 或从项目根目录
pnpm dev:backend
```

服务器将在 `http://localhost:3000` 启动。

## 📡 API 端点

### 健康检查

```
GET /health
```

### 宠物管理

```
POST   /api/pets                    # 创建宠物档案
GET    /api/pets/:id                # 获取宠物详情
GET    /api/pets/owner/:address     # 获取用户所有宠物
PUT    /api/pets/:id                # 更新宠物信息
DELETE /api/pets/:id                # 删除宠物档案
```

### AI 服务

```
POST   /api/ai/recommend            # AI 产品推荐
POST   /api/ai/analyze              # 健康分析
GET    /api/ai/history/:userId      # AI 分析历史
GET    /api/ai/analytics/:userId    # AI 使用分析
```

### 产品管理

```
GET    /api/products                # 获取产品列表（支持筛选）
GET    /api/products/search         # 搜索产品
GET    /api/products/:id            # 产品详情
POST   /api/products                # 创建产品
PUT    /api/products/:id            # 更新产品
DELETE /api/products/:id            # 删除产品
```

### 订单管理

```
POST   /api/orders                  # 创建订单
GET    /api/orders/:id              # 获取订单详情
GET    /api/orders/buyer/:address   # 买家订单列表
GET    /api/orders/merchant/:address # 商家订单列表
PUT    /api/orders/:id/status       # 更新订单状态
GET    /api/orders/number/:orderNumber # 通过订单号查询
```

### 商家管理

```
POST   /api/merchant                # 商家注册
GET    /api/merchant/:walletAddress # 获取商家信息
PUT    /api/merchant/:walletAddress # 更新商家信息
GET    /api/merchant/:walletAddress/products # 商家产品列表
GET    /api/merchant/:walletAddress/orders   # 商家订单列表
GET    /api/merchant/:walletAddress/stats    # 商家统计数据
GET    /api/merchant/verified/list  # 认证商家列表
```

## 📦 数据模型

### Pet (宠物档案)
- 基本信息：名称、物种、品种、年龄、体重
- 健康信息：健康评分、过敏源、健康问题
- 饮食限制和推荐

### Product (产品)
- 基本信息：名称、描述、分类、价格
- 商家信息：商家地址
- 库存和销量
- NFT 折扣设置

### Order (订单)
- 订单信息：订单号、买家、商家
- 产品快照
- 价格和折扣信息
- 订单状态和支付哈希

### Merchant (商家)
- 商家信息：店铺名、描述、logo
- 钱包地址
- 统计数据：销售额、订单数
- 认证状态和评分

### AIAnalysis (AI 分析记录)
- 分析类型：健康分析、推荐
- 输入和输出数据
- 置信度和成本
- 使用的 AI 模型

### NFTAsset (NFT 资产)
- Token ID 和所有者
- 宠物关联
- 阶段和等级
- 权益和折扣率

## 🛠️ 开发

### 项目结构

```
packages/backend/
├── src/
│   ├── server.ts              # 服务器入口
│   ├── database/
│   │   └── mongodb.ts         # MongoDB 连接
│   ├── models/                # 数据模型
│   │   ├── Pet.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── Merchant.ts
│   │   ├── AIAnalysis.ts
│   │   └── NFTAsset.ts
│   ├── routes/                # API 路由
│   │   ├── pets.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   ├── merchant.ts
│   │   └── ai.ts
│   └── scripts/               # 工具脚本
│       └── seed-products.ts   # 产品数据导入
├── package.json
└── tsconfig.json
```

### 构建

```bash
pnpm build
```

### 生产环境运行

```bash
pnpm start
```

## 🧪 测试

```bash
pnpm test
```

## 📝 API 使用示例

### 创建宠物档案

```bash
curl -X POST http://localhost:3000/api/pets \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    "name": "布丁",
    "species": "dog",
    "breed": "柯基",
    "age": 5,
    "weight": 12,
    "healthScore": 85,
    "allergies": ["鸡肉"],
    "healthIssues": ["敏感肠胃"]
  }'
```

### AI 产品推荐

```bash
curl -X POST http://localhost:3000/api/ai/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "petProfile": {
      "name": "布丁",
      "species": "dog",
      "age": 5,
      "allergies": ["鸡肉"]
    },
    "userId": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    "query": "推荐适合敏感肠胃的狗粮"
  }'
```

### 创建订单

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "buyerAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
    "productId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "quantity": 1,
    "nftTokenId": "1"
  }'
```

## 🔧 故障排除

### MongoDB 连接失败

确保 MongoDB 正在运行：
```bash
# 检查 MongoDB 状态
mongosh --eval "db.adminCommand('ping')"
```

### 端口已被占用

修改 `.env` 文件中的 `PORT` 变量，或停止占用端口的进程：
```bash
lsof -ti:3000 | xargs kill -9
```

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！
