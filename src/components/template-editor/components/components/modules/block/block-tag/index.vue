<template>
  <div class="block-tag-component" v-bind="_attrs">
    <div class="block-tag-title">{{ options.title }}</div>
    <div class="tag-content">
      <div class="tag-list">
        <div class="tag-item" v-for="item in useColumns" :key="item.key">
          <div class="tag-item-title">{{ item.label }}</div>
          <div class="tag-item-content">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash-es';
export default {
  name: 'Table',
  props: {
    module: {
      type: Object,
      default: () => {}
    },
    props: {
      type: Object,
      default: () => {}
    },
    useColumns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    options() {
      return this.$props.module.options;
    },
    _attrs() {
      return this.options._attrs || {};
    }
  },
  data() {
    return {
      refresh: true,
      mockData: [
        { y1: '张三', y2: 15, y3: '浙江省杭州市', y4: '男' },
        { y1: '李四', y2: 20, y3: '浙江省杭州市', y4: '女' },
        { y1: '王五', y2: 25, y3: '浙江省杭州市', y4: '男' },
        { y1: '赵六', y2: 30, y3: '浙江省杭州市', y4: '女' }
      ]
    };
  },
  watch: {
    module: {
      handler(newVal) {
        console.log('useColumns', newVal);

        this.refresh = !this.refresh;
        setTimeout(() => {
          this.refresh = !this.refresh;
        }, 100);
      },
      deep: true
    }
  },
  methods: {
    get,
    getCustomResult(row, customResult) {
      return this.generateString(customResult, row);
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.block-tag-component {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}

.block-tag-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.tag-content {
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    .tag-item {
      padding: 5px 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  }
}
</style>
