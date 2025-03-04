import { ref, onMounted } from 'vue';

export type StickyParam = {
  element: HTMLElement | string
  target: HTMLElement | string
  offsetY?: number
}

export default function useSticky (options: StickyParam) {
  const { element, target, offsetY = 0 } = options || {};
  const times = ref<number>(0);
  const sticky = ref<boolean>(false);

  const targetStyle = ref<any>({} as any);
  const targetTop = ref<number>(0);
  const elementTop = ref<number>(0);
  const ut = ref<HTMLElement>({} as HTMLElement);
  const ue = ref<HTMLElement>({} as HTMLElement);

  onMounted(() => {
    initElements();
  });

  window.addEventListener('scroll', () => {
    if (times.value >= 3) return;
    if (!ue.value.tagName || !ut.value.tagName) {
      times.value += 1;
      initElements();
      return;
    }
    Promise.resolve().then(() => calculate());
  });

  function initElements () {
    ut.value = target instanceof HTMLElement ? target : document.querySelector(String(target)) as HTMLElement;
    ue.value = element instanceof HTMLElement ? element : document.querySelector(String(element)) as HTMLElement;
    if (!ut.value || !ue.value) return;

    const { top: utTop } = ut.value.getBoundingClientRect();
    const { top: ueTop } = ue.value.getBoundingClientRect();
    targetTop.value = utTop;
    elementTop.value = ueTop;
    targetStyle.value = {
      position: ut.value.style.position,
      zIndex: ut.value.style.zIndex,
      top: ut.value.style.top
    };
  }

  function calculate () {
    const { top: autTop } = ut.value.getBoundingClientRect();
    const { top: aueTop } = ue.value.getBoundingClientRect();

    if (aueTop + offsetY <= targetTop.value && !sticky.value) {
      sticky.value = true;
      ue.value.style.position = 'fixed';
      ue.value.style.top = targetTop.value - offsetY + 'px';
      ue.value.style.zIndex = '9999';
      return;
    }

    if (autTop + elementTop.value >= 0 && sticky.value === true) {
      sticky.value = false;
      ue.value.style.position = 'relative';
      Object.keys(targetStyle.value).map((key: string) => {
        ue.value.style[key as any] = targetStyle.value[key];
      });
    }
  }
  return {};
}
