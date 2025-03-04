import { onUnmounted, ref } from 'vue';
import { prefetchResource } from '@/utils/prefetch';

const { VITE_ENV } = import.meta.env;
const isDev = VITE_ENV === 'development';

export type PrefetchItem = {
  label: string
  key: string
  // 是否开启预加载 默认true
  prefetch?: boolean
  // 项目地址 一般用于加载其他项目的资源
  url?: string
  // location.origin
  origin?: string
}

export type PrefetchParam = {
  // 预加载资源
  items: PrefetchItem[]
  // 是否开启预加载
  prefetch?: boolean
  // 延迟开始时间
  delay?: number
}

export default function usePrefetch (options: PrefetchParam) {
  const { items, prefetch, delay } = options || {};
  if (isDev || prefetch === false) return;

  if (!items?.length) return;

  isDev && setTimeout(() => {
    initPrefetch();
  }, delay || 3000);

  const prefetchWorker = ref<Worker>();

  function initPrefetch () {
    prefetchWorker.value = prefetchResource(items);
  }

  onUnmounted(() => {
    prefetchWorker.value?.terminate();
  });
}
