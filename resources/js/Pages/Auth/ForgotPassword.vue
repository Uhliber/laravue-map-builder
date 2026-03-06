<script setup lang="ts">
import GuestLayout from "@/Layouts/GuestLayout.vue"
import { Head, useForm } from "@inertiajs/vue3"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import InputError from "@/components/InputError.vue"

defineProps<{
  status?: string
}>()

const form = useForm({
  email: "",
})

const submit = () => {
  form.post(route("password.email"))
}
</script>

<template>
  <GuestLayout>
    <Head title="Forgot Password" />

    <div class="flex justify-center">
      <Card class="w-full max-w-md">

        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>

          <CardDescription>
            No problem. Just let us know your email
            address and we will email you a password reset link that will allow
            you to choose a new one.
          </CardDescription>
        </CardHeader>

        <CardContent>

          <div
            v-if="status"
            class="mb-4 text-sm font-medium text-green-600"
          >
            {{ status }}
          </div>

          <form @submit.prevent="submit">
            <FieldGroup>

              <Field>
                <FieldLabel for="email">
                  Email
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  v-model="form.email"
                  required
                  autofocus
                  autocomplete="username"
                />

                <InputError :message="form.errors.email" />
              </Field>


              <Button
                type="submit"
                class="w-full"
                :disabled="form.processing"
              >
                Email Password Reset Link
              </Button>

            </FieldGroup>
          </form>

        </CardContent>

      </Card>
    </div>
  </GuestLayout>
</template>
