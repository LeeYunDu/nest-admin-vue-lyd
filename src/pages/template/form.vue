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

    <template #slotName="{item}">
      这是自定义插槽的内容：
      {{ item }}
    </template>

    <!-- 插槽名称规则 = #label + key -->
    <template #label-y10="{label,props}">
      label插槽
    </template>
  </UiForm>

  <div class="button-group">
    <el-button type="primary" @click="submit">提交</el-button>
    <el-button @click="reset">重置</el-button>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { UiForm } from '@/components/UI/form'
import { formFields } from './json'

let model = ref({
  y1:''
})

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

const formRef = ref()

const submit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      console.log(model.value)
    }
  })
}

const reset = () => {
  formRef.value.resetFields()
}
</script>


<style lang="scss" scoped>
.button-group{
  margin-top: 20px;
}

</style>
