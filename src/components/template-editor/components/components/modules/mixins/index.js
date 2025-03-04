import { get } from 'lodash-es';
export default {
  props: {
    module: {
      type: Object,
      default: () => {}
    },
    typeData: {
      type: Object,
      default: () => {}
    },
    dataSourceFields: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mockData: [
        {
          nxm: '张三',
          zzh: 330321199003077111,
          ngj: '中国',
          djr: '男',
          djrq: '2025-01-01',
          djjg: '浙江省杭州市余杭区的登记机关',
          img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          nxm: '赵云',
          zzh: 430321199003077111,
          ngj: '中国',
          y4: '男',
          djrq: '2025-01-01',
          djjg: '浙江省杭州市余杭区的登记机关',
          img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          nxm: '关羽',
          zzh: 530321199003077111,
          ngj: '中国',
          djr: '男',
          djrq: '2025-01-01',
          djjg: '浙江省杭州市余杭区的登记机关',
          img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          nxm: '刘备',
          zzh: 630321199003077112,
          ngj: '中国',
          djr: '女',
          djrq: '2025-01-01',
          djjg: '浙江省杭州市余杭区的登记机关',
          img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          nxm: '王五',
          zzh: 730321199003077113,
          ngj: '中国',
          y4: '男',
          djrq: '2025-01-01',
          djjg: '浙江省杭州市余杭区的登记机关',

          img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        },
        {
          nxm: '赵六',
          zzh: 330321199003077114,
          ngj: '中国',
          y4: '女',
          djrq: '2025-01-01',
          djjg: '浙江省杭州市余杭区的登记机关',

          img: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        }
      ]
    };
  },
  computed: {
    dataSource() {
      return get(this.$props.typeData, 'dataSource', []);
    },
    fields() {
      return get(this.$props.typeData, 'fields', []);
    },
    useData() {
      let mockData = this.mockData || [];
      return this.$props.isEdit ? mockData : mockData;
    }
  },
  watch: {
    // 'module.dataSrc': {
    //   handler(val) {
    //     this.clear();
    //   }
    // },
    dataSourceFields(val) {
      // this.clear();
    },
    module: {
      handler(newVal, oldVal) {
        this.initFieldsOption();
        if (newVal.id == oldVal.id) {
          if (newVal.dataSrc !== oldVal.dataSrc) {
            this.clear();
          }
        }
      },
      deep: true
    }
  },
  methods: {
    clear() {},
    updateModule(module) {
      this.$emit('update', this.$props.module);
    },
    generateString(template, data) {
      // 使用正则表达式匹配 `${}` 包裹的字段
      const regex = /\${(.*?)}/g;
      let result = template;

      // 逐个替换字段
      let match;
      while ((match = regex.exec(template)) !== null) {
        const field = match[1]; // 获取字段名（例如 y1 或 y2）
        if (data.hasOwnProperty(field)) {
          // 替换模板中的字段为对应的数据值
          result = result.replace(match[0], data[field]) || '';
        } else {
          result = result.replace(match[0], '');
        }
      }

      return result;
    }
  }
};
