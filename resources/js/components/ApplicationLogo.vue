<script setup lang="ts">
import { MapPinPen } from "lucide-vue-next"
import { computed } from "vue"
import Badge from "./ui/badge/Badge.vue"

type Direction = "vertical" | "horizontal"

const props = withDefaults(
  defineProps<{
    direction?: Direction
  }>(),
  {
    direction: "vertical",
  },
)

const directionClass = computed(() => {
  switch (props.direction) {
    case "vertical":
      return "grid"
    case "horizontal":
      return "flex gap-2"
  }
})
</script>

<template>
  <div :class="['w-max justify-center items-center', directionClass]">
    <div class="flex gap-2 items-center font-bebas text-4xl text-primary">
      Map Builder
      <MapPinPen class="text-primary w-7 h-7 mb-1" />
    </div>
    <Badge
      variant="destructive"
      class="w-min h-min mx-auto rounded-full uppercase"
    >
      Prototype
    </Badge>
  </div>
</template>
