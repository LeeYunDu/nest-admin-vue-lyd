<template>
  <div
    v-if="show"
    class="SimpleDialog"
    :class="{
      'SimpleDialog-enter-active': show
    }"
    :style="useStyle"
  >
    <div v-if="showClose" class="close" @click="onCancel">
      <i class="iconfont-screen icon-screen-jiantou icon"></i>
    </div>

    <div v-if="show" class="SimpleDialog-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, inject } from 'vue'
import _ from 'lodash-es'
import { cloneDeep,get } from 'lodash-es'
let emits = defineEmits(['update:modelValue', 'onOK', 'onCancel'])
// 定义组件的 Props
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  footerShow: { type: Boolean, default: false },
  bodyPadding: { type: [Array, String], default: () => [] },
  title: { type: [Array, String], default: () => [] },
  dialogClass: { type: String, default: '' },
  dialogStyle: { type: Object, default: () => ({}) },
  showClose: { type: Boolean, default: true }
})

let isBigScreen = inject('isBigScreen')
// 定义 emit 事件

// 内部状态
const btnLoading = ref(false)
const attrs = ref(props.$attrs)

const show = computed({
  get: () => props.modelValue,
  set: val => emits('update:modelValue', val)
})
const pxToRem = px => {
  return isBigScreen ? px : `${px / 16}rem`
}

// useStyle 计算属性
const useStyle = computed(() => {
  let dialogStyle = cloneDeep(props.dialogStyle)
  if (document.documentElement.clientWidth <= 2560) {
    // 处理最后单位为px的样式值，转化为rem
    Object.keys(dialogStyle).forEach(key => {
      if (
        typeof dialogStyle[key] === 'string' &&
        dialogStyle[key].includes('px')
      ) {
        dialogStyle[key] = pxToRem(dialogStyle[key].replace('px', ''))
      }
    })
  }

  return {
    ...dialogStyle
  }
})

// 确认按钮点击事件
const onConfirm = () => {
  btnLoading.value = true
  emits('onOK', () => {
    btnLoading.value = false
  })
}

// 取消按钮点击事件
const onCancel = () => {
  show.value = false
  if (!_.hasIn(attrs.value, 'onCancel')) {
    emits('onCancel')
  }
}
</script>

<style lang="scss" scoped>
.SimpleDialog {
  position: absolute;
  top: 0;
  display: flex;
  padding: 30px;
  background-size: 100% 100%;
  background-color: transparent;
  flex-direction: column;
  // background-image: url('~@/assets/img/component/screen-dialog-bg.png');
  border-image: linear-gradient(
    180deg,
    rgba(99, 176, 183, 0.45),
    rgba(50, 218, 245, 1)
  );
}

// 弹窗打开动画
.SimpleDialog-enter-active {
  animation: SimpleDialogOpen 0.3s ease-in-out;
}

@keyframes SimpleDialogOpen {
  from {
    transform: scale(0);
  }

  to {
    transform: scale(1);
  }
}

.close {
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;

  .icon {
    width: 20px;
    height: 20px;
    color: #efffff;
  }
}

.history-dialog {
  .close {
    top: 0;
    right: 50%;
    transform: translateX(50%);
  }
}

.SimpleDialog-body {
  display: flex;
  height: 100%;
  flex: 1;
  flex-direction: column;
}
</style>
