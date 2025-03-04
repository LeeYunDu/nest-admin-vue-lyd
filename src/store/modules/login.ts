import { uLogin, uLogout, uTokenLogin } from '@/api'
import { DingLoginMode, LoginMode, ResponseMode } from '@/typings/params'
import store from '..'
import { ElMessage } from 'element-plus'
import { ActionContext } from 'vuex'
import { LoginStoreMode } from '@/typings/store'
import Cookie from 'js-cookie'

export interface LoginRedirect {
  path?: string
  type?: string
  query?: any
}

const app = {
  state: () => ({
    system: {},
    loginInfo: {
      token: sessionStorage.getItem('LOGIN_TOKEN')
    } as LoginStoreMode,
    redirect: {
      path: '',
      type: '',
      query: {}
    } as LoginRedirect
  }),

  getters: {
    loginInfo: (state: any): any => state.loginInfo,
    redirect: (state: any): any => state.redirect
  },

  mutations: {
    SET_LOGIN_INFO(state: any, data: any) {
      const { token } = data || {}
      const useToken = Cookie.get('LOGIN_TOKEN') || token || ''
      state.loginInfo.token = useToken
      sessionStorage.setItem('LOGIN_TOKEN', useToken)
    },

    CLEAR_LOGIN_INFO(state: any) {
      state.loginInfo = {}
      Cookie.set('LOGIN_TOKEN', '')
      sessionStorage.setItem('LOGIN_TOKEN', '')
    },

    SET_LOGIN_REDIRECT(state: any, data: any) {
      state.redirect = data || {
        path: '',
        type: '',
        query: {}
      }
    }
  },

  actions: {
    // 账号密码登录
    async login(
      { commit }: ActionContext<LoginStoreMode, any>,
      params: LoginMode
    ) {
      try {
        let result: any
        const data = await uLogin(params)
        // 获取用户信息
        Cookie.set('realName', data.realName)
        Cookie.set('token', data.token)
        result = await store.dispatch('getUserInfo')
        result = Object.assign(params || {}, data || {}, { success: true })
        commit('SET_LOGIN_INFO', result)
        return result
      } catch (error) {
        console.log(error)
      }
    },

    // login by token
    async tokenLogin({ commit }: any, token: string) {
      try {
        let result: any
        const { data, status, errMsg }: any =
          (await uTokenLogin({ token })) || {}
        if (status !== 200) {
          result = { success: false, status, data }
          ElMessage.error(errMsg)
        } else {
          commit('SET_LOGIN_INFO', data)
          result = await store.dispatch('getUserInfo')
        }
        return result
      } catch (error) {
        console.log(error)
      }
    },

    // 浙政钉扫码登录
    async dingLogin({ commit }: any, params: DingLoginMode) {
      try {
        let result: any
        const { data, status, errMsg } = await uDingLogin(params)
        if (status !== 200 || !data) {
          result = { success: false, status, data }
          ElMessage.error(errMsg)
        } else {
          commit('SET_LOGIN_INFO', data)
          result = await store.dispatch('getUserInfo')
        }
        return result
      } catch (error) {
        return error
      }
    },

    // 退出
    async logout({ commit }: any) {
      try {
        const { status, errMsg }: ResponseMode = await uLogout()
        if (status !== 200) {
          commit('CLEAR_LOGIN_INFO')
          await store.dispatch('clearUserStore')
          await store.dispatch('removeMenus')
          await store.dispatch('removeRoutes')
          ElMessage.success('退出成功。')
          await store.dispatch('clearUserStore')
          ElMessage.success('退出成功。')
        } else {
          ElMessage.error(errMsg)
        }
        return status === 200
      } catch (error) {
        console.log(error)
      }
    },

    async setLoginRedirect({ commit }: any, data: any) {
      try {
        commit('SET_LOGIN_REDIRECT', data)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
export default app
