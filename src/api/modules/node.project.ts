/**
 * node project apis
 */

import { ApiProxy } from '@/config'
import request from '../request'

// url 前缀
const prefix = ApiProxy.node.main

// 项目列表
export function nProjectOne (id: string | number) {
  return request({
    url: prefix + '/project/' + id,
    type: 'GET'
  })
}

// 项目列表
export function nProjectList (data: any) {
  return request({
    url: prefix + '/project',
    type: 'GET',
    params: data || {}
  })
}

// 项目列表 查询
export function nProjectQuery (data: any) {
  return request({
    url: prefix + '/project/query',
    type: 'POST',
    params: data || {}
  })
}

