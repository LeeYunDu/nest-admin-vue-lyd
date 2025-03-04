<template>
  <div class="block-image-component" v-bind="_attrs">
    <div class="block-image-title" v-if="options.title">{{ options.title }}</div>
    <div class="block-image-content">
      <div class="block-image-list" :style="useStyle">
        <div class="block-image-item" v-for="(item, index) in useData" :key="index">
          <el-image
            class="item-img"
            :src="get(item, options.imgField, 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')"
            fit="fill"
          >
          </el-image>
          <div class="block-info">
            <div class="block-image-item-title">{{ get(item, options.field1, '-') }}</div>
            <div class="block-image-item-content">{{ get(item, options.field2, '-') }}</div>
            <div class="info-item" v-for="(field, fieldIndex) in useColumns" :key="fieldIndex">
              <div class="label">{{ field.label }}：</div>
              <div class="value">
                <template v-if="get(field, 'props.customResult', '')">
                  {{ getCustomResult(item, field.props.customResult) }}
                </template>
                <template v-else>
                  {{ get(item, field.key, '-') }}
                </template>
              </div>
            </div>
          </div>
        </div>
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
    },
    useStyle() {
      return [
        {
          width: '100%',
          display: 'grid',
          gridTemplateColumns: `repeat(${this.options.span || 0}, minmax(0, 1fr))`,
          gridGap: '10px 10px'
        }
      ];
    }
  },
  data() {
    return {
      refresh: true
    };
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

.block-image-list {
  display: flex;
  flex-wrap: wrap;
  .block-image-item {
    display: flex;

    .item-img {
      flex: 0 0 100px;
      width: 100px;
      height: 100px;
      margin-right: 12px;
    }
    .block-info {
      display: flex;
      flex-direction: column;

      .block-image-item-title {
        font-size: 16px;
        font-weight: bold;
      }
      .block-image-item-content {
        font-size: 14px;
        color: #999;
        margin-bottom: 4px;
      }
      .info-item {
        display: flex;
        align-items: center;
        .label {
          color: #999;
        }
        .value {
          color: #333;
        }
      }
    }
  }
}
</style>
