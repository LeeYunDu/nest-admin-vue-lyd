import { nProjectOne } from '@/api'
import Config, { BaseConfig } from '@/config'
import { ResponseMode } from '@/typings/params'
import store from '..'

const app = {
  state: () => ({
    app: {},
    theme: import.meta.env.VITE_THEME,
    mode: 'static',
    micro: {
      apps: {},
      currentApp: {},
      working: false
    }
  }),

  getters: {
    app: (state: any): any => state.app,
    theme: (state: any): any => state.theme,
    micro: (state: any): any => state.micro,
    mode: (state: any): any => state.mode,
    projectId: (): number => Config.project.id
  },

  mutations: {
    SET_APP(state: any, data: any) {
      state.app = data || {}
    },

    SET_MICRO_APP(state: any, data: any) {
      state.micro.working = true
      state.micro.currentApp = data.micro
      state.micro.apps[data.projectId] = data
    },

    DESTROY_MICRO(state: any) {
      state.micro.working = false
      // state.micro.currentApp = {}
    },

    SET_APP_MODE(state: any, mode: string) {
      state.mode = mode || 'static'
    }
  },

  actions: {
    /**
     * destroy micro
     * @param param0
     */
    async destroyMicro({ commit }: any) {
      commit('DESTROY_MICRO')
    },

    setAppMode({ commit }: any, mode: string) {
      commit('SET_APP_MODE', mode)
    }
  }
}
export default app
