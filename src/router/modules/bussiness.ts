export const bussinessRoutes: Array<any> = [
  {
    path: '/project',
    name: 'Project',
    component: () => import('@/layouts/router.vue'),
    redirect: '/project/project-list',
    meta: {
      permission: false,
      title: '项目管理'
    },
    children: [
      {
        path: 'project-list',
        name: 'ProjectList',
        component: () => import('@/pages/project/index.vue')
      }
    ]
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('@/layouts/router.vue'),
    redirect: '/menu/menu-list',
    meta: {
      title: '菜单管理',
      permission: true,
      showHeader: false,
      showSide: true
    },
    children: [
      {
        path: 'menu-list',
        name: 'MenuList',
        component: () => import('@/pages/menu/index.vue')
      }
    ]
  }
]
