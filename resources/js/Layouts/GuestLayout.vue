<script setup lang="ts">
import { computed } from "vue"
import ApplicationLogo from "@/components/ApplicationLogo.vue"
import ThemeToggle from "@/components/ThemeToggle.vue"
import { Link, usePage } from "@inertiajs/vue3"
import { PageProps } from "@/types"

const page = usePage<PageProps>()

const authorUrl = computed<string>(() => {
  return (page.props?.author_url as string) ?? "/"
})
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center py-6 sm:justify-center sm:py-8"
  >
    <div class="absolute -z-10 inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -left-40 w-96 h-96 bg-primary/30 dark:bg-primary/10 rounded-full blur-[120px]"
      />
      <div
        class="absolute top-40 right-0 w-96 h-96 bg-primary/20 dark:bg-primary/5 rounded-full blur-[120px]"
      />
    </div>

    <div>
      <Link href="/">
        <ApplicationLogo class="h-20 w-20 fill-current text-gray-500" />
      </Link>
    </div>

    <div
      class="flex justify-center mt-6 w-full overflow-hidden px-6 py-4 sm:max-w-md"
    >
      <slot />
    </div>

    <div
      class="mt-8 flex text-sm gap-4 items-center text-black dark:text-white/70"
    >
      <ThemeToggle />

      <a
        :href="authorUrl"
        target="_blank"
        rel="noopener"
        class="text-right lg:text-center hover:text-primary-800 dark:hover:text-primary"
      >
        Ollie 2026
      </a>
    </div>
  </div>
</template>
