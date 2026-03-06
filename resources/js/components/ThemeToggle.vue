<script setup lang="ts">
import { computed, onMounted } from "vue"
import { Sun, Moon } from "lucide-vue-next"
import { useThemeStore } from "@/stores/theme"

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.hydrateTheme()
})

const isDark = computed(() => {
  if (themeStore.theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  }

  return themeStore.theme === "dark"
})

const toggleTheme = () => {
  themeStore.setTheme(isDark.value ? "light" : "dark")
}
</script>

<template>
  <button
    @click="toggleTheme"
    class="p-2 w-max transition hover:opacity-80"
    aria-label="Toggle theme"
  >
    <Sun v-if="!isDark" :size="20" />
    <Moon v-else :size="20" />
  </button>
</template>
