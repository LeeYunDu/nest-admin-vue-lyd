<template>
  <section class="layout-side" :class="[sideTheme]">
    <section class="content scroll-y">
      <AppMenu :menus="menus" />
    </section>
  </section>
</template>
<script lang="ts" setup>
import AppMenu from './common/menu.vue'
import useApp from '@/hooks/state/use-app'

// hooks
const { sideMenus: menus, sideTheme } = useApp()

</script>
<style lang="scss" scoped>
.layout-side {
  width: 100%;
  min-height: 50%;
  max-height: 100%;
  background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 78%, #ECF4FF 100%);
  box-shadow: 0px 2px 4px 0px rgba(237,237,237,0.5);
  border-radius: 4px;
  overflow: hidden;
  .content {
    padding: 8px;
  }
  &.theme {
    background: $primary-color;
    :deep() {
      .submenu-title {
        i {
          color: $white;
        }
      }
      .el-menu {
        border: none;
        background: $primary-color;
        .el-sub-menu__title:hover,
        .el-menu-item:hover,
        .el-menu-item.is-active {
          background: linear-gradient(to right, rgba($color: $white, $alpha: 0.25), rgba($color: $white, $alpha: 0)) !important;
          color: $white;
        }
        .el-menu-item {
          &.is-active {
            border-color: $white;
            color: $white;
          }
        }
      }
      .el-menu-item,
      .el-sub-menu__title {
        color: $white;
      }
    }
  }
  :deep() {
    .el-menu {
      border-right: none;
      .el-menu-item {
        position: relative;
        height: 46px;
        line-height: unset;
        font-size: 16px;
        color: #191919;
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 0;
          width: 0px;
          height: 20%;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          background: #1B88FD;
          transform: translate(0, -50%);
          transition: height 0.2s;
        }
        &.is-active {
          background: rgba(27, 136, 253, 0.12);
          border-radius: 4px;
          font-weight: 500;
          color: $primary-color;
          &::after {
            width: 4px;
            height: 100%;
          }
        }
      }
      .el-sub-menu__title {
        display: flex;
        align-items: center;
        font-size: 16px;
      }
    }
  }

  .content {
    width: 100%;
    height: 100%;
  }
}
</style>
