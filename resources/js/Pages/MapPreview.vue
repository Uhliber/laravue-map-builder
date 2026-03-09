<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Head, router, usePage } from "@inertiajs/vue3"
import { MapFormData, MapPreview } from "@/types"
import MapBase from "@/components/MapBase.vue"
import ThemeToggle from "@/components/ThemeToggle.vue"
import {
  CornerDownLeft,
  Fullscreen,
  LayoutGrid,
  LayoutPanelLeft,
} from "lucide-vue-next"

const STORAGE_KEY = "map-builder-formdata"

const page = usePage()

const previewData = ref<MapFormData | null>(null)
const backendMap = page.props.map as MapPreview | undefined

const layout = ref<"hero" | "split" | "fullscreen">("hero")

function setLayout(l: "hero" | "split" | "fullscreen") {
  layout.value = l
}

function loadPreview() {
  // CASE 1 - Backend preview (/map-preview/{id})

  if (backendMap) {
    previewData.value = {
      base: { src: backendMap.base_src },
      pointers: backendMap.pointers,
    }
    return
  }

  // CASE 2 - Draft preview (/map-preview)
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

onMounted(loadPreview)
</script>

<template>
  <Head title="Map Preview" />

  <div class="min-h-screen bg-background flex flex-col relative">
    <!-- Floating Layout Switcher -->
    <div
      class="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 bg-muted/40 backdrop-blur border rounded-xl p-2 shadow-lg"
    >
      <!-- Back to builder -->
      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition"
        @click="router.visit(backendMap ? '/dashboard' : '/map-builder')"
      >
        <CornerDownLeft class="w-5 h-5" />
      </button>

      <div class="h-px bg-border"></div>

      <!-- Layout 1 -->
      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition"
        :class="{ 'bg-primary text-primary-foreground': layout === 'hero' }"
        @click="setLayout('hero')"
      >
        <LayoutGrid class="w-5 h-5" />
      </button>

      <!-- Layout 2 -->
      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition"
        :class="{ 'bg-primary text-primary-foreground': layout === 'split' }"
        @click="setLayout('split')"
      >
        <LayoutPanelLeft class="w-5 h-5" />
      </button>

      <!-- Layout 3 -->
      <button
        class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition"
        :class="{
          'bg-primary text-primary-foreground': layout === 'fullscreen',
        }"
        @click="setLayout('fullscreen')"
      >
        <Fullscreen class="w-5 h-5" />
      </button>

      <div class="h-px bg-border"></div>

      <ThemeToggle class="mx-auto" />
    </div>

    <!-- ================= HERO LAYOUT ================= -->
    <div
      v-if="layout === 'hero'"
      class="flex flex-col items-center px-6 py-10 gap-8"
    >
      <!-- Headline -->
      <div
        class="flex items-center justify-between w-full max-w-5xl mx-auto mb-6"
      >
        <div class="flex items-center space-x-3">
          <div class="h-10 w-10 bg-muted rounded-full"></div>
          <div class="flex flex-col">
            <div class="h-4 w-24 bg-muted/80 rounded"></div>
            <div class="h-3 w-16 bg-muted/60 rounded mt-1"></div>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="h-8 w-16 bg-muted/70 rounded"></div>
          <div class="h-8 w-16 bg-muted/60 rounded"></div>
          <div class="h-8 w-16 bg-muted/70 rounded"></div>
        </div>
      </div>

      <!-- Map Hero -->
      <div class="w-full max-w-5xl bg-card rounded-2xl border shadow-xl p-8">
        <MapBase
          v-if="previewData"
          class="w-full"
          :map-image="previewData.base"
          :pointers="previewData.pointers"
        />

        <div
          v-else
          class="aspect-square w-full rounded-xl bg-muted animate-pulse"
        />
      </div>

      <!-- Feature Row -->
      <div class="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
        <div
          v-for="i in 3"
          :key="i"
          class="h-36 rounded-xl border bg-muted/40"
        ></div>
      </div>
    </div>

    <!-- ================= SPLIT COLUMN LAYOUT ================= -->
    <div
      v-else-if="layout === 'split'"
      class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 px-10 py-20 items-center"
    >
      <!-- Marketing Column -->
      <div class="space-y-8">
        <div class="h-10 w-72 bg-muted rounded"></div>

        <div class="space-y-4">
          <div class="h-4 w-full bg-muted/60 rounded"></div>
          <div class="h-4 w-5/6 bg-muted/60 rounded"></div>
          <div class="h-4 w-2/3 bg-muted/60 rounded"></div>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-6">
          <div class="h-28 rounded-xl border bg-muted/40"></div>
          <div class="h-28 rounded-xl border bg-muted/40"></div>
          <div class="h-28 rounded-xl border bg-muted/40"></div>
          <div class="h-28 rounded-xl border bg-muted/40"></div>
        </div>
      </div>

      <!-- Map Feature -->
      <div class="bg-card rounded-2xl border shadow-xl p-6">
        <MapBase
          v-if="previewData"
          class="w-full"
          :map-image="previewData.base"
          :pointers="previewData.pointers"
        />

        <div
          v-else
          class="aspect-square w-full rounded-xl bg-muted animate-pulse"
        />
      </div>
    </div>

    <!-- ================= FULLSCREEN LAYOUT ================= -->

    <div
      v-else-if="layout === 'fullscreen'"
      class="relative w-screen h-screen overflow-y-auto bg-background"
    >
      <!-- Map -->
      <MapBase
        v-if="previewData"
        class="absolute object-cover"
        :map-image="previewData.base"
        :pointers="previewData.pointers"
      />
    </div>
  </div>
</template>
