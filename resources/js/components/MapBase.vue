<script setup lang="ts">
import { ref, computed } from "vue"
import type { MapBaseAsset, MapPointer as PointerType } from "@/types"
import MapPointer from "@/components/MapPointer.vue"

const emit = defineEmits<{
  "map-loaded": [boolean]
}>()

const props = defineProps<{
  mapImage: MapBaseAsset
  pointers: PointerType[]
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
const mapLoaded = ref(false)

const mapPointers = computed(() =>
  props.pointers.filter((p) => p.x !== null && p.y !== null),
)

function handleMapLoad() {
  mapLoaded.value = true
  emit("map-loaded", true)
}

function pointerStyle(pointer: PointerType) {
  return {
    left: `${pointer.x}%`,
    top: `${pointer.y}%`,
    width: `${pointer.width}%`,
    height: `${pointer.height}%`,
  }
}
</script>

<template>
  <div ref="mapContainer" class="relative w-full select-none">
    <div class="relative w-full inline-block">
      <!-- Base Map -->
      <img
        :src="mapImage.src"
        class="w-full h-auto rounded-lg border block"
        @load="handleMapLoad"
      />

      <!-- Pointer Layer -->
      <div
        v-if="mapLoaded"
        class="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <MapPointer
          v-for="pointer in mapPointers"
          :key="pointer.id"
          :pointer="pointer"
          :pointer-style="pointerStyle(pointer)"
        />
      </div>
    </div>
  </div>
</template>
