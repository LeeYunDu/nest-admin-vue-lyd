import { FieldItem, FormMode, ItemMode } from '@/typings/items'
export const tableColumn = (params: any): FieldItem[] => {
  return [
    { label: '项目名称', key: 'projectName', },
    { label: '子应用个数', key: 'subAppCount', },
    { label: '操作', key: 'action', type: 'slot', slot: 'action', unit: undefined }
  ]
}
