<template>
  <Modal
    v-model="show"
    fullscreen
    title="模版编辑器"
    @on-ok="ok"
    @on-cancel="cancel"
  >
    <div class="editor-container">
      <!-- <div class="editor-left">
        <Components @addModule="addModule" />
      </div> -->
      <div class="editor-center">
        <!-- <div class="panel-actions">
          <el-button type="primary" size="mini" @click="save">保存</el-button>
          <el-button type="info" size="mini" @click="preview">预览模式</el-button>
          <el-button type="warning" size="mini" @click="clear">清空画布</el-button>
        </div> -->
        <!-- <div style="margin-bottom: 20px">curModules:{{ curModules }}</div>
        <div>viewOptions:{{ viewOptions }}</div> -->
        <!-- <Panel
          :modules="curModules"
          :options="viewOptions"
          :typeData="typeData"
          @delete="deleteModule"
          @copy="copyModule"
          @active="onActiveModule"
          @moveUp="moveUpModule"
          @moveDown="moveDownModule"
          v-if="show"
        /> -->

        <DraggablePanel></DraggablePanel>
      </div>
      <!-- <div class="editor-right">
        <Attrs
          v-if="show"
          :modules="curModules"
          :typeData="typeData"
          :activeModule="activeModule"
          :viewOptions="viewOptions"
          @updateComponent="updateComponent"
        />
      </div> -->
    </div>

    <Modal v-model="showPreview" fullscreen title="预览模式">
      <div class="preview-container">
        <Panel
          v-if="showPreview"
          :modules="cloneDeep(curModules)"
          :options="{ ...cloneDeep(viewOptions), isEdit: false }"
          :type-data="cloneDeep(typeData)"
        />
      </div>
    </Modal>
  </Modal>
</template>

<script>
import Components from './components/components/index.vue'
import Attrs from './components/attrs/index.vue'
// import Panel from './components/panel/index.vue';
import { cloneDeep } from 'lodash-es'
// import { getSubjectView } from '@/api/configuration-center'
import DraggablePanel from './draggablePanel/index.vue'
export default {
  name: 'TemplateEditor',
  components: {
    Components,
    Attrs,
    // Panel,
    DraggablePanel
  },
  model: {
    prop: 'value',
    event: 'update:value'
  },
  props: {
    module: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      show: true,
      showPreview: false,
      // 渲染组件
      curModules: [],
      activeModule: null,
      // 视图配置
      viewOptions: {
        grid: {
          span: 24
        },
        isEdit: true
      },
      typeData: {}
    }
  },
  watch: {
    value(val) {
      this.show = val
      if (val) {
        this.init()
      } else {
        this.clear()
      }
    }
  },
  methods: {
    cloneDeep,
    // 初始化专题模块,获取可渲染的数据源
    async init() {
      // api/jczxsjk-retrieval/subjectSearch/querySubjectData
      let res = await getSubjectView({ id: this.$props.row.id })
      // 获取可渲染的数据源和可选字段
      // let { subjectAffiliateSetList, wholeSearchVO } = res;
      let dataSource = res.subjectAffiliateSetList
      let fields = res.wholeSearchVO
      this.typeData = { dataSource, fields }
    },
    ok() {
      this.$emit('update:value', false)
    },
    clear() {
      this.curModules = []
    },
    save() {
      console.log(this.curModules)
    },
    preview() {
      this.showPreview = true
    },
    cancel() {
      this.$emit('update:value', false)
    },
    addModule(module) {
      this.curModules.push(module)
    },
    deleteModule(item, index) {
      this.curModules.splice(index, 1)
    },
    copyModule(item, index) {
      let cloneItem = cloneDeep(item)
      this.curModules.splice(index + 1, 0, cloneItem)
    },
    onActiveModule(item, index) {
      item._index = index
      this.activeModule = item
    },
    updateComponent(component) {
      let curModules = cloneDeep(this.curModules)
      curModules[component._index] = component
      this.curModules = curModules
    },
    moveUpModule(item, index) {
      let curModules = cloneDeep(this.curModules)
      // 数据的下标向上移动一个位置
      const temp = curModules[index - 1]
      if (temp) {
        curModules[index - 1] = item
        curModules[index] = temp
        this.curModules = curModules
      }
    },
    moveDownModule(item, index) {
      let curModules = cloneDeep(this.curModules)
      const temp = curModules[index + 1]
      if (temp) {
        curModules[index + 1] = item
        curModules[index] = temp
        this.curModules = curModules
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-container {
  display: flex;
  height: 100%;
  width: 100%;
  .editor-left {
    width: 200px;
  }
  .editor-center {
    flex: 1;
    margin: 0 10px;
    padding: 0 10px;
    // border-right: 1px solid #ccc;
  }
  .editor-right {
    width: 500px;
  }
}
</style>
