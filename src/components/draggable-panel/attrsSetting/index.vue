<template>
  <div class="attrs-setting">
    <h3>属性设置</h3>
    {{ useSettingFormItems }}
    <div class="attrs-content">
      <!-- <SettingForm :model="attrs.props" :fields="[{ key: 'y1' }, { key: 'y2' }]" /> -->
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SettingForm from './setting-form/index.vue'
import { componentAttrsConfig } from '../config/component-attrs-comfig'
import { get } from 'lodash-es'
const props = defineProps({
  attrs: {
    type: Object,
    default: () => ({})
  }
})

const useSettingFormItems = computed(() => {
  return []
})
</script>

<style scoped>
/* 保持原有样式不变 */
.attrs-setting {
  padding: 20px;
}

h3 {
  margin-bottom: 15px;
}

.attrs-content {
  border: 1px solid #ebeef5;
  padding: 15px;
  border-radius: 4px;
}
</style>