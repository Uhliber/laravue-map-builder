<script setup lang="ts">
import { computed } from "vue"

const emit = defineEmits<{
  "update:checked": [boolean]
}>()

const props = defineProps<{
  checked: boolean
  value?: string | number
}>()

const proxyChecked = computed({
  get() {
    return props.checked
  },

  set(val: boolean) {
    emit("update:checked", val)
  },
})
</script>

<template>
  <input
    type="checkbox"
    :value="value"
    v-model="proxyChecked"
    class="rounded border-input text-primary focus:ring-primary focus:ring-offset-2 transition"
  />
</template>
