<template>
  <section
    :class="['app-layout', { showHeader: showHeader, showSide: showSide }]"
    :style="{
      backgroundImage: `url(${banner})`
    }"
  >
    <header v-if="showHeader">
      <ViewHeader />
    </header>
    <main>
      <template v-if="showSide">
        <section class="aside">
          <ViewAside />
        </section>
      </template>
      <section class="main">
        <ViewMain />
      </section>
    </main>
  </section>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import useCheckedMenu from '@/hooks/state/use-checked-menu'
import ViewHeader from './components/header.vue'
import ViewMain from './components/main.vue'
import ViewAside from './components/aside.vue'
import { RouteLocationMatched, useRoute } from 'vue-router'
import { MenuMode } from '@/typings/data'
import { get } from 'lodash-es'
import { imgPath } from '@/utils'

// hooks
const route = useRoute()

const showHeader = computed(() => {
  return get(route.meta, 'showHeader', false)
})

const { showSide } = useCheckedMenu()

const matched = computed<RouteLocationMatched[]>(() => route.matched || [])

const metaMenu = computed<MenuMode>(() => (route.meta?.data || {}) as MenuMode)

const banner = computed<string>(() => {
  let showBanner = metaMenu.value.showBanner??true
  if(showBanner){
    const cp = metaMenu.value.picture
    const cur = cp ? JSON.parse(cp) : getMachedPicture()
    return cur[0]?.url || imgPath('layout/banner2.png')
  }
  return ''
})

// fns
function getMachedPicture() {
  let picture: any[] = []
  matched.value.find((item: RouteLocationMatched) => {
    const mData = item.meta?.data as MenuMode
    if (mData?.picture) {
      picture = JSON.parse(mData.picture)
      return true
    }
  })
  return picture
}
</script>
<style lang="scss" scoped>
.app-layout {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-size: 100% ;
  background-repeat: no-repeat;
  background-position: top;
  background-color: #F6F7F9;
  &.showHeader {
    header {
      height: $page-header-height;
      padding: 0;
    }
  }
  header {
    position: relative;
    width: 100%;
    z-index: 33;
  }

  main {
    margin: 20px 24px 24px 24px;
    position: relative;
    display: flex;
    overflow: hidden;
    flex: 1;
    .aside {
      width: $page-aside-width;
      margin-right: 20px;
      background: #FFFFFF;
      border-radius: 4px 4px 4px 4px;
      overflow: hidden;
      padding: 6px 10px;
    }
    .main {
      flex: 1;
      height: 100%;
      overflow: hidden;
    }
  }
  .fixed-container {
    position: fixed;
  }
  .bg-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
