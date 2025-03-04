<template>
  <div>
    <el-form-item label="标题:">
      <el-input v-model="componentOption.title" placeholder="请输入标题" />
    </el-form-item>
    <el-form-item label="字段:">
      <el-select v-model="componentOption.useColumns" multiple value-key="key" placeholder="请选择列表项" style="width: 100%">
        <el-option v-for="(item, index) in mockFields" :key="index" :label="`${item.label}（${item.key}）`" :value="item" />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import mixins from '../../mixins/index';

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
    initFieldsOption() {
      this.componentOption = this.$props.module.options;
    },
    handleClick(row) {
      console.log('自定义返回结果', row);
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

      this.activeField.props.customResult = this.customResult;
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
