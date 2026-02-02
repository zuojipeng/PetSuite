#!/bin/bash

# PetSuite 开发环境启动脚本

echo "🚀 启动 PetSuite 开发环境..."
echo ""

# 检查是否已经创建了 .env 文件
if [ ! -f packages/backend/.env ]; then
  echo "📝 复制后端环境配置文件..."
  cp packages/backend/.env.example packages/backend/.env
  echo "⚠️  请编辑 packages/backend/.env 文件，配置MongoDB连接"
  echo ""
fi

# 检查 MongoDB 是否运行
echo "🔍 检查 MongoDB 状态..."
if ! pgrep -x "mongod" > /dev/null; then
  echo "⚠️  MongoDB 未运行"
  echo ""
  echo "请选择启动 MongoDB 的方式："
  echo "1. Docker (推荐):"
  echo "   docker run -d -p 27017:27017 --name petsuite-mongo mongo:latest"
  echo ""
  echo "2. 本地安装:"
  echo "   mongod --dbpath ./data"
  echo ""
  echo "3. Homebrew (Mac):"
  echo "   brew services start mongodb-community"
  echo ""
  read -p "按回车键继续..."
else
  echo "✅ MongoDB 正在运行"
fi

echo ""
echo "📦 构建共享包..."
pnpm --filter @petsuite/shared build

echo ""
echo "📦 构建后端..."
pnpm --filter @petsuite/backend build

echo ""
echo "🌱 导入示例产品数据..."
echo "您想要导入示例产品数据吗？(y/n)"
read -p "> " import_data

if [ "$import_data" = "y" ] || [ "$import_data" = "Y" ]; then
  node packages/backend/dist/scripts/seed-products.js
  echo "✅ 产品数据导入完成"
fi

echo ""
echo "✅ 开发环境准备完成！"
echo ""
echo "现在可以启动服务:"
echo "  • 后端: pnpm dev:backend  (端口 3000)"
echo "  • 前端: pnpm dev:frontend (端口 5173)"
echo ""
echo "或者同时启动:"
echo "  pnpm dev"
