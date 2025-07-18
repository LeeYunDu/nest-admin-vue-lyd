/**
 * node apis
 */

import request from '../request'
import { ApiProxy } from '@/config'

// url 前缀
const prefix = ApiProxy.node.main

// 角色获取
export function nRoleUserPage (data: any) {
  return request({
    url: prefix + '/role-user/query',
    type: 'POST',
    params: data || {}
  })
}
