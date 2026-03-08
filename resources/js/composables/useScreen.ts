import { computed } from "vue"
import { useMediaQuery } from "@vueuse/core"

type ScreenSize = "sm" | "md" | "lg" | "xl" | "2xl"

const breakpoints: Record<ScreenSize, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export function useScreen() {
  const sm = useMediaQuery(`(max-width: ${breakpoints.sm - 1}px)`)
  const md = useMediaQuery(`(max-width: ${breakpoints.md - 1}px)`)
  const lg = useMediaQuery(`(max-width: ${breakpoints.lg - 1}px)`)
  const xl = useMediaQuery(`(max-width: ${breakpoints.xl - 1}px)`)
  const xxl = useMediaQuery(`(max-width: ${breakpoints["2xl"] - 1}px)`)

  function screenIs(size: ScreenSize) {
    switch (size) {
      case "sm":
        return sm.value
      case "md":
        return md.value
      case "lg":
        return lg.value
      case "xl":
        return xl.value
      case "2xl":
        return xxl.value
    }
  }

  const screenIsMobile = computed(() => sm.value)

  return {
    screenIs,
    screenIsMobile,
  }
}
