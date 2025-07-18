import request from './request'

/**
 * java user, namespace: u
 */

/**
 * node project, namespace: nProject
 */
export * from './modules/node.project'

/**
 * node page-view, namespace: nPageView
 */
export * from './modules/node.page-view'

/**
 * node menus, namespace: nMenu
 */
export * from './modules/node.menu'

/**
 * node files, namespace: nFile
 */
export * from './modules/node.file'

/**
 * node role, namespace: nRole
 */
export * from './modules/node.role'

/**
 * node enums, namespace: nEnum
 */
export * from './modules/node.enum'

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
