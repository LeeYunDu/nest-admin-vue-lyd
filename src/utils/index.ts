import { isArray, isString, isNumber, isStringFunction } from './is'
import type { MenuMapperModel } from '@/typings/global'
import Dict, { ApiProxy } from '@/config'
import { cloneDeep, get, isFunction } from 'lodash-es'
import { MenuMode } from '@/typings/data'
import router from '@/router'
import { dayjs } from 'element-plus'
import { useStore } from 'vuex'
import { FieldItem } from '@/typings/items'
const store = useStore()

/**
 * about colors
 */
export * from './colors'

/**
 * about load
 */
export * from './load'

/**
 * about is
 */
export * from './is'

/**
 * Generate random string by Math.random and time
 */
export const generateId = (): string =>
  `${Math.floor(Math.random() * 10)}${new Date().getTime()}`

/**
 * @desc 转换平级数据为树形数据
 */
export function transformToTree (sNodes: Array<any>, setting?: MenuMapperModel) {
  const set = {
    children: 'children',
    idKey: 'id',
    pIdKey: 'parentId',
    label: 'name'
  } as MenuMapperModel

  setting && Object.assign(set, setting)

  let i
  let l
  const key = set.idKey
  const parentKey = set.pIdKey || ''
  const childKey = set.children || ''
  if (!key || key === '' || !sNodes) return []
  if (Array.isArray(sNodes)) {
    sNodes.sort((a, b) => a.orderNum - b.orderNum)
    const r = []
    const tmpMap = []
    for (i = 0, l = sNodes.length; i < l; i++) {
      // sNodes[i][childKey] = [{}]
      tmpMap[sNodes[i][key]] = sNodes[i]
    }
    for (i = 0, l = sNodes.length; i < l; i++) {
      if (
        tmpMap[sNodes[i][parentKey]] &&
        sNodes[i][key] !== sNodes[i][parentKey]
      ) {
        const children = tmpMap[sNodes[i][parentKey]][childKey] || []
        children.push(sNodes[i])
        children.sort((a: any, b: any) => a.orderNum - b.orderNum)
        tmpMap[sNodes[i][parentKey]][childKey] = children
      } else {
        r.push(sNodes[i])
      }
    }

    return r
  } else {
    return [sNodes]
  }
}

/**
 * 首字母转大写
 */
export function initialToUpperCase (str: string) {
  if (!isString(str)) return str
  const strs = str.split('')
  strs[0] = strs[0].toUpperCase()
  return strs.join('')
}
/*
 * @desc 跳转
 * @param {object} item 跳转对象
 * @param {object} params 跳转添加的参数
 * */
export function open (item: MenuMode, params: any = {}) {
  const iPath = item.routerPath || item.path
  const iLink = item.link

  if (iLink && iLink !== '#') {
    window.location.href = replaceUrlParams(iLink, params, false) as string
  }

  if (iPath && iPath !== '#') {
    router.push(replaceUrlParams(iPath, params, true))
  }
}

// 替换地址中{}包裹的参数,路由则返回路由对象
export function replaceUrlParams (url: string, params: any, isRouter = false) {
  if (!url) return url
  const reg = /\{([^}]+)\}/g
  const result = url.match(reg)
  if (!result) return url
  result.forEach((item: string) => {
    const key = item.replace(/[{}]/g, '')
    url = url.replace(item, params[key])
  })
  if (!isRouter) {
    return url
  } else {
    return {
      path: url,
      query: getUrlParams(url)
    }
  }
}

// 获取地址栏url中的参数
export function getUrlParams (url: string) {
  const params: any = {}
  const arr = url.split('?')
  if (arr.length > 1) {
    const str = arr[1]
    const strs = str.split('&')
    for (let i = 0, l = strs.length; i < l; i++) {
      const param = strs[i].split('=')
      params[param[0]] = param[1]
    }
  }
  return params
}

/**
 * 跳转登录
 */
export async function ssoLogin (gotoUrl: string = location.href) {
  const { DEV, VITE_DOMAIN } = import.meta.env
  const domain = DEV ? VITE_DOMAIN : location.origin
  const href = `${domain}/fib-screen/index.html#/login?redirect=${gotoUrl}`
  window.location.href = href
}

/**
 * 获取url信息
 * @param key
 * @returns
 */
export function getQuery (key: string | string[]) {
  const url = location.href.split('?')
  const p = url?.[1]?.split('&')
  if (!p || p.length < 1) return
  const result = {} as any
  let str = ''
  const keyIsArray = isArray(key)
  p.every(item => {
    const itemKey = item.split('=')[0]
    let itemValue = item.split('=')[1] || ''
    if (itemValue.indexOf('#/') >= 0) {
      itemValue = itemValue.replace('#/', '')
    }
    if (!keyIsArray && key && itemKey === key) {
      str = itemValue
      return false
    }

    if (!key || (keyIsArray && key.includes(itemKey))) {
      result[itemKey] = itemValue
    }
    return true
  })
  return keyIsArray || !key ? result : str
}

