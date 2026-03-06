<script setup lang="ts">
import { ChevronRightCircleIcon } from "lucide-vue-next"

defineProps<{
  title?: string
  description?: string
  link?: string
  target?: string
}>()
</script>

<template>
  <component
    :is="link ? 'a' : 'div'"
    :href="link || undefined"
    :target="target || '_self'"
    class="flex gap-2 w-full bg-white dark:bg-neutral-800 shadow-xl rounded-xl p-3 text-sm border border-gray-200 dark:border-neutral-700 backdrop-blur-sm cursor-pointer hover:opacity-95 transition"
  >
    <div class="flex-1">
      <div class="font-semibold text-primary-700 dark:text-primary">
        {{ title }}
      </div>

      <div v-if="description" class="text-xs text-muted-foreground">
        {{ description }}
      </div>
    </div>

    <div v-if="link" class="grid items-end">
      <ChevronRightCircleIcon
        class="w-4 h-4 text-primary-700 dark:text-primary"
      />
    </div>
  </component>
</template>
