<template>
  <div class="btnBox">
    <input
      id="input_import_file"
      ref="uploadDom"
      type="file"
      :multiple="multiple"
      :accept="useAccept"
      @change="()=>{beforeUpload()}"
    >
    <template v-if="fileType==='img'">
      <file-view
        v-model="fileList"
        :file-type="fileType"
        :value-config="valueConfig"
        :remove="remove"
        v-bind="$attrs"
        :download="download"
        @del="delFile"
      />
      <slot name="uploadBtn">
        <div
          v-if="isShowUpload"
          :loading="isUploading"
          class="uploadBox"
          :class="{'hide':limit && fileList.length>=limit*1}"
          element-loading-text="压缩中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(256, 256, 256, 1)"
          @click="goUpload"
        >
          <div class="uploadIcon">
            <el-icon>
              <plus />
            </el-icon>
            <span>上传图片</span>
          </div>
        </div>
      </slot>
      <!-- 上传提示 -->
      <div v-if="isShowTip" class="upload_tip flex f-aic ">
        <slot name="tips">
          <p v-if="tips" v-html="tips"></p>
          <p v-else>
            请上传
            <template v-if="fileSize">
              大小不超过
              <b>{{ fileSize }}MB</b> ,
            </template>
            <template v-if="acceptType">
              格式为
              <b>{{ acceptType.join("/") }}</b>
            </template>
            的图片
          </p>
        </slot>
      </div>
    </template>
    <template v-else>
      <div class="flex f-aic">
        <div class="upload-gourp" @click="goUpload">
          <slot name="uploadBtn">
            <el-button
              v-if="isShowUpload && !(String(limit) && fileList.length>=limit*1)"
              size="small"
              type="primary"
              class="up_btn"
              :loading="isUploading"
            >
              <img src="@static/images/app/icon_upload.png" class="icon_up">
              <span>点击上传</span>
            </el-button>
          </slot>
        </div>

        <!-- 上传提示 -->
        <div v-if="isShowTip" class="upload_tip flex f-aic" style="margin-left:10px">
          <img src="@static/images/common/icon-tip.png" class="icon_tip" alt="">
          <slot name="tips">
            <p v-if="tips" v-html="tips"></p>
            <p v-else>
              请上传
              <template v-if="fileSize">
                大小不超过
                <b>{{ fileSize }}MB</b> ,
              </template>
              <template v-if="acceptType">
                格式为
                <b>{{ acceptType.join("/") }}</b>
              </template>
              的文件
            </p>
            <p v-if="limit > 0">，数量不得超过{{ limit }}个</p>
          </slot>
        </div>
      </div>
      <slot name="fileView">
        <file-view
          v-if="isShowFileList"
          v-model="fileList"
          :domain="file_domain"
          :file-type="fileType"
          :value-config="valueConfig"
          :remove="remove"
          :download="download"
          v-bind="$attrs"
          @del="delFile"
        />
      </slot>
    </template>
  </div>
