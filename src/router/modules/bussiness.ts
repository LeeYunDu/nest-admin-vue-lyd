import { get } from 'lodash-es'
export const bussinessRoutes: Array<any> = [
  {
    path: '/template',
    name: 'Template',
    component: () => import('@/layouts/router.vue'),
    meta: { permission: false, title: '模版页面示例', showHeader: true, showSide: true },
    redirect: '/template/list',
    children: [
      {
        path: 'list',
        name: 'TemplateList',
        component: () => import('@/pages/template/list.vue'),
        meta: { permission: false, title: '列表页面', showHeader: true, showSide: true }
      },
      {
        path: 'add-page',
        name: 'TemplateAdd',
        component: () => import('@/pages/template/add.vue'),
        meta: { permission: false, title: '新增页面', showHeader: true, showSide: true }
      },
      {
        path: 'detail-page',
        name: 'TemplateDetail',
        component: () => import('@/pages/template/detail.vue'),
        meta: { permission: false, title: '详情页面', showHeader: true, showSide: true }
      }
    ]
  },

]


export const useBussinessRoutes = () => {
  // 处理路由的数据结构，以达到aside侧边栏菜单组件的格式
  const handleRoutes = bussinessRoutes.map((module, index) => {
    const extra = {
      name: get(module, 'meta.title', '未命名菜单'),
      hidden: 1,// 0为隐藏，1为显示
      routerPath: get(module, 'path', ''),
      children: get(module, 'children', []).map((child: any) => {
        return {
          name: get(child, 'meta.title', '未命名菜单'),
          hidden: 1,// 0为隐藏，1为显示
          routerPath: module.path + '/' + get(child, 'path', ''),
        }
      })
    }
    return extra
  })

  return handleRoutes
}


