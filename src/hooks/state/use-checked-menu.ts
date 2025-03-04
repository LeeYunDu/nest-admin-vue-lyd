import { computed, ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { MenuMode } from '@/typings/data'

export default function useCheckedMenu () {
  const routeRef: any = computed(() => useRoute())
  const route = computed(() => {
    const routeData: any = routeRef.value
    return routeData
  })
  const menu: ComputedRef<MenuMode> = computed(() => {
    return route.value.meta.data as MenuMode
  })
  const options: ComputedRef<any> = computed(() => JSON.parse(menu.value?.options || '{}'))
  const showHeader = computed(() => {
    if (options.value.hiddenHeader === undefined) return route.value.meta.showHeader
    return options.value.hiddenHeader !== 1
  })
  const showSide = computed(() => {
    if (options.value.hiddenSide === undefined) return route.value.meta.showSide
    return options.value.hiddenSide !== 1
  })

  const showBreadcrumb = computed(() => options.value.showBreadcrumb === 1)
  return {
    route,
    menu,
    options,
    showHeader,
    showSide,
    showBreadcrumb
  }
}
