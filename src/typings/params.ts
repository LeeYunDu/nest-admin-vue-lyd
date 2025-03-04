/**
 * request params of page
 */
export interface Page {
  pageSize?: number
  currentPage?: number
	page?: number
	pageNum?: number
}

/**
 * trasition params mode
 */
export interface ParamsTransitionMode extends Page {
	tabType: string
  area?: string
	city?: string
	orderType?: string | number
	productId?: string | number
	industryId?: string | number
	natureId?: string | number
	requireId?: string | number
}

export interface ResponseMode<T = any> {
	message?: string
	msg?: string
	data: T
	status?: number | null
	success?: boolean
}

export type PromiseRo<T = any> = Promise<ResponseMode<T>>

// 排序
export interface OrderMode {
	orderBy: string
}

/**
 *
 */
export interface KeyMapperMode {
	inputKey: string
	outputKey: string
	name?: string
}

/**
 * 登录的mode
 */
export interface LoginMode {
	username: string
	password: string | number
	code?: string
	t?: string
}

/**
 * ding 扫码获取用户信息
 */
export interface DingLoginMode {
  code?: string
  state?: string
}
