<template>
  <section class="view-component">
    <section class="message">
      <i class="qx qx-tongzhi"></i>
      <template v-if="hasMsg">
        <span class="circle"></span>
      </template>
    </section>
  </section>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

const hasMsg = computed<any>(() => true)
</script>
<style lang="scss" scoped>
.message {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  i {
    font-size: 26px;
  }
  .circle {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 6px;
    height: 6px;
    border-radius: 100%;
    background: red;
  }
}
</style>
