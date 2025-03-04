import { createStore } from 'vuex'
import AppModule from './modules/app'
import LoginModule from './modules/login'
import UserModule from './modules/user'
import RouterModule from './modules/router'
import DataModule from './modules/data'

const store = createStore({
  modules: {
    /**
     * 系统配置相关
     */
    AppModule,

    /**
     * 登录/退出登录
     */
    LoginModule,

    /**
     * 用户相关
     */
    UserModule,

    /**
     * 路由相关
     */
    RouterModule,

    /**
     * 数据
     */
    DataModule
  }
})

export { store, store as default }
