<template>
  <section class="ui-form">
    <el-form
      ref="uiFormRef"
      :model="params"
      v-bind="formProps"
      :rules="rules"
    >
      <ui-grid v-bind="gridPropsRef" :style="gridStyle">
        <template v-for="(item, index) in useLabels" :key="item.key + index">
          <template v-if="item._visible">
            <ui-grid-item v-bind="item.gridProps">
              <el-form-item
                class="ui-form-item"
                :class="[{ hiddenLabel: Number(item.formItemProps?.labelWidth) == 0 }]"
                :label="item.label"
                :prop="item.key"
                v-bind="item.formItemProps"
              >
                <!-- slot title -->
                <template #label>
                  <slot
                    :name="`label-${item.key}`"
                    :props="item.props"
                    :label="item.label"
                  >
                    <span>{{ item.label }}{{ item.label? (formProps['label-suffix']??':'):'' }}</span>
                  </slot>
                </template>

                <!-- slot form-item-content -->
                <template v-if="item.type === 'slot'">
                  <slot :name="item.slotName || item.key" :item="item"></slot>
                </template>

                <template v-else>
                  <template v-if="!(labelOptions.relation[item.type] && item.options && item.options.length > 0)">
                    <component
                      :is="`${itemPrefix}${item.type}`"
                      v-model="params[item.key]"
                      v-bind="item.props"
                      @input="val => itemChange(val, item)"
                      @change="val => itemChange(val, item)"
                    >
                      <template v-if="item.props?.prefix" #prefix>{{ item.props.prefix }}</template>
                      <template v-if="item.props?.suffix" #suffix>{{ item.props.suffix }}</template>
                      <template v-if="item.props?.prepend" #prepend>{{ item.props.prepend }}</template>
                      <template v-if="item.props?.append" #append>{{ item.props.append }}</template>
                    </component>
                  </template>
                  <template v-else>
                    <component
                      :is="`${itemPrefix}${item.type}`"
                      v-model="params[item.key]"
                      v-bind="item.props"
                      @change="val => itemChange(val, item)"
                    >
                      <template v-for="(child, ci) in item.options" :key="ci">
                        <template v-if="child.text">
                          <component
                            :is="`${itemPrefix}${item.child?.type || labelOptions.relation[item.type]}`"
                            v-bind="Object.assign(child, child.props || {})"
                          >
                            <span v-html="child.text"></span>
                          </component>
                        </template>
                        <template v-else>
                          <component
                            :is="`${itemPrefix}${item.child?.type || labelOptions.relation[item.type]}`"
                            v-bind="Object.assign(child, child.props || {})"
                          />
                        </template>
                      </template>
                    </component>
                  </template>
                </template>
              </el-form-item>
            </ui-grid-item>
          </template>
        </template>
      </ui-grid>
    </el-form>
  </section>
</template>
<script lang="ts" setup>
import {
  computed,
  ComputedRef,
  CSSProperties,
  ref,
  Ref,
  watch
} from 'vue'
import { set, get,isFunction } from 'lodash-es'
import { UiGrid, UiGridItem } from '../../grid'
import { useVModel } from '@vueuse/core'
import { FormChangeOutput, FormProps, LabelItem, uiFormProps } from '../types'
import { GridProps } from '../../grid/type'
import { FormMode } from '@/typings/items'

const labelOptions = {
  relation: {
    table: 'table-column',
    select: 'option',
    'checkbox-group': 'checkbox',
    'radio-group': 'radio-button'
  }
}

const props = defineProps(uiFormProps)

const emits = defineEmits(['change'])

defineExpose({
  resetFields,
  validate,
  validateField
})

const uiFormRef: Ref<any> = ref('uiFormRef')
const itemPrefix = ref('el-')
let params = ref<any>({})
const useModel: Ref<any> = useVModel(props, 'model', emits)
const showlist = ref<LabelItem[]>([])

const formProps: ComputedRef<FormProps> = computed(() => {
  return Object.assign({}, {
    labelWidth: '100px'
  }, props.props)
})

