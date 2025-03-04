import { ref, toRef } from 'vue'

export interface ScrollOptionsMode {
  target: Document
  type: string
  plus: number
  stop?: boolean
}
export default function useScrollAuto (opts: ScrollOptionsMode) {
  const { target, type } = opts || {}
  if (!target) return
  const scrollDom: any = target
  const typeRef = type || 'y'
  const stop = toRef(opts, 'stop')
  const activeScroll = ref(stop.value !== false)

  const active = ref(0)
  const plusRef = toRef(opts, 'plus')
  const ing = () => {
    if (activeScroll.value) {
      active.value += plusRef.value
    }
    const sdSize = scrollDom[typeRef === 'y' ? 'clientHeight' : 'clientWidth']
    const sdScrollSize = scrollDom[typeRef === 'y' ? 'scrollHeight' : 'scrollWidth']
    if (activeScroll.value && Math.abs(sdSize + active.value - sdScrollSize) <= plusRef.value && active.value > 0) {
      setTimeout(() => {
        active.value = 0
      }, 500)
    }
    if (activeScroll.value) {
      scrollDom[typeRef === 'y' ? 'scrollTop' : 'scrollLeft'] = active.value
    }
    requestAnimationFrame(ing)
  }
  ing()
  scrollDom.onmouseenter = function () {
    activeScroll.value = false
  }
  scrollDom.onmouseleave = function () {
    activeScroll.value = true
  }

  return {}
}
