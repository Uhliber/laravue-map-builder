<script setup lang="ts">
// import { computed } from "vue"
import { useForm, usePage, Link } from "@inertiajs/vue3"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import InputError from "@/components/InputError.vue"
import type { PageProps } from "@/types"

defineProps<{
  mustVerifyEmail?: boolean
  status?: string
}>()

const user = usePage<PageProps>().props.auth.user

const form = useForm({
  name: user.name,
  email: user.email,
})

// const verificationLinkSent = computed(
//   () => (usePage().props.status === "verification-link-sent")
// )
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Profile Information</CardTitle>

      <CardDescription> Update your account profile details. </CardDescription>
    </CardHeader>

    <CardContent class="max-w-xl">
      <form
        @submit.prevent="form.patch(route('profile.update'))"
        class="space-y-6"
      >
        <FieldGroup>
          <Field>
            <FieldLabel for="name"> Name </FieldLabel>

            <Input
              id="name"
              type="text"
              v-model="form.name"
              required
              autofocus
              autocomplete="name"
            />

            <InputError :message="form.errors.name" />
          </Field>

          <Field>
            <FieldLabel for="email"> Email </FieldLabel>

            <Input
              id="email"
              type="email"
              v-model="form.email"
              required
              autocomplete="username"
            />

            <InputError :message="form.errors.email" />
          </Field>

          <div
            v-if="mustVerifyEmail && user.email_verified_at === null"
            class="text-sm space-y-2"
          >
            <p class="text-muted-foreground">Your email is unverified.</p>

            <Link
              :href="route('verification.send')"
              method="post"
              as="button"
              class="text-primary hover:underline"
            >
              Click here to resend verification email
            </Link>

            <div
              v-if="status === 'verification-link-sent'"
              class="text-sm text-primary bg-primary/10 px-3 py-2 rounded-md"
            >
              A new verification link was sent to your email.
            </div>
          </div>

          <div class="flex items-center gap-4 pt-2">
            <Button type="submit" :disabled="form.processing"> Save </Button>

            <Transition
              enter-active-class="transition ease-in-out duration-300"
              enter-from-class="opacity-0 translate-x-1"
              leave-active-class="transition ease-in-out duration-300"
              leave-to-class="opacity-0"
            >
              <p
                v-if="form.recentlySuccessful"
                class="text-sm text-primary-700 dark:text-primary-500"
              >
                Saved.
              </p>
            </Transition>
          </div>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</template>
