<template>
  <section class="view-component layout-breadcrumb">
    <ui-breadcrumb />
  </section>
</template>
<script lang="ts" setup>
</script>
<style lang="scss" scoped>
.layout-breadcrumb {
  width: 100%;
  height: 100%;
  color: white;
  :deep {
    .el-breadcrumb__item {
      &:first-child {
        .el-breadcrumb__inner {
          font-size: 20px;
          font-weight: 600;
          text-shadow: 0px 2px 4px #235AC0;
          color: white;
        }
      }
      .el-breadcrumb__separator,
      .el-breadcrumb__inner {
        font-size: 16px;
        color: rgba($color: $primary-color-breadcrumb, $alpha: 0.8);
      }
    }
  }
}
</style>
