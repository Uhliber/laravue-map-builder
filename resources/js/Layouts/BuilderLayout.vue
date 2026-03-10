<script setup lang="ts">
import { router, usePage } from "@inertiajs/vue3"
import { House } from "lucide-vue-next"

import "vue-sonner/style.css"
import { Toaster } from "vue-sonner"
import { computed } from "vue"
const page = usePage()
const isAuthenticated = computed(() => !!page.props.auth?.user)

const props = defineProps({
  hasUnsavedChanges: { type: Boolean, default: false },
})
const emit = defineEmits(["confirm-navigation"])

function handleBackClick() {
  if (props.hasUnsavedChanges) {
    emit("confirm-navigation", () => router.visit("/dashboard"))
  } else {
    isAuthenticated.value ? router.visit("/dashboard") : router.visit("/")
  }
}
</script>

<template>
  <Toaster position="top-center" richColors />
  <div>
    <div class="min-h-screen">
      <nav class="border-b border-neutral-100 dark:border-neutral-800">
        <!-- Primary Navigation -->
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 justify-between">
            <div class="flex">
              <!-- Logo -->
              <div class="flex shrink-0 items-center">
                <div
                  class="cursor-pointer"
                  tabindex="1"
                  @keypress.enter="handleBackClick"
                  title="Go to Dashboard"
                  aria-label="Go to Dashboard"
                  @click="handleBackClick"
                >
                  <House class="text-primary w-8 h-8" />
                </div>
              </div>
            </div>

            <!-- Right Controls Slot -->
            <div class="flex items-center gap-4">
              <slot name="actions" />
            </div>
          </div>
        </div>
      </nav>

      <!-- Page Content -->
      <main>
        <slot />
      </main>
    </div>
  </div>
</template>
