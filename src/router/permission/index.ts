import {
  RouteMeta,
  RouteLocationNormalized,
  NavigationGuardNext
} from 'vue-router'
import router from '..'
import { setTitle } from './util'
import { nextReplace, doNext, addRoutes, getAppInfo } from './state'
import { syncIng } from './async'

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    try {
      const meta: RouteMeta = to.meta
      if (to.matched.length === 0) {
        // 路由不存在，跳转到 404 页面
        next({ name: 'NotFound' })
      } else {
        setTitle(meta)
        // getAppInfo();
        if (meta.permission === false) return next()
        const { router: defaultTo } = await addRoutes()
        await syncIng(to, next)
        if (defaultTo) return nextReplace(to, next)
        doNext(to, from, next)
      }
    } catch (error) {
      console.log(error)
      router.push('/401')
    }
  }
)
