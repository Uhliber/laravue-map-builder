<script setup lang="ts">
import { ref, watch, computed } from "vue"
import { useFloating, autoUpdate, offset, shift, flip } from "@floating-ui/vue"
import { ChevronRightCircleIcon } from "lucide-vue-next"
import type { MapPointer } from "@/types"

const props = defineProps<{
  pointer: MapPointer
  pointerStyle: Record<string, string | number>
  isResizing?: boolean
  noAnimate?: boolean
}>()

const pointerAssetPath = () =>
  `/images/pointers/${props.pointer.category}/${props.pointer.id}.${props.pointer.fileType}`

const trigger = computed(() => props.pointer.trigger ?? "hover")

const open = ref(false)
let hoverTimeout: number | null = null

const reference = ref<HTMLElement | null>(null)
const floating = ref<HTMLElement | null>(null)

const { floatingStyles } = useFloating(reference, floating, {
  placement: props.pointer.placement ?? "top",
  whileElementsMounted: autoUpdate,
  middleware: [offset(props.pointer.offset ?? 2), flip(), shift()],
})

/**
 * Visibility Engine
 */
const popoverVisible = computed(() => {
  if (trigger.value === "disabled") return false
  if (trigger.value === "always") return true
  return open.value
})

/**
 * Interaction Controls
 */

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

/**
 * Cleanup on pointer change
 */
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
      trigger === 'always' && !noAnimate ? 'hover:scale-[1.02]' : '',
    ]"
    :style="pointerStyle"
    @mouseenter="showPopover"
    @mouseleave="hidePopover"
    @click="togglePopover"
  >
    <!-- Pointer Image -->
    <img
      :src="pointerAssetPath()"
      class="w-full h-full object-contain"
      :class="[
        noAnimate
          ? '!transition-none !duration-0'
          : 'transition-all duration-200 ease-out transform group-hover:scale-105 group-hover:rotate-2',
      ]"
      draggable="false"
    />

    <!-- Popover -->
    <Transition
      enter-active-class="transition duration-250 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95 translate-y-1"
    >
      <div
        v-if="popoverVisible"
        ref="floating"
        :style="floatingStyles"
        class="z-50 bg-white dark:bg-neutral-800 shadow-xl rounded-xl p-3 text-sm min-w-[180px] border border-gray-200 dark:border-neutral-700 backdrop-blur-sm"
      >
        <div class="flex gap-2">
          <div class="flex-1">
            <div class="font-semibold text-primary">
              {{ pointer.title || pointer.name }}
            </div>

            <div
              v-if="pointer.description"
              class="text-xs text-muted-foreground"
            >
              {{ pointer.description }}
            </div>
          </div>
          <div class="grid items-end">
            <a
              v-if="pointer.link"
              :href="pointer.link"
              :target="pointer.target || '_self'"
              class="inline-flex items-center gap-1 text-primary text-xs hover:underline"
            >
              <ChevronRightCircleIcon class="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
