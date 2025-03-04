import { ResponseMode } from '@/typings/params'
import { RouteLocationNormalized } from 'vue-router'
import store from '../../store'

export async function syncIng(to: RouteLocationNormalized) {
  initBusinessData()
  const { success }: ResponseMode = await doAuth(to)
  // if (!success) throw Error('授权失败')
}

/**
 * 初始化业务数据
 */
export async function initBusinessData() {
  // 字典值
  const { isLoadedDict } = store.getters || {}
  if (!isLoadedDict) {
    // await store.dispatch('initDict');
  }
}

/**
 * 认证
 * @param to
 */
export async function doAuth(to: RouteLocationNormalized): Promise<any> {
  const result: ResponseMode = { success: store.getters.isLogin }
  try {
    if (store.getters.isLogin) return result
    const { VITE_ENV, VITE_USERNAME, VITE_PASSWORD } = import.meta.env
    // await store.dispatch('authZlb')
    // await store.dispatch('authZzd')
    if (VITE_ENV === 'development') {
      // const { status }: ResponseMode = await store.dispatch('login', {
      //   username: VITE_USERNAME,
      //   password: VITE_PASSWORD
      // });
      // result.success = status === 200;
    }
    return result
  } catch (error) {
    return result
  }
}
