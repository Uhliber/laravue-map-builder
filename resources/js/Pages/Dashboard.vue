<script setup lang="ts">
import Card from "@/components/ui/card/Card.vue"
import CardContent from "@/components/ui/card/CardContent.vue"
import CardDescription from "@/components/ui/card/CardDescription.vue"
import CardHeader from "@/components/ui/card/CardHeader.vue"
import CardTitle from "@/components/ui/card/CardTitle.vue"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue"
import { Head } from "@inertiajs/vue3"
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
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome!</CardTitle>

            <CardDescription> You're logged in. </CardDescription>
          </CardHeader>

          <CardContent class="max-w-xl"> </CardContent>
        </Card>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
