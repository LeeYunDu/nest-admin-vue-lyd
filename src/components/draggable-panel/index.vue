<template>
  <div class="draggable-container">
    <div class="action-menu">
      <div class="action-item" v-for="item in actionMenu" :key="item.key" @click="handleAction(item)">
        {{ item.label }}
      </div>
      <div class="tree-panel" v-show="showTreePanel">
        <el-tree :data="panelComponents" :default-expand-all="true" node-key="nodeId" :props="defaultProps"></el-tree>
      </div>
    </div>
    <div class="component-library" ref="componentLibrary">
      <div
        class="component-item"
        v-for="(item, index) in items"
        :key="index"
        :data-type="get(item, 'dataAttributes.type')"
        :data-is-container="get(item, 'dataAttributes.isContainer', false)"
        :data-class="get(item, 'dataAttributes.class', '')"
        :data-component-name="get(item, 'name', '')"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="config-panel" ref="configPanel">
      {{ panelComponents[0].children[0] }}
      <div class="panel-content" data-type="page" data-node-id="page" ref="panelContent"></div>
    </div>

    <div class="attrs-panel" ref="attrsPanel">
      <div class="attrs-content">
        <AttrsSetting :attrs="activeComponentAttrs"></AttrsSetting>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted,  nextTick, h, createApp } from 'vue'
import Sortable from 'sortablejs'
import { get } from 'lodash-es'
import AttrsSetting from './attrsSetting/index.vue'
import { componentLibray } from './config/component-config'
import { ElTree } from 'element-plus'

// 响应式数据
const actionMenu = reactive([{ label: '树结构', key: 'tree' }])
const showTreePanel = ref(false)
const defaultProps = reactive({
  children: 'children',
  label: 'componentName'
})
const activeComponent = ref(null)
const activeComponentAttrs = ref(null)
const panelComponents = reactive([
  {
    componentName: 'Page',
    nodeId: 'page',
    children: [],
    state: {},
    methods: {}
  }
])
const items = reactive(componentLibray)

// DOM 引用
const componentLibrary = ref(null)
const configPanel = ref(null)
const panelContent = ref(null)
const attrsPanel = ref(null)

// 状态变量
const currentHoverContainer = ref(null)

// 方法
const handleAction = (item) => {
  switch (item.key) {
    case 'tree':
      showTreePanel.value = !showTreePanel.value
      break
    default:
      break
  }
}

const getUUID = () => new Date().getTime()

const findContainer = (element) => {
  let el = element
  for (let i = 0; i < 5 && el; i++) {
    if (el.dataset?.isContainer === 'true') {
      return el
    }
    el = el.parentElement
  }
  return null
}

const removeDragOverClass = (container) => {
  const els = document.querySelectorAll('.drag-over')
  els.forEach(el => el.classList.remove('drag-over'))
}

// 初始化拖拽
let sortableInstance = null
let librarySortable = null

const initSortable = () => {
  // 主面板初始化
  sortableInstance = Sortable.create(panelContent.value, {
    group: {
      name: 'nested',
      pull: true,
      put: ['component-library', 'form-container', 'grid-layout'],
      draggable: '.component-item'
    },
    onAdd: handleAdd,
    onEnd: handleEnd
  })

  // 组件库初始化
  librarySortable = Sortable.create(componentLibrary.value, {
    group: {
      name: 'component-library',
      put: false
    },
    animation: 150,
    pull: 'clone',
    sort: false,
    onStart: handleLibStart,
    onEnd: handleLibEnd
  })
}

const handleAdd = (evt) => {
  addDataAttribute(evt)
  addItemToPanel(evt, evt.newIndex)
  addEventToDom(evt)
}

const handleEnd = (evt) => {
  addItemToPanel(evt, evt.newIndex)
}

const handleLibStart = (evt) => {
  const clone = evt.item.cloneNode(true)
  clone.style.opacity = '0.5'
  evt.item.parentNode.insertBefore(clone, evt.item)
  evt.item.style.display = 'none'
  evt.item._clone = clone
}

const handleLibEnd = (evt) => {
  evt.item.style.display = 'block'
  if (evt.item._clone) {
    evt.item._clone.style.opacity = '1'
  }
}

// 数据操作方法
const addDataAttribute = (evt) => {
  const itemData = evt.item.dataset
  if (itemData.class) {
    evt.item.classList.add(itemData.class)
  }
  if (!itemData.nodeId) {
    evt.item.dataset.nodeId = getUUID()
  }
}

const addItemToPanel = (evt, index) => {
  const itemData = evt.item.dataset
  const parentElement = evt.item.parentElement
  const curId = itemData.nodeId
  const parentId = parentElement.dataset.nodeId
  
  if (itemData.parentId) {
    const parent = getComponentById(itemData.parentId)
    parent.children = parent.children.filter(child => child.nodeId !== curId)
  }
  
  evt.item.dataset.parentId = parentId
  const parent = getComponentById(parentId)
  
  if (parent) {
    parent.children.splice(index, 0, {
      nodeId: curId,
      type: itemData.type || '',
      isContainer: itemData.isContainer === 'true',
      parentId,
      componentName: itemData.componentName,
      children: [],
      props: {},
      hidden: false,
      isLocked: false
    })
  }
  
  if (itemData.isContainer === 'true') {
    nextTick(() => createNestedContainers(evt))
  }
}

