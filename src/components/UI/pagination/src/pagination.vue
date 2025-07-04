<template>
  <section class="ui-component">
    <el-pagination
      v-bind="bindProps"
      :total="total"
      :current-page="currentPage"
      @size-change="onChangeSize"
      @current-change="onChangeCurrent"
    />
  </section>
</template>
<script lang="ts">
import { computed, defineComponent, ref, inject, watch } from 'vue'
import { engineInjectionKey, gcInjectionKey } from 'static/lib/entry'
import { useSubscribe, useSingleAsync } from 'static/lib/hooks'

const defaultMapper = { currentPage: 'currentPage', pageSize: 'pageSize' }
const defaultProps = {
  pageSizes: [10, 20, 50, 100, 200],
  pageSize: 10,
  currentPage: 1,
  background: true,
  layout: 'total, prev, pager, next, jumper'
}

export default defineComponent({
  name: 'UiPagination',

  props: {
    options: { type: Object, defaul: () => ({}) },
    mapper: { type: Object, default: () => ({}) }
  },

  setup (props: any) {
    const {
      group: provideGroup,
      paramsRef
    }: any = inject(engineInjectionKey) || {}

    const { pubsubKeys }: any = inject(gcInjectionKey) || {}
    const isInGc = computed<boolean>(() => {
      return !!provideGroup
    })

    const mapper = computed(() => Object.assign({}, defaultMapper, props.mapper))
    const propsOptions = computed<any>(() => props.options)
    const bindProps = computed<any>(() => Object.assign({}, defaultProps, propsOptions.value))
    const currentPage = ref(bindProps.value.currentPage)
    const total = computed<number>(() => props.options?.total || 0)

    function asyncData () {
      if (!isInGc.value) return
      const params = Object.assign({}, {
        [mapper.value.currentPage]: currentPage.value,
        pageNum: currentPage.value,
        [mapper.value.pageSize]: bindProps.value.pageSize
      })
      useSingleAsync(provideGroup, { params, SINGLE_ASYNC: pubsubKeys.SINGLE_ASYNC })
    }
    function onChangeSize () {
      asyncData()
    }

    function onChangeCurrent (value: number) {
      currentPage.value = value
      asyncData()
    }

    useSubscribe('resetPagination').subscribe(() => currentPage.value === 1)

    watch(paramsRef, () => {
      const paramsValue = paramsRef.value
      currentPage.value = paramsValue[mapper.value.currentPage]
    })

    return {
      currentPage,
      bindProps,
      total,
      // fn
      onChangeSize,
      onChangeCurrent
    }
  }
})
</script>
<style lang="scss" scoped>
.ui-component {
  width: 100%;
  padding: 4px 10px;
  box-sizing: border-box;
}
</style>
