<template>
  <div class="panel-container">
    <UiGrid v-bind="gridPropsRef" :gridStyle="gridStyle">
      <UiGridItem v-for="(item, index) in cModules" :key="index" :gridPropsRef="gridPropsRef" v-bind="item.gridProps">
        <div
          class="component-container"
          :class="{ 'is-edit': isEdit, 'is-drag': !item._show && isEdit }"
          @click="onActive(item, index)"
        >
          <div class="component-container-title" v-if="isEdit">{{ item.name }}</div>
          <template v-if="componrtnsMap[item.componentType]">
            <component :is="componrtnsMap[item.componentType]" :module="item" v-bind="item.options" :isEdit="isEdit" />
          </template>
          <template v-else>
            <p>暂无组件，请先添加组件 {{ item }}</p>
          </template>
          <div class="button-group" v-if="isEdit">
            <div class="button-item move-up" v-if="index != 0" @click="onMoveUp(item, index)"><i class="el-icon-top"></i></div>
            <div class="button-item move-down" v-if="index != cModules.length - 1" @click="onMoveDown(item, index)">
              <i class="el-icon-bottom"></i>
            </div>

            <div class="button-item copy" @click="onCopy(item, index)"><i class="el-icon-document-copy"></i></div>
            <div class="button-item delete" @click="onDelete(item, index)"><i class="el-icon-delete"></i></div>
          </div>
        </div>
      </UiGridItem>
    </UiGrid>
  </div>
</template>

<script>
import { componentTypeMap } from '../components/config/modules.config';
import { get, set } from 'lodash-es';
import UiGrid from './grid/index.vue';
import UiGridItem from './grid/grid-item.vue';

export default {
  name: 'Panel',
  components: {
    UiGrid,
    UiGridItem
  },
  props: {
    modules: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      componrtnsMap: componentTypeMap
    };
  },
  computed: {
    cModules() {
      return this.$props.modules
        .map((item, index) => {
          // setProps
          // grid item
          item.gridProps = Object.assign({}, this.gridPropsRef, item.options.gridItem);
          // 添加自定义属性
          try {
            if (get(item, 'options.attrs.length', 0) > 0) {
              item.options._attrs = {};
              item.options.attrs.forEach((element) => {
                if (element.name && element.value) {
                  set(item.options._attrs, element.name, element.value);
                }
              });
            }
          } catch (error) {
            console.log(error, 'error');
          }
          let res = { ...item };
          return res;
        })
        .filter((item) => {
          // 编辑模式下全部返回
          if (this.isEdit) {
            return true;
          } else {
            // 预览模式下只返回显示的组件
            return get(item, '_show', false);
          }
        });
    },
    gridPropsRef() {
      return get(this.$props.options, 'grid', {
        xGap: 10,
        yGap: 5
      });
    },
    gridStyle() {
      return Object.assign(
        {
          alignItems: 'center'
        },
        this.gridPropsRef.style || {}
      );
    },
    isEdit() {
      // 预览状态下添加一些边框来放置按钮
      return get(this.options, 'isEdit', false);
    }
  },
  methods: {
    onDelete(item, index) {
      this.$confirm('此操作将删除该组件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('delete', item, index);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      // this.modules.splice(index, 1);
    },
    onCopy(item, index) {
      this.$emit('copy', item, index);
      // this.modules.push(this.modules[index]);
    },
    onActive(item, index) {
      this.$emit('active', item, index);
    },
    onMoveUp(item, index) {
      this.$emit('moveUp', item, index);
    },
    onMoveDown(item, index) {
      this.$emit('moveDown', item, index);
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-container {
  height: 100%;
  width: 100%;
  overflow: auto;
}

.component-container {
  position: relative;

  &:hover {
    background-color: rgb(246, 247, 255);
  }

  &.is-edit {
    padding: 10px 10px 10px 10px;
    border: 1px solid #ccc;
    margin: 5px 0;
  }

  &.is-drag {
    opacity: 0.5;
  }
}

.button-group {
  position: absolute;
  bottom: 0;
  right: 10px;
  display: flex;
  gap: 10px;
  .button-item {
    cursor: pointer;
    font-size: 16px;
  }
}
</style>
