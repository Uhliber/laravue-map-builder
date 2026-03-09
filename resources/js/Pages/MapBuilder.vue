<script setup lang="ts">
import { computed, reactive, onMounted, ref, watch, nextTick } from "vue"
import { debounce } from "lodash-es"
import { toast } from "vue-sonner"

import { useMapPointerDrag } from "@/composables/useMapPointerDrag"

import ThemeToggle from "@/components/ThemeToggle.vue"
import Button from "@/components/ui/button/Button.vue"
import BuilderLayout from "@/Layouts/BuilderLayout.vue"
import Sidebar from "@/components/Sidebar.vue"
import SidebarItem from "@/components/SidebarItem.vue"

import {
  Layers,
  Map,
  MapPin,
  MessageSquareMore,
  MinusIcon,
  PlusIcon,
  Trash,
} from "lucide-vue-next"
import { Head, router } from "@inertiajs/vue3"

import { useAssetsStore } from "@/stores/assets"
import { MapAsset, MapPointer } from "@/types"
import ButtonGroup from "@/components/ui/button-group/ButtonGroup.vue"
import Switch from "@/components/ui/switch/Switch.vue"
import { useScreen } from "@/composables/useScreen"
import TooltipSettingsDialog from "@/components/TooltipSettingsDialog.vue"

const assetsStore = useAssetsStore()
const { screenIsMobile } = useScreen()

const formData = reactive({
  base: null as null | {
    id: string
    src: string
  },

  pointers: [] as MapPointer[],
})

const sidebarOpen = ref(true)
const openSections = ref<string[]>([])

const activeBaseMap = ref<MapAsset | null>(null)
const mapPointers = reactive<Record<string, MapPointer>>({})

const mapContainer = ref<HTMLElement | null>(null)

const selectedPointerId = ref<string | null>(null)

const tooltipDialogOpen = ref(false)

const selectedPointer = computed(() =>
  selectedPointerId.value ? mapPointers[selectedPointerId.value] : null,
)

const allAssets = computed<MapAsset[]>(() => [
  ...assetsStore.baseAssets,
  ...assetsStore.pointerAssets,
])

const sortedPointers = computed(() => {
  const list = Object.values(mapPointers)

  return list.sort((a, b) => {
    if (a.id === selectedPointerId.value) return 1
    if (b.id === selectedPointerId.value) return -1
    return 0
  })
})

const { startDrag, clampPointerPosition } = useMapPointerDrag(
  mapContainer,
  mapPointers,
  allAssets,
)

const baseElements = computed(() => assetsStore.baseAssets)
const pointerSubcategories = computed(() => assetsStore.pointerSubcategories)

const pointerAtMax = computed(() => {
  if (!selectedPointer.value) return true
  return (selectedPointer.value.width ?? 8) >= 24
})

const pointerAtMin = computed(() => {
  if (!selectedPointer.value) return true
  return (selectedPointer.value.width ?? 8) <= 4
})

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

const debouncedSave = debounce(saveToLocalStorage, 300)

watch(sidebarOpen, (open) => {
  if (!open) openSections.value = []
})

watch(
  mapPointers,
  () => {
    formData.pointers = Object.values(mapPointers)
  },
  { deep: true },
)

watch(formData, () => debouncedSave(), { deep: true })

onMounted(() => {
  assetsStore.fetchAssets()

  nextTick(() => {
    loadFromLocalStorage()
    openSections.value = ["Base", "Pointers"]
  })
})

const STORAGE_KEY = "map-builder-formdata"

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
}

function loadFromLocalStorage() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return

  try {
    const parsed = JSON.parse(raw)

    if (parsed?.base) formData.base = parsed.base
    if (parsed?.pointers) formData.pointers = parsed.pointers

    /**
     * Restore workspace state
     */
    if (parsed?.base) {
      const baseAsset = assetsStore.baseAssets.find(
        (a) => a.id === parsed.base.id,
      )

      if (baseAsset) activeBaseMap.value = baseAsset
    }

    if (parsed?.pointers) {
      parsed.pointers.forEach((p: MapPointer) => {
        mapPointers[p.id] = p
      })
    }
  } catch {
    console.warn("Failed loading builder state")
  }
}

function setBaseMap(asset: MapAsset): void {
  activeBaseMap.value = asset

  formData.base = {
    id: asset.id,
    src: asset.src,
  }
}

function clearSelection() {
  selectedPointerId.value = null
}

function handleWorkspaceClick(event: MouseEvent) {
  const target = event.target as HTMLElement

  if (target.closest(".map-pointer")) {
    return
  }

  selectedPointerId.value = null
}

