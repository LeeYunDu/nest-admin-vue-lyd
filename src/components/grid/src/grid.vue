<template>
  <section class="ui-grid" :style="style">
    <slot></slot>
  </section>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  CSSProperties,
  computed,
  toRef,
  provide
} from 'vue';
import { gridInjectionKey } from '..';

const defaultCols = 24;

const gridProps = {
  cols: {
    type: [Number, String] as PropType<number | string>,
    default: defaultCols
  },
  xGap: {
    type: [Number, String] as PropType<number | string>,
    default: 0
  },
  yGap: {
    type: [Number, String] as PropType<number | string>,
    default: 0
  },
  style: [Object, String] as PropType<CSSProperties | string>,
  itemStyle: [Object, String] as PropType<CSSProperties | string>
} as const;

export default defineComponent({
  name: 'UiGrid',
  props: gridProps,
  setup(props) {
    const computedColsRef = computed<number>(() => Number(props.cols));
    const computedStyleRef = computed<CSSProperties | string>(
      () => props.style || ''
    );

    provide(gridInjectionKey, {
      itemStyleRef: toRef(props, 'itemStyle'),
      xGapRef: toRef(props, 'xGap')
    });

    const style = computed<CSSProperties>(() => {
      return {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: `repeat(${computedColsRef.value}, minmax(0, 1fr))`,
        gridGap: `${props.yGap}px ${props.xGap}px`
      };
    });
    return {
      style: [computedStyleRef.value, style.value]
    };
  }
});
</script>
