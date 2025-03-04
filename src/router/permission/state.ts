import router from '..'
import { get, cloneDeep } from 'lodash-es'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import store from '../../store'
import { getDefaultRouter } from './util'
import { MenuMode } from '@/typings/data'

/**
 * 初始化项目信息
 * @returns
 */
export function getAppInfo() {
  const { app } = store.getters
  if (app && Object.keys(app).length > 0) return
  store.dispatch('getAppInfo')
}

/**
 * add routes
 * @param routes
 * @param parent
 */
export function deepAddRoute(routes?: MenuMode[], parent?: MenuMode) {
  routes &&
    routes.map((item: any) => {
      const menuType = Number(item.menuType)
      if ([1, 2].includes(menuType)) {
        item.name = item.name + item.id
        let useName = parent ? String(parent.name) : 'portalApp'
        if (item.path.indexOf('/micro/') === 0) {
          useName = 'microApp'
        }
        const childMenus: any[] = item.children
        if (menuType === 1) {
          const path = item.path || ''
          const prefixPath = `${parent?.redirect || path}`
          const suffixPath = get(item, 'children[0].path', '')
          item.redirect =
            prefixPath +
            (suffixPath.startsWith('/') ? suffixPath : '/' + suffixPath)
          item.redirect = String(item.redirect).replace('//', '/')
          delete item.children
          router.addRoute(useName, item)
        } else {
          if (item.path.substring(0, 1) !== '/' && !parent) {
            item.path = '/' + item.path
          }
          router.addRoute(useName, item)
        }
        childMenus && deepAddRoute(childMenus, item)
      }
    })
}

/**
 * keep-alive
 * @param {*} to
 * @param {*} from
 */
export function keepAlive(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) {
  if (!to.meta || !from.meta) return
  to.meta.keepAlive = false
  to.meta.destory = false

  const toData: any = to.meta.data || {}
  const fromData: any = from.meta.data || {}
  if (Object.keys(toData).length < 1 || Object.keys(fromData).length < 1)
    return

  if (fromData.componentType === 1 && toData.componentType !== 3) {
    to.meta.destory = true
  }

  if (toData.componentType === 1) {
    to.meta.keepAlive = fromData.componentType === 3
  }
}

/**
 * 入库记录访问
 * @param to
 * @returns
 */
export async function cache(to: RouteLocationNormalized) {
  const matched = to.matched || []
  const names = []
  matched.map((item: any) => {
    item.meta.title && names.push(item.meta.title)
  })
  return true
}

const _fullPath = '/'

/**
 * @param {*} to
 */
export function nextReplace(
  to: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const _to = { ...to, replace: true }
  if (to.path === '/404') _to.path = _fullPath
  const goToPath = _to.path && _to.path === '/'
  const useRouterMenu = getDefaultRouter(store.getters.routes) || {}

  const useTo: any = goToPath ? { path: useRouterMenu.routerPath } : _to
  return next(useTo)
}

// 跳转前
export function doNext(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  if (to.path === '/') {
    return nextReplace(to, next)
  }
  cache(to)
  keepAlive(to, from)
  return next()
}

/**
 * 获取菜单 & 组装路由
 */
export async function addRoutes() {
  const result: any = {
    router: false
  }
  return result

  const asyncMenus = store.getters.menus.asyncMenus || []
  if (asyncMenus.length > 0) {
  } else {
    // 不远程获取数据
    // const { accessRoutes } = (await store.dispatch('getMenus')) || {};
    const accessRoutes: MenuMode[] = []
    deepAddRoute(cloneDeep(accessRoutes))
    if (accessRoutes && accessRoutes.length > 0) {
      result.router = true
    }
  }

  return result
}