function ensurePointerDefaults(pointer: MapPointer) {
  if (pointer.width == null) pointer.width = 8
  if (pointer.height == null) pointer.height = 8
  if (!pointer.trigger) pointer.trigger = "disabled"
}

function toggleAnimate(pointer: MapPointer, val: boolean) {
  pointer.animate = val
}

function toggleTooltip(pointer: MapPointer, val: boolean) {
  pointer.trigger = val ? "hover" : "disabled"
}

function increasePointerSize(pointer: MapPointer) {
  pointer.width = Math.min((pointer.width ?? 8) + 2, 24)
  pointer.height = Math.min((pointer.height ?? 8) + 2, 24)

  clampPointerPosition(pointer)
}

function decreasePointerSize(pointer: MapPointer) {
  pointer.width = Math.max((pointer.width ?? 8) - 2, 4)
  pointer.height = Math.max((pointer.height ?? 8) - 2, 4)

  clampPointerPosition(pointer)
}

function removePointer(pointerId: string) {
  if (!mapPointers[pointerId]) return

  delete mapPointers[pointerId]

  if (selectedPointerId.value === pointerId) {
    selectedPointerId.value = null
  }
}

function saveMap() {
  if (!formData.base) {
    toast.error("Base map required", {
      description: "Select a base map before saving.",
      class:
        "border border-destructive/30 shadow-md dark:!border-destructive/40 dark:!bg-neutral-800",
    })
    return
  }

  if (!formData.pointers.length) {
    toast.error("Pointer required", {
      description: "Add at least one pointer before saving.",
      class:
        "border border-destructive/30 shadow-md dark:!border-destructive/40 dark:!bg-neutral-800",
    })
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
  router.post("/maps", formData, {
    preserveState: true,
    preserveScroll: true,
    only: [],
    onSuccess: (page) => {
      toast.success("Map saved", {
        description: "Your map configuration was stored locally.",
        class:
          "border border-primary/30 shadow-md dark:!border-primary/40 dark:!bg-neutral-800",
      })

      // clear draft only after successful save
      localStorage.removeItem(STORAGE_KEY)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapId = (page.props as any)?.map_id

      if (mapId) {
        router.visit(`/map-preview/${mapId}`)
      }
    },
  })
}

function handlePreview() {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    toast.error("Nothing to preview", {
      description: "Build your map first before opening preview.",
      class:
        "border border-destructive/30 shadow-md dark:!border-destructive/40 dark:!bg-neutral-800",
    })
    return
  }

  try {
    const parsed = JSON.parse(raw)

    if (!parsed?.base || !parsed?.pointers?.length) {
      toast.error("Map is empty", {
        description:
          "Please add a base map and at least one pointer before preview.",
        class:
          "border border-destructive/30 shadow-md dark:!border-destructive/40 dark:!bg-neutral-800",
      })
      return
    }

    saveToLocalStorage()
    router.get("/map-preview")
  } catch {
    toast.error("Preview error", {
      description: "Saved map data is corrupted.",
      class:
        "border border-destructive/30 shadow-md dark:!border-destructive/40 dark:!bg-neutral-800",
    })
  }
}

function openTooltipSettings() {
  if (!selectedPointer.value) return
  tooltipDialogOpen.value = true
}

function updatePointerTooltip(data: MapPointer) {
  if (!selectedPointer.value) return

  Object.assign(selectedPointer.value, data)
}
</script>

