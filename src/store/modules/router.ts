import { RouteLocationNormalized } from 'vue-router'
import vueRouter from '../../router'
import { constantRoutes } from '@/router/modules/constant'

function removeRoute(route: any) {
  vueRouter.removeRoute(route.name)
}
const router = {
  state: () => ({
    routes: [],
    currentRoute: {}
  }),

  getters: {
    routes: (state: any) => state.routes,
    currentRoute: (state: any): any => state.currentRoute
  },

  mutations: {
    SET_CURRENT_ROUTE(state: any, data: RouteLocationNormalized) {
      state.currentRoute = data
    },
    SET_ROUTES: (state: any, data: Array<any>) => {
      state.routes = data || []
    }
  },

  actions: {
    removeRoutes() {
      const routes = vueRouter.getRoutes() || []
      if (!routes.length) return
      const constantNames = constantRoutes.map((cr: any) => cr.name)
      routes.map((route: any) => {
        if (!constantNames.includes(route.name)) {
          removeRoute(route)
        }
      })
    },

    setRoutes({ commit }: any, routes: any[]) {
      commit('SET_ROUTES', routes)
    },

    setCurrentRoute({ commit }: any, data: RouteLocationNormalized) {
      commit('SET_CURRENT_ROUTE', data)
    }
  }
}
export default router
