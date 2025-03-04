import router from '@/router'
import store from '@/store'
import { LoginRedirect } from '@/store/modules/login'

export interface MicroMode {
  showMenu?: boolean
}

export class Micro {
  constructor (argOpts?: any) {
    this.options = argOpts?.micro
  }

  // micro opts
  options: MicroMode = {}

  // showMenu
  showMenu: boolean = this.options.showMenu === true

  // login
  login (options: LoginRedirect = {}) {
    const { path } = options
    store.dispatch('setLoginRedirect', { path: path || '', type: 'link' })
    router.push('/login')
  }

  // logout
  logout (options: LoginRedirect = {}) {
    const { path } = options
    store.dispatch('setLoginRedirect', { path: path || '', type: 'link' })
    store.dispatch('logout')
  }
}

export const micro = new Micro()
