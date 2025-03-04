<template>
  <div>
    <el-form-item label="标题:">
      <el-input v-model="componentOption.title" placeholder="请输入标题" />
    </el-form-item>
    <el-form-item label="字段:">
      <el-select v-model="componentOption.useColumns" multiple value-key="key" placeholder="请选择列表项" style="width: 100%">
        <el-option v-for="(item, index) in dataSourceFields" :key="index" :label="`${item.label}（${item.key}）`" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item label="配置">
      <el-table :data="componentOption.useColumns" border>
        <el-table-column label="标题" width="80" prop="label" />
        <el-table-column label="操作" prop="action">
          <template #default="{ row }">
            <el-button link type="primary" size="mini" @click="handleClick(row)"> 自定义结果 </el-button>
            <el-button link type="primary" size="mini" @click="handleDelete(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <Modal v-model="showModal" title="自定义返回结果" @on-ok="handleOk">
      <div class="use-fields-list">
        <div class="use-fields-item" v-for="(item, index) in dataSourceFields" :key="index">
          <span @click="addString(item)" class="use-fields-item-label">{{ item.label }}</span>
        </div>
      </div>
      <el-alert title="自定义结果模版，程序将自动解析被${}符号包裹住的字段" type="info" />
      <el-input type="textarea" :rows="10" v-model="customResult" />
    </Modal>
  </div>
</template>

<script>
import mixins from '../mixins/index';
export default {
  name: 'TableSetting',
  mixins: [mixins],
  props: {
    module: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      componentOption: {},
      mockFields: [
        { label: '标题1 ', key: 'y1', props: {} },
        { label: '标题2 ', key: 'y2', props: {} },
        { label: '标题3 ', key: 'y3', props: {} },
        { label: '标题4 ', key: 'y4', props: {} },
        { label: '标题5 ', key: 'y5', props: {} }
      ],
      showModal: false,
      customResult: '',
      activeField: {}
    };
  },

  methods: {
    clear() {
      this.componentOption.useColumns = [];
    },
    initFieldsOption() {
      this.componentOption = this.$props.module.options;
    },
    handleClick(row) {
      this.showModal = true;
      this.activeField = row;
      this.customResult = row.props.customResult || '${' + row.key + '}';
    },
    addString(item) {
      this.customResult += '${' + item.key + '}';
    },
    handleDelete(row) {
      console.log('删除');
    },
    handleOk() {
      if (this.customResult) {
        this.activeField._type = 'customResult';
      }

      this.activeField.props.customResult = this.customResult || '';
      this.customResult = '';
      this.updateModule(this.$props.module);
    }
  },
  mounted() {
    this.initFieldsOption();
  }
};
</script>

<style lang="scss" scoped>
.use-fields-list {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  gap: 10px;
}

.use-fields-item {
  padding: 5px 10px;
  height: 30px;
  background-color: #f0f0f0;
  cursor: pointer;
}
</style>
