<template>
  <section class="layout-main">
    <section class="content" :class="[{ noBreadcrumb: !showBreadcrumb }]">
      <template v-if="showBreadcrumb">
        <section class="breadcrumb">
          <PageBreadcrumb />
        </section>
      </template>
      <section class="mount scroll-y">
        <router-view />
      </section>
    </section>
  </section>
</template>
<script lang="ts" setup>
import useCheckedMenu from '@/hooks/state/use-checked-menu'
import PageBreadcrumb from './breadcrumb.vue'

const { showBreadcrumb } = useCheckedMenu()
</script>

<style lang="scss" scoped>
$breadcrumb-margin-bottom: 16px;
.layout-main {
  width: 100%;
  height: 100%;
  .content {
    width: 100%;
    height: 100%;
    .breadcrumb {
      width: 100%;
      height: $page-breadcrumb-height;
      margin-bottom: $breadcrumb-margin-bottom;
    }
    .mount {
      width: 100%;
      height: calc(100% - #{$page-breadcrumb-height} - #{$breadcrumb-margin-bottom});
    }
    &.noBreadcrumb {
      .mount {
        height: 100%;
      }
    }
  }
}
</style>