<template>
  <Head title="Builder" />

  <BuilderLayout>
    <template #actions>
      <ThemeToggle />

      <div class="flex gap-4">
        <Button variant="outline" @click="handlePreview"> Preview </Button>
        <Button @click="saveMap">Save</Button>
      </div>
    </template>

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
        @click.self="clearSelection"
      >
        <div
          ref="mapContainer"
          class="relative w-full h-fit max-w-[780px] select-none"
          @click="handleWorkspaceClick"
        >
          <img
            v-if="activeBaseMap"
            :src="activeBaseMap?.src"
            class="w-full h-auto rounded-lg aspect-square border block"
            draggable="false"
          />
          <div
            v-else
            class="grid justify-center items-center bg-neutral-100 dark:bg-neutral-800/30 w-full h-auto rounded-lg aspect-square border"
          >
            <div
              class="pointer-events-none absolute inset-4 rounded-md border-2 border-dashed border-neutral-300/30 dark:border-neutral-800"
            ></div>
            <div
              v-if="!Object.values(mapPointers).length"
              class="max-w-md p-6 sm:p-16 text-center"
            >
              <h1 class="font-bold text-muted-foreground text-sm sm:text-base">
                Start Building Your Map
              </h1>
              <p class="mt-2 text-muted-foreground/70 text-xs sm:text-sm">
                To begin, select a base map from the sidebar. Once your base is
                set, drag pointers onto the map to mark locations.
              </p>
              <p class="mt-2 text-muted-foreground/70 text-xs sm:text-sm">
                Click a pointer to customize it. You can adjust its size, enable
                animations, and configure a tooltip to add helpful information
                or links for your users.
              </p>
            </div>
          </div>
          <div
            v-for="pointer in sortedPointers"
            :key="pointer.id"
            :class="[
              'absolute map-pointer',
              selectedPointerId === pointer.id
                ? 'z-[40] ring-2 ring-primary'
                : 'z-[10]',
            ]"
            :style="{
              left: pointer.x + '%',
              top: pointer.y + '%',
              width: (pointer.width ?? 6) + '%',
              height: (pointer.height ?? 6) + '%',
            }"
            draggable="true"
            @mousedown="(e) => startDrag(pointer.id, e)"
            @mouseup="
              () => {
                selectedPointerId = pointer.id
                ensurePointerDefaults(pointer)
              }
            "
          >
            <img :src="pointer.src" class="w-full h-full" />
          </div>
          <div
            v-if="selectedPointer"
            class="absolute z-[30] pointer-events-none"
            :style="{
              left: selectedPointer.x + '%',
              top: selectedPointer.y + '%',
              transform: `translateX(${-(screenIsMobile ? 40 : 60) + (selectedPointer.width ?? 8) * 1.3}%) translatey(${screenIsMobile ? (selectedPointer.height ?? 8) * 4.5 : -50}%)`,
            }"
          >
            <div
              class="grid items-center justify-items-end gap-2 pb-2 pointer-events-auto"
            >
              <!-- Toolbar -->
              <ButtonGroup @click.stop>
                <ButtonGroup
                  :orientation="screenIsMobile ? 'vertical' : 'horizontal'"
                  aria-label="Pointer controls"
                >
                  <Button variant="dull" size="sm">
                    Animate
                    <Switch
                      class="w-7 h-4"
                      :model-value="selectedPointer.animate ?? false"
                      @update:model-value="
                        toggleAnimate(selectedPointer, $event)
                      "
                    />
                  </Button>
                  <Button variant="dull" size="sm">
                    Tooltip
                    <Switch
                      class="w-7 h-4"
                      :model-value="selectedPointer.trigger !== 'disabled'"
                      @update:model-value="
                        toggleTooltip(selectedPointer, $event)
                      "
                    />
                  </Button>
                  <Button
                    v-if="!screenIsMobile"
                    variant="outline"
                    size="icon-sm"
                    title="Open Tooltip Setting"
                    :disabled="selectedPointer.trigger === 'disabled'"
                    @click="openTooltipSettings"
                  >
                    <MessageSquareMore
                      :class="{
                        'tooltip-attention':
                          selectedPointer.trigger !== 'disabled',
                      }"
                    />
                  </Button>
                </ButtonGroup>
                <ButtonGroup v-if="!screenIsMobile">
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    aria-label="Remove Pointer"
                    title="Remove Pointer"
                    @click="removePointer(selectedPointer.id)"
                  >
                    <Trash />
                  </Button>
                </ButtonGroup>
              </ButtonGroup>

              <ButtonGroup
                :orientation="screenIsMobile ? 'horizontal' : 'vertical'"
                aria-label="Pointer controls"
                class="h-fit"
                @click.stop
              >
                <Button
                  v-if="screenIsMobile"
                  variant="outline"
                  size="icon-sm"
                  title="Open Tooltip Setting"
                  :disabled="selectedPointer.trigger === 'disabled'"
                  @click="openTooltipSettings"
                >
                  <MessageSquareMore
                    :class="{
                      'tooltip-attention':
                        selectedPointer.trigger !== 'disabled',
                    }"
                  />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  title="Increase Pointer Size"
                  :disabled="pointerAtMax"
                  @click="increasePointerSize(selectedPointer)"
                >
                  <PlusIcon />
                </Button>

                <Button
                  variant="outline"
                  size="icon-sm"
                  title="Decrease Pointer Size"
                  :disabled="pointerAtMin"
                  @click="decreasePointerSize(selectedPointer)"
                >
                  <MinusIcon />
                </Button>

                <Button
                  v-if="screenIsMobile"
                  variant="destructive"
                  size="icon-sm"
                  aria-label="Remove Pointer"
                  title="Remove Pointer"
                  @click="removePointer(selectedPointer.id)"
                >
                  <Trash />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </main>
    </div>
    <TooltipSettingsDialog
      v-model:open="tooltipDialogOpen"
      :pointer="selectedPointer"
      @save="updatePointerTooltip"
    />
  </BuilderLayout>
</template>
