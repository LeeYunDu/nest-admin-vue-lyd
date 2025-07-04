<template>
  <section class="view-component">
    <el-upload
      class="upload-ui"
      :action="uAction"
      :headers="headers"
      :name="name"
      :limit="limit"
      :file-list="files"
      :list-type="listType"
      :on-exceed="handleExceed"
      :on-success="handleSuccess"
      v-bind="props"
    >
      <slot name="btn">
        <!-- <img class="icon_upload" :src="metaFilePath('upload.png')" alt=""> -->
        <el-icon class="icon_upload"><DocumentAdd /></el-icon>
        <div class="el-upload__text">
          将文件拖拽至此区域或<em>点击选择文件上传</em>
        </div>
      </slot>
      <template #tip>
        <slot name="tip"></slot>
      </template>
    </el-upload>
  </section>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ApiProxy } from '@/config'
import { ElMessage } from 'element-plus'
import { get } from 'lodash-es'
import { metaFilePath } from '@/utils'

const uProps = defineProps({
  action: { type: String, default: '' },
  name: { type: String, default: 'fileArray' },
  listType: { type: String, default: '' },
  limit: { type: String, default: '1' },
  props: { type: Object, default: () => ({}) },
  modelValue: { type: Array, default: () => [] }
})

const emits = defineEmits(['update:modelValue'])

const { VITE_FILE_DOMAIN: filePrefix } = import.meta.env
const prefix = ApiProxy.java.main

const uAction = computed<string>(() => uProps.action || `${prefix}/pc/upload/file`)

const headers = ref({
  // token: store.getters.loginInfo.token
  // Authorization: store.getters.loginInfo.token
})
// const files = ref([])
const files = computed<any>(() => uProps.modelValue)
// watchEffect(() => {
//   files.value = props.modelValue
// })
// watchEffect(() => {
//   fileList.value = props.modelValue
// })

function handleSuccess (response: any, file: any, fileList: any) {
  const { success, errMsg, message, status } = response
  if (!(success || Number(status) === 200)) return ElMessage.error(errMsg || message)
  const filterFileList = fileList.map((item: any) => {
    const listItem = get(item, 'response.data.resultList[0]')
    if (!listItem) return item
    listItem.url = filePrefix + listItem.fileUrl || '/static/images/app/no-data.png'
    listItem.name = listItem.originalFilename || 'no-picture.png'
    return listItem
  })
  emits('update:modelValue', filterFileList)
}
// function handleRemove (file: any, fileList: any) {
//
// }
function handleExceed () {
  ElMessage.error(`最大上传数量为${uProps.limit}`)
}
</script>
<style lang="scss" scoped>
:deep(.upload-ui) {
  .el-upload-list {
    width: 100%;
    height: auto;
  }

  .el-upload {
    width: 100%;
    flex-direction: column;
    background: #F6FBFF;
    border-radius: 4px;
    border: 1px dashed#DCDCDC;
    padding: 50px 20px;
    .el-upload__text{
      color: #191919;
      em{
        color: $primary-color;
      }
    }
  }

  .icon_upload {
    display: block;
    width: 60px;
    height: auto;
    margin: 0 auto 25px;
    color: $primary-color;
    svg{
      width: 60px;
      height: 60px;
    }
  }
}
</style>
