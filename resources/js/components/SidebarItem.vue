<script setup lang="ts">
import { ref, watch } from "vue"
import { Plus, type LucideIcon } from "lucide-vue-next"

const props = defineProps<{
  icon: LucideIcon
  label: string
  collapsed: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

const open = ref(false)

function toggle() {
  emit("click")

  if (!props.collapsed) {
    open.value = !open.value
  }
}

watch(
  () => props.collapsed,
  (val) => {
    if (val) open.value = false
  },
)
</script>

<template>
  <div>
    <!-- Header -->
    <div
      class="flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 group"
      :title="label"
      @click="toggle"
    >
      <component :is="icon" class="w-5 h-5 shrink-0" />

      <div
        class="flex w-full justify-between items-center transition-all duration-300 overflow-hidden"
        :class="collapsed ? 'opacity-0 -ml-2' : 'opacity-100 ml-0'"
      >
        <span class="truncate">
          {{ label }}
        </span>

        <Plus
          class="text-neutral-500 w-4 h-4 group-hover:text-foreground transition-transform duration-300"
          :class="open ? 'rotate-45' : ''"
        />
      </div>
    </div>

    <!-- Panel -->
    <div
      class="overflow-hidden transition-[max-height] duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]"
      :class="open && !collapsed ? 'max-h-max mt-2' : 'max-h-0'"
    >
      <div
        class="p-2 transition-all duration-200"
        :class="
          open && !collapsed
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-1 pointer-events-none'
        "
      >
        <slot />
      </div>
    </div>
  </div>
</template>
