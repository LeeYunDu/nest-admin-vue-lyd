<template>
  <div class="attrs-setting">
    <h3>属性设置</h3>
    {{ useSettingFormItems }}
    <div class="attrs-content">
      <SettingForm :model="attrs.props" :fields="[{ key: 'y1' }, { key: 'y2' }]" />
    </div>
  </div>
</template>

<script>
import SettingForm from './setting-form/index.vue';
import { componentAttrsConfig } from '../config/component-attrs-comfig';
export default {
  name: 'AttrsSetting',
  components: {
    SettingForm
  },
  props: {
    attrs: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    useSettingFormItems() {
      console.log(componentAttrsConfig[this.attrs.type].settingFormItems);
      console.log(this.attrs, 'this.attrs.type');

      return componentAttrsConfig[this.attrs.type].settingFormItems || [];
    }
  }
};
</script>
