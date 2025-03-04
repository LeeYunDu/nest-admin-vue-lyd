import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  createWebHistory
} from 'vue-router'
import { constantRoutes } from './modules/constant'
import { bussinessRoutes } from './modules/bussiness'
import Layout from '@/layouts/router.vue'

const routes: Array<RouteRecordRaw> = [
  ...constantRoutes,
  ...bussinessRoutes,
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '',
    redirect: '/home',
    component: Layout,
    children: []
  }
]
const router = createRouter({
  // history: createWebHistory(), // 使用 history 模式
  history: createWebHashHistory(),
  routes
})

export default router