const useLabels = ref<LabelItem[]>([])
const rules: ComputedRef<any> = computed(() => {
  const useRules = {} as any
  useLabels.value.map((label: FormMode) => {
    let { required,ruleTrigger } = label.props.formItem||{}
    useRules[label.key] = required?[
      { required: true, message: `${label.label} 是必填项！`, trigger: ruleTrigger??'blur' },
      ...(label.props.rules || [])
    ]:(label.props.rules || undefined)
  })
  Object.assign(useRules, formProps.value.rules || {})
  return useRules
})
watch(() => props.model, async () => {
  await Promise.resolve().then()
  batchShow()
  params.value = props.model
  Object.keys(params.value).map((key: string) => {
    const label = (useLabels.value.find((item: LabelItem) => item.key === key) || {}) as LabelItem
    // 清除插槽的校验
    if (label.type === 'slot' && params.value[key] && Object.keys(params.value[key]).length > 0) {
      // validateField(key)
    }
  })
}, { immediate: true, deep: true })

watch(() => props.labels, () => {
  showlist.value = []
  useLabels.value = props.labels.map((item: LabelItem) => {
    setPlaceholder(item)
    setProps(item)
    const { hasShowFn } = itemShow(item)
    hasShowFn && showlist.value.push(item)
    return item
  })
}, { immediate: true })

function setProps (item: LabelItem) {
  // grid item
  item.gridProps = Object.assign({}, props.options.gridItem || {
    span: 12
  }, item.props?.gridItem || {})

  // formItemProps
  item.formItemProps = item.props?.formItem || {}

  return item
}

function setPlaceholder (item: LabelItem) {
  let placeholder = item.props?.placeholder
  if (!placeholder) {
    switch (true) {
      case ['input'].includes(String(item.type)):
        placeholder = '请输入'
        break
      default:
        placeholder = '请选择'
        break
    }
    set(item, 'props.placeholder', placeholder + item.label)
  }
}

// grid
const gridPropsRef = computed<GridProps>(() => props.options.grid || {
  xGap: 10,
  yGap: 5
})

const gridStyle = computed<CSSProperties>(() => {
  return Object.assign({
    alignItems: 'center'
  }, gridPropsRef.value.style || {}) as CSSProperties
})

/**
 * 显示隐藏
 */
function itemShow (item: LabelItem) {
  let visible = true
  let hasShowFn = false

  switch (true) {
    case isFunction(item.show):
      visible = (item.show as any)(useModel.value, item)
      hasShowFn = true
      break
    default:
      visible = item.show !== false
      break
  }

  if (!visible) {
    useModel.value[item.key] = ''
  }
  item._visible = visible

  return {
    hasShowFn
  }
}

/**
 * item 值变化
 */
function itemChange (value: any, item: LabelItem) {
  let useValue = value?.target ? value.target.value : value
  useValue = ['false', 'true'].includes(useValue) ? JSON.parse(useValue) : useValue
  delete useModel.value[item.key]
  set(useModel.value, item.key, useValue)
  if (isFunction(item.change)) {
    (item.change as any)(useValue, useModel.value, item)
  }
  batchShow()
  const result: FormChangeOutput = { params: useModel.value, key: item.key, value: useValue }
  emits('change', result)
}

function batchShow () {
  showlist.value.map((i: LabelItem) => {
    const useItem = useLabels.value.find((l: LabelItem) => l.key === i.key)
    useItem && itemShow(useItem)
  })
}

function validateField (key: string, callback?: any) {
  return uiFormRef.value.validateField(key, callback)
}

function resetFields () {
  uiFormRef.value.resetFields()
}

function validate () {
  return uiFormRef.value.validate()
}

</script>
<style lang="scss" scoped>
.ui-form {
  ::v-deep(.el-form) {
    &.el-form--label-left {
      .el-form-item__label {
        justify-content: flex-start;
      }
    }
    &.el-form--label-top {
      .el-form-item__label {
        justify-content: flex-start;
      }
    }
    .el-form-item__label {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      line-height: 1.2;
      font-size: 16px;
      color: #686b73;
    }
    .el-form-item {
      width: 100%;
      &.hiddenLabel {
        .el-form-item__label {
          opacity: 0;
          // display: none!important;
        }
      }
    }

    .el-radio-group {
      line-height: 28px;

      .el-radio {
        height: 26px;
        line-height: 24px;
        padding: 0 6px;
        margin-right: 12px;
        margin-left: 0px;
      }
    }
  }
}
</style>
