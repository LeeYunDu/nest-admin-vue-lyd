<template>
  <section class="ui-component">
    <el-breadcrumb class="breadcrumb-box" separator="/">
      <template v-for="(item, index) in items" :key="index">
        <el-breadcrumb-item @click="onClick(item)">
          {{ item.name || '' }}
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </section>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  name: 'UiComponent',

  setup () {
    const router = useRouter()
    const route = useRoute()
    const matched = computed(() => route.matched || [])
    const items = computed(() => {
      const useItems: any[] = []
      matched.value.map((item: any, index: number) => {
        const meta = item.meta || {}
        useItems.push({
          name: index === 0 ? '首页' : meta.title,
          path: index === 0 ? '/home' : item.path
        })
      })
      return useItems
    })

    function onClick (item: any) {
      router.push({ path: item.path })
    }
    return {
      items,

      // fn
      onClick
    }
  }
})
</script>
<style lang="scss" scoped>
$height: 100%;
.ui-component {
  height: $height;
  padding: 0 15px;
  .breadcrumb-box {
    height: 100%;
    line-height: $height;
    display: flex;
    align-items: center;
    cursor: pointer;
    span {
      color: $white;
    }
  }
}
</style>
