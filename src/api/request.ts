'use strict'
import axios from 'axios'
import { cloneDeep, get } from 'lodash-es'
import router from '@/router'
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'
import store from '@/store'
import { InternalAxiosRequestConfig } from 'axios'
// init
const service = axios.create({
  timeout: 1000 * 60
})
// request
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // config.headers.token = ''
    const token = Cookies.get('token') || ''
    if (token) {
      // 部分项目需要，与后端对接确认
      // config.headers.token = token
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  (error: any) => {
    console.log(error)
    Promise.reject(error)
  }
)
// response
service.interceptors.response.use(
  (response: any) => {
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data

    // 处理文件类型接口报错
    if (dataAxios.type && dataAxios.type.includes('application/json')) {
      const reader = new FileReader()
      reader.onload = function () {
        const content = reader.result
        const message = JSON.parse(content as string)
        ElMessage.error(`${message.msg}`)
      }
      reader.readAsText(dataAxios)
      return Promise.reject(response)
    }

    // 这个状态码是和后端约定的
    const { code } = dataAxios
    dataAxios.status = code
    // 根据 code 进行判断
    if (code === undefined) {
      // 如果没有 code 代表这不是项目后端开发的接口
      return dataAxios
    } else {
      // 有 code 代表这是一个后端接口 可以进行进一步的判断
      switch (code) {
        case 200:
          return dataAxios
        case 'xxx':
          // [ 示例 ] 其它和后台约定的 code
          ElMessage.error(
            `[ code: xxx ] ${dataAxios.msg}: ${response.config.url}`
          )
          break
        case 401:
          //清空用户标识 重新登陆
          store.dispatch('clearUserStore')
          return Promise.reject('')
          break
        case 403:
          break
        case 1000:
          ElMessage.error('服务器异常，请联系管理员')
          break
        default:
          console.log(dataAxios)
          // 不是正确的 code
          ElMessage.error(`${dataAxios.msg}`)
          break
      }
    }
  },
  (error: any) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误'
          break
        case 401:
          //清空用户标识 重新登陆
          store.dispatch('clearUserStore')
          // window.location.replace(authLogin(location.href));
          break
        case 403:
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器内部错误'
          break
        case 501:
          error.message = '服务未实现'
          break
        case 502:
          error.message = '网关错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网关超时'
          break
        case 505:
          error.message = 'HTTP版本不受支持'
          break
        default:
          error.message = '网络异常'
          break
      }
    }

    if (
      get(error, 'response.status') !== 401 &&
      get(error, 'response.status') !== 403
    ) {
      console.log(error)
    }
    return Promise.reject(error)
  }
)

// ajax entry
const suffix = '' // 后缀
const ajax = function (obj: any, config?: any) {
  const _suffix = obj.suffix !== undefined ? obj.suffix : suffix
  const url = obj.url + _suffix
  const type = obj.type ? obj.type.toUpperCase() : 'GET'
  const uConfig = Object.assign({}, config || {})
  const params = obj.params
  switch (type) {
    case 'POST':
      return service.post(url, params, { ...uConfig })
    case 'PUT':
      return service.put(url, params, { ...uConfig })
    case 'DELETE':
      return service.delete(url, { ...uConfig })
    default:
      return service.get(url, { params: params, ...uConfig })
      break
  }
}

export default ajax
