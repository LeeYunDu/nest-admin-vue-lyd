<template>
  <section class="app-menu">
    <el-menu
      :default-active="defaultActive"
      v-bind="uProps"
    >
      <template v-for="(menu, index) in menus" :key="index">
        <template v-if="menu.hidden !== 0">
          <!-- 嵌套 -->
          <menu-sub
            v-if="menu.children && menu.children.length > 0"
            :index="menu.routerPath"
            :menu="menu"
          />

          <el-menu-item
            v-else
            :key="index"
            :index="route.matched[0].path === menu.routerPath ? route.path : menu.routerPath"
            @click="onMenu(menu)"
          >
            <Icon :menu="menu" />
            <span>{{ menu.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </section>
</template>
<script lang="ts" setup>
import { open } from '@/utils'
import { MenuMode } from '@/typings/data'
import { computed, PropType } from 'vue'
import { useRoute } from 'vue-router'
import MenuSub from './menu.sub.vue'
import Icon from './icon.vue'

const props = defineProps({
  menus: { type: Array as PropType<MenuMode[]>, default: () => [] },
  props: { type: Object, default: () => ({}) }
})

// hooks
const route = useRoute()

// state
const defaultActive = computed<string>(() => route.path)
const uProps = computed<any>(() => Object.assign({}, props.props))

// fns
function onMenu (menu: MenuMode) {
  open(menu)
}
</script>
<style lang="scss" scoped>
.app-menu {
  width: 100%;
  height: 100%;
}
</style>
