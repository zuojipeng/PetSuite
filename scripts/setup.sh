#!/bin/bash

# PetSuite Monorepo Setup Script
# This script sets up the development environment

set -e

echo "🐾 PetSuite Monorepo Setup"
echo "=========================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "❌ Error: Node.js 18+ is required. Current version: $(node -v)"
  exit 1
fi
echo "✅ Node.js version: $(node -v)"

# Check pnpm installation
echo ""
echo "Checking pnpm installation..."
if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm is not installed. Installing..."
  npm install -g pnpm
else
  echo "✅ pnpm version: $(pnpm -v)"
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
pnpm install

# Build shared package first
echo ""
echo "Building shared package..."
pnpm --filter @petsuite/shared build

# Create .env files if they don't exist
echo ""
echo "Creating environment files..."

if [ ! -f packages/backend/.env ]; then
  cp packages/backend/.env.example packages/backend/.env
  echo "✅ Created packages/backend/.env (please update with your values)"
else
  echo "⏭️  packages/backend/.env already exists"
fi

if [ ! -f packages/frontend/.env ]; then
  cp packages/frontend/.env.example packages/frontend/.env
  echo "✅ Created packages/frontend/.env (please update with your values)"
else
  echo "⏭️  packages/frontend/.env already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env files with your API keys"
echo "  2. Start backend: pnpm dev:backend"
echo "  3. Start frontend: pnpm dev:frontend"
echo "  4. Compile contracts: pnpm compile:contracts"
echo ""
