<template>
  <section class="ui-grid" :style="useStyle">
    <slot></slot>
  </section>
</template>

<script>
import { get } from 'lodash-es';
export default {
  name: 'UiGrid',
  props: {
    gridStyle: {
      type: Object,
      default: () => ({})
    },
    xGap: {
      type: Number | String,
      default: 0
    },
    yGap: {
      type: Number | String,
      default: 0
    },
    itemStyle: {
      type: Object,
      default: () => ({})
    },
    cols: {
      type: Number | String,
      default: 24
    }
  },
  data() {
    return {};
  },
  computed: {
    computedCols() {
      return get(this.$props, 'cols');
    },

    useStyle() {
      return [
        this.gridStyle,
        {
          width: '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${this.computedCols}, minmax(0, 1fr))`,
          gridGap: `${this.$props.yGap}px ${this.$props.xGap}px`
        }
      ];
    }
  }
};
</script>
