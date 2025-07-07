<template>
  <UiForm
    v-bind="formOptions"
    ref="formRef"
    :model="model"
    :labels="formFields"
  >
    <template #cascader="{item}">
      <el-cascader
        v-model="model[item.key]"
        :options="item.options"
        v-bind="item.props"
      />
    </template>
  </UiForm>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { UiForm } from '@/components/UI/form'
import { formFields } from './json'
let model = ref({})

const formOptions = ref({
  props: {
    inline: true,
    labelWidth: 'auto',
    labelPosition: 'right',
    rules: [],
    'validate-on-rule-change': false,
    ruleTrigger: 'change'
  },
  options: {
    gridItem: { span: 24 }
  }
})
</script>
