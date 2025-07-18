import { FieldItem, FormMode } from '@/typings/items'
import { get } from 'lodash-es'
import store from '@/store'
const dictData = store.getters.dictData
import { checkLinkWay, checkNumber } from '@/utils/validator'


// 表单查询字段配置
export const tableQueryFormFields: FormMode[] = [
  {
    label: '文本输入框', key: 'y1', type: 'input',
    props: {
      gridItem: { span: 4 },
      formItem: { required: false },
      clearable: true,
      placeholder: '请输入内容',
    },
  },
  {
    label: '选择器', key: 'y2', type: 'select', options: [
      { label: '选项一', value: '1' },
      { label: '选项二', value: '2' },
      { label: '选项三', value: '3' },
    ],
    props: {
      gridItem: { span: 4 },
      formItem: { required: false },
      clearable: true,
    }
  },
  {
    label: '', type: 'slot', slotName: 'button', key: '', props: {
      gridItem: { span: 4 },
      formItem: {
        labelWidth: 0
      }
    }
  }
]

// 表单配置
export const tableQueryFormOptions = {
  props: {
    inline: true,
    labelWidth: 'auto',
    labelPosition: 'right',
    rules: [],
    'validate-on-rule-change': false,
    ruleTrigger: 'change'
  },
  options: {
    gridItem: { span: 6 }
  }
}

export const tableColumn: FieldItem[] = [
  { label: '多选框', type: 'selection', key: 'checkbox-group', width: '100px' },
  { label: '序号', type: 'index', key: 'index', width: '100px' },
  { label: '文本字段', key: 'y1', },
  { label: '字典字段', key: 'chooseType12Name', transform: '12.dist' },
  { label: '时间字段', key: 'y3', transform: '{y}-{m}-{d}' },
  { label: '插槽字段', key: 'y4', type: 'slot', slotName: 'y4' },
  {
    label: '函数字段',
    key: 'y5',
    transform: (data: any) => {
      return data == 0 ? '否' : '是'
    }
  },
  {
    label: '操作',
    key: 'action',
    type: 'slot',
    slotName: 'action',
    props: {
      width: '210px',
    },
  },
]


export const formFields = [
  {
    label: '文本显示字数限制', key: 'y1', type: 'input',
    props: {
      gridItem: { span: 24 },
      formItem: { required: true },
      clearable: true,
      maxlength: 30,
      'show-word-limit': true,
      placeholder: '请输入标题,限30字内',
    },
  },
  {
    label: '不显示label', key: 'y91', type: 'input',
    props: {
      gridItem: { span: 24 },
      formItem: { required: true, labelWidth: 0 },
    },
  },
  {
    label: '数字类型输入框', key: 'y2', type: 'input',
    props: {
      clearable: true,
      gridItem: { span: 24 },
      min: 0,
      type: 'number',
      'suffix': '㎡',
      formItem: { required: true, },
      rules: [
        { validator: () => {}, trigger: 'blur' }
      ]
    },
  },
  {
    label: '时间范围选择器', key: 'y3', type: 'datePicker', props: {
      'value-format': 'x',
      clearable: true,
      type: 'datetimerange',
      formItem: { required: true, },
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      gridItem: { span: 24 }
    }
  },
  {
    label: '单选框', key: 'y4', type: 'radio-group', options: [
      { label: '单选框1', value: true },
      { label: '单选框2', value: false },
    ],
    props: {
      formItem: { required: true, }
    },
    child: { type: 'radio' }
  },
  {
    label: '多选框', value: '', key: 'key1', type: 'checkbox-group', options: [
      { value: 1, label: '多选框1' },
      { value: 2, label: '多选框2' },
    ] as any, props: {
      formItem: { required: true, }
    },
  },
  {
    label: '选择器', key: 'y5', type: 'select', options: [
      { label: '选项一', value: '1' }
    ], props: {
      gridItem: { span: 6 },
      clearable: true,
      formItem: { required: true, }
    },
  },
  {
    label: '级联选择器', key: 'y6', slotName: 'cascader', type: 'slot', options: [
      { name: '选项1', id: 1, childList: [{ name: '选项1-1', id: '1-1' }] },
      { name: '选项2', id: 2 }
    ],
    props: {
      clearable: true,
      formItem: { required: true, },
      gridItem: { span: 24 },
      props: {
        checkStrictly: true,
        value: 'id',
        label: 'name',
        children: 'childList',
        emitPath: false
      }
    }
  },
  {
    label: '插槽字段', key: 'y9', slotName: 'slotName', type: 'slot',
    props: {}
  },
  {
    label: 'label插槽', key: 'y10', type: 'input',
    props: {}
  },

]
