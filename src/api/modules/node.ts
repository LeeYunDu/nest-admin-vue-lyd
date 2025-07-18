/**
 * node common apis
 */

import { ApiProxy } from '@/config'
import request from '../request'

// url 前缀
const prefix = ApiProxy.node.main

// base64获取
export function nFileBase64ById (id: string | number) {
  return request({
    url: prefix + '/file/base64/' + id,
    type: 'GET'
  })
}

// 微信用户信息
export function nWechatUserInfo (id: string | number) {
  return request({
    url: prefix + '/wechat/userInfo/' + id,
    type: 'GET'
  })
}
