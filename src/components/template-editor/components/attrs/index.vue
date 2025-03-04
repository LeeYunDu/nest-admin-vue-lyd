<template>
  <div class="attrs-container">
    <Tabs value="component">
      <TabPane label="组件设置" name="component">
        <div class="setting-main">
          <el-form label-position="left" label-width="auto" :model="curComponent">
            <div class="form-title">基础属性</div>
            <el-button type="primary" @click="show = true" size="mini">添加自定义属性</el-button>
            <el-form-item label="显示:">
              <el-switch v-model="curComponent._show" @change="onUpdateComponent" />
            </el-form-item>

            <el-form-item label="数据来源:">
              <el-select v-model="curComponent.dataSrc" @change="onChangeDataSrc">
                <el-option v-for="(item, index) in dataSource" :key="index" :label="item.relevanceDataName" :value="item.id" />
              </el-select>
            </el-form-item>

            <el-form-item label="表格栅格:">
              <el-slider v-model="componentOption.gridItem.span" :min="0" :max="24" />
            </el-form-item>
            <el-form-item label="表格高度:">
              <el-input v-model="componentOption.gridItem.height">
                <template #append>
                  <el-select v-model="componentOption.gridItem.heightUnit" placeholder="Select" style="width: 80px">
                    <el-option label="px" value="px" />
                    <el-option label="%" value="%" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="栅格偏移:">
              <el-slider v-model="componentOption.gridItem.offset" :min="0" :max="24" />
            </el-form-item>
            <div class="form-title">组件属性</div>
            <template v-if="get(componentAttrMap, get(curComponent, 'componentType', null), null)">
              <component
                :is="get(componentAttrMap, curComponent.componentType)"
                :module="curComponent"
                :typeData="typeData"
                :dataSourceFields="useDataSourceFields"
                @update="onUpdateComponent"
              />
            </template>
            <template v-else>
              <p>暂无该组件的属性配置面板</p>
            </template>
          </el-form>
        </div>
        <Modal v-model="show" title="自定义属性" @on-ok="ok" @on-cancel="cancel">
          <el-button type="primary" @click="addAttr" size="mini">新增</el-button>
          <el-table ref="formTable" max-height="600" :data="attrs">
            <el-table-column label="属性名称">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name" />
              </template>
            </el-table-column>
            <el-table-column label="属性值">
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="onDeleteAttr(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </Modal>
      </TabPane>
      <TabPane label="视图设置" name="view">
        <div class="form-title">基础属性</div>
        <el-form label-position="left" label-width="auto" :model="viewPageOptions">
          <el-form-item label="表格栅格:">
            <el-slider v-model="viewPageOptions.grid.span" :min="0" :max="24" />
          </el-form-item>
          <el-form-item label="栅格左右间距:">
            <el-slider v-model="viewPageOptions.grid.xGap" :min="0" :max="24" />
          </el-form-item>
          <el-form-item label="栅格上下间距:">
            <el-slider v-model="viewPageOptions.grid.yGap" :min="0" :max="24" />
          </el-form-item>
        </el-form>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import { get } from 'lodash-es';
import { componentAttrMap } from '../components/config/modules.config';
import mixins from '../components/modules/mixins';
export default {
  name: 'Attrs',
  mixins: [mixins],
  props: {
    modules: {
      type: Array,
      default: () => []
    },
    activeModule: {
      type: Object,
      default: () => {}
    },
    viewOptions: {
      type: Object,
      default: () => {}
    },
    typeData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      componentAttrMap,
      curComponent: {},
      componentOption: {},
      viewPageOptions: {},
      show: false,
      attrs: [],

      columns: [
        {
          label: '属性名称',
          key: 'name',
          slot: 'name'
        },
        {
          label: '属性值',
          key: 'value',
          slot: 'value'
        },
        {
          label: '操作',
          key: 'action',
          slot: 'action'
        }
      ]
    };
  },
  watch: {
    activeModule(val) {
      console.log(val, 'activeModule');
      this.curComponent = val;
      this.componentOption = val.options;
      // if (val.dataSrc) {
      //   this.onChangeDataSrc(val.dataSrc);
      // }
      this.attrs = this.componentOption.attrs;
      this.viewPageOptions = this.$props.viewOptions;
    }
  },
  computed: {
    useDataSourceFields() {
      if (!this.curComponent.dataSrc) {
        return [];
      }
      let item = this.dataSource.find((item) => item.id === this.curComponent.dataSrc);
      let { resultViewList = [] } = item;
      return resultViewList.map((item) => ({
        label: item.itemName,
        key: item.itemNameEn,
        props: {}
      }));
    }
  },
  methods: {
    get,
    addAttr() {
      this.attrs.push({
        name: '',
        value: ''
      });
    },
    onChangeDataSrc(val) {
      // let item = this.dataSource.find((item) => item.id === val);
      // let { resultViewList = [] } = item;
      // let fields = resultViewList.map((item) => ({
      //   label: item.itemName,
      //   key: item.itemNameEn,
      //   props: {}
      // }));
      // this.useDataSourceFields = fields;

      this.$emit('updateComponent', this.curComponent);
    },
    ok() {
      this.componentOption.attrs = this.attrs;
      // this.curComponent.options = this.componentOption;
      // this.$emit('updateComponent', this.curComponent);
    },
    cancel() {
      this.show = false;
    },
    onDeleteAttr(row, index) {
      this.componentOption.attrs.splice(index, 1);
    },
    onUpdateComponent() {
      console.log(this.curComponent, 'this.curComponent');
      this.$emit('updateComponent', this.curComponent);
    }
  }
};
</script>

<style lang="scss" scoped>
.attrs-container {
}

.form-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  padding-left: 10px;
  position: relative;
  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 16px;
    background-color: #409eff;
    margin-right: 10px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
