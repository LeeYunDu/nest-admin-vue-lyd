<template>
  <section class="layout-header">
    <section class="left" @click="onClick">
      <span class="title">模版项目</span>
    </section>
    <section class="center">
      <!-- <AppMenu :menus="headerMenus" :props="menuProps" /> -->
    </section>
    <section class="right">
      <section class="item">
        <WeatherTime></WeatherTime>
      </section>
      <section class="item">
        <HeaderPersonal />
      </section>
    </section>
  </section>
</template>
<script lang="ts" setup>
import { ref, computed, inject } from 'vue'
import Config from '@/config'
// import HeaderMessgae from './header/message.vue'
import HeaderPersonal from './header/personal.vue'
import { useRoute, useRouter } from 'vue-router'
import { imgPath } from '@/utils'
import WeatherTime from './header/weather-time.vue'
import { ElMessage } from 'element-plus'
// hooks
const router = useRouter()
let route = useRoute()
// state
const title = computed<string>(() => {
  return route.meta.title
})

// fns
function onClick() {
  router.push({ path: '/' })
}

</script>
<style lang="scss" scoped>
.layout-header {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  background: $primary-bg-header;
  .left {
    width: 26%;
  }
  .right {
    width: 24%;
  }
  .left {
    padding-left: 26px;
    .title {
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 28px;
      cursor: pointer;
    }
    img {
      width: 28px;
      cursor: pointer;
    }
  }
  .center {
    flex: 1;
    text-align: center;
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 24px;
    .item {
      height: 100%;
      display: flex;
      align-items: center;
      margin-left: 15px;
      img {
        width: 20px;
      }
      .icon_download{
        width: 30px;
        height: 30px;
        border-radius: 100%;
        background: rgba($color: #fff, $alpha: 0.5);
        color: #fff;
        cursor: pointer;
        svg{
          width: 70%;
          height: 70%;
        }
      }
      &.control {
        cursor: pointer;
      }
    }
  }
}

</style>
