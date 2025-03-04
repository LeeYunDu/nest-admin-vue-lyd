export const bussinessRoutes: Array<any> = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/home/index.vue'),
    meta: {
      permission: false,
      title: 'template'
    }
  },
]
