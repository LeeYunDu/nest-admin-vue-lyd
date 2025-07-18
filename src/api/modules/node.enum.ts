/**
 * node enum apis
 */

import { ApiProxy } from '@/config'
import { PromiseRo } from '@/typings/params'
import request from '../request'

// url 前缀
const prefix = ApiProxy.node.main

// 根据项目id查询枚举值
export function nEnumList (projectId: number | string): PromiseRo<any> {
  return request({
    url: prefix + '/enum/list/' + projectId,
    type: 'GET'
  })
}

// 枚举获取
export function nEnumQuery (data: any): PromiseRo<any> {
  return request({
    url: prefix + '/enum/query',
    type: 'POST',
    params: data || {}
  })
}

// 枚举深度获取
export function nEnumDeep (id: string | number): PromiseRo<any> {
  return request({
    url: prefix + '/enum/query/' + id,
    type: 'GET'
  })
}

// 枚举获取
export function nEnumById (id: string | number): PromiseRo<any> {
  return request({
    url: prefix + '/enum/' + id,
    type: 'GET'
  })
}

// 枚举新增
export function nEnumCreate (data: any): Promise<any> {
  return request({
    url: prefix + '/enum/create',
    type: 'POST',
    params: data || {}
  })
}

// 枚举更新
export function nEnumUpdate (data: any): PromiseRo<any> {
  return request({
    url: prefix + '/enum/update',
    type: 'PUT',
    params: data || {}
  })
}

// 枚举删除
export function nEnumDelete (id: string | number): PromiseRo<any> {
  return request({
    url: prefix + '/enum/' + id,
    type: 'DELETE'
  })
}
