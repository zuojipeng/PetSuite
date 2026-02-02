import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 配置 - PetSuite E2E 测试
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',

  // 测试超时时间
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },

  // 并行运行测试
  fullyParallel: true,

  // 失败重试次数
  retries: process.env.CI ? 2 : 0,

  // 并发worker数量
  workers: process.env.CI ? 1 : undefined,

  // 测试报告
  reporter: [
    ['html'],
    ['list']
  ],

  use: {
    // 基础 URL
    baseURL: 'http://localhost:5173',

    // 追踪配置（失败时记录）
    trace: 'on-first-retry',

    // 截图配置
    screenshot: 'only-on-failure',

    // 视频配置
    video: 'retain-on-failure',
  },

  // 测试项目配置
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // 可选：添加其他浏览器
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Web 服务器配置（可选，如果想让 Playwright 自动启动前端）
  // webServer: {
  //   command: 'pnpm dev',
  //   url: 'http://localhost:5173',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
