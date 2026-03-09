<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue"
import Card from "@/components/ui/card/Card.vue"
import CardContent from "@/components/ui/card/CardContent.vue"
import CardDescription from "@/components/ui/card/CardDescription.vue"
import CardHeader from "@/components/ui/card/CardHeader.vue"
import CardTitle from "@/components/ui/card/CardTitle.vue"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue"
import ConfirmDialog from "@/components/ConfirmDialog.vue"
import { Map } from "@/types"

import { Head, Link, router, usePage } from "@inertiajs/vue3"

import { Play, Plus, Eye, Pencil, Trash2 } from "lucide-vue-next"
import { onMounted, ref, computed } from "vue"
import { toast } from "vue-sonner"

const { props } = usePage()

const maps = props.maps as Map[]

const hasDraftMap = ref(false)

const MAP_LIMIT = 5

const limitReached = computed(() => maps.length >= MAP_LIMIT)

function handleDelete(id: number) {
  router.delete(`/maps/${id}`, {
    preserveScroll: true,
    onSuccess: () => {
      const index = maps.findIndex((m) => m.id === id)
      if (index > -1) maps.splice(index, 1)

      toast.success("Map deleted", {
        description: "The map has been successfully removed.",
        class:
          "border border-primary/30 shadow-md dark:!border-primary/40 dark:!bg-neutral-800",
      })
    },
  })
}

onMounted(() => {
  const draft = localStorage.getItem("map-builder-formdata")

  if (draft) {
    try {
      const parsed = JSON.parse(draft)
      hasDraftMap.value =
        parsed &&
        ((parsed.base && parsed.pointers?.length) ||
          parsed.pointers?.length > 0)
    } catch {
      hasDraftMap.value = false
    }
  }
})
</script>

<template>
  <Head title="Dashboard" />

  <AuthenticatedLayout>
    <template #header>
      <h2 class="text-xl font-semibold leading-tight text-primary">
        Dashboard
      </h2>
    </template>

    <div class="py-12">
      <div class="grid gap-6 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Build Button -->
        <div class="flex justify-end">
          <Link v-if="!limitReached" :href="route('map-builder')">
            <Button>
              <Plus v-if="!hasDraftMap" class="mr-2 h-4 w-4" />
              <Play v-else class="mr-2 h-4 w-4" />
              {{ hasDraftMap ? "Continue Building" : "Build Map" }}
            </Button>
          </Link>

          <Button v-else disabled> Map limit reached (5) </Button>
        </div>

        <!-- EMPTY STATE -->
        <Card v-if="maps.length === 0" class="py-10">
          <CardHeader>
            <CardTitle class="text-center">Create your first map</CardTitle>

            <CardDescription class="text-center">
              You do not have any maps yet. Click the button below and start
              building!
            </CardDescription>
          </CardHeader>

          <CardContent class="flex justify-center">
            <Link :href="route('map-builder')">
              <Button>
                <Plus v-if="!hasDraftMap" class="mr-2 h-4 w-4" />
                <Play v-else class="mr-2 h-4 w-4" />
                {{ hasDraftMap ? "Continue Building" : "Build Map" }}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <!-- MAP GRID -->
        <div v-else>
          <TransitionGroup
            name="fade"
            tag="div"
            class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div
              v-for="(map, i) in maps"
              :key="map.id"
              class="opacity-0 animate-fade-in"
              :style="{ animationDelay: `${i * 80}ms` }"
            >
              <Card
                class="overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer"
                @click="router.visit(`/map-preview/${map.id}`)"
              >
                <!-- map preview -->
                <div
                  class="relative aspect-video bg-muted overflow-hidden group"
                >
                  <img
                    :src="map.base_src"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <!-- Floating preview indicator -->
                  <div
                    class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white/70 text-primary-foreground shadow-md transition-all opacity-0 group-hover:opacity-100"
                    title="Preview Map"
                  >
                    <Eye class="w-4 h-4" />
                  </div>
                </div>

                <CardContent class="space-y-4 pt-4">
                  <!-- metadata -->
                  <div class="text-sm text-muted-foreground space-y-1">
                    <div class="font-semibold text-lg">
                      {{ map.pointers_count }} pointers
                    </div>
                    <span :title="map.created_at.date">{{
                      map.created_at.human
                    }}</span>
                  </div>

                  <!-- actions -->
                  <div class="flex gap-2">
                    <!-- Edit -->
                    <Link
                      :href="`/map-builder/${map.id}`"
                      class="flex-1"
                      @click.stop
                    >
                      <Button size="sm" variant="outline" class="w-full">
                        <Pencil class="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>

                    <!-- Delete -->
                    <ConfirmDialog
                      title="Delete this map?"
                      description="This action cannot be undone. The map and all pointers will be permanently removed."
                      confirm-text="Delete map"
                      cancel-text="Cancel"
                      confirm-variant="destructive"
                      @confirm="handleDelete(map.id)"
                    >
                      <Button size="sm" variant="destructive" @click.stop>
                        <Trash2 class="h-4 w-4" />
                      </Button>
                    </ConfirmDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
