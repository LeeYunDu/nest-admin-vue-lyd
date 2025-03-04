<template>
  <div class="table-component" v-bind="_attrs">
    <div class="table-title">{{ options.title }}</div>
    <div class="table-content">
      <el-table :data="mockData" v-if="refresh" border :key="tableKey">
        <el-table-column v-bind="item" v-for="(item, index) in useColumns" :key="index">
          <template #default="{ row }">
            <template v-if="get(item, 'props.customResult')">
              {{ getCustomResult(row, item.props.customResult) }}
            </template>
            <template v-else>
              {{ get(row, item.key) }}
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash-es';
import mixins from '../mixins/index';
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
      refresh: true,
      tableKey: 0
    };
  },
  watch: {
    module: {
      handler(newVal, oldVal) {
        this.tableKey++;
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
.table-component {
  padding: 10px;
  border-radius: 5px;
  height: 100%;
}

.table-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
