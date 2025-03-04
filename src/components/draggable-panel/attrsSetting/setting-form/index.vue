<template>
  <div>
    <el-form
      ref="form"
      :model="formData"
      label-width="80px"
    >
      <el-form-item v-for="(field, index) in fields" :key="index" :label="field.label">
        <el-input v-model="formData[field.key]"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
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
