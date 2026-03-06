import { ref, onMounted, onUnmounted, nextTick } from "vue"

type ScreenSize = "sm" | "md" | "lg" | "xl" | "2xl"

const breakpoints: Record<ScreenSize, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export function useScreen(debounceMs = 120) {
  const width = ref(window.innerWidth)

  let resizeTimeout: number | null = null

  function handleResize() {
    if (resizeTimeout) clearTimeout(resizeTimeout)

    resizeTimeout = window.setTimeout(() => {
      width.value = window.innerWidth
    }, debounceMs)
  }

  function screenIs(size: ScreenSize) {
    return width.value < breakpoints[size]
  }

  function screenIsMobile() {
    return width.value < breakpoints.sm
  }

  onMounted(async () => {
    await nextTick()
    width.value = window.innerWidth
    window.addEventListener("resize", handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize)
    if (resizeTimeout) clearTimeout(resizeTimeout)
  })

  return {
    width,
    screenIs,
    screenIsMobile,
  }
}
