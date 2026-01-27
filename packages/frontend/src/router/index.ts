import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import CreateProfile from '../views/CreateProfile.vue'
import AIAdvisor from '../views/AIAdvisor.vue'
import MyNFTs from '../views/MyNFTs.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/create-profile',
    name: 'CreateProfile',
    component: CreateProfile,
  },
  {
    path: '/ai-advisor',
    name: 'AIAdvisor',
    component: AIAdvisor,
  },
  {
    path: '/my-nfts',
    name: 'MyNFTs',
    component: MyNFTs,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
