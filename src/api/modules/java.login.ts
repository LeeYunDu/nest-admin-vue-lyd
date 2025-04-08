import { ApiProxy } from '@/config'
import request from '../request'
const prefix = ApiProxy.java.main

// 获取登录验证码
export function getLoginCodeApi (): Promise<any> {
  return request({
    url: prefix + '/captchaImage',
    type: 'GET',

  }, {
    headers: {
      isToken: false
    },
  })
}


