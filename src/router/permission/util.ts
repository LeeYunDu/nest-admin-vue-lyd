import { RouteMeta } from 'vue-router'

/**
 * 设置title
 * @param {*} param0
 */
export function setTitle (meta: RouteMeta): void {
  document.title = String(meta.title || '')
}

/**
 * 获取默认跳转的路由地址
 * @param routes
 * @returns
 */
export function getDefaultRouter (routes: any) {
  if (!routes || routes.length < 1) return
  let routerMenu: any
  routes && routes.map((item: any) => {
    if (routerMenu) return routerMenu
    if (item.menuType === 2) {
      routerMenu = item
    } else if (item.children && item.children.length > 0) {
      routerMenu = getDefaultRouter(item.children)
    }
  })
  return routerMenu
}