</template>
<script lang="ts">
import { get, cloneDeep } from 'lodash-es'
import FileView from '../../fileView/src/fileView.vue'
import { defineComponent, computed, ref, watch, SetupContext } from 'vue'
// import { useVModel } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { ApiProxy } from '@/config'
const { VITE_DOMAIN } = import.meta.env
const prefix = ApiProxy.java.main
const fileDomain = VITE_DOMAIN || ''
export default defineComponent({
  components: { FileView },
  props: {
    // 值
    modelValue: { type: [String, Object, Array], default: () => [] },
    // 上传的文件类型
    fileType: {
      type: String,
      default: 'file' //file img
    },
    multiple:{
      type:Boolean,
      default:false,
    },
    // 限制上传的文件数量
    limit: {
      type: Number,
      default: 1
    },
    // 大小限制(MB)-最大
    fileSize: {
      type: Number,
      default: 0
    },
    // 大小限制(MB)-最小
    fileMinSize: {
      type: Number,
      default: 0
    },
    // 图片压缩比-fileType为img有效
    compressRatio: {
      type: Number,
      default: 0
    },
    // 图片宽高比-fileType为img有效
    aspectRatio: {
      type: Number,
      default: 0
    },
    // 可以上传的类型
    acceptType: {
      type: Array,
      default: () => ['png', 'jpg', 'jpeg', 'doc', 'xls', 'ppt', 'txt', 'pdf']
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    },
    isShowFileList:{
      type:Boolean,
      default:true
    },
    // 上传提示
    tips: {
      type: String,
      default: ''
    },
    // 是否显示上传
    isShowUpload: {
      type: Boolean,
      default: true
    },
    // 是否显示删除
    remove: {
      type: Boolean,
      default: true
    },
    download: {
      type: Boolean,
      default: true
    },
    // 数据值key
    valueConfig: {
      type: Object,
      default: () => {
        return {
          name: 'originalFilename',
          url: 'fileUrl'
        }
      }
    },
    // 接口配置
    apiConfig: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  emits: ['update:modelValue', 'del', 'change','upStatus','upload-success'],
  setup (props: any, ctx: SetupContext) {
    const uploadDom = ref(null)
    const isUploading = ref(false)
    watch(()=>isUploading.value,val=>{
      ctx.emit('upStatus', val)
    })
    const nameKey = computed(() =>
      get(props || {}, 'valueConfig.name', 'originalFilename')
    )
    const urlKey = computed(() =>
      get(props || {}, 'valueConfig.url', 'fileUrl')
    )
    const newApiConfig = computed(() =>
      Object.assign(
        {
          apiUrl: `${prefix}/pc/upload/file`,
          requestType: 'post',
          params: {},
          headers: {},
          paramsFilesKey: 'fileArray',
          isNeedBackDomain: false,
          fileDomain: fileDomain || ''
        },
        props.apiConfig || {}
      )
    )
    const file_domain = ref('')
    // const fileList=useVModel(props, 'modelValue', ctx.emit)
    const fileList = ref([])
    const initData = () => {
      fileList.value = []
      if (props.modelValue) {
        let list = props.modelValue
        if (list && typeof list === 'string') {
          try {
            list = JSON.parse(list)
          } catch (error) {}
        }
        list = Array.isArray(list) ? list : [list]
        list.map((item: any) => {
          let itemObj: any = {}
          if (typeof item === 'string') {
            itemObj[nameKey.value] = item
            itemObj[urlKey.value] = item
          } else {
            itemObj = item
          }
          fileList.value.push(itemObj)
        })
      }
      file_domain.value = newApiConfig.value.fileDomain
    }
    watch(
      () => {
        return props.modelValue
      },
      () => {
        initData()
      },
      { deep: true, immediate: true }
    )

    const goUpload = () => {
      const apiUrl = get(newApiConfig.value || {}, 'apiUrl', '')
      if (!apiUrl) {
        ElMessage.warning('暂未配置上传接口')
        return false
      }
      if (isUploading.value) {
        ElMessage.warning('正在上传中,请稍后再试...')
        return false
      }
      uploadDom.value.dispatchEvent(new MouseEvent('click'))
    }
    const clearUploadStatus = () => {
      uploadDom.value.value = ''
      isUploading.value = false
    }
    const beforeUpload = async (oneFile: any) => {
      let curFileList = []
      if (oneFile) {
        curFileList = [oneFile]
      } else {
        if (!uploadDom.value) {
          ElMessage.warning('未找到上传input')
          return false
        }
        curFileList = uploadDom.value.files
        if(uploadDom.value.files.length > props.limit){
          ElMessage.warning(`上传文件数量超过${props.limit}限制`)
          return
        }
      }
      for (var i = 0; i < curFileList.length; i++) {
        const file = curFileList[i]
        // 校检文件类型
        if (props.acceptType && props.acceptType.length) {
          let fileExtension = ''
          if (file.name.lastIndexOf('.') > -1) {
            fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
          }
          const isTypeOk = props.acceptType.some((type: string) => {
            if (file.type.indexOf(type) > -1) return true
            if (fileExtension && fileExtension.indexOf(type) > -1) return true
            return false
          })
          if (!isTypeOk) {
            ElMessage.error('文件格式不正确, 请上传正确格式的文件!')
            clearUploadStatus()
            return false
          }
        }
        // 校检文件大小
        if (props.fileSize) {
          const isLt = file.size / 1024 / 1024 < props.fileSize
          if (!isLt) {
            ElMessage.error(
              `上传文件大小不能超过 ${formatFileSize(
                props.fileSize * 1024 * 1024
              )}!`
            )
            clearUploadStatus()
            return false
          }
        }
        if (props.fileMinSize && props.fileMinSize * 1 > 0) {
          const isMinLt = file.size / 1024 / 1024 > props.fileMinSize
          if (!isMinLt) {
            ElMessage.error(
              `上传文件大小不能小于 ${formatFileSize(
                props.fileMinSize * 1024 * 1024
              )}!`
            )
            clearUploadStatus()
            return false
          }
        }
        if (props.fileType === 'img') {
          if (props.aspectRatio && props.aspectRatio * 1 > 0) {
            const file_aspectRatio: any = await getAspectRatio(file)
            console.log(
              '图片宽高比:',
              file_aspectRatio,
              '目标宽高比',
              props.aspectRatio
            )
            if (
              file_aspectRatio &&
              Math.abs(file_aspectRatio * 1 - props.aspectRatio * 1) * 1 > 0.1
            ) {
              ElMessage.error(
                `上传图片宽高比应为 ${props.aspectRatio},现在为${file_aspectRatio}`
              )
              clearUploadStatus()
              return false
            }
          }
          //校验文件是否需要压缩
          if (props.compressRatio && props.compressRatio * 1 > 0) {
            console.log('图片目标压缩比:' + props.compressRatio)
            compressLoading.value = true
            compressPhoto(file, props.compressRatio, (compressFile: any) => {
              maxQ.value = 1
              minQ.value = 0
              compressLoading.value = false
              beforeUpload(compressFile)
            })
            clearUploadStatus()
            return false
          }
        }
      }
      upFileInfo(curFileList)
    }
    const upFileInfo = (curFileList: any) => {
      if (!curFileList || !curFileList.length) {
        return
      }
      const formData: any = new FormData()
      const filesKey = get(
        newApiConfig.value || {},
        'paramsFilesKey',
        'fileArray'
      )
      const params = get(newApiConfig.value || {}, 'params', {})
      // 文件参数
      for (var i = 0; i < curFileList.length; i++) {
        const currowfile = curFileList[i]
        let fileObject: any = {
          file: currowfile,
          status: 'active', // success error active 上传状态
          percent: 0
        }
        fileObject[nameKey.value] = currowfile.name
        fileObject[urlKey.value] = ''
        fileObject['percentTimer'] = percentChange(fileObject)
        fileList.value.push(fileObject)
        formData.append(filesKey, curFileList[i])
      }
      changeVal()
      // 额外参数
      Object.keys(params || {}).forEach((key: string) => {
        formData.append(key, params[key])
      })
      isUploading.value = true
      try {
        const headers = get(newApiConfig.value || {}, 'headers', {})
        const apiUrl = get(newApiConfig.value || {}, 'apiUrl', '')
        const requestType = get(newApiConfig.value || {}, 'requestType', 'post')
        const xhr: any = new XMLHttpRequest()
        xhr.open(requestType, apiUrl, false)
        // xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8')
        Object.keys(headers || {}).forEach((key: string) => {
          if (headers[key]) {
            xhr.setRequestHeader(key, headers[key])
          }
        })
        xhr.onreadystatechange = () => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            const res = xhr.responseText ? JSON.parse(xhr.responseText) : {}
            res.success = res.success || Number(res.status) === 200
            res.errMsg = res.errMsg || res.message
            if (!res.success) {
              ElMessage.error(res.errMsg || '上传失败')
              uploadFinish({}, false)
              ctx.emit('upload-success', false)

            } else {
              uploadFinish(res.data || {}, res.success)
              ctx.emit('upload-success', true)
            }
          } else {
            ElMessage.error('上传失败')
            uploadFinish({}, false)
          }
        }
        xhr.upload.onprogress = (event: any) => {
          if (event.lengthComputable && event.total) {
            const percent = (event.loaded / event.total) * 100
            console.log('上传进度', percent + '%')
          }
        }
        xhr.send(formData)
      } catch (error) {
        ElMessage.error('上传失败')
        uploadFinish({}, false)
      }
    }
    const uploadFinish = (data: any, uploadSuccess: boolean) => {
      const isNeedBackDomain = get(
        newApiConfig.value || {},
        'isNeedBackDomain',
        false
      )
      const fileDomain = isNeedBackDomain
        ? get(data || {}, 'domain', '')
        : get(newApiConfig.value || {}, 'fileDomain', '')
      file_domain.value = fileDomain
      setTimeout(() => {
        const resultList = get(data || {}, 'resultList', [])
        fileList.value.map((item: any, index: number) => {
          if (item.status && ['active'].indexOf(item.status) !== -1) {
            if (uploadSuccess) {
              const findItem = resultList.find(
                (citem: any) => item[nameKey.value] === citem[nameKey.value]
              )
              if (findItem && findItem[urlKey.value]) {
                fileList.value[index][urlKey.value] =
                  fileDomain + findItem[urlKey.value]
              }
            }
            if (item.percentTimer) {
              clearInterval(fileList.value[index].percentTimer)
              fileList.value[index].percentTimer = null
            }
            fileList.value[index].status = uploadSuccess ? 'success' : 'error'
            fileList.value[index].percent = uploadSuccess ? 100 : item.percent
          }
        })
        changeVal()
        clearUploadStatus()
      }, 2000)
    }
    const delFile = () => {
      ctx.emit('del', fileList.value)
      changeVal()
    }
    const changeVal = () => {
      ctx.emit('update:modelValue', fileList.value)
      ctx.emit('change', fileList.value)
    }

    // 模拟进度条
    const percentChange = (fileObject: any) => {
      const percentTimer = setInterval(() => {
        const random = Math.floor(Math.random() * 5) + 1
        if (fileObject.percent <= 95) {
          fileObject.percent = random + (fileObject.percent || 0)
        } else {
          clearInterval(fileObject.percentTimer)
          fileObject.percentTimer = null
        }
        changeVal()
      }, 300)
      return percentTimer
    }
    // 文件大小单位换算
    const formatFileSize = (fileSize: number) => {
      let temp: any = fileSize
      let unit = 'B'
      if (fileSize < 1024) {
        temp = fileSize
        unit = 'B'
      } else if (fileSize < 1024 * 1024) {
        temp = fileSize / 1024
        unit = 'KB'
      } else if (fileSize < 1024 * 1024 * 1024) {
        temp = fileSize / (1024 * 1024)
        unit = 'MB'
      } else {
        temp = fileSize / (1024 * 1024 * 1024)
        unit = 'GB'
      }
      return (temp * 1).toFixed(2) + unit
    }
    // 获取图片宽高比
    const getAspectRatio = (photoFile: any) => {
      return new Promise(resolve => {
        var reader = new FileReader()
        reader.onload = (() => {
          return (e: any) => {
            var img = new Image()
            img.src = e.target.result
            img.onload = () => {
              console.log('图片宽高', img.width, img.height)
              resolve((img.width / img.height).toFixed(2))
            }
          }
        })(photoFile)
        reader.readAsDataURL(photoFile)
      })
    }
    // 图片压缩
    const compressLoading = ref(false)
    const minQ = ref(0) //图片压缩最小质量
    const maxQ = ref(1) //图片压缩最大质量
    const compressPhoto = (file: any, compressRatio: any, callback: any) => {
      const nextQ = compressRatio
      fileToBase64(file, nextQ, function (image: any, canvas: any, nextQ: any) {
        const base64Codes = canvas.toDataURL(file.type, 1)
        const compressFile = base64ToFile(base64Codes, file.name.split('.')[0])
        const compressFileSize = compressFile.size / 1024
        console.log('图片质量：' + nextQ)
        console.log('压缩后文件大小：' + compressFileSize + 'kB')
        if (
          props.fileSize &&
          props.fileSize * 1 > 0 &&
          compressFileSize > props.fileSize
        ) {
          // 压缩后文件大于最大值
          maxQ.value = nextQ
          nextQ = (nextQ + minQ.value) / 2 // 质量降低
          compressPhoto(file, nextQ, callback)
        } else if (
          props.fileMinSize &&
          props.fileMinSize * 1 > 0 &&
          compressFileSize < props.fileMinSize
        ) {
          // 压缩以后文件小于最小值
          minQ.value = nextQ
          nextQ = (nextQ + maxQ.value) / 2 // 质量提高
          compressPhoto(file, nextQ, callback)
        } else {
          callback(compressFile)
        }
      })
    }
    // file 转为 base64
    const fileToBase64 = (file: any, nextQ: any, callback: any) => {
      if (!file || !window.FileReader) return
      const image: any = new Image()
      // 绑定 load 事件处理器，加载完成后执行
      image.onload = function () {
        const canvas = document.createElement('canvas')
        const canvas_ctx: any = canvas.getContext('2d')
        canvas_ctx.clearRect(0, 0, canvas.width, canvas.height)
        canvas.width = image.width * nextQ
        canvas.height = image.height * nextQ
        canvas_ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        callback(image, canvas, nextQ)
      }
      if (/^image/.test(file.type)) {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
          image.src = this.result
        }
      }
    }
    const base64ToFile = (dataurl: string, filename: string) => {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    }

    let useAccept = computed(()=>{
      return props.acceptType.map(e=>{
        return `.${e}`
      }).join(',')
    })
    return {
      get,
      useAccept,
      cloneDeep,
      uploadDom,
      fileList,
      isUploading,
      file_domain,
      newApiConfig,
      compressLoading,

      goUpload,
      beforeUpload,
      delFile
    }
  }
})
</script>

