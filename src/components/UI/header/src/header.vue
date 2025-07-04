<template>
  <section class="ui-component">
    <section class="h-content full">
      <section class="left">
        <slot name="left">
          <span>{{ title }}</span>
        </slot>
      </section>

      <section class="right">
        <slot name="right">
          <span>{{ extra.label }}</span>
        </slot>
      </section>
    </section>
  </section>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'UiHeader',

  components: {},

  props: {
    // header config
    options: {
      type: Object,
      default: () => ({})
    }
  },

  setup (props: any) {
    const title = computed(() => props.options.title)
    const extra = computed(() => props.options.extra || {})
    return {
      title,
      extra
    }
  }
})
</script>

<style lang="scss" scoped>
.ui-component {
  width: 100%;
  height: 50px;
  padding-right: 10px;
  .h-content {
    height: 100%;
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-between;
    .left {
      height: 100%;
      display: flex;
      align-items: center;
      font-weight: 500;
      font-size: 18px;
      color: $primary-color-title;
      &::before {
        content: '';
        position: relative;
        width: 6px;
        height: 18px;
        margin-right: 8px;
        background: $primary-color-title-sub;
      }
    }
    .right {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: rgba($color: $color-3, $alpha: 0.7);
      font-size: 12px;
    }
  }
}
</style>
