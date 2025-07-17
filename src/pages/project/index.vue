<template>
  <div class="page-component">
    <div class="table-box">
      <UITable
        v-bind="tableOptions"
        @change="onChange"
        @sort="sortChange"
      >
        <template #action="{row,config}">
          <template v-for="btn in actionButtons" :key="btn.key">
            <span
              v-if="showBtns(btn.key, row)"
              class="action-btn"
              type="text"
              @click="onAction(btn.key, row)"
            >{{ btn.label }}</span>
          </template>
        </template>
      </UITable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive,ref,onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { get } from 'lodash-es'
import UITable from '@/components/UI/table/index.vue'
import { tableColumn } from './json'

const state = reactive({
  show: false,
  data:[]
})

let tableOptions = reactive({
  props:{
    border: false,
    height: '100%',
    select: false,
    rowKey: 'id',
    stripe: false,
    currentRowkey: 'id'
  },
  options:{
    autoScroll:false,
    pagination:{
      total:0,
      mapper:{
        currentPage:'pageNum',
      },
      props:{
        pageSize:10,
        pageNum:1
      }
    },
  },
  data:[ ],
  columns:tableColumn({}),
})

const actionButtons = ref([
  { label:'详情',key:'detail' },
  { label:'编辑',key:'edit' },
  { label:'下架',key:'down' },
  { label:'删除',key:'delete' },
])

function showBtns (key:string, row:any):boolean {
  const active:any = {
    'detail': true,
    'edit': true,
    'delete': true,
    'down': true,
  }
  return active[key]
}

const onAction = (key:string, row:any) => {
  const actionMap:any = {
    'detail': () => ({}),
    'edit': () => ({}),
    'down': () => ({}),
    'delete': () => ({}),
  }
  actionMap[key] && actionMap[key](row)
}


const curParams:any = ref({
  pageNum: 1,
  pageSize: 10
})


function onChange (opts:any){
  let { params } = opts
  Object.assign(curParams.value,params)
  asyncData()
}

const onChangeCurrent = (value: number) => {
  asyncData()
}

const sortChange=async (item:any)=>{
  curParams.value.sort=item && item.order?item.prop+(item.order==='ascending'?'+':'-'):undefined
  onChangeCurrent(1)
}

const asyncData = async () => {
  const params: any = Object.assign({},  curParams.value || {})
  // const { success, errMsg, data }: any = await apiName(params)
  const  { success, errMsg, data }: any = { success:true,errMsg:'',data:{
    list:new Array(10).fill({
      projectName:'mock',
      subAppCount:10
    }),total:10
  } }
  if (!success) return ElMessage.error(errMsg)
  tableOptions.data= get(data || {}, 'list', [])
}

onMounted(() => {
  asyncData()
})
</script>

<style lang="scss" scoped>

.page-component{
  height: 100%;
  .table-box{
    height: 100%;
  }
}
</style>
