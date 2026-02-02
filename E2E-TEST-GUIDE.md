# PetSuite E2E 自动化测试指南

## ✅ 测试已完成并通过

刚刚成功运行了 **8 个端到端测试**，全部通过！

### 测试结果摘要

```
✓ 测试 1: 后端 API 健康检查 (51ms)
✓ 测试 2: 获取产品列表 (198ms)
✓ 测试 3: 创建宠物档案 (189ms)
✓ 测试 4: AI 产品推荐 (69ms)
✓ 测试 5: 前端首页加载 (8.7s)
✓ 测试 6: 产品列表页面展示 (5.4s)
✓ 测试 7: 完整用户流程（截图） (5.8s)
✓ 测试 8: API 响应时间 (68ms)

总计: 8 passed (27.4s)
```

---

## 🎯 测试内容

### 后端 API 测试
1. **健康检查** - 验证服务器运行状态
2. **产品列表** - 获取 5 个狗狗产品
3. **创建宠物** - CRUD 操作测试
4. **AI 推荐** - 智能推荐功能，验证过敏源过滤

### 前端 UI 测试
5. **首页加载** - 页面渲染和导航检查
6. **产品展示** - 发现并验证 8 个产品卡片
7. **用户流程** - 完整导航流程（首页→商城→AI顾问）

### 性能测试
8. **API 响应** - 健康检查 20ms，产品列表 40ms

---

## 🚀 如何运行测试

### 前置条件

确保以下服务正在运行：
- ✅ MongoDB (Docker 容器)
- ✅ 后端服务 (localhost:3000)
- ✅ 前端服务 (localhost:5173)

### 运行命令

```bash
# 基本运行（headless 模式）
cd packages/frontend
pnpm test:e2e

# 可视化 UI 模式（推荐）
pnpm test:e2e:ui

# 显示浏览器窗口
pnpm test:e2e:headed

# 调试模式（逐步执行）
pnpm test:e2e:debug
```

---

## 📁 测试文件结构

```
packages/frontend/
├── playwright.config.ts          # Playwright 配置
├── e2e/
│   └── integration.spec.ts       # E2E 测试用例
├── e2e-screenshots/               # 自动截图（失败时）
└── test-results/                  # 测试报告
```

---

## 🎬 测试演示

### 方式 1: 使用 Playwright UI（推荐）

这是最直观的方式，可以看到浏览器自动执行操作：

```bash
cd packages/frontend
pnpm test:e2e:ui
```

**特点**：
- 📊 可视化测试运行界面
- ▶️ 可以单独运行某个测试
- 🐛 内置调试工具
- 📹 查看测试录像
- 📸 查看失败截图

### 方式 2: 显示浏览器窗口

如果想看到浏览器自动操作，但不需要 UI 界面：

```bash
pnpm test:e2e:headed
```

### 方式 3: 调试单个测试

```bash
# 只运行 AI 推荐测试
npx playwright test --grep "AI 产品推荐"

# 调试模式（会暂停等待）
npx playwright test --grep "AI 产品推荐" --debug
```

---

## 📊 测试报告

运行测试后，查看详细报告：

```bash
npx playwright show-report
```

报告包含：
- 每个测试的执行时间
- 失败时的截图和视频
- 网络请求追踪
- 控制台日志

---

## 🔍 测试详情

### 测试 1-4: 后端 API 测试

使用 Playwright 的 `request` API 直接测试后端：

```typescript
const response = await request.get('http://localhost:3000/health');
expect(response.ok()).toBeTruthy();
```

### 测试 5-7: 前端 UI 测试

自动化浏览器操作：

```typescript
await page.goto('http://localhost:5173');
await page.click('a:has-text("商城")');
await expect(page.locator('.product-card')).toBeVisible();
```

### 测试 8: 性能测试

验证 API 响应时间：

```typescript
const startTime = Date.now();
await request.get('/api/products');
const duration = Date.now() - startTime;
expect(duration).toBeLessThan(1000); // < 1秒
```

---

## 🎨 自定义测试

在 `e2e/integration.spec.ts` 中添加新测试：

```typescript
test('你的测试名称', async ({ page, request }) => {
  // 测试逻辑
  await page.goto('http://localhost:5173/your-page');

  // 断言
  await expect(page).toHaveTitle(/预期标题/);
});
```

---

## 🐛 调试技巧

### 1. Playwright Inspector

```bash
pnpm test:e2e:debug
```

- 逐步执行测试
- 查看元素选择器
- 实时修改代码

### 2. 浏览器开发工具

测试失败时，Playwright 会保存：
- 📸 失败截图
- 📹 录像
- 🌐 网络追踪

### 3. 日志输出

在测试中添加：

```typescript
console.log('当前 URL:', page.url());
console.log('响应数据:', await response.json());
```

---

## 🔧 常见问题

### 问题 1: 测试超时

**原因**: 页面加载太慢或元素未找到

**解决**:
```typescript
// 增加超时时间
await page.waitForSelector('.element', { timeout: 10000 });

// 或在配置中全局设置
// playwright.config.ts
timeout: 60 * 1000
```

### 问题 2: 元素未找到

**原因**: 选择器不正确

**解决**:
```bash
# 使用 Playwright 生成选择器
npx playwright codegen http://localhost:5173
```

### 问题 3: 后端未运行

**错误**: `❌ 后端服务未运行`

**解决**:
```bash
# 启动后端
cd packages/backend
pnpm dev
```

---

## 📚 更多资源

- [Playwright 官方文档](https://playwright.dev)
- [测试最佳实践](https://playwright.dev/docs/best-practices)
- [选择器指南](https://playwright.dev/docs/selectors)

---

## 🎯 下一步

1. **持续集成**: 将测试集成到 CI/CD 流程
2. **更多测试**: 添加钱包连接、支付流程等测试
3. **视觉回归**: 使用 Playwright 的视觉对比功能
4. **移动端测试**: 添加移动设备的模拟测试

---

**创建时间**: 2026-02-03
**测试框架**: Playwright v1.58.1
**测试环境**: Chromium
**状态**: ✅ 全部通过
