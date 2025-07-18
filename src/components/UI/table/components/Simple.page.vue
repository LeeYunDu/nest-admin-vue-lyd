<template>
  <section class="pagination-component">
    <el-pagination
      v-model:current-page="cPage"
      :page-size="params.pageSize || params.offset"
      :layout="layout"
      :total="total"
      v-bind="$attrs"
      @current-change="onPageCurrentChange"
    >
      <template #default>
        <span class="total">共 {{ total }} 项数据</span>
      </template>
    </el-pagination>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  params: { type: Object, default: () => ({}) },
  total: { type: Number, default: 0 },
  layout: { type: String, default: 'prev, pager, next, jumper, slot' }
})

const emit = defineEmits(['pageChange', 'update:pageNun'])

const cPage = computed({
  get: () => props.params?.pageNum || props.params?.page,
  set: page => emit('update:pageNun', page)
})

const onPageCurrentChange = value => {
  emit('pageChange', { params: { pageNum: value } })
}
</script>

<style lang="scss" scoped>
.pagination-component {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 0;
  box-sizing: border-box;

  ::v-deep(.el-pagination) {
    display: flex;
    align-items: center;

    .total {
      // position: absolute;
      // left: 0;
      // font-size: 14px;
      // font-weight: 400;
      // color: rgba(0, 0, 0, 0.6);
    }

    > button {
      //border: 1px solid rgba(0, 0, 0, 0.15);
      //background-color: #fff;
    }

    .el-pager {
      > li {
        // border: 1px solid #dcdcdc;
        // background-color: #fff;
        // color: rgba(0, 0, 0, 0.6);
        // font-weight: normal;
        // font-size: 14px;
        // border-radius: 3px;

        & ~ li {
          margin-left: 5px;
        }

        &:not(.disabled).is-active {
          // background-color: #0ab1b6;
          // border: none;
          // color: rgba(255, 255, 255, 0.9);
        }

        &:not(.disabled):hover {
          // background-color: #0ab1b6;
          // border: none;
          // color: rgba(255, 255, 255, 0.9);
        }
      }
    }
  }
}
</style>
