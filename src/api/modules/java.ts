/**
 * java common apis
 */

import request from '../request';
import { ApiProxy } from '@/config';

const prefix = ApiProxy.java.main;

// 单个查询 如：type: 1
export function jSingleChoose (data: any) {
  return request({
    url: prefix + '/pc/ads/common/choose/getLevelTreeChooseResult',
    type: 'POST',
    params: data || {}
  });
}

// 多个查询 如：typeArray: [1, 2]; 注意：type = 1 用jSingleChoose 接口
export function jMultipleChoose (data: any) {
  return request({
    url: prefix + '/pc/ads/common/choose/getTreeChooseAllListResult',
    type: 'POST',
    params: data || {}
  });
}

// 多个查询 如：typeArray: [1, 2]; 注意：type = 1 用jSingleChoose 接口
export function fileUpload (data?: any) {
  return request({
    url: prefix + '/pc/upload/file',
    type: 'POST',
    params: data || {}
  });
}
