<template>
  <section class="items-component items">
    <template v-for="(item, index) in items" :key="index">
      <el-button class="btn-item" v-bind="item.props" @click="onClick(item)">{{ item.label }}</el-button>
    </template>
  </section>
</template>
<script lang="ts">
import { BtnMode } from '@/typings/items'
import { defineComponent, ref, PropType, SetupContext } from 'vue'

export default defineComponent({
  name: '',

  components: {},

  props: {
    data: { type: Array as PropType<BtnMode[]>, default: () => [] }
  },

  emits: ['onClick'],

  setup (props: any, ctx: SetupContext) {
    const items = ref(props.data)

    function onClick (item: BtnMode) {
      ctx.emit('onClick', item)
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
.items-component {
  display: flex;
  flex-wrap: wrap;
}
.items {
  .btn-item {
    margin-right: 10px;
    margin-bottom: 10px;
    :deep {
      &.el-button {
        margin-left: 0;
        margin: 0 auto;
      }
    }
  }
}
</style>