/**
 * 时间转换
 */
export function parseTime (time: string | number | Date, cFormat?: string) {
  if (!time) {
    return ''
  }
  if (arguments.length === 0) {
    return null
  }

  if ((time + '').length === 10) {
    time = +time * 1000
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    date = new Date(parseInt(String(time)))
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  } as any
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result: any, key: string | number) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}
/**
 * 判断数据类型
 */
export function dataType (data: unknown) {
  let type = 'String'

  if (Object.prototype.toString.call(data) === '[object Object]') {
    type = 'Object'
  } else if (Object.prototype.toString.call(data) === '[object Array]') {
    type = 'Array'
  } else if (typeof data === 'string') {
    type = 'String'
  } else if (typeof data === 'number') {
    type = 'Number'
  }

  return type
}

/**
 * 预警样式
 *
 * @param {*} key
 *
 * @param argOptions {
 * dictName 字典对象的属性名
 * byKey 根据那个key查找字典
 * getKey 获取字典里面的那个属性值
 * getKey returnType 返回类型
 * }
 */
export function parseDict (key: string | number, argOptions: any) {
  const { options, dictName, byKey, getKey, split, returnType } = argOptions
  if (!key || (!dictName && !options)) return
  let dicts: any
  const useDict: any = Dict

  if (options) dicts = options
  else dicts = useDict[dictName]

  if (!dicts || Object.keys(dicts).length < 1) return key

  const useByKey: any = byKey || 'code'

  const useGetKey: any = getKey || 'name'

  const _split = split || '、'

  let keys: any = key
  if (!Array.isArray(key)) {
    keys = (key + '').split(_split)
  }

  let values = ''
  let returnValues

  if (returnType === 'array') {
    returnValues = [] as any[]

    keys.map((item: string | number) => {
      const dict = dicts.find((_: any) => _[useByKey] + '' === item + '')
      if (!dict) return ''
      returnValues.push(dict[useGetKey])
    })
  } else {
    values = keys.reduce((prev: string, cur: string, index: number) => {
      const dict = dicts.find((_: any) => _[useByKey] + '' === cur + '')

      if (!dict) return ''
      const value =
        index <= keys.length - 1 && index > 0
          ? _split + dict[useGetKey]
          : dict[useGetKey]
      return (prev += value)
    }, '')
    returnValues = values || keys.join(_split)
  }
  return returnValues
}

/**
 * 通过结构获取数据
 * @param {*} data
 * @param {*} structure
 */
export function deepData (data: any, structure: string, type = 'clone') {
  if (!structure || !data) return data
  const _arr = structure.split('.')
  let convertData = data
  let parentData = data
  let lastKey = ''
  while (
    _arr.length > 0 &&
    convertData &&
    Object.keys(convertData).length > 0
  ) {
    let key: any = _arr.shift() + ''
    // 判断为数组
    if (key.indexOf('[') >= 0 && key.indexOf(']') >= 0) {
      key = key.substring(1, key.length - 1) * 1
    }
    lastKey = key
    parentData = convertData
    convertData = convertData[key]
  }
  // 获取的对象改变后 是否改变原来对象
  switch (type) {
    case 'clone':
      if (['Array', 'Object'].includes(dataType(convertData))) {
        convertData = cloneDeep(convertData)
      }
      break
    case 'headUp':
      convertData = { convertData, parentData, key: lastKey }
      break
    default:
      break
  }

  return convertData
}

/**
 * 转化value
 */
export function convertValue (
  argValue: string | number,
  argType: string | string[],
  argOption: any | any[]
): any {
  if (!argType) return argValue
  let types: any = argType
  if (!isArray(argType)) {
    ; ('')
    types = [argType]
  }

  let options: any = argOption
  if (!isArray(argOption)) {
    options = [argOption]
  }

  let value: any = argValue || ''
  let unit = ''
  let defaultValue = value

  let raise = ''
  types.map((item: string, index: number) => {
    if (
      ![
        'dict',
        'file',
        'image',
        'slot',
        'unit',
        'structure',
        'pubsub',
        'router',
        'number',
        'link',
        'html',
        'substring',
        'diy'
      ].includes(item)
    ) {
      // value = Number(value || 0)
    }
    const option = options[index]

    const fixed = option.fixed !== undefined ? option.fixed : 2
    switch (item) {
      case 'defaultValue':
        defaultValue =
          isString(option.value) &&
            ['[', '{'].includes(option.value.substring(0, 1))
            ? JSON.parse(option.value)
            : option.value
        value = value === undefined || value === '' ? option.value : value
        break
      case 'substring':
        value = String(value).substring(
          option.start || 0,
          option.end || String(value).length
        )
        break
      case 'raise':
        raise = value >= 0 ? '+' : '-'
        value = raise + value
        break
      case 'time':
        value = parseTime(value, option.value)
        break
      case 'number':
        if (isNumber(value)) {
          switch (option.value) {
            case '+':
              value = (value + option.number).toFixed(fixed)
              break
            case '-':
              value = (value - option.number).toFixed(fixed)
              break
            case '*':
              value = (value * option.number).toFixed(fixed)
              break
            case '/':
              value = (value / option.number).toFixed(fixed)
              break
          }
          value = value * 1
        } else {
          value = ''
        }
        break
      case 'dict':
        value = parseDict(value, option)
        break
      case 'unit':
        unit = option.value
        value = value + option.value
        break
      default:
        break
    }
  })
  return { value, unit, defaultValue }
}