<style lang="scss" scoped>
.btnBox {
  width: 100%;
  display: inline-block;
  vertical-align: middle;
  #input_import_file {
    position: fixed;
    left: -100vw;
    top: -100vh;
    display: none;
  }
  .up_btn {
    width: 315px !important;
    height: auto !important;
    padding: 4px 15px !important;
    margin-bottom: 20px;
    background: $primary-color;
    border-radius: 4px;
    border: 1px dashed $primary-color;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .icon_up {
      width: 24px;
      height: 24px;
      margin-right: 10px;
      svg {
        width: 100%;
        height: 100%;
      }
    }
  }
  .upload_tip {
    font-size: 12px;
    color: #999;
    text-align: justify;
    margin-bottom: 20px;
  }

  .uploadBox {
    display: inline-block;
    vertical-align: middle;
    width: 160px;
    height: 120px;
    border: 1px solid #cbcbcb;
    margin: 0 10px 10px 0;
    position: relative;
    &.hide {
      display: none;
    }
    // 上传按钮
    .uploadIcon {
      display: block;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      color: #c7c7c7;
      // font-weight: bold;
      white-space: nowrap;
      text-align: center;
      cursor: pointer;
      ::v-deep .el-icon {
        display: block;
        width: 20px;
        height: 20px;
        font-size: 20px;
        margin: 0 auto 10px;
        svg {
          width: 100%;
          height: 100%;
        }
      }
      span {
        display: block;
        font-size: 14px;
        line-height: 20px;
      }
    }
    .uploadProgress {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      padding: 5px;
      box-sizing: border-box;
      background: #ffffff;
      ::v-deep .el-progress {
        width: 100%;
        height: 100%;
        .el-progress-circle {
          width: 100% !important;
          height: 100% !important;
        }
        .el-progress__text {
          font-size: 14px !important;
          // color: $primary-color !important;
        }
      }
    }
  }
}

.icon_tip{
    width: 18px;
    height: 18px;
    margin-right: 4px;
}
</style>
