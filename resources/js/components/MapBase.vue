<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import type { MapPointer as PointerType } from "@/types"
import MapPointer from "@/components/MapPointer.vue"

const isResizing = ref(false)
let resizeTimeout: number | null = null

const POINTER_BASE_SIZE = 180

const emit = defineEmits<{
  "map-loaded": [boolean]
}>()

const props = defineProps<{
  mapImage: string
  pointers: PointerType[]
}>()

const mapContainer = ref<HTMLDivElement | null>(null)

/**
 * Map loading state ⭐
 */
const mapLoaded = ref(false)

const mapWidth = ref(0)
const mapHeight = ref(0)

const naturalMapSize = ref({
  width: 500,
  height: 500,
})

const mapPointers = computed(() =>
  props.pointers.filter((p) => p.x !== null && p.y !== null),
)

/**
 * Detect map container size
 */
onMounted(() => {
  if (!mapContainer.value) return

  const observer = new ResizeObserver(() => {
    isResizing.value = true

    if (mapContainer.value) {
      mapWidth.value = mapContainer.value.clientWidth
      mapHeight.value = mapContainer.value.clientHeight
    }

    if (resizeTimeout) clearTimeout(resizeTimeout)

    resizeTimeout = window.setTimeout(() => {
      isResizing.value = false
    }, 150)
  })

  observer.observe(mapContainer.value)
})

/**
 * Capture real map image intrinsic dimension
 */
function handleMapLoad(event: Event) {
  const img = event.target as HTMLImageElement

  naturalMapSize.value = {
    width: img.naturalWidth,
    height: img.naturalHeight,
  }

  mapLoaded.value = true

  emit("map-loaded", true)
}

/**
 * Pointer rendering math
 */
function pointerStyle(pointer: PointerType) {
  if (pointer.x === null || pointer.y === null)
    return {
      left: "0px",
      top: "0px",
      width: "0px",
      height: "0px",
    }

  const scaleX = mapWidth.value / naturalMapSize.value.width
  const scaleY = mapHeight.value / naturalMapSize.value.height

  const size = POINTER_BASE_SIZE * ((scaleX + scaleY) / 2)

  return {
    left: `${pointer.x * scaleX}px`,
    top: `${pointer.y * scaleY}px`,
    width: `${size}px`,
    height: `${size}px`,
  }
}
</script>

<template>
  <div ref="mapContainer" class="relative w-full select-none">
    <!-- Base Map -->
    <img
      :src="mapImage"
      class="w-full h-auto rounded-lg border block"
      @load="handleMapLoad"
    />

    <!-- Pointer Layer ⭐ only show after map is loaded -->
    <div v-if="mapLoaded" class="absolute inset-0 pointer-events-none">
      <MapPointer
        v-for="pointer in mapPointers"
        :key="pointer.id"
        :pointer="pointer"
        :is-resizing="isResizing"
        :pointer-style="pointerStyle(pointer)"
      />
    </div>
  </div>
</template>
