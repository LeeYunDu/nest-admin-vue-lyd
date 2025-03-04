import { cloneDeep } from 'lodash-es';
import { reactive } from 'vue';
import { useRoute } from 'vue-router';
import { nPageViewQuery } from '@/api';
import { MenuMode } from '@/typings/data';
import { useStore } from 'vuex';

const defaultOptions = {
  base: {
    title: '',
    header: {
      hidden: true
    }
  },

  layoutConf: {
    base: {
      colNum: 24,
      // rowHeight: 30,
      isDraggable: false,
      isMirrored: false,
      isResizable: false,
      margin: [10, 10],
      preventCollision: false,
      useCssTransforms: true,
      verticalCompact: true
    }
  },

  groupConf: {},

  asyncConf: {}
} as any;

export interface Gc {
  options: any
  params: any
}

export interface GcOptions {
  id: string | number
}
export default function useGc (options?: GcOptions): Gc {
  const store = useStore();
  const views: any = store.getters['view/views'];

  const route = useRoute();
  const { id } = options || {};
  let useId = id;
  const state: Gc = reactive({
    options: cloneDeep(defaultOptions),
    params: {
    } as any
  });

  if (!useId) {
    const route = useRoute();
    const currentMenu: MenuMode = (route.meta?.data || {}) as MenuMode;
    useId = currentMenu.id;
  }

  initParams();
  if (views[String(useId)]) {
    state.options = views[String(useId)].options;
  } else {
    initData();
  }

  function initParams () {
    // route params
    state.params = Object.assign(state.params || {}, route.query || {});
  }

  async function initData () {
    try {
      const { data, success }: any = await nPageViewQuery({ menuId: String(useId) });
      if (!success) return;
      let layoutBase = {} as any;
      let layout = [];
      let group = [];
      let async = [];

      const item = (data.list && data.list[0]) || {};
      const itemOptions = item.options && JSON.parse(item.options);
      layoutBase = itemOptions?.layoutConf?.base || {};

      layout = item.layout && JSON.parse(item.layout);
      group = item.group && JSON.parse(item.group);
      async = item.async && JSON.parse(item.async);

      if (!layout || layout.length < 1) {
        layout = [];
      }
      if (!group || group.length < 1) {
        group = [];
      }
      if (!async || async.length < 1) {
        async = [];
      }

      const options = cloneDeep(state.options);

      if (layoutBase) {
        if (layoutBase.margin && layoutBase.margin.length > 1) {
          layoutBase.margin[0] = layoutBase.margin[0] * 1;
          layoutBase.margin[1] = layoutBase.margin[1] * 1;
        }
        layoutBase.colNum = layoutBase.colNum * 1;
        layoutBase.maxRows = (layoutBase.maxRows && layoutBase.maxRows * 1) || undefined;

        layoutBase.isDraggable = false;
        layoutBase.isResizable = false;
        Object.assign(options.layoutConf.base, layoutBase || {});
      }
      options.layoutConf.layout = layout;
      options.groupConf.group = group;
      options.asyncConf.async = async;

      state.options = options;
      store.dispatch('view/setViewCache', { id: useId, useful: true, options: cloneDeep(options) });
    } catch (error) {
      console.log(error);
    }
  }
  return state;
}
