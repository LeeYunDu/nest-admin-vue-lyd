import { onMounted, Ref, ref } from 'vue'

export type AnchorsParam = {
  elements?: HTMLElement[]
  selectors?: string
}

export type AnchorsRo = {
  element: Ref<HTMLElement>
  close: () => void
  initElements: () => void
}

export default function useAnchors(options: AnchorsParam) {
  const { elements, selectors } = options || {}
  const stop = ref<boolean>(false)
  const scroll = ref<boolean>(true)
  const times = ref<number>(0)
  const current = ref<HTMLElement>({} as HTMLElement)
  let uElements: Element[] = []

  onMounted(() => {
    initElements()
  })

  window.addEventListener('scroll', () => {
    initElements()
  })

  function initElements() {
    if (stop.value) return
    switch (true) {
      case elements && elements.length > 0:
        uElements = elements || []
        break
      case !!selectors:
        uElements = Array.from(document.querySelectorAll(String(selectors)))
        break
      default:
        break
    }
    if (uElements.length <= 0 && times.value < 3) {
      times.value++
      setTimeout(() => initElements(), 500)
      return
    }

    uElements.find((element: Element) => {
      const elementRect = element.getBoundingClientRect()
      const isElementVisible =
        (elementRect.top >= 0 &&
          elementRect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight)) ||
        (elementRect.top < 0 &&
          elementRect.bottom >
            (window.innerHeight || document.documentElement.clientHeight))

      if (isElementVisible) {
        current.value = element as HTMLElement
        return true
      }
    })
  }

  function scrollTo(target: HTMLElement = current.value) {
    if (scroll.value === false || !target) return

    window.scrollTo({
      top: target.offsetTop || 0,
      behavior: 'smooth'
    })
  }

  function close() {
    stop.value = true
  }

  function open() {
    stop.value = false
  }

  return {
    element: current,

    close,
    open,
    initElements,
    scrollTo
  }
}
