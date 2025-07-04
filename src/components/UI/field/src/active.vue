<template>
  <template v-if="show">
    <teleport :to="`#${teleportTarget}`">
      <section
        :id="`0000${teleportTarget}`"
        ref="active"
        class="ui-field-active"
        :class="{ show: show }"
      >
        <main>
          <ui-form
            :model="model"
            :labels="labels"
            :props="formProps"
            :options="formOptions"
          />
        </main>
        <footer>
          <el-button type="primary" size="small" @click="onSubmit">提交</el-button>
        </footer>
      </section>
    </teleport>
  </template>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { fieldGlobal } from '@/global/pubsub'
import { useSubscribe } from '@/hooks/pubsub'
import { FieldItem } from '@/typings/items'
import { nMenuUpdate } from '@/api'
import { ResponseMode } from '@/typings/params'
import { ElMessage } from 'element-plus'

const labels = [
  { label: '名称', key: 'name', type: 'input' },
  { label: 'key', key: 'key', type: 'input' }
]
export default defineComponent({
  name: 'UiFieldActive',

  setup () {
    const activeRef = ref('active')
    const model = ref({
      id: '',
      name: '',
      key: ''
    })
    const formProps = {
      labelWidth: '70px',
      size: 'mini'
    }
    const formOptions = {
      gridItem: {
        span: 24
      }
    }
    const state = reactive({
      show: false,
      field: {} as FieldItem,
      teleportTarget: '',
    })
    useSubscribe(fieldGlobal.FIELD_ACTIVE).subscribe((options: any) => {

      console.log('eoptions: ', options)
      const { e, field, id } = options || {}
      state.field = field
      if (!e || !field) return
      model.value = {
        id: field.id,
        name: field.label,
        key: field.key
      }
      state.teleportTarget = id
      state.show = true
      initLayout(e)
    })

    function initLayout (e: EventTarget) {
      console.log('e: ', e)
    }

    function onClose () {
      state.show = false
    }

    async function onSubmit () {
      try {
        const { success }: ResponseMode = await nMenuUpdate({ menu: model.value })
        if (!success) return ElMessage.error('操作失败.')
        state.field.label = model.value.name
      } catch (error) {
        console.log(error)
      }
    }

    return {
      activeRef,
      model,
      labels,
      formOptions,
      formProps,
      ...toRefs(state),

      // fn
      onClose,
      onSubmit
    }
  }
})
</script>
<style lang="scss" scoped>
.ui-field-active {
  display: none;
  padding: 0px 15px;
  border-radius: 4px;
  background: $white;
  z-index: 99;
  &.show {
    display: block;
  }
  main {
    width: 80%;
    padding: 15px 0px;
  }
  footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    border-top: $theme-border;
  }
}
</style>
