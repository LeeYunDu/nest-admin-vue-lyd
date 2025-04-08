<template>
  <el-dialog
    v-model="show"
    v-bind="$attrs"
    destroy-on-close
    append-to-body
    class="Simple-modal"
    @close="onCancel"
  >
    <template v-for="( slot, slotKey ) in $slots" #[slotKey]>
      <slot :name="slotKey"></slot>
    </template>

    <template v-if="footerShow && !$slots.footer" #footer>
      <div class="pass-box">
        <el-button class="poss-cancel btn" @click="onCancel">取消</el-button>
        <el-button :loading="btnLoading" class="poss-confirm btn" @click="onConfirm">{{ $attrs['confirm-text'] || '确定' }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import _ from 'lodash-es'
import { computed, ref, useAttrs } from 'vue'
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  footerShow: { type: Boolean, default: false },
  bodyPadding: { type: [Array,String], default: () => ([]) },
})

const emits = defineEmits(['update:modelValue','onOK','onCancel'])

const $attrs = useAttrs()

const show = computed({
  get: () => props.modelValue,
  set: val => emits('update:modelValue',val)
})

const _bodyPadding = computed(() => {
  const style = props.bodyPadding
  if (!style) return '10px'
  if (_.isString(style)) return style + 'px'
  return style.join('px ') + 'px'
})

const btnLoading = ref(false)

const onConfirm = () => {
  btnLoading.value = true
  emits('onOK',() => {
    btnLoading.value = false
  })
}

const onCancel = () => {
  if (_.hasIn($attrs,'onCancel')) return emits('onCancel')
  show.value = false
}

</script>

<style lang="scss">
.Simple-modal {
  &.el-dialog{
    border-radius: 0;
    border: 1px solid;
    background: rgba(8,23,51,0.9);
    border-radius: 0px 0px 0px 0px;
    border: 1px solid;
    border-image: linear-gradient(180deg, rgba(23, 42, 49, 1), rgba(69, 128, 150, 1), rgba(27, 58, 86, 1)) 1 1;
    padding-top: 0px;
    .el-dialog__header {
      padding: 0px;
      width: 100%;
      height: 46px;
      display: flex;
      align-items: center;
      background: {
        // image:metaFilePathScss('yyjc-title-bg.png');
        size: 100% 46px;
        position: bottom;
        repeat: no-repeat;
      }
      position: relative;
      .el-dialog__title {
        font-family: Alibaba PuHuiTi, Alibaba PuHuiTi;
        font-weight: bold;
        font-size: 24px;
        color: #ffffff!important;
        // text-align: center;
        width: 100%;
        height: 100%;
        padding-left:70px;
        display: flex;
        align-items: center;
      }
      button {
        i {
          display: block;
          width: 32px;
          height: 32px;
          background: {
            image: imgPathScss('dialog/icon-close.png');
            size: 100% 100%;
          }
          > svg {
            display: none;
            width: 100%;
            height: 100%;
          }
        }
      }
      &:before {
        content: '';
        display: inline-block;

        width: 27.5px;
        height: 33px;
        background: {
          image: imgPathScss('dialog/icon-arrow-light.png');
          size: 100% 100%;
        }
        position: absolute;
        left: 15px;
        animation: lightMove 1.5s infinite linear;
      }

      &:after {
        content: '';
        display: inline-block;
        width: 27.5px;
        height: 33px;
        background: {
          image: imgPathScss('dialog/icon-arrow-light.png');
          size: 100% 100%;
        }
        position: absolute;
        left: 35px;
        animation: lightMove 1.5s infinite linear 0.2s;
      }
    }

    .el-dialog__body {
      display: flex;
      flex-direction: column;
      padding: 20px 17px;
    }
  }
  .pass-box {
    text-align: center;
    .btn {
      font-size: 14px;
      font-weight: 400;
      width: 96px;
      height: 36px;
      border-radius: 4px;
      padding: 0 20px;
      display: inline-block;
      line-height: 36px;
      cursor: pointer;
      min-height: initial;
    }
    .poss-confirm {
      margin-left: 20px;
      color: #FFFFFF;
      background: linear-gradient(56deg, #3061FF 0%, #3DA0FD 100%);
    }
    .poss-cancel {
      color: rgba(0, 0, 0, 0.65);
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.15);
    }
  }
}


</style>
