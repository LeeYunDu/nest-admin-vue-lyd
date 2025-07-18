<template>
  <div class="page-view">
    <section class="page-header">
      <div class="table-query-form">
        <UiForm
          v-bind="tableQueryFormOptions"
          ref="formRef"
          :model="curParams"
          :labels="useTableQueryForm"
          @change="onFormChange"
        >
          <template #button>
            <div class="form-button-group">
              <ActionButtons :fields="formButtons" />
            </div>
          </template>
        </UiForm>
      </div>
      <div class="table-menu">
        <ActionButtons :fields="tableMneuButtons" />
      </div>
    </section>
    <section class="page-main">
      <div class="table-box">
        <UiTable
          v-bind="tableOptions"
          ref="uiTableRef"
          :data="state.data"
          @page-change="onPageChange"
        >
          <template #y4="{$row}">
            <span>自定义插槽</span>
          </template>

          <template #action="{$row,config}">
            <template v-for="btn in actionButtons" :key="btn.key">
              <span
                v-if="showBtns(btn.key, $row)"
                class="action-btn"
                type="text"
                @click="onAction(btn.key, $row)"
              >{{ btn.label }}</span>
            </template>
          </template>
        </UiTable>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { tableColumn, tableQueryFormFields,tableQueryFormOptions } from './json'
import { UiTable } from '@/components/UI/table'
import { UiForm } from '@/components/UI/form'
import { useRouter } from 'vue-router'
import { get } from 'lodash-es'
import ActionButtons from '@/components/action-button/index.vue'
import { transformTableData } from '@/utils'

let state = reactive({
  data:[] ,
  show:false,
  total:0,
  row:{},
})


const curParams:any = ref({
  pageNum: 1,
  pageSize: 10,
  name:'',
})

let useTableQueryForm = computed(()=>{
  return tableQueryFormFields
})

function onPageChange (opts:any){
  let { params } = opts
  Object.assign(curParams.value,params)
  asyncData()
}

function onSearch (){
  curParams.value.pageNum = 1
  asyncData()
}

let router = useRouter()
const actionButtons = ref([
  { label:'详情',key:'detail' },
  { label:'编辑',key:'edit' },
  { label:'删除',key:'delete' },
])
const formRef = ref()
const formButtons = ref([
  {
    label:'查询',key:'search',icon:'',click:()=>{
      onSearch()
    } },
  {
    label:'重置',key:'reset',icon:'',click:()=>{
      formRef.value.resetFields()
      onSearch()
    } }
])

const tableMneuButtons = ref([
  {
    label:'新增',key:'search',icon:'',click:()=>{

    }
  },
])

function showBtns (key:string, row:any):boolean {
  const active:any = {
    'detail': true,
    'edit':true,
    'add':true,
    'delete':get(row, 'y6') == true,
  }
  return active[key]
}

function onFormChange (opts:any){
  let { params } = opts
  Object.assign(curParams.value,params,{ pageNum:1 })
  asyncData()
}


let tableOptions = reactive({
  props:{
    border: false,
    height: undefined,
    select: false,
    rowKey: 'id',
    stripe: false,
    currentRowkey: 'id'
  },
  options:{
    pagination:{
      total:0,
      mapper:{
        currentPage:'pageNum',
      },
      props:{
        pageSize:10,
        pageNum:1,
        background:true,
      }
    },
  },

  columns:tableColumn,
})


const onAction = (key:string, row:any) => {
  const actionMap:any = {
    'edit': () =>{
      ElMessage.info('正在建设中')
    },
    'detail':()=>{
      ElMessage.info('查看详情')

    },
    'delete':async () => {
      ElMessageBox.confirm(
        '该操作将数据,是否继续',
        '警告',
        {
          confirmButtonText: '是的',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          ElMessage.success('操作成功')
          asyncData()
        })
    },
  }
  state.row = row
  actionMap[key] && actionMap[key](row)
}


const asyncData = async () => {
  // const params: GpParam = Object.assign({},  curParams.value || {})
  // const { status,  msg, data } = await BuildingInfoGetPage(params)
  // if (!(status===200)) return ElMessage.error(msg)
  // tableOptions.options.pagination.total = get(data || {}, 'total', 0)
  // // state.data = data.list
  // state.data= transformTableData(buildingTableColumn,get(data || {}, 'list', []))

  // 以下是示例代码
  function useApi (params: any) {
    return new Promise((resolve, reject) => {
      resolve({
        status: 200,
        msg: 'success',
        data: {
          total: 2,
          list:[
            {
              y1:'名称',
              y3:new Date().getTime(),
              y5:0,
              y6:true
            },
            {
              y1:'名称',
              y5:1,
              y6:false
            }
          ]
        }
      })
    })
  }
  const params: any = Object.assign({},  curParams.value || {})
  const { status, msg, data } = await useApi(params)
  if (!(status===200)) return ElMessage.error(msg)
  tableOptions.options.pagination.total = get(data || {}, 'total', 0)
  state.data = transformTableData(tableColumn,get(data || {}, 'list', []))
}


asyncData()
</script>

<style lang="scss" scoped>


</style>
