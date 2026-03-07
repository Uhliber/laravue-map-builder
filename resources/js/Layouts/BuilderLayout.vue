<script setup lang="ts">
import { Link } from "@inertiajs/vue3"
import ThemeToggle from "@/components/ThemeToggle.vue"
import Button from "@/components/ui/button/Button.vue"
import { House } from "lucide-vue-next"
</script>

<template>
  <div>
    <div class="min-h-screen">
      <nav class="border-b border-neutral-100 dark:border-neutral-800">
        <!-- Primary Navigation Menu -->
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 justify-between">
            <div class="flex">
              <!-- Logo -->
              <div class="flex shrink-0 items-center">
                <Link :href="route('dashboard')">
                  <House class="text-primary w-8 h-8" />
                </Link>
              </div>
            </div>

            <div class="hidden sm:ms-6 sm:flex sm:items-center">
              <ThemeToggle />

              <div class="relative ms-3">
                <Button type="submit"> Save </Button>
              </div>
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
