<template>
  <section :class="['grid-item']" :style="useStyle">
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'UiGridItem',
  props: {
    gridItemStyle: {
      type: Object,
      default: () => ({})
    },
    span: {
      type: Number | String
    },
    offset: {
      type: Number | String,
      default: 0
    },
    // private props
    privateOffset: {
      type: Number
    },
    privateSpan: {
      type: Number
    },
    privateColStart: {
      type: Number
    },
    privateShow: {
      type: Boolean,
      default: true
    },
    itemStyleRef: {
      type: Object,
      default: () => ({})
    },
    gridPropsRef: {
      type: Object,
      default: () => ({})
    },
    xGapRef: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: Number | String,
      default: ''
    },
    heightUnit: {
      type: String,
      default: 'px'
    }
  },
  data() {
    return {};
  },
  computed: {
    itemStyle() {
      return Object.assign({}, this.$props.itemStyleRef, this.$props.gridItemStyle);
    },
    useStyle() {
      return Object.assign({}, this.itemStyle, this.deriveStyle());
    }
  },
  methods: {
    deriveStyle() {
      const { offset, privateShow = true } = this.$props;
      let span = this.$props.span || this.$props.gridPropsRef.span;
      const xGap = this.$props.gridPropsRef.xGap || 0;
      const mergedXGap = `${xGap}px`;
      let result = {};
      console.log(this.$props.height, 'this.$props.height');
      return Object.assign(
        result,
        {
          display: !privateShow ? 'none' : '',
          gridColumn: `span ${span} / span ${span}`,
          marginLeft: offset
            ? `calc((100% - (${span} - 1) * ${mergedXGap}) / ${span} * ${offset} + ${mergedXGap} * ${offset})`
            : ''
        },
        this.$props.height ? { height: this.$props.height + this.$props.heightUnit } : {}
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.grid-item {
  overflow: hidden;
}
</style>
