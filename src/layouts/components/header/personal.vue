<template>
  <section class="view-component">
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-icon class="icon_user">
          <UserFilled />
        </el-icon>
        <span class="username">{{ user.realName }}</span>
        <el-icon class="el-icon--right">
          <ArrowDown />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="onLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <section class="drop"></section>
  </section>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ArrowDown, UserFilled } from '@element-plus/icons-vue'

const router = useRouter()
const store = useStore()

const user = computed<any>(() => store.getters.user)

async function onLogout (e: any) {
  try {
    e.stopPropagation()
    await store.dispatch('logout')
    router.push({ path: '/login' })
  } catch (error) {
    console.log(error)
  }
}

</script>
<style lang="scss" scoped>
.view-component {
  display: flex;
  align-items: center;
  .el-dropdown-link {
    display: flex;
    align-items: center;
    cursor: pointer;
    color: white;
    :deep {
      .el-icon {
        width: 24px;
      }
    }
    .username {
      margin: 0 4px;
    }
  }
  .avatar {
    width: 20px;
  }
}
</style>
