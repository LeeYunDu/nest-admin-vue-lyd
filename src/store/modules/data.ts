import { ResponseMode } from '@/typings/params'
import Config from '@/config'
import { get } from 'lodash-es'
import { transformToTree } from '@/utils'

export interface DictMode {
  id: number
  name: string
  parentId: number
  type: string | number
  childList?: DictMode[]
  path?: string
  valueRange?: string
}

interface DictListMode {
  levelList: DictMode[]
  resultList: DictMode[]
  type: number
}

// 创建dict key
export function createDictKey(type: number | string) {
  return `dict_${type}`
}

const dictApis = [
  // {
  //   api: jMultipleChoose,
  //   type: 'java',
  //   params: {
  //     typeArray: [1] as number[]
  //   }
  // },
]

const app = {
  state: () => ({
    isLoadedDict: false,
    dictData: {}
  }),

  getters: {
    isLoadedDict: (state: any) => state.isLoadedDict,
    dictData: (state: any): any =>
      Object.keys(state.dictData).length > 1
        ? state.dictData
        : JSON.parse(sessionStorage.getItem('dictData') || '{}')
  },

  mutations: {
    SET_DICT_DATA(state: any, data: any) {
      state.isLoadedDict = true
      state.dictData = data || {}
      sessionStorage.setItem('dictData', JSON.stringify(state.dictData))
    }
  },

  actions: {
    /**
     * 初始化多个字典值
     * @param param0
     * @returns
     */
    async initDict({ commit, state }: any) {
      try {
        const datas = await Promise.all(
          dictApis.map((item: any) =>
            item.api(item.params).catch((err: any) => err)
          )
        )
        const dictData = state.dictData || {}
        datas.map((data: any, index: number) => {
          switch (index) {
            // case 0:
            //   if (data.success) {
            //     const list: DictListMode[] = get(data, 'data.listResultList', [])
            //     list.map((item: DictListMode) => {
            //       if (item.type) {
            //         const useType = createDictKey(item.type)
            //         dictData[useType] = {
            //           tree: item.resultList || [],
            //           list: item.levelList || []
            //         }
            //       }
            //     })
            //   }
            //   break
            case 0:
              const list = get(data, 'data', []).map((o: any) => {
                if (['true', 'false'].includes(o.value)) {
                  o.value = JSON.parse(o.value)
                } else {
                  !isNaN(o.value) && (o.value = Number(o.value))
                }
                return o
              })
              const treeData = transformToTree(list, { idKey: 'sid' })
              treeData.map((item: any) => {
                const useType = createDictKey(`n${item.sid}`)
                dictData[useType] = {
                  tree: item.children,
                  list: list.filter((o: any) => o.parentId === item.sid)
                }
              })
              break
          }
        })
        commit('SET_DICT_DATA', dictData)
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * 获取单个字典值
     * @param param0
     * @param type
     * @returns
     */
    async getSingleChoose({ commit, state }: any, type: number) {
      try {
        if (!type && type !== 0) return
        const useType = createDictKey(type)
        const dictData = state.dictData || {}
        if (dictData[useType]) {
          return dictData[useType]
        }

        const { data, status }: ResponseMode = await jSingleChoose({ type })
        if (status !== 200) return data
        const jsonData: DictListMode = data || {}
        const itemData = {
          tree: jsonData.resultList || [],
          list: jsonData.levelList || []
        }
        dictData[useType] = itemData
        commit('SET_DICT_DATA', dictData)
        return itemData
      } catch (error) {
        console.log(error)
      }
    }
  }
}
export default app
