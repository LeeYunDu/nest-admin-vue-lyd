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
      setTitle(meta)
      // getAppInfo();

      if (meta.permission === false) return next()

      const { router: defaultTo } = await addRoutes()
      await syncIng(to)
      if (defaultTo) return nextReplace(to, next)

      doNext(to, from, next)
    } catch (error) {
      console.log(error)
      router.push('/401')
    }
  }
)
