<template>
  <section class="ui-component">
    <el-descriptions
      class="descriptions-box"
      v-bind="props"
    >
      <template #extra>
        <slot name="extra"></slot>
      </template>
      <template v-for="(field, index) in fields" :key="index">
        <el-descriptions-item :label="field.label" v-bind="buildProps(field)">
          <template #label>
            <div
              class="flex f-aic"
              :class="{
                showIcon:Boolean(showChangeIcon(field))
              }"
            >
              {{ field.label }}
              <img
                class="icon-update"
                src="@static/images/audit/icon-update.png"
                @click="onShowDetail"
              >
            </div>
          </template>

          <template v-if="field.type === 'text'">
            {{ useText(field, data) }}
          </template>
          <template v-if="field.type === 'date'">
            {{ useText(field, data) }}
          </template>
          <template v-if="field.type === 'select'">
            {{ useText(field, data) }}
          </template>
          <template v-else-if="field.type === 'slot'">
            <slot :name="field.slotName || field.key" :item="field" :data="data"></slot>
          </template>
          <template v-else-if="field.type">
            <Component
              :is="`${componentConfig.prefix}${field.type}`"
              :value="field.value"
              disabled
              style="display: inline;"
            />
          </template>
        </el-descriptions-item>
      </template>
    </el-descriptions>
  </section>
</template>
<script lang="ts">
import { FieldItem } from '@/typings/items'
import { computed, defineComponent, inject, PropType } from 'vue'
import useText from '@/hooks/state/use-text'
import Config from '@/config'
import { parseTime } from '@/utils'
import { getCurrentInstance } from 'vue'
export default defineComponent({
  name: 'UiDescriptions',
  props: {
    fields: { type: Array as PropType<FieldItem[]>, default: () => [] },
    data: { type: Object as PropType<any>, default: () => ({}) },
    options: { type: Object, default: () => ({}) },
    compositeType:{ type:String,default:'单一文本' },
    activeIndex:{ type:Number,default:0 }
  },

  setup (props: any) {
    const cProps = computed(() => props.options.props || {
      column: 3
    })
    const itemProps = computed(() => props.options.itemProps || {
      span: 1
    })

    function buildProps (field) {
      if (field._options.fieldConf.props && field._options.fieldConf.props.length > 0) {
        const props = field._options.fieldConf.props.find(item => item.type === 'props').option
        return Object.assign({}, itemProps, props)
      } else {
        return itemProps
      }
    }
    let pageOptions:any = inject('page-options')  || null

    function showChangeIcon (field){
      if(JSON.stringify(pageOptions) == '{}'){
        return false
      }

      try {
        let { label,key } = field
        let { labels = [],keys = [] } = pageOptions
        if(labels.includes(label)){
          return true
        }

        // 单一字段和复合字段的对比
        if(props.compositeType == '单一文本'){
          if(keys.includes(key.replace('planningResult.',''))){
            return true
          }
        }else{
          let comparisonList = pageOptions.compositeComparisonResult.find(item=>{
            return  item.type == props.compositeType
          })
          if(comparisonList){
            let current = comparisonList.comparisonResult.find(policy=>{
              return policy.index == props.activeIndex
            })
            return current &&  current.comparison.map(e=>e.key).includes(key)
          }
        }
      } catch (error) {
        return false
      }
    }
    let ctx = getCurrentInstance()
    function onShowDetail (){
      PubSub.publish('show-comparison-detail',pageOptions)
    }
    return {
      props: cProps,
      itemProps,
      componentConfig: Config.component,
      // hooks
      useText,
      buildProps,
      parseTime,
      pageOptions,
      showChangeIcon,
      onShowDetail
    }
  }
})
</script>
<style lang="scss" scoped>
.descriptions-box {
  :deep {
    .el-descriptions__content {
      display: inline-block;
    }
    .el-descriptions__label{
      padding: 0px!important;
    }

    .flex{
      padding: 10px 12px;
      &.showIcon{
        background: rgba(243,148,20,0.08)!important;
        .icon-update{
          display: inline-block!important;
        }
      }
    }
  }
}


.icon-update{
  cursor: pointer;
  width: 28px;
  display: none
}
</style>
