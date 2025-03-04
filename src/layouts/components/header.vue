<template>
  <section class="layout-header">
    <section class="center">
      center
    </section>
    <section class="right">
      <div class="info-container">
        <WeatherTime></WeatherTime>
        <el-tooltip content="后台管理" placement="top">
          <i
            class="iconfont-screen icon-screen-daohang icon-manage"
            @click="toManage()"
          ></i>
        </el-tooltip>
        <el-tooltip content="退出登录" placement="top">
          <i
            style="margin-left: 20px"
            class="iconfont-screen icon-screen-tuichu"
            @click="logout()"
          ></i>
        </el-tooltip>
      </div>
    </section>
  </section>
</template>
<script lang="ts" setup>
import { ref, computed, inject } from 'vue'
import Config from '@/config'
// import HeaderMessgae from './header/message.vue'
// import HeaderPersonal from './header/personal.vue';
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
const isBigScreen = inject('isBigScreen')
const menu = ref([
  {
    name: '资源总览',
    path: '/home'
  },
  {
    name: '全区调节 ',
    path: '/all-area-regulate'
  },
  {
    name: '区域调节',
    path: '/few-area-regulate'
  },
  {
    name: '精准调节',
    path: '/precision-regulate'
  }
])

const buttomMenu = ref([
  {
    name: '设备规模',
    path: '/home'
  },
  {
    name: '区域负荷概况',
    path: '/resource-load'
  }
])

const loginTitle = ref('vue3-template')


// fns
function onClick() {
  router.push({ path: '/' })
}

function onRouter(path: string) {
  router.push({ path })
}

function toManage() {
  ElMessage.info('正在建设中')
}

function logout() {
  ElMessage.info('正在建设中')
}
</script>
<style lang="scss" scoped>
.layout-header {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0;
  position: relative;
  background: linear-gradient(
    180deg,
    #001b30 0%,
    rgba(0, 27, 48, 0.8) 50%,
    rgba(0, 27, 48, 0.2) 100%
  );

  .logo-wrap {
    position: absolute;
    left: 20px;
  }

  .left {
    width: 26%;
    padding-left: 20px;
  }
  .right {
    // width: 24%;

    .info-container {
      position: absolute;
      top: 30px;
      right: 30px;
      display: flex;
      align-items: center;

      .iconfont-screen {
        font-size: 16px;
        color: #afcedd;
        cursor: pointer;
      }

      .icon-manage {
        padding-left: 28px;
        border-left: 1px solid #ccc;
      }
    }
  }
  .left {
    .title {
      font-weight: 700;
      font-size: 20px;
      font-family: DingTalkJinBuTi;
      color: white;
    }
    img {
      height: 24px;
      cursor: pointer;
    }
  }
  .center {
    height: 100%;
    flex: 1;
    text-align: center;
    display: flex;
    justify-content: center;
    z-index: 10;

    :deep {
      .el-menu {
        height: 100%;
        background: transparent;
        border: none;
        .el-menu-item {
          height: 100%;
          background: unset;
          font-size: 18px;
          color: white;
          &:hover {
            border-bottom: 1px solid transparent;
            background: linear-gradient(
              180deg,
              rgba(236, 248, 251, 0.5) 0%,
              rgba(236, 248, 251, 0) 100%
            );
          }
          &.is-active {
            border-bottom: 4px solid #ecf8fb;
            background: linear-gradient(
              180deg,
              rgba(236, 248, 251, 0.5) 0%,
              rgba(236, 248, 251, 0) 100%
            );
            font-weight: 600;
            color: white !important;
          }
        }
      }
    }


  }
  .right {
    display: flex;
    justify-content: flex-end;
    .item {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 5px;
      img {
        width: 20px;
      }
      &.control {
        cursor: pointer;
      }
    }
  }
}

</style>
