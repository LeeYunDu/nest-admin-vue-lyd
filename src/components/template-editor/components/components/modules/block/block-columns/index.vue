<template>
  <div class="block-image-component" v-bind="_attrs">
    <div class="block-image-title" v-if="options.title">{{ options.title }}</div>
    <div class="table-content">
      <div class="columns-info-list" v-for="(dataItem, dI) in useData" :key="dI">
        <el-descriptions class="margin-top" :column="options.span" border v-bind="{ direction: options.direction }">
          <el-descriptions-item
            :label-style="{ width: options.labelWidth + 'px' }"
            :label="item.label"
            v-for="(item, index) in useColumns"
            :key="index"
          >
            <template v-if="get(item, 'props.customResult', '')">
              {{ getCustomResult(dataItem, item.props.customResult) }}
            </template>
            <template v-else>
              {{ get(dataItem, item.key, '-') }}
            </template>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash-es';
import mixins from '../../mixins/index';
export default {
  name: 'Table',
  mixins: [mixins],
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
      refresh: true
    };
  },
  watch: {
    module: {
      handler(newVal) {
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
.block-image-component {
  padding: 10px;
  border-radius: 5px;
  height: 100%;
}

.block-image-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.columns-info-list {
  & ~ .columns-info-list {
    margin-top: 12px;
  }
}
</style>
