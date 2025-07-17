<template>
  <el-col
    id="form-view"
    :span="span"
    :xl="span"
    :lg="span"
    :md="span"
    :sm="span"
    :xs="span"
    :offset="colOffset"
  >
    <el-form-item
      :label="label"
      :label-width="labelWidth ? `${labelWidth / 192}rem` : undefined"
      :prop="prop"
      :rules="rule"
      v-bind="formItemProps"
    >
      <template v-if="!isSlot">
        <template v-if="inputType === 'input'">
          <el-input v-bind="$attrs" :placeholder="placeholder">
            <template v-for="(slot, slotKey) in $slots" #[slotKey]>
              <slot :name="slotKey"></slot>
            </template>
            <template v-if="inputUnit && !$slots.suffix" #suffix>
              <span>{{ inputUnit }}</span>
            </template>
          </el-input>
        </template>
        <template v-if="inputType === 'select'">
          <el-select
            v-bind="$attrs"
            clearable
            style="width: 100%"
            :placeholder="placeholder"
          >
            <el-option
              v-for="item in selectOption"
              :key="item.value"
              :label="item.label"
              :value="'value-key' in $attrs ? item : item.value"
            />
          </el-select>
        </template>
        <template v-if="inputType === 'radio'">
          <el-radio-group v-bind="$attrs" clearable style="width: 100%">
            <el-radio
              v-for="item in selectOption"
              :key="item.value"
              :label="item.value"
              size="large"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </template>
        <template v-if="inputType === 'date'">
          <el-date-picker
            v-bind="$attrs"
            :type="$attrs.type ? $attrs.type : 'date'"
            value-format="x"
            style="width: 100%"
            :placeholder="placeholder"
            range-separator="-"
            :start-placeholder="$attrs.type === 'daterange' && '开始时间'"
            :end-placeholder="$attrs.type === 'daterange' && '结束时间'"
          />
        </template>
        <template v-if="inputType === 'checked'">
          <el-checkbox-group v-bind="$attrs" clearable style="width: 100%">
            <el-checkbox
              v-for="item in selectOption"
              :key="item.value"
              :label="item.value"
              size="large"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </template>
      </template>
      <template v-else>
        <slot :name="slotKey" v-bind="$attrs"></slot>
      </template>
    </el-form-item>
  </el-col>
</template>

<script setup>
import { isRegExp, isArray, isString, isObject } from 'lodash-es'
import { useStore } from 'vuex'
import { useAttrs, useSlots, computed, unref, toRefs } from 'vue'
// import * as validators from '@/utils/validator'
import { initialToUpperCase } from '@/utils'

const props = defineProps({
  inputType: { type: String, default: 'input' },
  span: { type: [Number, String], default: 6 },
  label: { type: String, default: '' },
  labelWidth: { type: [Number, String], default: '' },
  prop: { type: String, default: '' },
  inputUnit: { type: String, default: '' },
  options: { type: [Array, String, Object, Function], default: () => [] },
  rules: { type: Array, default: () => [] },
  require: { type: Boolean, default: false },
  slotKey: { type: String, default: '' },
  formItemProps: { type: Object, default: () => ({}) },
  colOffset: { type: Number, default: 0 }
})

const { require, rules, slotKey } = toRefs(props)

const slots = useSlots()

const attrs = useAttrs()

const store = useStore()

const isSlot = computed(() => Object.keys(slots).includes(unref(slotKey)))

const placeholder = computed(() => {
  if (props.label && !('placeholder' in attrs))
    return ['select', 'date'].includes(props.inputType)
      ? `请选择${props.label.replace('：', '')}`
      : `请输入${props.label.replace('：', '')}`
  return attrs.placeholder || ''
})
// 选择框字典处理
const selectOption = computed(() => {
  // 数组直接返回
  if (isArray(props.options)) return props.options
  // 字符串查找字典后返回
  if (isString(props.options))
    return (
      store.getters.dictDataOnly(props.options)?.map(item => ({
        label: item.name,
        value: item.id
      })) || []
    )
  // 对象需另外配置渲染的label和value
  if (isObject(props.options)) {
    const { target, labelKey = 'name', valueKey } = props.options
    if (!(target && labelKey && valueKey)) return []
    return (
      store.getters.dictDataOnly(target)?.map(item => ({
        label: item[labelKey],
        value: item[valueKey]
      })) || []
    )
  }
  return []
})

const typeOf = (value, type) =>
  Object.prototype.toString.call(value).slice(8, -1).toLowerCase() === type

function validator(rule, value, callback) {
  return validators[`check${initialToUpperCase(unref(rules))}`](
    rule,
    value,
    callback
  )
}

const rule = computed(() => {
  if (unref(require))
    return [{ required: true, message: '该项为必填项', trigger: 'blur' }]
  // if (typeOf(unref(rules), 'string')) return [ { required: true, validator: validator, trigger: 'change' } ]
  return unref(rules)
})
</script>

<style lang="scss" scoped>
#form-view {
  ::v-deep(.el-form-item) {
    margin-bottom: 20px;
    align-items: center;

    .el-form-item__label {
      padding-bottom: 0 !important;
      font-size: 14px;
      font-weight: 500;
      color: #272727;
    }

    .el-form-item__content {
      .el-input {
        .el-input__inner {
          height: 36px;
          line-height: 36px;
        }

        .el-input__suffix {
          .el-input__suffix-inner {
            font-size: 14px;
            font-weight: 400;
            color: #272727;
          }
        }
      }

      .el-textarea {
        .el-textarea__inner {
          padding-bottom: 20px;
        }

        .el-input__count {
          width: calc(100% - 20px);
          right: 10px;
          background-color: #fff;
          text-align: right;
          bottom: 1px;
          height: 18px;
        }
      }
    }
  }
}
</style>
