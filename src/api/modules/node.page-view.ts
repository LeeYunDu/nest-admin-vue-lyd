/**
 * node page-view apis
 */

import { ApiProxy } from '@/config'
import request from '../request'

// url 前缀
const prefix = ApiProxy.node.main

// 菜单获取
export function nPageViewList (data: any) {
  return request({
    url: prefix + '/page-view',
    type: 'GET',
    params: data || {}
  })
}

// 菜单获取
export function nPageViewQuery (data: any) {
  return request({
    url: prefix + '/page-view/query',
    type: 'POST',
    params: data || {}
  })
}

// 菜单获取
export function nPageViewById (id: string | number) {
  return request({
    url: prefix + '/page-view/' + id,
    type: 'GET'
  })
}

// 菜单新增
export function nPageViewCreate (data: any) {
  return request({
    url: prefix + '/page-view/create',
    type: 'POST',
    params: data || {}
  })
}

// 菜单新增
export function nPageViewUpdate (data: any) {
  return request({
    url: prefix + '/page-view/update',
    type: 'PUT',
    params: data || {}
  })
}

// 菜单删除
export function nPageViewDelete (id: string | number) {
  return request({
    url: prefix + '/page-view/' + id,
    type: 'DELETE'
  })
}
