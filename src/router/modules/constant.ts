export const constantRoutes: Array<any> = [
  // login
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
    meta: { permission: false, name: '登录', title: '登录', showHeader: false }
  },

  // 错误页面
  {
    path: '/401',
    name: '401',
    component: () => import('@/pages/errorPages/401.vue'),
    meta: { permission: false, showHeader: false }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/pages/errorPages/404.vue'),
    meta: { permission: false, showHeader: false }
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/pages/errorPages/500.vue'),
    meta: { permission: false, showHeader: false }
  },

]
