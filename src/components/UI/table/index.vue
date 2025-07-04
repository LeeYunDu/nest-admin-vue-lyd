<template>
  <section class="table-view">
    <div v-if="$slots.tableHeader" class="table-header">
      <slot name="tableHeader"></slot>
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      stripe
      v-bind="$attrs"
      :style="tableStyle"
      :header-cell-style="_HeaderStyle"
      :cell-style="_CellStyle"
      empty-text="暂无数据"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      @selection-change="onTableSelectChange"
      @sort-change="onTableSortChange"
      @filter-change="onTableFilterChange"
    >
      <template v-for="(tableProps, index) in columnsData" :key="index">
        <TableColumn
          :column-props="tableProps"
          @clickable="(params) => $emit('clickable', params)"
        >
          <template #[String(tableProps.slot)]="tableColumnProps">
            <slot :name="tableProps.slot" v-bind="tableColumnProps"> </slot>
          </template>
        </TableColumn>
      </template>

      <template #empty>
        <slot name="nodata">
          <div class="no-data-box">
            <div>
              <!-- <img src="static/images/app/no-data.png" alt="" /> -->
            </div>
            <div>暂无信息</div>
          </div>
        </slot>
      </template>
    </el-table>
    <SimplePage
      v-if="showPage"
      v-bind="$attrs"
      @page-change="$emit('pageChange')"
    />
  </section>
</template>

<script setup lang="ts">
import SimplePage from './components/Simple.page.vue'
import { hasIn, isArray, isString, cloneDeep } from 'lodash-es'
import TableColumn from './components/Table.column.vue'
import {
  computed,
  ref,
  useAttrs,
  onMounted,
  nextTick,
  unref,
  toRefs,
  toRaw
} from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  tableStyle: { type: Object, default: () => ({}) },
  btnStyleConfig: { type: Object, default: () => ({ gapLine: true }) },
  headerStyle: { type: Object, default: () => ({}) },
  cellStyle: { type: Object, default: () => ({}) },
  selectionKey: { type: [String, Array], default: '' },
  selection: { type: Array, default: () => [] },
  showPage: { type: Boolean, default: true }
})

const emits = defineEmits([
  'pageChange',
  'update:selection',
  'update:sort',
  'reload',
  'filter',
  'clickable'
])

const attrs = useAttrs()

// style
const defaultHeaderStyle = computed(() => {
  return  {
    height: '36px',
    color: 'rgba(255, 255, 255, 1)',
    fontWeight: '400',
    fontSize: '16px',
    textAlign: 'center'
  }
})

const defaultCellStyle = {
  height: '44px',
  color: 'rgba(255, 255, 255, 1)',
  fontWeight: '400',
  fontSize: '14px',
  textAlign: 'center'
}

const { gapLine } = toRefs(props.btnStyleConfig)

const _BtnStyle = computed(() =>
  unref(gapLine) ? { gap: 'initial', line: '""' } : { gap: '5px', line: 'none' }
)
const _HeaderStyle = computed(() =>
  Object.assign({}, defaultHeaderStyle.value, props.headerStyle)
)
const _CellStyle = computed(() =>
  Object.assign({}, defaultCellStyle, props.cellStyle)
)

const table = ref(null)

const columnsData = computed(() =>
  props.columns.filter(i => ('hidden' in i ? Boolean(i.hidden) : true))
)

const isScroll = computed(() => {
  return 'scroll' in attrs && props.data.length > 0
})

const selectionList = ref([])

function onTableSelectChange(selection) {
  if (hasIn(attrs, 'onSelectionChange')) return
  selectionList.value = []
  if (isString(props.selectionKey))
    selectionList.value = selection.map(item => item[props.selectionKey])
  if (isArray(props.selectionKey)) {
    const selectMap = {}
    for (const key of props.selectionKey) selectMap[key] = null
    selection.forEach(select => {
      const selectMapDeep = cloneDeep(selectMap)
      for (const key in selectMap) selectMapDeep[key] = select[key]
      selectionList.value.push(selectMapDeep)
    })
  }
  emits('update:selection', selectionList.value || [])
}

