export type Partial<T> = {
  [key in keyof T]?: T[key]
}

export type Record<K extends keyof any, T> = {
  [key in K]: T
}

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

export type Exclude<T, U> = T extends U ? never : T

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any

export type Required<T> = {
  [P in keyof T]-?: T[P]
}
