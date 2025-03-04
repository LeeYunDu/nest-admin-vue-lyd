<template>
  <span class="icon-c">
    <template v-if="isObject(icon)">
      <img v-show="isActive && !!icon.active" class="icon" :src="icon.active" />
      <img
        v-show="!isActive && !!icon.default"
        class="icon"
        :src="icon.default"
      />
    </template>
    <template v-else>
      <i v-if="!!menu.icon" :class="icon"></i>
    </template>
  </span>
</template>
<script lang="ts" setup>
import { MenuMode } from '@/typings/data'
import { isJsonString, isObject, isString } from '@/utils'
import { PropType } from 'vue'
import Config from '@/config'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

type Icon = string | { [key: string]: string }

const props = defineProps({
  menu: { type: Object as PropType<MenuMode>, default: () => ({}) }
})

// hooks
const route = useRoute()

// state
const isActive = computed<boolean>(() => props.menu.routerPath === route.path)

const iconfont = Config.iconfont?.prefix || 'iconfont'

const icon = computed<Icon>(() => {
  let uIcon = props.menu.icon

  switch (true) {
    case isJsonString(uIcon):
      uIcon = JSON.parse(uIcon || '{}')
      break
    case uIcon && isString(uIcon):
      uIcon = `${iconfont} ${uIcon}`
      break
    default:
      break
  }
  return uIcon
})
</script>
<style lang="scss" scoped>
.icon-c {
  display: flex;
  align-items: center;
  margin-right: 12px;
  margin-bottom: 1px;
  img.icon {
    width: 18px;
  }
  i {
    display: none;
    width: 22px;
    text-align: center;
    margin-right: 12px;
    font-weight: 600;
    color: $primary-color;
  }
}
</style>
