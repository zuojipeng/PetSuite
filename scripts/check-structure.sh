#!/bin/bash

# PetSuite Monorepo Structure Verification Script

echo "🔍 PetSuite Monorepo Structure Check"
echo "====================================="
echo ""

ERRORS=0
WARNINGS=0

# Check critical directories
echo "📁 Checking directory structure..."
REQUIRED_DIRS=(
  "packages/backend"
  "packages/frontend"
  "packages/contracts"
  "packages/shared"
  "docs"
  "scripts"
  ".github/workflows"
)

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo "  ✅ $dir"
  else
    echo "  ❌ $dir (missing)"
    ((ERRORS++))
  fi
done

echo ""
echo "📄 Checking critical files..."
REQUIRED_FILES=(
  "pnpm-workspace.yaml"
  "package.json"
  "README.md"
  "packages/shared/package.json"
  "packages/shared/index.ts"
  ".github/workflows/backend-ci.yml"
  ".github/workflows/frontend-ci.yml"
  ".github/workflows/contracts-ci.yml"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (missing)"
    ((ERRORS++))
  fi
done

echo ""
echo "🔧 Checking package names..."
check_package_name() {
  local pkg_file=$1
  local expected_name=$2

  if [ -f "$pkg_file" ]; then
    local actual_name=$(grep '"name"' "$pkg_file" | head -1 | cut -d'"' -f4)
    if [ "$actual_name" = "$expected_name" ]; then
      echo "  ✅ $expected_name"
    else
      echo "  ⚠️  Expected $expected_name, got $actual_name"
      ((WARNINGS++))
    fi
  fi
}

check_package_name "packages/backend/package.json" "@petsuite/backend"
check_package_name "packages/frontend/package.json" "@petsuite/frontend"
check_package_name "packages/contracts/package.json" "@petsuite/contracts"
check_package_name "packages/shared/package.json" "@petsuite/shared"

echo ""
echo "📦 Checking workspace dependencies..."
for pkg in backend frontend contracts; do
  if grep -q '"@petsuite/shared": "workspace:\*"' "packages/$pkg/package.json" 2>/dev/null; then
    echo "  ✅ $pkg depends on shared"
  else
    echo "  ⚠️  $pkg missing shared dependency"
    ((WARNINGS++))
  fi
done

echo ""
echo "🏗️  Checking build artifacts..."
if [ -d "packages/shared/dist" ]; then
  if [ -f "packages/shared/dist/index.js" ] && [ -f "packages/shared/dist/index.d.ts" ]; then
    echo "  ✅ Shared package built"
  else
    echo "  ⚠️  Shared package not fully built (run: pnpm --filter @petsuite/shared build)"
    ((WARNINGS++))
  fi
else
  echo "  ⚠️  Shared package not built (run: pnpm --filter @petsuite/shared build)"
  ((WARNINGS++))
fi

echo ""
echo "🔍 Checking Node.js and pnpm..."
NODE_VERSION=$(node -v 2>/dev/null)
if [ $? -eq 0 ]; then
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$NODE_MAJOR" -ge 18 ]; then
    echo "  ✅ Node.js $NODE_VERSION"
  else
    echo "  ⚠️  Node.js $NODE_VERSION (18+ recommended)"
    ((WARNINGS++))
  fi
else
  echo "  ❌ Node.js not found"
  ((ERRORS++))
fi

if command -v pnpm &> /dev/null; then
  PNPM_VERSION=$(pnpm -v)
  echo "  ✅ pnpm $PNPM_VERSION"
else
  echo "  ❌ pnpm not found (install with: npm i -g pnpm)"
  ((ERRORS++))
fi

echo ""
echo "======================================"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo "✅ All checks passed! Monorepo is properly configured."
  echo ""
  echo "Next steps:"
  echo "  1. Run: pnpm install"
  echo "  2. Build shared: pnpm --filter @petsuite/shared build"
  echo "  3. Start dev: pnpm dev:backend (in one terminal)"
  echo "  4. Start dev: pnpm dev:frontend (in another terminal)"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo "⚠️  $WARNINGS warning(s) found. Monorepo is functional but has minor issues."
  exit 0
else
  echo "❌ $ERRORS error(s) and $WARNINGS warning(s) found."
  echo "Please fix the errors above before proceeding."
  exit 1
fi
