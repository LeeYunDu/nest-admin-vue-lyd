<template>
  <el-sub-menu :index="index">
    <template #title>{{ data.label }}</template>
    <template v-for="(item, itemIndex) in data.children" :key="itemIndex">
      <template v-if="item.hidden === 1">
        <template v-if="item.children?.length">
          <UiSubMenu :index="`${index}-${item.id}`" :data="item" />
        </template>
        <template v-else>
          <el-menu-item :index="`${index}-${item.id}`">{{ item.label }}</el-menu-item>
        </template>
      </template>
    </template>
  </el-sub-menu>
</template>
<script lang="ts">
import { open } from '@/utils'
import { MenuMode } from '@/typings/data'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'UiSubMenu',

  props: {
    data: { type: Object as PropType<MenuMode>, default: () => ({}) },
    index: { type: String, default: '' }
  },

  setup () {
    function onMenu (menu: MenuMode) {
      open(menu)
    }
    return {
      // fn
      onMenu
    }
  }
})
</script>