function onTableSortChange(params) {
  if (hasIn(attrs, 'onSortChange')) return
  const { order, prop: fieldKey } = params
  if (!(order && fieldKey)) {
    emits('update:sort', '')
    return emits('reload')
  }
  const sortKey = { ascending: '+', descending: '-' }
  emits('update:sort', `${fieldKey}${sortKey[order]}`)
  emits('reload')
}

function onTableFilterChange(filter) {
  if (hasIn(attrs, 'onFilterChange')) return
  const positionName = Object.keys(filter).join('')
  const index = positionName[positionName.length - 1]
  const columns = columnsData.value.filter(item => item.key)
  const column = (columns[index - 1] && columns[index - 1]) || {}
  emits('filter', {
    key: column.key || positionName,
    value: toRaw(filter[positionName])
  })
}

let interval = null

function initScroll() {
  const bodyWrapper = table.value.$el.querySelector('.el-scrollbar__wrap')

  interval = setInterval(() => {
    bodyWrapper.scrollTop += 1
    if (
      bodyWrapper.clientHeight + bodyWrapper.scrollTop + 1 >
      bodyWrapper.scrollHeight
    ) {
      bodyWrapper.scrollTop = 0
    }
  }, 50)
}

const cellMouseEnter = () =>
  isScroll.value && interval && clearInterval(interval)

const cellMouseLeave = () => isScroll.value && initScroll()

onMounted(() => isScroll.value && nextTick(() => initScroll()))

defineExpose({ table })
</script>

<style lang="scss" scoped>
.table-view {
  width: 100%;
  height: 100%;

  overflow-y: auto;
  ::v-deep(.el-table) {
    flex: 1;
    background: transparent;
    .el-table__body-wrapper {
      margin-top: 20px;
    }

    .el-table__inner-wrapper {
      &::before {
        display: none;
      }
    }

    .el-table__row--striped {
      td {
        background: transparent !important;
      }
    }
    thead {
      tr {
        th {
          color: #fff;
        }
      }
    }

    th.el-table__cell {
      // border: none;
      padding: 0;
      background:rgba(57, 156, 255, 0.36);
      font-size: 16px;
      color: #020810;
      font-family: 'Alibaba PuHuiTi', 'Alibaba PuHuiTi';
      border-bottom: 0;

      .cell {
        white-space: nowrap;
      }
    }

    tr {
      // border: none;
      background-repeat: no-repeat;
      background-size: 100%;
      background-color: transparent;

      td {
        padding: 0;
        // border: none !important;
        font-size: 16px;
        color: white;
        font-family: 'Alibaba PuHuiTi', serif;
        font-weight: 400;
        line-height: 19px;
        border-bottom: 0;
      }

      &:hover {
        td {
          background: transparent !important;

          &.el-table-fixed-column--right {
            z-index: 99;
            background: white !important;
          }
        }
      }
    }

    .el-table__row--level-0 {
      .type-name {
        color: rgba(0, 242, 242, 1) !important;
      }
    }

    // 操作按钮样式
    .el-table__row {
      .cell {
        .el-button {
          position: relative;
        }
        button > span {
          font-size: 16px;
          font-weight: 400;
          color: #0ab1b6;
        }
        button + button {
          margin-left: v-bind('_BtnStyle.gap') !important;
          &::before {
            content: v-bind('_BtnStyle.line');
            position: absolute;
            left: -2px;
            width: 1px;
            height: 15px;
            background-color: #0ab1b6;
            margin: 0 5px;
          }
        }
      }
    }
  }
}

.no-data-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // padding-top: 116px;
  // padding-bottom: 100px;
  img {
    width: 192px;
  }
}

@media (min-width: 3000px) {
  .table-view {
    ::v-deep(.el-table) {
      .el-table__body-wrapper {
        margin-top: 25px;
      }
    }
  }
}
</style>
