import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../store/auth'

// Layouts
import UserLayout from '../layouts/UserLayout.vue'
import MerchantLayout from '../layouts/MerchantLayout.vue'
import DarkLayout from '../layouts/DarkLayout.vue'

// User Views
import Home from '../views/Home.vue'
import MyPets from '../views/MyPets.vue'
import CreateProfile from '../views/CreateProfile.vue'
import AIAdvisor from '../views/AIAdvisor.vue'
import MyNFTs from '../views/MyNFTs.vue'
import Dashboard from '../views/Dashboard.vue'

// Dark Theme Views
import DarkAIAdvisor from '../views/DarkAIAdvisor.vue'

// Merchant Views (lazy-loaded)
const MerchantDashboard = () => import('../views/merchant/Dashboard.vue')
const MerchantProducts = () => import('../views/merchant/Products.vue')
const MerchantOrders = () => import('../views/merchant/Orders.vue')
// const MerchantCustomers = () => import('../views/merchant/Customers.vue')
// const MerchantPayments = () => import('../views/merchant/Payments.vue')
// const MerchantNFTBenefits = () => import('../views/merchant/NFTBenefits.vue')
// const MerchantAnalytics = () => import('../views/merchant/Analytics.vue')
const MerchantSettings = () => import('../views/merchant/Settings.vue')

const routes: RouteRecordRaw[] = [
  // ==================== C 端路由 ====================
  {
    path: '/',
    component: UserLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
      },
      {
        path: 'my-pets',
        name: 'MyPets',
        component: MyPets,
      },
      {
        path: 'create-profile',
        name: 'CreateProfile',
        component: CreateProfile,
      },
      {
        path: 'ai-advisor',
        name: 'AIAdvisor',
        component: AIAdvisor,
      },
      {
        path: 'my-nfts',
        name: 'MyNFTs',
        component: MyNFTs,
      },
      {
        path: 'marketplace',
        name: 'Marketplace',
        component: () => import('../views/Marketplace.vue'),
      },
      {
        path: 'marketplace/:id',
        name: 'ProductDetail',
        component: () => import('../views/ProductDetail.vue'),
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('../views/Checkout.vue'),
      },
      {
        path: 'my-orders',
        name: 'MyOrders',
        component: () => import('../views/MyOrders.vue'),
      },
      {
        path: 'become-merchant',
        name: 'BecomeAMerchant',
        component: () => import('../views/BecomeAMerchant.vue'),
      },
    ],
  },

  // ==================== 深色主题路由（新UI）====================
  {
    path: '/dark',
    component: DarkLayout,
    children: [
      {
        path: '',
        name: 'DarkHome',
        component: Dashboard,
      },
      {
        path: 'my-pets',
        name: 'DarkMyPets',
        component: MyPets,
      },
      {
        path: 'ai-advisor',
        name: 'DarkAIAdvisor',
        component: DarkAIAdvisor,
      },
      {
        path: 'my-nfts',
        name: 'DarkMyNFTs',
        component: MyNFTs,
      },
      {
        path: 'marketplace',
        name: 'DarkMarketplace',
        component: () => import('../views/Marketplace.vue'),
      },
    ],
  },

  // ==================== B 端路由 ====================
  {
    path: '/merchant',
    component: MerchantLayout,
    meta: { requiresMerchant: true },
    children: [
      {
        path: '',
        redirect: '/merchant/dashboard',
      },
      {
        path: 'dashboard',
        name: 'MerchantDashboard',
        component: MerchantDashboard,
        meta: { requiresMerchant: true },
      },
      {
        path: 'products',
        name: 'MerchantProducts',
        component: MerchantProducts,
        meta: { requiresMerchant: true },
      },
      {
        path: 'orders',
        name: 'MerchantOrders',
        component: MerchantOrders,
        meta: { requiresMerchant: true },
      },
      // {
      //   path: 'customers',
      //   name: 'MerchantCustomers',
      //   component: MerchantCustomers,
      //   meta: { requiresMerchant: true },
      // },
      // {
      //   path: 'payments',
      //   name: 'MerchantPayments',
      //   component: MerchantPayments,
      //   meta: { requiresMerchant: true },
      // },
      // {
      //   path: 'nft-benefits',
      //   name: 'MerchantNFTBenefits',
      //   component: MerchantNFTBenefits,
      //   meta: { requiresMerchant: true },
      // },
      // {
      //   path: 'analytics',
      //   name: 'MerchantAnalytics',
      //   component: MerchantAnalytics,
      //   meta: { requiresMerchant: true },
      // },
      {
        path: 'settings',
        name: 'MerchantSettings',
        component: MerchantSettings,
        meta: { requiresMerchant: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Route Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 需要商家权限的路由
  if (to.meta.requiresMerchant) {
    if (!authStore.isConnected) {
      // 未连接钱包，重定向到首页
      return next({ path: '/', query: { redirect: to.fullPath } })
    }

    if (!authStore.isMerchant) {
      // 没有商家权限，引导用户申请成为商家
      alert('您还不是商家，请先申请商家账户')
      return next('/become-merchant')
    }
  }

  next()
})

export default router
