declare module '*.vue' {
  import { App, defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent> & {
    install(app: App): void
  }
  export default Component
}

declare type Nullable<T> = T | null

declare type CustomizedHTMLElement<T> = HTMLElement & T

declare type Indexable<T> = {
  [key: string]: T
}

declare type Hash<T> = Indexable<T>

declare type ComponentSize = 'large' | 'medium' | 'small' | 'mini'
interface Window {
  ActiveXObject?: any
  globalApp: any
  ZWJSBridge: any
  aplus_queue: any
  localtion: any
  AMap: any
  kityminder: any
  kity: any
}

declare const AMap: any

declare const watermark: any
