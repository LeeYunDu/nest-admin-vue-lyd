<template>
  <div class="component-list">
    <div v-for="(group, gIndex) in componentTypeOptions" :key="gIndex" class="component-group" :label="group.label">
      <div class="group-title">{{ group.label }}</div>
      <div class="component-options">
        <div
          class="component-item"
          v-for="(option, oInedx) in group.options"
          :key="oInedx"
          :class="{
            gray: option.disabled
          }"
          @click="onClick(option)"
        >
          <div class="main">{{ option.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ListTemplate from './modules/list/index.vue';
import FormTemplate from './modules/form/index.vue';
import { componentTypeOptions } from './config/modules.config';
import { get, set } from 'lodash-es';
export default {
  components: {
    ListTemplate,
    FormTemplate
  },

  data() {
    return {
      componentTypeOptions
    };
  },
  methods: {
    addModule(module) {
      this.$emit('addModule', module);
    },
    onClick(componentItem) {
      let { disabled } = componentItem;
      if (disabled) return;
      let fields = this.createFields(componentItem);
      this.$emit('addModule', fields);
    },
    onAddFields(fields) {
      this.$emit('addModule', fields);
    },
    createFields(componentItem) {
      let { attr, label } = componentItem;
      // componentType的枚举 跟 menu表的字段对应
      let componentType = attr.componentType;
      let type = get(attr, 'type', '');
      let id = Math.floor(Math.random() * 10001);

      // 在这里可以根据type类型,获取一些组件的初始化属性
      let initOption = {
        // formItem: { required: false },
        gridItem: {
          heightUnit: 'px',
          height: ''
        }
      };
      if (type) {
        initOption.type = type;
      }
      this.addPropsOption(initOption, componentItem);
      // 新增组件的基本信息
      let fields = {
        id: id,
        name: label,
        // label: label,
        // key: 'y' + (Math.random() * 100).toFixed(0),
        // order: 99,
        componentType: componentType, // 组件类型
        options: initOption,
        _show: true
        // delete: 0
      };
      return fields;
    },
    addPropsOption(option, componentItem) {
      let { attr, label } = componentItem;
      let componentType = attr.componentType;
      switch (Number(componentType)) {
        case 1:
          // table
          let obj1 = {
            useColumns: []
          };
          Object.assign(option, obj1);
          break;
        case 3:
          // block-image
          let obj3 = {
            span: 3,
            field2: '',
            field1: '',
            useColumns: [],
            imgField: '',
            title: ''
          };
          Object.assign(option, obj3);
          break;
        case 4:
          // block-columns
          let obj4 = {
            span: 3,
            labelWidth: 120,
            direction: 'horizontal',
            useColumns: []
          };
          Object.assign(option, obj4);
          break;

        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.component-list {
  display: flex;
  flex-direction: column;

  .component-group {
    .group-title {
      margin-bottom: 4px;
      color: #2c3e50;
      font-size: 14px;
    }

    .component-options {
      display: flex;
      flex-wrap: wrap;
      margin-left: -4px;
      margin-right: -4px;

      .component-item {
        width: 50%;

        text-align: center;
        height: 30px;
        line-height: 30px;
        padding: 4px;
        margin-bottom: 8px;
        cursor: pointer;

        &.gray {
          cursor: not-allowed;
        }

        .main {
          background: #f4f6fc;
          border: 1px solid #f4f6fc;
          color: #333;
          font-size: 12px;

          &:hover {
            color: #409eff;
            border: 1px dashed #409eff;
          }
        }
      }
    }

    & ~ .component-group {
      margin-top: 15px;
    }
  }
}
</style>
