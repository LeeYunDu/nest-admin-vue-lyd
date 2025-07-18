import { useStore } from 'vuex'
import { computed, ref, watch, ComputedRef } from 'vue'
import { MenuMode } from '@/typings/data'
import { useSubscribe } from '@/hooks/pubsub'
import { appKeys } from '@/global/pubsub/index'
import { useRoute } from 'vue-router'
import { useBussinessRoutes } from '@/router/modules/bussiness'

export default function useApp () {
  const route = useRoute()
  const store = useStore()
  const appRef = computed(() => store.getters.app)
  const microApps = computed(() => store.getters.micro.apps)
  const menuOption = computed<any>(() => appRef.value.options?.menu || {})
  const sideTheme = computed<any>(() => appRef.value.options?.sideTheme ?? '')

  const menus = computed(() => store.getters.menus)
  // const treeMenus = computed<MenuMode[]>(() => menus.value.treeMenus || [])
  const treeMenus = ref(useBussinessRoutes())
  console.log(treeMenus, 'treeMenus')

  const currentMenu: ComputedRef<MenuMode> = computed(() => {
    return (route?.meta?.data || {}) as MenuMode
  })
  const topMenuId: any = computed(() => currentMenu.value?._ids?.[0])

  const chm = computed<MenuMode | undefined>(() => treeMenus.value?.find((item: MenuMode) => item.id === topMenuId.value))
  const menuPosition = computed<string>(() => menuOption.value.menuPosition)
  const headerMenus = computed<MenuMode[]>(() => {
    switch (true) {
      case menuPosition.value === 'topLeft':
        return treeMenus.value.map((item: MenuMode) => ({
          ...item,
          children: []
        }))
      case menuPosition.value === 'left':
        return []
      default:
        return treeMenus.value
    }
  })
  const sideMenus = ref<any[]>([])
  setSideMenus()
  watch(chm, () => {
    setSideMenus()
  })
  function setSideMenus () {
    let sms: MenuMode[] = []
    switch (true) {
      case menuPosition.value === 'topLeft':
        sms = chm.value?.children || []
        break
      case menuPosition.value === 'left':
        sms = treeMenus.value || []
        break
      default:
        break
    }
    sideMenus.value = sms
  }

  const sub = useSubscribe(appKeys.LOAD_MICRO_APP)
  // sub.unsubscribe()
  sub.subscribe((data: any) => {
    // alert(1)
    const microState = microApps.value[data?.micro.id]
    if (!microState) return
    sideMenus.value = microState.menus?.treeMenus || []
  })

  return {
    app: appRef,
    headerMenus,
    currentHeaderMenu: chm,
    sideMenus,
    menuPosition: menuOption.value.menuPosition,
    menuShowIcon: menuOption.value.menuShowIcon,
    sideTheme
  }
}
