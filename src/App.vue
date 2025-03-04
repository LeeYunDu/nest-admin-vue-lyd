<template>
  <el-config-provider :locale="locale">
    <PageLayout />
  </el-config-provider>
</template>
<script lang="ts" setup>
import { watch, computed, provide } from 'vue'
import PageLayout from '@/layouts/index.vue'
import locale from 'element-plus/dist/locale/zh-cn.min.js'
// import useWatermark from '@/hooks/state/use-watermark';
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

// hooks
const store = useStore()
// const { reload }: any = useWatermark()
const route = useRoute()
// state
const path = computed<string>(() => route.path)


// control
watch(path, () => {})
</script>
