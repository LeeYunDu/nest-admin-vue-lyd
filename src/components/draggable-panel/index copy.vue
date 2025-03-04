<template>
  <div class="draggable-container">
    <div class="action-menu">
      <div class="action-item" v-for="(item, index) in actionMenu" :key="index" @click="handleAction(item)">
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

<script>
import Sortable from 'sortablejs';
import { get } from 'lodash-es';
import AttrsSetting from './attrsSetting/index.vue';
import { componentLibray } from './config/component-config';
// import { v4 as uuid } from 'uuid';
export default {
  components: {
    AttrsSetting
  },
  data() {
    return {
      // 数结构
      actionMenu: [{ label: '树结构', key: 'tree' }],
      showTreePanel: false,
      defaultProps: {
        children: 'children',
        label: 'componentName'
      },
      // 属性面板
      activeComponent: null,
      activeComponentAttrs: null,

      handleDragOver: null,
      handleDragLeave: null,
      currentHoverContainer: null,
      panelComponents: [
        {
          componentName: 'Page',
          nodeId: 'page',
          children: [],
          state: {},
          methods: {}
        }
      ],
      items: componentLibray
    };
  },
  mounted() {
    this.initSortable();
    this.initDragFeedback();
    this.observeContainerChanges();
  },
  unmounted() {},
  methods: {
    get,
    handleAction(item) {
      let { key } = item;
      switch (key) {
        case 'tree':
          this.showTreePanel = !this.showTreePanel;
          break;
        default:
          break;
      }
    },
    initDragFeedback() {
      // 使用 panelContent 作为事件委托的根节点
      const panel = this.$refs.panelContent;
      // 拖拽进入时
      panel.addEventListener(
        'dragenter',
        (e) => {
          const container = this.findContainer(e.target);
          if (container) {
            container.classList.add('drag-over');
            this.currentHoverContainer = container; // 记录当前悬停容器
          }
        },
        true
      ); // 使用捕获阶段

      // 拖拽离开时
      panel.addEventListener(
        'dragleave',
        (e) => {
          if (this.currentHoverContainer) {
            // 检查是否真正离开容器区域
            if (!e.relatedTarget || !this.currentHoverContainer.contains(e.relatedTarget)) {
              this.currentHoverContainer.classList.remove('drag-over');
              this.currentHoverContainer = null;
            }
          }
        },
        true
      );

      // 拖拽结束时清理
      panel.addEventListener('dragend', (evt) => {
        if (this.currentHoverContainer) {
          this.removeDragOverClass(this.currentHoverContainer);
          this.currentHoverContainer = null;
        }
        // 节流调用
      });
    },
    removeDragOverClass(container) {
      if (container && container.classList.contains('drag-over')) {
        container.classList.remove('drag-over');
      }
      const els = document.querySelectorAll('.drag-over');
      els.forEach((el) => {
        el.classList.remove('drag-over');
      });
    },

    // 增强的容器查找方法
    findContainer(element) {
      var el = element;
      // 最多向上查找5层防止死循环
      for (let i = 0; i < 5 && el; i++) {
        if (el.dataset.isContainer === 'true') {
          return el;
        }
        el = el.parentElement;
      }
      return null;
    },
    getUUID() {
      return new Date().getTime();
    },
    initSortable() {
      const panelContent = this.$refs.panelContent;
      const componentLibrary = this.$refs.componentLibrary;
      let that = this;
      // 初始化组件库和面板的拖拽
      // Disable drag within the config panel
      Sortable.create(panelContent, {
        group: {
          name: 'nested',
          pull: true, // 禁止拖出面板
          put: ['component-library', 'form-container', 'grid-layout'],
          draggable: '.component-item', // 普通组件类名
          disabled: false // Disable drag in the panel itself
        },

        onAdd(evt) {
          // 添加data- 属性
          that.addDataAttribute(evt);
          // 当拖入主面板时，创建组件数据
          that.addItemToPanel(evt, evt.newIndex);
          // 给DOM元素添加事件
          that.addEventToDom(evt);
        },
        onEnd(evt) {
          that.addItemToPanel(evt, evt.newIndex);
        }
      });
      Sortable.create(componentLibrary, {
        group: {
          name: 'component-library',
          put: false
        }, // 允许组件从库拖到面板
        animation: 150,
        pull: 'clone', // 从源容器拖动时克隆元素
        sort: false, // boolean 定义是否列表单元是否可以在列表容器内进行拖拽排序
        onStart(evt) {
          // 创建一个元素的克隆
          const clone = evt.item.cloneNode(true);
          clone.style.opacity = '0.5'; // 拖动时让克隆元素变得透明
          evt.item.parentNode.insertBefore(clone, evt.item); // 将克隆元素插入到源元素的位置
          evt.item.style.display = 'none'; // 隐藏源元素
          evt.item._clone = clone; // 将克隆元素挂载到源元素上
        },
        onEnd(evt) {
          // 恢复源元素的显示
          evt.item.style.display = 'block';
          evt.item._clone.style.opacity = '1';
          // 将拖动的元素放入配置面板中
          if (evt.from !== evt.to) {
          } else {
            // 如果拖动未成功，移除克隆元素
            evt.item._clone.remove();
          }
        }
      });
    },

    createNestedContainers(evt) {
      let that = this;
      const itemClass = evt.item.dataset.class;
      const containers = document.querySelectorAll(`.${itemClass}`);
      // itemClass 是 form-container 或 grid-layout
      containers.forEach((container) => {
        Sortable.create(container, {
          group: {
            name: itemClass,
            pull: true,
            put: ['component-library', 'nested', 'form-container', 'grid-layout'], // 允许从组件库拖入
            draggable: `.${itemClass}-component`, // 表单内部组件类名
            sort: true,
            disabled: false // Disable drag in the panel itself
          },

          onAdd: (evt) => {
            console.log('onAdd', evt);
            console.log(evt.item.dataset);
            // 添加data- 属性
            that.addDataAttribute(evt);
            // 当拖入表单容器时，创建嵌套组件数据
            that.addItemToPanel(evt, evt.newIndex);
            // 给DOM元素添加事件
            that.addEventToDom(evt);
          },
          onEnd(evt) {
            that.addItemToPanel(evt, evt.newIndex);
          }
        });
      });
    },
    addNestedItem(formId, item, index) {},
    addDataAttribute(evt) {
      if (this.get(evt.item.dataset, 'class', '')) {
        evt.item.classList.add(this.get(evt.item.dataset, 'class', ''));
      }

      if (!evt.item.dataset.nodeId) {
        evt.item.dataset.nodeId = new Date().getTime();
      }
      switch (evt.item.dataset.type) {
        case 'form-container':
          break;
        case 'grid-layout':
          break;
        default:
          break;
      }
    },

    // 在数据模型中标记容器类型
    addItemToPanel(evt, index) {
      const componentType = evt.item.dataset.type;
      const isContainer = evt.item.dataset.isContainer;
      let hasParentId = evt.item.dataset.parentId;
      // 如果存在parentId，则需要从父级的children中删除节点
      if (hasParentId) {
        let parent = this.getComponentById(hasParentId);
        if (parent) {
          parent.children = parent.children.filter((child) => child.nodeId !== evt.item.dataset.nodeId);
        }
      }
      const parentElement = evt.item.parentElement;
      let curId = evt.item.dataset.nodeId;
      let parentId = parentElement.dataset.nodeId;
      evt.item.dataset.parentId = parentId;
      let parent = this.getComponentById(parentId);
      if (parent) {
        // 按下标插入
        parent.children.splice(index, 0, {
          nodeId: curId, // 后续替换为uuid
          type: componentType || '',
          isContainer: isContainer || false,
          parentId,
          componentName: evt.item.dataset.componentName,
          children: [],
          props: {},
          hidden: false,
          isLocked: false
        });
      }

      // 如果是容器，需要动态创建嵌套 Sortable
      if (isContainer) {
        this.$nextTick(() => {
          this.createNestedContainers(evt);
        });
      }
    },
    // 添加点击事件
    addEventToDom(evt) {
      evt.item.addEventListener('click', (e) => {
        if (this.activeComponent) {
          this.activeComponent.classList.remove('component-active');
        }
        this.activeComponent = evt.item;
        let activeId = evt.item.dataset.nodeId;
        this.activeComponentAttrs = this.getComponentById(activeId);
        console.log(this.activeComponentAttrs, 'activeComponentAttrs');
        // 添加class
        evt.item.classList.add('component-active');
        this.createMenuElement(evt);
        // 阻止冒泡
        e.stopPropagation();
      });
    },
    // 添加组件操作菜单栏
    createMenuElement(evt) {
      // 清除旧菜单（避免重复添加）
      const oldMenu = document.querySelector('.component-menu');
      if (oldMenu) oldMenu.remove();
      // 创建VNode结构的菜单
      const menuVNode = this.$createElement(
        'div',
        {
          class: 'component-menu'
        },
        [
          this.$createElement(
            'div',
            {
              class: 'component-menu-item',
              on: {
                click: (menuEvent) => {
                  this.handleMenuClick('delete', evt);
                  menuEvent.stopPropagation();
                }
              }
            },
            '删除'
          ),
          this.$createElement(
            'div',
            {
              class: 'component-menu-item',
              on: {
                click: (menuEvent) => {
                  this.handleMenuClick('copy', evt);
                  menuEvent.stopPropagation();
                }
              }
            },
            '复制'
          )
        ]
      );
      // 创建临时容器并渲染VNode
      // const container = document.createElement('div');
      const tempVue = new Vue({ render: () => menuVNode }).$mount();
      const menuElement = tempVue.$el;

      // 添加新菜单到DOM
      evt.item.appendChild(menuElement);
    },
    handleMenuClick(type, evt) {
      let { item } = evt;
      let that = this;
      const parentElement = evt.item.parentElement;
      let curId = evt.item.dataset.nodeId;
      let parentId = parentElement.dataset.nodeId;
      let parent = this.getComponentById(parentId);
      switch (type) {
        case 'delete':
          if (parent) {
            parent.children = parent.children.filter((child) => child.nodeId !== curId);
          }
          item.remove();
          break;
        case 'copy':
          const clone = evt.item.cloneNode(true);
          clone.dataset.nodeId = new Date().getTime();
          // 清除menu
          const menu = clone.querySelector('.component-menu');
          if (menu) menu.remove();
          // 清除active
          clone.classList.remove('component-active');
          that.addEventToDom({ item: clone });
          // 将克隆元素插入到源元素的位置
          evt.item.parentNode.appendChild(clone);
          break;
        default:
          break;
      }
    },
    // 根据nodeId获取组件
    getComponentById(nodeId) {
      const findComponent = (components) => {
        for (const component of components) {
          if (component.nodeId === nodeId) {
            return component;
          }
          if (component.children && component.children.length) {
            const found = findComponent(component.children);
            if (found) {
              return found;
            }
          }
        }
        return null;
      };
      return findComponent(this.panelComponents);
    },
    // 当新增表单容器时，通过 MutationObserver 自动初始化嵌套 Sortable：
    observeContainerChanges() {
      const observer = new MutationObserver(() => {
        this.initDragFeedback(); // DOM变化时重新初始化
      });

      observer.observe(this.$refs.panelContent, {
        childList: true,
        subtree: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
    // 右阴影
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

  // &:hover {
  //   background: rgba(0, 120, 212, 0.1);
  //   border: 2px dashed #0078d4;
  // }
}

.dragged-item {
  padding: 10px;
  background-color: #cce5ff;
  margin-bottom: 10px;
  border-radius: 4px;
}

.form-container {
  border: 1px dashed #ccc;
  min-height: 100px;
  padding: 10px;
  transition: box-shadow 0.3s ease;
  z-index: 1;
}

.grid-layout {
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
