import { onUnmounted, ref } from 'vue';
export default function useMouseMove () {
  const x = ref(0);
  const y = ref(0);
  const moving = ref(false);

  function onMouseMove (e: MouseEvent) {
    x.value = e.pageX;
    y.value = e.pageY;
  }

  function on () {
    moving.value = true;
    document.addEventListener('mousemove', onMouseMove);
  }

  function off () {
    moving.value = false;
    document.removeEventListener('mousemove', onMouseMove);
  }

  onUnmounted(() => off());

  return {
    x,
    y,
    moving,

    // fn
    on,
    off
  };
}
