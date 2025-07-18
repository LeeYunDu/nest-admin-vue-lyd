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
  {
    path: '/template',
    name: 'Template',
    component: () => import('@/layouts/router.vue'),
    meta: { permission: false, title: 'template', showHeader: true, showSide: true },
    redirect: '/template/list',
    children: [
      {
        path: 'list',
        name: 'TemplateList',
        component: () => import('@/pages/template/list.vue'),
        meta: { permission: false, title: 'list', showHeader: true, showSide: true }
      },
      {
        path: 'add-page',
        name: 'TemplateAdd',
        component: () => import('@/pages/template/add.vue'),
        meta: { permission: false, title: 'add', showHeader: true, showSide: true }
      },
      {
        path: 'detail-page',
        name: 'TemplateDetail',
        component: () => import('@/pages/template/detail.vue'),
        meta: { permission: false, title: 'detail', showHeader: true, showSide: true }
      }
    ]
  },
]
