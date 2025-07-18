/**
 * node menu apis
 */

import { ApiProxy } from '@/config'
import { MenuMode } from '@/typings/data'
import { PromiseRo } from '@/typings/params'
import request from '../request'

// url 前缀
const prefix = ApiProxy.node.main

// 菜单获取
export function nMenuList (projectId: string | number): PromiseRo<MenuMode[]> {
  return request({
    url: prefix + '/menu/list/' + projectId,
    type: 'GET'
  })
}

// 菜单获取
export function nMenuQuery (data: any) {
  return request({
    url: prefix + '/menu/query',
    type: 'POST',
    params: data || {}
  })
}

// 菜单获取
export function nMenuDeep (id: string | number) {
  return request({
    url: prefix + '/menu/query/' + id,
    type: 'GET'
  })
}

// 菜单更新
export function nMenuUpdate (data: any) {
  return request({
    url: prefix + '/menu/update',
    type: 'PUT',
    params: data || {}
  })
}
