<template>
  <template v-if="pageMode === 'static'">
    <span>{{ field.label }}</span>
  </template>
  <template v-else>
    <el-popover
      :title="field.label"
      :width="400"
      trigger="click"
    >
      <section :id="uid">
      </section>
      <template #reference>
        <span class="ui-field" :class="[pageMode]" @click="onClick">{{ field.label }}</span>
      </template>
    </el-popover>
  </template>
</template>
<script lang="ts">
import { FieldItem } from '@/typings/items'
import { computed, defineComponent, PropType } from 'vue'
import { useStore } from 'vuex'
import PubSub from 'pubsub-js'
import { fieldGlobal } from '@/global/pubsub/index'
import { uuid } from '@/utils'

export default defineComponent({
  props: {
    field: { type: Object as PropType<FieldItem>, default: () => ({}) }
  },

  setup (props: any) {
    const store = useStore()
    const pageMode = computed(() => store.getters.mode)
    const uid = uuid(6, 'field-')

    function onClick (e: EventTarget) {
      PubSub.publish(fieldGlobal.FIELD_ACTIVE, { e, field: props.field, id: uid })
    }
    return {
      uid,
      pageMode,

      // fn
      onClick
    }
  }
})
</script>
<style lang="scss" scoped>
.ui-field {
  &.active {
    position: relative;
    cursor: pointer;
    &::after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border: 1px dashed rgba($color: $primary-color, $alpha: 0.6);
      border-radius: 4px;
      padding: 2px 4px;
      left: -4px;
      top: -2px;
    }
  }
}
</style>
