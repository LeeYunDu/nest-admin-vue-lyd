/**
 * node menu apis
 */

import { ApiProxy } from '@/config'
import { AxiosRequestConfig } from 'axios'
import request from '../request'

// url 前缀
const prefix = ApiProxy.node.main

// 上传
export function nFileUpload (data: FormData, config?: AxiosRequestConfig): Promise<any> {
  return request({
    url: prefix + '/file/upload',
    type: 'POST',
    params: data
  }, config)
}

// 创建多条数据
export function nFileCreateMany (data: any): Promise<any> {
  return request({
    url: prefix + '/file/bulk',
    type: 'POST',
    params: data
  })
}

// 文件获取
export function nFileQuery (data: any): Promise<any> {
  return request({
    url: prefix + '/file',
    type: 'GET',
    params: data || {}
  })
}

// 文件删除
export function nFileDelete (id: number | string): Promise<any> {
  return request({
    url: prefix + '/file/' + id,
    type: 'DELETE'
  })
}
