/**
 * node apis
 */

import request from '../request'
import { ApiProxy } from '@/config'

// url 前缀
const prefix = ApiProxy.node.main

// 角色获取
export function nRolePage (data: any) {
  return request({
    url: prefix + '/role/query',
    type: 'POST',
    params: data || {}
  })
}

// base64获取
export function nRoleById (id: string | number) {
  return request({
    url: prefix + '/role/query/' + id,
    type: 'GET'
  })
}

// 菜单新增
export function nRoleCreate (data: any) {
  return request({
    url: prefix + '/role/create',
    type: 'POST',
    params: data || {}
  })
}

// 更新
export function nRoleUpdate (data: any) {
  return request({
    url: prefix + '/role/update',
    type: 'POST',
    params: data || {}
  })
}

// 角色删除
export function nRoleDelete (id: string | number) {
  return request({
    url: prefix + '/role/' + id,
    type: 'DELETE'
  })
}

// 角色用户关联-新增
export function nRoleUserCreate (data: any) {
  return request({
    url: prefix + '/role-user/create',
    type: 'POST',
    params: data || {}
  })
}

// 角色用户关联-更新
export function nRoleUserUpdate (data: any) {
  return request({
    url: prefix + '/role-user/update',
    type: 'POST',
    params: data || {}
  })
}

// 角色用户关联-获取单条
export function nRoleUserQuery (data: any) {
  return request({
    url: prefix + '/role-user/query',
    type: 'POST',
    params: data || {}
  })
}
