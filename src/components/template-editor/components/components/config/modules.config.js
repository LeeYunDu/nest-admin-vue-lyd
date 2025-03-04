/**
 * componentType 表示渲染的是什么组件
 */
import Table from '../modules/table/index.vue';
import TableSetting from '../modules/table/setting.vue';
import BlockTag from '../modules/block/block-tag/index.vue';
import BlockImage from '../modules/block/block-image/index.vue';
import BlockTagSetting from '../modules/block/block-tag/setting.vue';
import BlockImageSetting from '../modules/block/block-image/setting.vue';
import LoopTable from '../modules/block/block-columns/index.vue';
import LoopTableSetting from '../modules/block/block-columns/setting.vue';
export const componentTypeMap = {
  1: Table,
  2: BlockTag,
  3: BlockImage,
  4: LoopTable

  // 7: 'input',
  // 8: 'select',
  // 9: 'cascader',
  // 10: 'checkbox-group',
  // 11: 'radio-group',
  // 12: 'switch',
  // 13: 'date-picker',
  // 14: 'rate',
  // 15: 'slider',
  // 24: 'input-number',
  // 99: 'slot'
};

export const componentAttrMap = {
  1: TableSetting,
  2: BlockTagSetting,
  3: BlockImageSetting,
  4: LoopTableSetting
};

export const componentTypeOptions = [
  {
    label: '表格',
    options: [{ label: '普通表格', value: 'table', attr: { componentType: 1, type: 'basic' } }]
  },
  {
    label: '信息块',
    options: [
      // { label: '标签模块', value: 'block', attr: { componentType: 2, type: 'tag' } },
      { label: '图片模块', value: 'block', attr: { componentType: 3, type: 'image' } },
      { label: '循环表格', value: 'block', attr: { componentType: 4, type: 'loop-table' } }
    ]
  }
  // {
  //   label: '输入字段',
  //   options: [
  //     { label: '文本', value: 'input', attr: { componentType: 7, type: 'text' } },
  //     { label: '单行输入框', value: 'input', attr: { componentType: 7 } },
  //     { label: '多行文本', value: 'input-textarea', attr: { componentType: 7, type: 'textarea' } },
  //     { label: '密码', value: 'input-password', attr: { componentType: 7, type: 'password' } },
  //     { label: '计数器', value: 'input-number', attr: { componentType: 24 } }
  //   ]
  // },
  // {
  //   label: '选择字段',
  //   options: [
  //     { label: '下拉选择器', value: 'select', attr: { componentType: 8 } },
  //     { label: '级联选择器', value: 'cascader', attr: { componentType: 9 } },
  //     { label: '树型结构选择器', disabled: true, value: 'tree', attr: { componentType: 8, type: 'tree' } },
  //     { label: '多选框', value: 'checkbox-group', attr: { componentType: 10 } },
  //     { label: '单选框', value: 'radio-group', attr: { componentType: 11 } },
  //     { label: '开关', value: 'switch', attr: { componentType: 12 } }
  //   ]
  // },
  // {
  //   label: '日期时间字段',
  //   options: [
  //     { label: '年', value: 'datePicker-year', attr: { componentType: 13, type: 'year' } },
  //     { label: '月', value: 'datePicker-month', attr: { componentType: 13, type: 'month' } },
  //     { label: '日', value: 'datePicker-day', attr: { componentType: 13, type: 'day' } },
  //     { label: '周', value: 'datePicker-week', attr: { componentType: 13, type: 'week' } },
  //     { label: '日期默认', value: 'datePicker-date', attr: { componentType: 13 } },
  //     // { label: '时间', value: 'timePicker', attr: { componentType: 12, type: 'year' } },
  //     { label: '日期时间', value: 'datePicker-datetime', attr: { componentType: 13, type: 'datetime' } },
  //     { label: '时间范围', value: 'datePicker-datetimerange', attr: { componentType: 13, type: 'datetimerange' } }
  //   ]
  // },
  // {
  //   label: '上传字段',
  //   options: [{ label: '上传', value: 'upload', attr: { componentType: 99 } }]
  // },
  // {
  //   label: '其他',
  //   options: [
  //     { label: '插槽', value: 'slot', attr: { componentType: 99 } },
  //     { label: '评分', value: 'rate', attr: { componentType: 14 } },
  //     { label: '滑块', value: 'slider', attr: { componentType: 15 } }
  //   ]
  // }
];
