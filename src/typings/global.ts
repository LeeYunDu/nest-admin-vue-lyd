import { Component } from 'vue'
import { DialogProps as ElDialogProps } from 'element-plus'

interface MenuMapperModel {
  children?: string
  idKey?: string
  pIdKey?: string
  label?: string
}

export type Item = {
  label: string
  key: string | number
  [key: string]: any
}

export type {
  MenuMapperModel
}

export interface ComponentItem {
  name: string
  slot?: string | number
  component?: Component | string
  options?: any
  description?: string
  [key: string]: any
}

export type TeleportType<T = any> = {
  target: string | HTMLElement
  data?: T
  [key: string]: any
}

export type DialogProps<T = any> = {
  visible: boolean
  title?: string
  data?: T
  props?: ElDialogProps
  [key: string]: any
}

export type LoopType<T = any> = {
  timer: number | null
  time: number
  index: number
  current: T
  [key: string]: any
}
