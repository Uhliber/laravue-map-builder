<script setup lang="ts">
import { Head, Link, usePage } from "@inertiajs/vue3"
import { MapPinPen } from "lucide-vue-next"
import ThemeToggle from "@/components/ThemeToggle.vue"
import { PageProps } from "@/types"
import { computed, ref } from "vue"
import { useScreen } from "@/composables/useScreen"

import MapBase from "@/components/MapBase.vue"
import {
  demoMapBaseImage,
  demoPointers as originalDemoPointers,
  demoHighlightPointer,
} from "@/demo/mapDemo"
import MapPointer from "@/components/MapPointer.vue"
import MapPointerContent from "@/components/MapPointerContent.vue"
import ApplicationLogo from "@/components/ApplicationLogo.vue"

defineProps<{
  canLogin?: boolean
  canRegister?: boolean
  laravelVersion: string
  phpVersion: string
}>()

const page = usePage<PageProps>()
const { screenIs } = useScreen()
const mapHighlightVisible = ref(false)

const authorUrl = computed(() => (page.props.author_url as string) ?? "/")

// Deep clone pointers so we can mutate safely
const demoPointers = originalDemoPointers.map((p) => ({ ...p }))

// Update ollie-stand pointer dynamically
const olliePointer = demoPointers.find((p) => p.id === "ollie-stand")
if (olliePointer) {
  olliePointer.link = authorUrl.value as string
}

function onMapLoaded() {
  mapHighlightVisible.value = true
}
</script>

<template>
  <Head title="Map Builder by Ollie" />

  <div class="text-black/50 dark:text-white/50 relative min-h-screen">
    <!-- Background Blur -->
    <div class="absolute -z-10 inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -left-40 w-96 h-96 bg-primary-100/80 dark:bg-primary/10 rounded-full blur-[120px]"
      />
      <div
        class="absolute top-40 right-0 w-96 h-96 bg-primary-200/60 dark:bg-primary/5 rounded-full blur-[120px]"
      />
    </div>

    <div
      class="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white"
    >
      <div
        class="relative w-full max-w-2xl px-6 lg:max-w-7xl flex flex-col min-h-[100dvh]"
      >
        <!-- Header -->
        <header class="grid grid-cols-2 items-center gap-2 py-10 shrink-0">
          <Link href="/">
            <ApplicationLogo
              class="block w-auto fill-current"
              direction="horizontal"
            />
          </Link>

          <nav v-if="canLogin" class="-mx-3 flex flex-1 justify-end">
            <Link
              v-if="$page.props.auth.user"
              :href="route('dashboard')"
              class="rounded-md px-3 py-2 transition hover:text-black/70 dark:text-white"
            >
              Dashboard
            </Link>

            <template v-else>
              <Link
                :href="route('login')"
                class="px-3 py-2 transition dark:text-white"
              >
                Log in
              </Link>

              <Link
                v-if="canRegister"
                :href="route('register')"
                class="px-3 py-2 transition dark:text-white"
              >
                Register
              </Link>
            </template>
          </nav>
        </header>

        <!-- Map Renderer -->
        <main
          class="flex-1 flex flex-col gap-4 sm:flex-row sm:gap-0 justify-center items-center"
        >
          <div>
            <MapPointerContent
              v-if="screenIs('sm')"
              :title="demoHighlightPointer.pointer.title"
              :description="demoHighlightPointer.pointer.description"
              :link="demoHighlightPointer.pointer.link"
              :target="demoHighlightPointer.pointer.target"
            >
            </MapPointerContent>
          </div>
          <div class="relative">
            <MapBase
              class="w-full max-w-2xl"
              :map-image="{ id: 'demo', src: demoMapBaseImage }"
              :pointers="demoPointers"
              @map-loaded="onMapLoaded"
            />
            <MapPointer
              v-if="mapHighlightVisible && !screenIs('sm')"
              :pointer="demoHighlightPointer.pointer"
              :pointer-style="demoHighlightPointer.style"
            />
          </div>
        </main>

        <!-- Footer -->
        <footer
          class="grid grid-cols-2 py-10 text-sm text-black dark:text-white/70 lg:grid-cols-3 items-center"
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
        </footer>
      </div>
    </div>
  </div>
</template>
