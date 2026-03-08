<script setup lang="ts">
import { ref, onMounted } from "vue"
import { router } from "@inertiajs/vue3"
import { MapFormData } from "@/types"

const STORAGE_KEY = "map-builder-formdata"

const previewData = ref<MapFormData>()

function loadPreview() {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    router.visit("/map-builder")
    return
  }

  try {
    const parsed = JSON.parse(raw)

    if (!parsed || Object.keys(parsed).length === 0) {
      router.visit("/map-builder")
      return
    }

    previewData.value = parsed
  } catch {
    router.visit("/map-builder")
  }
}

onMounted(() => {
  loadPreview()
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-6">
    <div class="w-full max-w-5xl">
      <h1 class="text-xl font-semibold mb-4">Map Preview</h1>

      <div
        class="border rounded-lg p-4 bg-muted/30 font-mono text-sm overflow-auto max-h-[80vh]"
      >
        <pre v-if="previewData"
          >{{ JSON.stringify(previewData, null, 2) }}
        </pre>

        <p v-else class="text-muted-foreground">Loading preview...</p>
      </div>
    </div>
  </div>
</template>