const createNestedContainers = (evt) => {
  const itemClass = evt.item.dataset.class
  document.querySelectorAll(`.${itemClass}`).forEach(container => {
    Sortable.create(container, {
      group: {
        name: itemClass,
        pull: true,
        put: ['component-library', 'nested', 'form-container', 'grid-layout'],
        draggable: `.${itemClass}-component`
      },
      onAdd: handleAdd,
      onEnd: handleEnd
    })
  })
}

// 组件操作方法
const getComponentById = (nodeId) => {
  const search = components => {
    for (const comp of components) {
      if (comp.nodeId === nodeId) return comp
      if (comp.children?.length) {
        const found = search(comp.children)
        if (found) return found
      }
    }
    return null
  }
  return search(panelComponents)
}

// 事件处理
const addEventToDom = (evt) => {
  const clickHandler = (e) => {
    if (activeComponent.value) {
      activeComponent.value.classList.remove('component-active')
    }
    activeComponent.value = evt.item
    activeComponentAttrs.value = getComponentById(evt.item.dataset.nodeId)
    evt.item.classList.add('component-active')
    createMenuElement(evt)
    e.stopPropagation()
  }
  
  evt.item.addEventListener('click', clickHandler)
}

const createMenuElement = (evt) => {
  const oldMenu = document.querySelector('.component-menu')
  if (oldMenu) oldMenu.remove()

  const menu = h('div', { class: 'component-menu' }, [
    h('div', { 
      class: 'component-menu-item',
      onClick: (e) => {
        handleMenuClick('delete', evt)
        e.stopPropagation()
      }
    }, '删除'),
    h('div', { 
      class: 'component-menu-item',
      onClick: (e) => {
        handleMenuClick('copy', evt)
        e.stopPropagation()
      }
    }, '复制')
  ])

  const container = document.createElement('div')
  const app = createApp({ render: () => menu })
  app.mount(container)
  evt.item.appendChild(container.firstElementChild)
}

const handleMenuClick = (type, evt) => {
  const item = evt.item
  const parent = item.parentElement
  const curId = item.dataset.nodeId
  
  switch (type) {
    case 'delete':
      const parentComp = getComponentById(parent.dataset.nodeId)
      parentComp.children = parentComp.children.filter(child => child.nodeId !== curId)
      item.remove()
      break
    case 'copy':
      const clone = item.cloneNode(true)
      clone.dataset.nodeId = getUUID()
      clone.querySelector('.component-menu')?.remove()
      clone.classList.remove('component-active')
      addEventToDom({ item: clone })
      parent.appendChild(clone)
      break
  }
}


const initDragFeedback = () => {
  const panel = panelContent.value
  
  panel.addEventListener('dragenter', e => {
    const container = findContainer(e.target)
    if (container) {
      container.classList.add('drag-over')
      currentHoverContainer.value = container
    }
  }, true)

  panel.addEventListener('dragleave', e => {
    if (currentHoverContainer.value && 
      !currentHoverContainer.value.contains(e.relatedTarget)) {
      currentHoverContainer.value.classList.remove('drag-over')
      currentHoverContainer.value = null
    }
  }, true)

  panel.addEventListener('dragend', () => {
    if (currentHoverContainer.value) {
      removeDragOverClass(currentHoverContainer.value)
    }
  })
}

const observeContainerChanges = () => {
  const observer = new MutationObserver(() => {
    initDragFeedback()
  })
  observer.observe(panelContent.value, {
    childList: true,
    subtree: true
  })
}



// 生命周期
onMounted(() => {
  initSortable()
  initDragFeedback()
  observeContainerChanges()
})
</script>

<style lang="scss" scoped>
/* 样式部分保持原样 */
.draggable-container {
  display: flex;
}

.action-menu {
  padding: 10px;
  margin-right: 10px;
  outline: 1px solid #ccc;
  background-color: #f9f9f9;
  position: relative;
  .action-item {
    cursor: pointer;
  }
  .tree-panel {
    position: absolute;
    top: 0;
    left: calc(100% + 0px);
    width: 250px;
    height: 100%;
    background-color: #f9f9f9;
    outline: 1px solid #ccc;
    z-index: 1;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
}

.component-library {
  width: 200px;
  border: 1px solid #ccc;
  padding: 10px;
  margin-right: 20px;
  background-color: #f9f9f9;
}

.component-item {
  padding: 10px;
  background-color: #e0e0e0;
  margin: 5px 0;
  cursor: move;
}

.config-panel {
  flex-grow: 1;
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #fff;
}

.panel-content {
  min-height: 200px;
  border: 1px dashed #ddd;
  padding: 10px;
}

.dragged-item {
  padding: 10px;
  background-color: #cce5ff;
  margin-bottom: 10px;
  border-radius: 4px;
}

.form-container, .grid-layout {
  border: 1px dashed #ccc;
  min-height: 100px;
  padding: 10px;
  transition: box-shadow 0.3s ease;
  z-index: 1;
}

.nested-component {
  margin: 5px;
  padding: 8px;
  background: #f5f5f5;
}

.drag-over {
  background: rgba(0, 120, 212, 0.1);
  border: 1px dashed #0078d4;
}

.component-active {
  border: 1px dashed blue;
  position: relative;
  .component-menu {
    background: #cce5ff;
    display: flex;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 11;
    .component-menu-item {
      padding: 5px;
      cursor: pointer;
      font-size: 12px;
      margin-left: 5px;
    }
  }
}
.attrs-panel {
  width: 300px;
  border: 1px solid #ccc;
  margin-left: 20px;
  padding: 10px;
}
</style>