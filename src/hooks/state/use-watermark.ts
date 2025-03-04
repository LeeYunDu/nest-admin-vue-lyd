import { onMounted, nextTick, onUnmounted } from 'vue';
import { parseTime } from '@/utils';
import store from '@/store';
import { useRoute } from 'vue-router';

export default function useWatermark () {
  const user = store.getters.user;
  const route = useRoute();
  let timer: any = 0;

  async function init (opts?: any) {
    await nextTick();
    remove();

    const time = opts?.delay ?? 3000;
    const loop = opts?.loop ?? 1000 * 60;
    setTimeout(() => watermarkIng(), time);
    timer = setInterval(() => watermarkIng(), loop);
  }

  onMounted(() => {
    init({ delay: 3000 });
  });

  onUnmounted(() => {
    remove();
  });

  function watermarkIng () {
    const waterText = (user.realName || '') + ' ' + (route.meta?.title || '') + parseTime(new Date(), '{y}-{m}-{d} {h}:{i}');
    watermark.init({
      watermark_txt: waterText,
      watermark_x_space: 60,
      watermark_y_space: 60,
      watermark_x: 20, // 水印起始位置x轴坐标
      watermark_y: 20,
      watermark_width: 120,
      watermark_fontsize: '12px',
      watermark_alpha: 0.08
    });
  }


  function remove () {
    timer && clearInterval(timer);
  }

  function reload () {
    init({ delay: 0 });
  }

  return {
    reload
  };
}