/**
 *
 * @param {*} url 链接
 * @param {*} type 类型: 'auth'： 需要登录并传递参数
 */
export function outLinkOpen (url: string) {
  window.open(url)
}
/**
 * 生成uuid
 */
export function uuid (size = 18, prefix?: string) {
  const s: any[] = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < size; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[7] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[9] = hexDigits.substr((s[9] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[11] = '-'

  const uuid = s.join('')
  return (prefix || '') + uuid
}

export function calculateCenter (lnglatarr: any) {
  const total = lnglatarr.length
  let X = 0
  let Y = 0
  let Z = 0
  lnglatarr.map((lnglat: number[]) => {
    const lng = (lnglat[0] * Math.PI) / 180
    const lat = (lnglat[1] * Math.PI) / 180
    const x = Math.cos(lat) * Math.cos(lng)
    const y = Math.cos(lat) * Math.sin(lng)
    const z = Math.sin(lat)
    X += x
    Y += y
    Z += z
  })
  X = X / total
  Y = Y / total
  Z = Z / total
  const Lng = Math.atan2(Y, X)
  const Hyp = Math.sqrt(X * X + Y * Y)
  const Lat = Math.atan2(Z, Hyp)
  return new AMap.LngLat((Lng * 180) / Math.PI, (Lat * 180) / Math.PI)
}

export function convertToFunction (str: string) {
  if (!isStringFunction(str)) return () => str
  return new Function(`return ${str}`)()
}

export function getLastMonthDate () {
  const today = new Date()
  const lastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  )
  return lastMonth
}

// rem 转化
export function convertRem (rem: number, docWidth: number) {
  return rem * 100 * (document.documentElement.clientWidth / docWidth)
}

// 图片获取
export function imgPath (name: string) {
  return `static/images/${name}`
  // return new URL('@static/images/', import.meta.url) + name
}

export const pxToRem = (px: number | string) => {
  if (px == 'auto') return px
  // 获取浏览器视口的宽度和高度
  const viewportWidth = window.innerWidth
  const isBigScreen = viewportWidth > 2560
  const result: any = isBigScreen ? px : `${Number(px) / 16}rem`
  return result
}

// 获取字典值
export function getDictValue (target: any, value: any, valueKey?: string) {
  value = +value
  if (!value && !String(value)) return value
  return store.getters.dictDataOnly(target)?.find((dict: any) => +dict[valueKey || 'id'] === value)?.name || value
}

// 表格数据转化
export function transformTableData (fields: FieldItem[], data: any) {
  const needTransField = fields.filter((field: FieldItem) => {
    return field.transform
  })
  needTransField.forEach((field: FieldItem) => {
    const { transform, key, unit } = field
    // 目前就判断下是否为时间、字典
    let type = ''
    if (isFunction(transform)) {
      type = 'function'
    } else {
      if (transform.indexOf('x') > -1 || (transform.indexOf('{') > -1 && transform.indexOf('}') > -1)) {
        type = 'time'
      }
      if (transform.indexOf('.') > -1) {
        type = 'dict'
      }
    }

    data.map((e: any) => {
      const value = e[key]
      // if (!(String(value))) {
      //   e[key] = '-'
      //   return e
      // }
      if (value === '' || value == null || value === undefined) {
        return '-'
      }
      switch (type) {
        case 'time':

          e[key] = parseTime(new Date(get(e, key, '')), transform) + (unit || '')
          break
        case 'dict':
          e['_' + key] = cloneDeep(get(e, key, ''))
          e[key] = getDictValue(transform, get(e, key, '')) + (unit || '')
          break
        case 'function':
          e[key] = transform(get(e, key, ''), e)
        default:
          e[key] = get(e, key, '') + (unit || '')
          break
      }
      if (unit) {
        e[key] = e[key]
      }
      return e
    })
  })

  return data
}

