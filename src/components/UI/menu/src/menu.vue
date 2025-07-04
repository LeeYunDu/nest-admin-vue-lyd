<template>
  <section class="ui-component">
    <el-menu
      :default-active="activeIndex"
      v-bind="compoentProps"
      @select="handleSelect"
    >
      <template
        v-for="(item, index) in useData"
        :key="index"
      >
        <template v-if="item.hidden === 1">
          <template v-if="item.children?.length">
            <UiSubMenu
              :data="item"
              :index="item.id"
            />
          </template>
          <template v-else>
            <el-menu-item :index="item.id">{{ item.label }}</el-menu-item>
          </template>
        </template>
      </template>
    </el-menu>
  </section>
</template>
<script lang="ts">
import { MenuMode } from '@/typings/data'
import { computed, defineComponent, PropType, toRef } from 'vue'
import UiSubMenu from './sub.menu.vue'
import { useStore } from 'vuex'
import { open } from '@/utils'
import useCheckedMenu from '@/hooks/state/use-checked-menu'

export default defineComponent({
  name: 'UiMenu',

  components: { UiSubMenu },

  props: {
    data: { type: Array as PropType<MenuMode[]>, default: () => [] },
    options: { type: Object, default: () => ({}) }
  },

  setup (props: any) {
    const store = useStore()
    const menus = computed(() => store.getters.menus)
    const useData = toRef(props, 'data')
    const options = toRef(props, 'options')
    const compoentProps = computed(() => options.value.props || {})
    const itemProps = computed(() => options.value.itemProps || {})
    const { menu } = useCheckedMenu()
    const activeIndex = computed(() => {
      return menu.value?._ids?.join('-')
    })

    function handleSelect (id: string | number) {
      const ids = String(id).split('-') || []
      const selectId = String(ids[ids.length - 1])
      const menuType2s: any = menus.value.jsonMenus[2]
      const selectMeun = menuType2s.find(
        (menu: MenuMode) => String(menu.id) === selectId
      )
      if (!selectMeun) return
      open(selectMeun)
    }

    return {
      activeIndex,
      useData,
      compoentProps,
      itemProps,
      // fn
      handleSelect
    }
  }
})
</script>
<style lang="scss" scoped>
.ui-component {
  :deep {
    .el-menu--horizontal {
      display: flex;
      align-items: center;
    }
  }
}
</style>
