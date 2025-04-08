/**
 * node menu apis
 */

import { DingLoginMode, LoginMode } from '@/typings/params'
import request from '../request'
import { ApiProxy } from '@/config'

const prefix = ApiProxy.java.main

// 账号密码登录
export function uLogin (data: LoginMode): Promise<any> {
  return request({
    url: prefix + '/login',
    type: 'POST',
    params: data || {}
  })
}

// 退出登录
export function uLogout (): Promise<any> {
  return request({
    url: prefix + '/pc/login/loginout',
    type: 'POST'
  })
}

// 登录信息
export function uUserInfo (): Promise<any> {
  return request({
    url: prefix + '/getInfo',
    type: 'GET'
  })
}

// login by token
export function uTokenLogin (data?: any): Promise<any> {
  return request({
    url: prefix + '/pc/login/loginbytoken',
    type: 'POST',
    params: data || {}
  })
}

// 获取ding scan用户信息
export function uDingLogin (data?: DingLoginMode): Promise<any> {
  return request({
    url: prefix + '/pc/zzd/login/getZzdLoginResult',
    type: 'POST',
    params: data || {}
  })
}
