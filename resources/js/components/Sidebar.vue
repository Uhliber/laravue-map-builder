<script setup lang="ts">
import { ChevronLeft } from "lucide-vue-next"
import { computed, ref, watch } from "vue"
import Alert from "./ui/alert/Alert.vue"
import AlertTitle from "./ui/alert/AlertTitle.vue"
import AlertDescription from "./ui/alert/AlertDescription.vue"

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(["update:modelValue"])

const sidebarOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
})

const alertVisible = ref(false)

watch(
  () => sidebarOpen.value,
  (open) => {
    if (open) {
      setTimeout(() => {
        alertVisible.value = true
      }, 300)
    } else {
      alertVisible.value = false
    }
  },
  { immediate: true },
)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <aside
    class="h-full border-r bg-white dark:bg-neutral-900 relative flex flex-col transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]"
    :class="sidebarOpen ? 'w-80' : 'w-14'"
  >
    <!-- Toggle Button -->
    <button
      @click="toggleSidebar"
      class="absolute -right-3 top-6 z-20 w-6 h-6 rounded-full border bg-white dark:bg-neutral-800 flex items-center justify-center shadow transition hover:scale-110"
    >
      <ChevronLeft
        class="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]"
        :class="sidebarOpen ? 'rotate-0' : 'rotate-180'"
      />
    </button>

    <!-- Header -->
    <div
      class="p-4 font-semibold text-sm border-b flex items-center gap-3 overflow-hidden"
    >
      <slot name="header-icon" />

      <span
        class="whitespace-nowrap text-muted-foreground transition-all duration-300 overflow-hidden"
        :class="
          sidebarOpen
            ? 'opacity-100 max-w-[200px] translate-x-0'
            : 'opacity-0 max-w-0 -translate-x-2'
        "
      >
        <slot name="header-label" />
      </span>
    </div>
    <div v-if="alertVisible" class="p-4 transition-opacity duration-200">
      <Alert>
        <AlertTitle class="text-destructive">Demo Mode</AlertTitle>
        <AlertDescription>
          Custom asset uploads are disabled in Demo Mode due to limited storage.
          You may select from the available base maps and pointers.
        </AlertDescription>
      </Alert>
    </div>

    <!-- Menu -->
    <div
      class="flex flex-col p-2 text-sm transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] gap-2 overflow-y-auto"
    >
      <slot />
    </div>
  </aside>
</template>
