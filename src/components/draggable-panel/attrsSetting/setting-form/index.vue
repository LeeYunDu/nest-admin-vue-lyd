<template>
  <div>
    <el-form
      ref="form"
      :model="formData"
    >
      <SettingFormItem v-for="(field, index) in fields" :key="index" v-bind="field" />
    </el-form>
  </div>
</template>

<script setup>
import SettingFormItem from './setting-form-item.vue'
import { reactive,watch } from 'vue'
const props = defineProps({
  model:{
    type:Object,
    default:()=>{}
  },
  fields:{
    type:Array,
    default:()=>[]
  }
})

let formData = reactive({

})

watch(()=>props.model,val=>{
  formData = val
})
</script>

<style lang="scss" scoped>
.setting-form{
  padding: 20px;
}
</style>
