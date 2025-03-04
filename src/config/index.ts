const { VITE_PROJECT_BASE, VITE_APP_BASE_API } = import.meta.env

export const BaseConfig = {
  portalBaseUrl: `/${String(VITE_PROJECT_BASE)}`,
  domain: window.origin
}

// api代理
export const ApiProxy = {
  java: {
    // 主应用
    main: VITE_APP_BASE_API
  }
}

export const App = {
  domain: location.origin
}

// 当前项目相关
export default {
  project: {
    id: 421,
    name: '模版项目',
    cacheView: true,
    meta: {
      // 用到的文件夹id集合
      folders: [2164]
    }
  },
  component: {
    prefix: 'el-'
  },
  iconfont: {
    prefix: 'iconfont'
  },
  dictData: {}
}
