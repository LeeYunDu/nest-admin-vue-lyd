import { nMenuList, nRoleUserQuery } from '@/api'
import Config from '@/config'
import { isArray, transformToTree } from '@/utils'
import { cloneDeep, maxBy } from 'lodash-es'
import { MetaMode } from '@/typings/store'
import Layout from '@/layouts/index.vue'
import { MenuMode } from '@/typings/data'
import store from '..'

const modules = import.meta.glob('../../**/*.vue')
const defaultComponent = modules['../../views/common/view.vue']

export const loadComponent = (view: string) => {
  try {
    if (!view) return Layout
    const path = view.substring(0, 1) === '/' ? view.substring(1, view.length) : view
    return modules['../../' + path + '.vue'] || defaultComponent
  } catch (error) {
    return defaultComponent
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter (asyncRouterMap: any[], parentRoute?: any) {
  return asyncRouterMap.filter((route: any) => {
    let flag = true
    const pageType = route.pageType
    switch (pageType) {
      // component
      case 1:
        route.component = loadComponent(String(route.component))
        break

      // iframe
      case 2:
        route.component = loadComponent('views/common/iframe')
        break

      // outlink
      case 3:
        route.component = loadComponent('views/common/source')
        route.path = route.path || '/views/source/view'
        flag = false
        break

      default:
        break
    }

    if (parentRoute) {
      route._ids = [].concat(parentRoute?._ids, route._ids || [route.id])
    } else {
      route._ids = [route.id]
    }

    // 重命名children 与 路由children重名
    if (route.menuType === 2) {
      delete route.children
    }

    // 组装 路由路径
    route.routerPath = (parentRoute?.routerPath || '') + (route.path.substring(0, 1) === '/' ? route.path : `/${route.path}`)
    route.routerPath = String(route.routerPath).replace('//', '/')

    const options = JSON.parse(route.options || '{}')
    route.meta = {
      title: route.name,
      permission: options.permission !== 0,
      data: cloneDeep(route)
    } as MetaMode

    // route.hidden === 1: 显示
    if ([1].includes(route.menuType) && route.hidden === 1 && isArray(route.children) && route.children?.length) {
      route.children = filterAsyncRouter(route.children, route)
    }
    return flag
  })
}
export interface MenusMode {
  asyncMenus: MenuMode[]
  treeMenus: MenuMode[]
  headerMenus: MenuMode[]
  jsonMenus: { [keys: string]: MenuMode[] }
  jsonAsyncMenus: { [keys: string]: MenuMode }
  appMenus?: MenusMode
}
export interface LoadMenuParamsMode {
  projectId: string | number
}

export interface LoadMenusResultMode {
  menus: MenusMode
}

function getAppMenus (data: any, options: any) {
  const { pathPrefix } = options || {}
  const menus: MenuMode[] = data || []
  const list = menus.map((item: any) => {
    item.label = item.name
    return item
  })
  if (list.length < 1) return
  const asyncMenus = list.map((item: MenuMode) => {
    item.path = `${pathPrefix ?? ''}${item.path}`
    return item
  })
  const [treeMenus, jsonMenus, jsonAsyncMenus] = transformToTreeAndClassify(list)
  const headerMenus: MenuMode[] = []
  treeMenus.map((fm: MenuMode) => headerMenus.push(fm))

  return {
    asyncMenus,
    treeMenus,
    headerMenus,
    jsonMenus,
    jsonAsyncMenus
  } as MenusMode
}

function gerPermissionMenus (data: any[], options: any): MenusMode {
  const defalutResult = {} as MenusMode
  if (!data?.length) return defalutResult
  const { pathPrefix, allJsonMeuns } = options || {}
  const menus: MenuMode[] = []
  let permissionIds: any = data.map((role: any) => role.roleMenuPermission || []).flat() || []
  permissionIds = [...(new Set(permissionIds) as any)]
  permissionIds.map((id: number) => {
    if (!allJsonMeuns[id]) return
    const useItem = cloneDeep(allJsonMeuns[id])
    delete useItem.children
    menus.push(useItem)
  })
  if (!menus?.length) return defalutResult
  const asyncMenus = menus.map((item: MenuMode) => {
    item.path = `${pathPrefix ?? ''}${item.path}`
    return item
  })
  const [treeMenus, jsonMenus, jsonAsyncMenus] = transformToTreeAndClassify(menus)
  const headerMenus: MenuMode[] = []
  treeMenus.map((fm: MenuMode) => headerMenus.push(fm))

  return {
    asyncMenus,
    treeMenus,
    headerMenus,
    jsonMenus,
    jsonAsyncMenus
  } as MenusMode
}

export async function loadMenus (options: any): Promise<LoadMenusResultMode> {
  const { projectId, pathPrefix } = options || {}
  if (!projectId) return {} as LoadMenusResultMode
  const user = store.getters.user
  const menus: MenusMode = {
    asyncMenus: [],
    treeMenus: [],
    headerMenus: [],
    jsonMenus: {},
    jsonAsyncMenus: {} as any,
    appMenus: {} as any
  }
  try {
    const [...datas] = await Promise.all([
      // 所有菜单
      nMenuList(projectId).catch(err => err),
      // 权限菜单
      nRoleUserQuery({ projectId, userId: user.userId }).catch(err => err)
    ])
    datas && datas.map(({ data }: any, index) => {
      switch (true) {
        case index === 0:
          menus.appMenus = getAppMenus(data, { pathPrefix })
          break
        case index === 1:
          const roles = data?.list || []

          setUserRole(roles)
          let result = menus.appMenus || {} as MenusMode
          if (roles?.length > 0) {
            result = gerPermissionMenus(roles, { allJsonMeuns: menus.appMenus?.jsonAsyncMenus, pathPrefix })
          }

          // TODO 登录功能做了后，第185行代码需注释
          result = menus.appMenus || {} as MenusMode

          menus.asyncMenus = result.asyncMenus || []
          menus.treeMenus = result.treeMenus || []
          menus.headerMenus = result.headerMenus || []
          menus.jsonMenus = result.jsonMenus || {}
          menus.jsonAsyncMenus = result.jsonAsyncMenus || {}
          break
        default: break
      }
    })
    return { menus } as LoadMenusResultMode
  } catch (error) {
    console.log(error)
    return { menus } as LoadMenusResultMode
  }
}

function setUserRole (data: any[]) {
  const maxRole: any = maxBy(data, (o: any) => o.roleMenuPermission?.length) || {}
  store.dispatch('setUserRole', { roleKey: maxRole.roleKey, roleName: maxRole.roleName })
}

function transformToTreeAndClassify (menus: MenuMode[]) {
  const jsonMenus = {} as any
  const transMenus = cloneDeep(menus)
  const treeMenus = transformToTree(transMenus, { idKey: 'sid' })
  const jsonAsyncMenus = {} as any
  transMenus.map((menu: MenuMode) => {
    const menuType = String(menu.menuType)
    if (!jsonMenus[menuType]) (jsonMenus[menuType] = [])
    jsonMenus[menuType].push(menu)
    jsonAsyncMenus[String(menu.id)] = menu
  })
  return [treeMenus, jsonMenus, jsonAsyncMenus]
}

// 获取默认路由
const loopGetDefaultRoute = (route: any): any => {
  if (route && route.children && route.children.length) {
    return loopGetDefaultRoute(route.children[0])
  }
  return route
}

const menu = {
  state: () => ({
    routes: [],

    menus: {}
  }),

  getters: {
    menus: (state: any) => state.menus
  },

  mutations: {
    SET_MENUS (state: any, data: any) {
      state.menus = data || {}
    }
  },

  actions: {
    async getMenus ({ commit }: any) {
      try {
        const { menus }: LoadMenusResultMode = await loadMenus({ projectId: Config.project.id })
        let routes: Array<any> = []
        routes = filterAsyncRouter(menus.treeMenus)
        const defaultRoute = loopGetDefaultRoute(routes[0])
        if (defaultRoute) {
          routes.push({
            path: '/',
            redirect: defaultRoute.path
          })
        }
        store.dispatch('setRoutes', routes)
        commit('SET_MENUS', menus)
        // 缓存页面
        if (Config.project.cacheView === true) {
          const cdms = menus.jsonMenus[2] || []
          if (cdms.length) {
            store.dispatch('view/initCacheViews', cdms.map((item: MenuMode) => item.sid))
          }
        }
        return { accessRoutes: routes }
      } catch (error) {
        console.log(error)
      }
    },

    // 清除菜单
    async removeMenus ({ commit }: any) {
      commit('SET_MENUS', {})
    }
  }
}
export default menu
