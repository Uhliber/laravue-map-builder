<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { useScreen } from "@/composables/useScreen"
import {
  useFloating,
  autoUpdate,
  offset,
  shift,
  flip,
  arrow as arrowMiddleware,
} from "@floating-ui/vue"

import type { MapPointer } from "@/types"
import MapPointerContent from "@/components/MapPointerContent.vue"

const props = withDefaults(
  defineProps<{
    pointer: MapPointer
    pointerStyle: Record<string, string | number>
    isResizing?: boolean
  }>(),
  {
    isResizing: false,
  },
)

const arrow = ref<HTMLElement | null>(null)

const pointerAssetPath = () =>
  `/images/pointers/${props.pointer.category}/${props.pointer.id}.${props.pointer.fileType}`

const { screenIsMobile } = useScreen()
const isMobile = screenIsMobile

const open = ref(false)
let hoverTimeout: number | null = null

const reference = ref<HTMLElement | null>(null)
const floating = ref<HTMLElement | null>(null)

const { floatingStyles, middlewareData, placement } = useFloating(
  reference,
  floating,
  {
    placement: props.pointer.placement ?? "top",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(props.pointer.offset ?? 10),
      flip(),
      shift(),
      arrowMiddleware({ element: arrow }),
    ],
  },
)

const arrowStyle = computed(() => {
  const side = placement.value.split("-")[0]

  const opposite: Record<string, string> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  }

  const { x, y } = middlewareData.value.arrow ?? {}

  return {
    left: x != null ? `${x}px` : "",
    top: y != null ? `${y}px` : "",
    [opposite[side]]: "-6px",
  }
})

const floatingClass = computed(() => {
  const side = placement.value.split("-")[0]

  switch (side) {
    case "top":
      return "-translate-x-8 origin-bottom"

    case "bottom":
      return "-translate-x-8 origin-top"

    case "left":
      return "translate-y-4 origin-right"

    case "right":
      return "translate-y-4 origin-left"

    default:
      return "origin-center"
  }
})

const trigger = computed(() => {
  if (props.pointer.trigger === "disabled") return "disabled"

  if (isMobile.value) {
    if (props.pointer.trigger === "hover" || props.pointer.trigger === "always")
      return "click"

    return props.pointer.trigger ?? "click"
  }

  return props.pointer.trigger ?? "hover"
})

const popoverVisible = computed(() => {
  if (trigger.value === "disabled") return false
  if (trigger.value === "always") return true
  return open.value
})

let scrollUnlockTimeout: number | null = null

watch(popoverVisible, (val) => {
  if (!isMobile.value) return

  if (scrollUnlockTimeout) {
    clearTimeout(scrollUnlockTimeout)
    scrollUnlockTimeout = null
  }

  if (val) {
    document.body.style.overflow = "hidden"
  } else {
    scrollUnlockTimeout = window.setTimeout(() => {
      document.body.style.overflow = ""
    }, 250)
  }
})

function showPopover() {
  if (trigger.value !== "hover") return

  if (hoverTimeout) clearTimeout(hoverTimeout)

  hoverTimeout = window.setTimeout(() => {
    open.value = true
  }, 120)
}

function hidePopover() {
  if (trigger.value !== "hover") return

  if (hoverTimeout) clearTimeout(hoverTimeout)

  hoverTimeout = window.setTimeout(() => {
    open.value = false
  }, 120)
}

function togglePopover() {
  if (trigger.value !== "click") return
  open.value = !open.value
}

function closeMobile() {
  open.value = false
}

watch(
  () => props.pointer.id,
  () => {
    open.value = false
  },
)
</script>

<template>
  <div
    ref="reference"
    class="absolute cursor-pointer select-none pointer-events-auto group"
    :class="[
      isResizing
        ? '!transition-none !duration-0'
        : 'transition-all duration-200 ease-out',
      trigger === 'always' && pointer.animate ? 'hover:scale-[1.02]' : '',
    ]"
    :style="pointerStyle"
    @mouseenter="showPopover"
    @mouseleave="hidePopover"
    @click="togglePopover"
  >
    <!-- Pointer Image -->
    <img
      :src="pointerAssetPath()"
      class="w-full h-full"
      :class="[
        !pointer.animate
          ? '!transition-none !duration-0'
          : 'transition-all duration-200 ease-out transform group-hover:scale-105 group-hover:rotate-2',
      ]"
      draggable="false"
    />

    <!-- DESKTOP POPOVER -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <div
        v-if="popoverVisible && !isMobile"
        ref="floating"
        :style="floatingStyles"
        :class="[floatingClass, 'z-50 min-w-[180px]']"
      >
        <!-- Arrow -->
        <div
          ref="arrow"
          :style="arrowStyle"
          class="absolute z-[1] w-3 h-3 rotate-45 bg-white dark:bg-neutral-800"
        ></div>

        <!-- Content -->
        <MapPointerContent
          :title="pointer.title || pointer.name"
          :description="pointer.description"
          :link="pointer.link"
          :target="pointer.target"
        />
      </div>
    </Transition>
  </div>

  <!-- MOBILE POPOVER -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-250 ease-out"
      enter-from-class="opacity-0 translate-y-6"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-y-6"
    >
      <div v-if="popoverVisible && isMobile">
        <!-- backdrop -->
        <div
          class="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[998]"
          @click="closeMobile"
        />

        <div
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] w-[92vw] max-w-sm"
        >
          <MapPointerContent
            :title="pointer.title || pointer.name"
            :description="pointer.description"
            :link="pointer.link"
            :target="pointer.target"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
