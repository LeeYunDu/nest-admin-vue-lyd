<template>
  <div>
    {{ fields }}
    <!-- <el-form ref="form" :model="formData" size="mini" label-width="80px">
      <el-form-item v-for="(field, index) in fields" :label="field.label" :key="index">
        <el-input v-model="formData[field.key]"></el-input>
      </el-form-item>
    </el-form> -->
  </div>
</template>

<script>
export default {
  name: 'SettingForm',
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    model: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {}
    };
  },
  watch: {
    model: {
      handler(val) {
        // this.formData = val;
      },
      deep: true
    }
  }
};
</script>
