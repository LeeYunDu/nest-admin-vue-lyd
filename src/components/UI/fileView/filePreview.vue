
<template>
  <SimpleModal
    v-model="state.show"
    :title="state.title"
    :footer-show="false"
    width="70%"
    body-padding="20"
    destroy-on-close
    :fullscreen="true"
    @closed="onClosed"
  >
    <div class="dialog-content">
      <vue-office-pdf
        :src="fileData"
        style="height: 80vh"
      />
      <div class="flex f-aic f-jcc footer-box">
        <actionButton :fields="successDialogBtn" />
      </div>
    </div>
  </SimpleModal>
</template>

<script lang="ts" setup>
import SimpleModal from '@/views/common/Simple.modal.vue'
import { reactive,ref,computed } from 'vue'
import actionButton from '@/views/common/action.button.vue'
import VueOfficePdf from '@vue-office/pdf'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  fileData: { type: Object, default: () => null },
  count:{ type:Number,default:0 },

})

const emits = defineEmits(['update:modelValue','update:row','success'])

const fileData = computed(() => {
  return props.fileData
})
const state = reactive({
  show: computed({
    get: () => {
      return props.modelValue
    },
    set: val =>  emits('update:modelValue', val)
  }),
  title: '文件预览',
})

let successDialogBtn = ref([
  { label:'关闭',key:'form-close',click:()=>{
    onClosed()
  } },
])

function onClosed () {
  emits('update:modelValue',false)
}

</script>

<style lang="scss" scoped>

  :deep .el-dialog__body {
    // height: 500px;
    // min-height: 500px;
    // max-height: 600px;
    display: flex;
    flex-direction: column;
  }


.success{
  width: 120px;
  margin-bottom: 6px;
}



.dialog-content{
  .excelData-container{
    height: 450px;
    overflow: auto;
    &::-webkit-scrollbar { /*滚动条整体样式*/
      width: 8px!important; /*高宽分别对应横竖滚动条的尺寸*/
      height: 8px!important;
    }
    ::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
      border-radius: 6px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(43, 53, 59, 0.5);
    }
    ::-webkit-scrollbar-track { /*滚动条里面轨道*/
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      background: rgba(43, 53, 59, 0.5);
    }
  }

  ::v-deep(table){
    border: 1px solid black!important; /* 添加边框样式 */
    border-collapse: collapse!important; /* 边框合并 */
    padding: 5px!important;
    th, td {
      border: 1px solid black!important; /* 添加边框样式 */
      border-collapse: collapse!important; /* 边框合并 */
      padding: 5px!important;
      white-space: nowrap;
    }
  }
}
.footer-box{
  margin-top: 50px;
}
</style>
