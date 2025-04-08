import request from './request'

/**
 * java user, namespace: u
 */
export * from './modules/java.user'
/**
 * 通用
 * @param options
 * @returns
 */
export function asyncConf (options: any) {
  let url = options && options.url
  if (url.substring(0, 1) !== '/') url = '/' + url
  return request({
    url,
    type: options.type || 'get',
    params: options.params || {}
  })
}


export default {}
