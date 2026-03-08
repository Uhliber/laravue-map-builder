<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue"
import Card from "@/components/ui/card/Card.vue"
import CardContent from "@/components/ui/card/CardContent.vue"
import CardDescription from "@/components/ui/card/CardDescription.vue"
import CardHeader from "@/components/ui/card/CardHeader.vue"
import CardTitle from "@/components/ui/card/CardTitle.vue"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue"
import { Head, Link } from "@inertiajs/vue3"
import { Play, Plus } from "lucide-vue-next"
import { onMounted, ref } from "vue"

const hasDraftMap = ref(false)

onMounted(() => {
  const draft = localStorage.getItem("map-builder-formdata")

  console.log(draft)

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
      <div class="grid gap-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex justify-end">
          <Link v-show="false" :href="route('map-builder')">
            <Button type="button">
              <Plus v-if="!hasDraftMap" class="text-primary-foreground"></Plus>
              <Play v-else class="text-primary-foreground"></Play>
              {{ hasDraftMap ? "Continue Building" : "Build Map" }}
            </Button>
          </Link>
        </div>
        <Card class="py-10">
          <CardHeader>
            <CardTitle class="text-center">Create your first map</CardTitle>
            <CardDescription class="text-center">
              You do not have any maps yet. Click the button below and start
              building!
            </CardDescription>
          </CardHeader>

          <CardContent class="w-full flex justify-center">
            <Link :href="route('map-builder')">
              <Button type="button">
                <Plus
                  v-if="!hasDraftMap"
                  class="text-primary-foreground"
                ></Plus>
                <Play v-else class="text-primary-foreground"></Play>
                {{ hasDraftMap ? "Continue Building" : "Build Map" }}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
