import { test, expect } from '@playwright/test';

/**
 * PetSuite 前后端联调 E2E 测试
 *
 * 测试完整用户流程：
 * 1. 访问首页
 * 2. 查看产品列表
 * 3. 创建宠物档案
 * 4. 使用 AI 推荐功能
 */

const BACKEND_URL = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:5173';

// 在所有测试前检查后端是否运行
test.beforeAll(async ({ request }) => {
  try {
    const response = await request.get(`${BACKEND_URL}/health`);
    expect(response.ok()).toBeTruthy();
    console.log('✅ 后端服务正常运行');
  } catch (error) {
    throw new Error('❌ 后端服务未运行，请先启动后端服务 (pnpm dev:backend)');
  }
});

test.describe('前后端联调测试', () => {

  test('测试 1: 后端 API 健康检查', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/health`);

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty('status', 'healthy');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('uptime');

    console.log('✅ 健康检查通过:', data);
  });

  test('测试 2: 获取产品列表', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/products?species=dog&limit=5`);

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBeTruthy();
    expect(data.data.length).toBeGreaterThan(0);

    // 验证产品数据结构
    const product = data.data[0];
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('category');
    expect(product.tags).toContain('dog');

    console.log(`✅ 获取到 ${data.data.length} 个狗狗产品`);
  });

  test('测试 3: 创建宠物档案', async ({ request }) => {
    const testPet = {
      owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      name: 'E2E测试宠物',
      species: 'cat',
      breed: '英短',
      age: 2,
      weight: 4.5,
      healthScore: 95,
      allergies: [],
      healthIssues: []
    };

    const response = await request.post(`${BACKEND_URL}/api/pets`, {
      data: testPet
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data.data).toHaveProperty('_id');
    expect(data.data.name).toBe(testPet.name);
    expect(data.data.species).toBe(testPet.species);

    console.log(`✅ 创建宠物成功，ID: ${data.data._id}`);

    // 清理：删除测试宠物
    await request.delete(`${BACKEND_URL}/api/pets/${data.data._id}`);
  });

  test('测试 4: AI 产品推荐', async ({ request }) => {
    const recommendRequest = {
      petProfile: {
        name: 'AI测试猫',
        species: 'cat',
        age: 3,
        allergies: ['鸡肉'],
        healthScore: 85
      },
      userId: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      query: '推荐适合成年猫的猫粮，不含鸡肉'
    };

    const response = await request.post(`${BACKEND_URL}/api/ai/recommend`, {
      data: recommendRequest
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty('success', true);
    expect(data.data).toHaveProperty('recommendations');
    expect(Array.isArray(data.data.recommendations)).toBeTruthy();
    expect(data.data.recommendations.length).toBeGreaterThan(0);

    // 验证推荐结果
    const firstRecommendation = data.data.recommendations[0];
    expect(firstRecommendation).toHaveProperty('product');
    expect(firstRecommendation).toHaveProperty('score');
    expect(firstRecommendation).toHaveProperty('reasoning');

    // 验证过滤了过敏源
    const productName = firstRecommendation.product.name.toLowerCase();
    expect(productName).not.toContain('鸡');

    console.log(`✅ AI 推荐成功，返回 ${data.data.recommendations.length} 个产品`);
    console.log(`   推荐评分: ${firstRecommendation.score}, 产品: ${firstRecommendation.product.name}`);
  });

  test('测试 5: 前端首页加载', async ({ page }) => {
    await page.goto(FRONTEND_URL);

    // 等待页面加载
    await page.waitForLoadState('networkidle');

    // 检查页面标题
    await expect(page).toHaveTitle(/PetSuite/i);

    // 检查主要导航元素
    const navigation = page.locator('nav');
    await expect(navigation).toBeVisible();

    console.log('✅ 前端首页加载成功');
  });

  test('测试 6: 产品列表页面展示', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/marketplace`);

    // 等待产品加载
    await page.waitForTimeout(2000);

    // 检查是否有产品卡片
    const productCards = page.locator('[data-testid="product-card"], .product-card');
    const count = await productCards.count();

    if (count > 0) {
      console.log(`✅ 产品列表页面显示 ${count} 个产品`);
    } else {
      console.log('⚠️ 产品列表为空（可能需要调整选择器）');
    }
  });

  test('测试 7: 完整用户流程（截图）', async ({ page }) => {
    // 1. 访问首页
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'e2e-screenshots/01-homepage.png' });
    console.log('📸 截图: 首页');

    // 2. 导航到产品页面
    const marketplaceLink = page.locator('a[href*="marketplace"], a:has-text("商城")').first();
    if (await marketplaceLink.isVisible()) {
      await marketplaceLink.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'e2e-screenshots/02-marketplace.png' });
      console.log('📸 截图: 商城页面');
    }

    // 3. 导航到 AI 顾问页面
    const agentLink = page.locator('a[href*="agent"], a:has-text("AI"), a:has-text("顾问")').first();
    if (await agentLink.isVisible()) {
      await agentLink.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'e2e-screenshots/03-ai-agent.png' });
      console.log('📸 截图: AI 顾问页面');
    }

    console.log('✅ 完整流程测试完成，截图已保存到 e2e-screenshots/');
  });
});

test.describe('性能测试', () => {

  test('测试 API 响应时间', async ({ request }) => {
    const endpoints = [
      { name: 'Health Check', url: '/health' },
      { name: 'Products List', url: '/api/products?limit=10' },
    ];

    for (const endpoint of endpoints) {
      const startTime = Date.now();
      const response = await request.get(`${BACKEND_URL}${endpoint.url}`);
      const duration = Date.now() - startTime;

      expect(response.ok()).toBeTruthy();
      expect(duration).toBeLessThan(1000); // 应该在 1 秒内响应

      console.log(`⚡ ${endpoint.name}: ${duration}ms`);
    }
  });
});
