import { ErrorTypeEnum } from '@/enums/exceptionEnum'
import { MenuMode } from './data'

export declare interface DataStoreMode {
  querys?: any
  params?: any
  data?: any
}

export declare interface UserStoreMode {
  user: UserInfoMode
}
export declare interface LoginStoreMode {
  token?: string
  sessionId?: string
}

export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum
  // Error file
  file: string
  // Error name
  name?: string
  // Error message
  message: string
  // Error stack
  stack?: string
  // Error detail
  detail: string
  // Error url
  url: string
  // Error time
  time?: string
}

export interface UserInfoMode {
  email?: string
  id: string | number
  realName: string
  mobile: string | number
  password: string
  status: number
  userId: number
  username: string
  token: string
}

export interface DictMode {
  name?: string
  id?: string | number
}

export interface MetaMode {
  title: string
  data?: MenuMode
}
