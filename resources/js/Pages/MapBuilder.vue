<script setup lang="ts">
import { computed, reactive, onMounted, ref, watch, nextTick } from "vue"
import { useMapPointerDrag } from "@/composables/useMapPointerDrag"

import BuilderLayout from "@/Layouts/BuilderLayout.vue"
import Sidebar from "@/components/Sidebar.vue"
import SidebarItem from "@/components/SidebarItem.vue"

import { Layers, Map, MapPin } from "lucide-vue-next"
import { Head } from "@inertiajs/vue3"

import { useAssetsStore } from "@/stores/assets"
import { MapAsset, MapPointer } from "@/types"

const assetsStore = useAssetsStore()

const sidebarOpen = ref(true)
const openSections = ref<string[]>([])

const activeBaseMap = ref<MapAsset | null>(null)
const mapPointers = reactive<Record<string, MapPointer>>({})

const mapContainer = ref<HTMLElement | null>(null)

const allAssets = computed<MapAsset[]>(() => [
  ...assetsStore.baseAssets,
  ...assetsStore.pointerAssets,
])

const { startDrag } = useMapPointerDrag(mapContainer, mapPointers, allAssets)

const baseElements = computed(() => assetsStore.baseAssets)
const pointerSubcategories = computed(() => assetsStore.pointerSubcategories)

function toggleSection(section: string): void {
  if (!sidebarOpen.value) {
    sidebarOpen.value = true

    nextTick(() => {
      if (!openSections.value.includes(section)) {
        openSections.value.push(section)
      }
    })

    return
  }

  if (openSections.value.includes(section)) {
    openSections.value = openSections.value.filter((s) => s !== section)
  } else {
    openSections.value.push(section)
  }
}

watch(sidebarOpen, (open) => {
  if (!open) openSections.value = []
})

onMounted(() => {
  assetsStore.fetchAssets()
})

function setBaseMap(asset: MapAsset): void {
  activeBaseMap.value = asset
}
</script>

<template>
  <Head title="Builder" />

  <BuilderLayout>
    <div class="flex h-[calc(100vh-64px)] overflow-hidden">
      <!-- Sidebar -->
      <Sidebar v-model="sidebarOpen">
        <template #header-icon>
          <Layers class="w-5 h-5 shrink-0" />
        </template>

        <template #header-label> ELEMENTS </template>

        <SidebarItem
          :icon="Map"
          label="Base"
          :collapsed="!sidebarOpen"
          :open="openSections.includes('Base')"
          @click="toggleSection('Base')"
        >
          <div class="grid grid-cols-3 gap-2 px-2 pb-2">
            <img
              v-for="asset in baseElements ?? []"
              :key="asset.id"
              :src="asset.src"
              :alt="asset.name"
              class="border dark:border-neutral-600 rounded-md p-1 aspect-square cursor-grab hover:ring-2 hover:ring-primary-400 transition"
              @click="setBaseMap(asset)"
            />
          </div>
        </SidebarItem>

        <SidebarItem
          :icon="MapPin"
          label="Pointers"
          :collapsed="!sidebarOpen"
          :open="openSections.includes('Pointers')"
          @click="toggleSection('Pointers')"
        >
          <div
            v-for="(assets, subcategory) in pointerSubcategories ?? {}"
            :key="subcategory"
            class="mb-2"
          >
            <div class="text-[11px] uppercase text-muted-foreground px-1 mb-1">
              {{ subcategory }}
            </div>

            <div class="grid grid-cols-4 gap-2 px-1 pb-2">
              <img
                v-for="asset in assets"
                :key="asset.id"
                :src="asset.src"
                :alt="asset.name"
                class="border dark:border-neutral-600 rounded-md aspect-square p-1 cursor-grab hover:ring-2 hover:ring-primary-400 transition"
                draggable="true"
                @mousedown="(e) => startDrag(asset.id, e)"
              />
            </div>
          </div>
        </SidebarItem>
      </Sidebar>

      <!-- Workspace -->
      <main
        class="flex justify-center flex-1 bg-neutral-50 dark:bg-neutral-950 p-6 overflow-auto"
      >
        <div
          ref="mapContainer"
          class="relative w-full h-fit max-w-[780px] select-none"
        >
          <img
            v-if="activeBaseMap"
            :src="activeBaseMap?.src"
            class="w-full h-auto rounded-lg aspect-square border block"
            draggable="false"
          />
          <div
            v-else
            class="bg-neutral-100 dark:bg-neutral-800/30 w-full h-auto rounded-lg aspect-square border block"
          ></div>
          <div
            v-for="pointer in Object.values(mapPointers)"
            :key="pointer.id"
            class="absolute"
            :style="{
              left: pointer.x + '%',
              top: pointer.y + '%',
              width: (pointer.width ?? 6) + '%',
              height: (pointer.height ?? 6) + '%',
            }"
            draggable="true"
            @mousedown="(e) => startDrag(pointer.id, e)"
          >
            <img :src="pointer.src" class="w-full h-full min-w-max" />
          </div>
        </div>
      </main>
    </div>
  </BuilderLayout>
</template>
