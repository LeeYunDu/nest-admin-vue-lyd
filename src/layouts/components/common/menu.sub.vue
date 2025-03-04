<template>
  <section class="submenuBox">
    <el-sub-menu :index="String(menu.routerPath)">
      <template #title>
        <span class="submenu-title">
          <Icon :menu="menu" />
          <span>{{ menu.name }}</span>
        </span>
      </template>
      <template v-for="item in menu.children" :key="item.id">
        <template v-if="item.hidden !== 0">
          <!-- 嵌套 -->
          <template v-if="Number(item.menuType) === 1 && item.children && item.children.length > 0">
            <subMenu
              :key="item.id"
              :index="menu.routerPath"
              :menu="item"
            />
          </template>
          <template v-else>
            <el-menu-item
              :index="item.routerPath"
              @click="onMenu(item)"
            >
              <Icon :menu="item" />
              <span>{{ item.name }}</span>
            </el-menu-item>
          </template>
        </template>
      </template>
    </el-sub-menu>
  </section>
</template>
<script lang="ts" setup name="subMenu">
import { open } from '@/utils'
import { MenuMode } from '@/typings/data'
import Icon from './icon.vue'
import { PropType } from 'vue'

defineProps({
  // 菜单
  menu: { type: Object as PropType<MenuMode>, default: () => ({}) },
  index: { type: [String, Number], default: '' }
})

function onMenu (menu: MenuMode) {
  open(menu)
}
</script>
<style lang="scss" scoped>
</style>
