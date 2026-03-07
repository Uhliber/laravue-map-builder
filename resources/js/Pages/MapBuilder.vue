<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"
import BuilderLayout from "@/Layouts/BuilderLayout.vue"
import Sidebar from "@/components/Sidebar.vue"
import SidebarItem from "@/components/SidebarItem.vue"

import { Layers, Map, MapPin } from "lucide-vue-next"
import { Head } from "@inertiajs/vue3"

import { useAssetsStore } from "@/stores/assets"

const assetsStore = useAssetsStore()

const sidebarOpen = ref(true)
const openSections = ref<string[]>([])

onMounted(() => {
  assetsStore.fetchAssets()
})

const baseElements = computed(() => assetsStore.baseAssets)
const pointerSubcategories = computed(() => assetsStore.pointerSubcategories)

function toggleSection(section: string): void {
  if (!sidebarOpen.value) sidebarOpen.value = true

  if (openSections.value.includes(section)) {
    openSections.value = openSections.value.filter((s) => s !== section)
  } else {
    openSections.value.push(section)
  }
}

watch(sidebarOpen, (open) => {
  if (!open) openSections.value = []
})
</script>

<template>
  <Head title="Builder" />
  <BuilderLayout>
    <div class="flex h-[calc(100vh-64px)] overflow-hidden">
      <Sidebar v-model="sidebarOpen">
        <template #header-icon>
          <Layers class="w-5 h-5 shrink-0" />
        </template>

        <template #header-label> ELEMENTS </template>

        <!-- Base -->
        <SidebarItem
          :icon="Map"
          label="Base"
          :collapsed="!sidebarOpen"
          @click="toggleSection('Base')"
        >
          <div class="grid grid-cols-3 gap-2 px-2 pb-2">
            <img
              v-for="asset in baseElements"
              :key="asset.id"
              :src="asset.src"
              :alt="asset.name"
              class="border dark:border-neutral-600 rounded-md p-1 aspect-square cursor-pointer hover:ring-2 hover:ring-offset-1 dark:hover:ring-primary/80 hover:ring-primary-400 transition"
            />
          </div>
        </SidebarItem>

        <!-- Pointers -->
        <SidebarItem
          :icon="MapPin"
          label="Pointers"
          :collapsed="!sidebarOpen"
          @click="toggleSection('Pointers')"
        >
          <div
            v-for="(assets, subcategory) in pointerSubcategories"
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
                class="border dark:border-neutral-600 rounded-md aspect-square p-1 cursor-pointer hover:ring-2 hover:ring-offset-1 dark:hover:ring-primary/80 hover:ring-primary-400 transition"
              />
            </div>
          </div>
        </SidebarItem>
      </Sidebar>

      <!-- Main Workspace -->
      <main
        class="flex-1 bg-neutral-50 dark:bg-neutral-950 p-6 overflow-auto"
      ></main>
    </div>
  </BuilderLayout>
</template>
