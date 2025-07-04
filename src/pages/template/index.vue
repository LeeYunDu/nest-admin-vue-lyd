<template>
  <div>
    <div class="nav-list">
      <div v-for="item in navList" :key="item.name" class="nav-item">
        <router-link :to="item.path">{{ item.name }}</router-link>
      </div>
    </div>

    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

let navList = [
  {
    name: 'form',
    path: '/template/form'
  },
  {
    name: 'table',
    path: '/template/table'
  }
]
</script>

<style lang="scss" scoped>
.main {
  padding: 20px;
}

.nav-list{
  display: flex;
  .nav-item{
    margin-right: 20px;
  }
}
</style>
