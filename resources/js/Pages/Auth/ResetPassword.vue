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
  FieldDescription,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import InputError from "@/components/InputError.vue"

const props = defineProps<{
  email: string
  token: string
}>()

const form = useForm({
  token: props.token,
  email: props.email,
  password: "",
  password_confirmation: "",
})

const submit = () => {
  form.post(route("password.store"), {
    onFinish: () => {
      form.reset("password", "password_confirmation")
    },
  })
}
</script>

<template>
  <GuestLayout>
    <Head title="Reset Password" />

    <div class="flex justify-center">
      <Card class="w-full max-w-md">

        <CardHeader>
          <CardTitle>Reset your password</CardTitle>

          <CardDescription>
            Enter your email and choose a new password.
          </CardDescription>
        </CardHeader>

        <CardContent>
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


              <Field>
                <FieldLabel for="password">
                  Password
                </FieldLabel>

                <Input
                  id="password"
                  type="password"
                  v-model="form.password"
                  required
                  autocomplete="new-password"
                />

                <FieldDescription>
                  Must be at least 8 characters.
                </FieldDescription>

                <InputError :message="form.errors.password" />
              </Field>


              <Field>
                <FieldLabel for="password_confirmation">
                  Confirm Password
                </FieldLabel>

                <Input
                  id="password_confirmation"
                  type="password"
                  v-model="form.password_confirmation"
                  required
                  autocomplete="new-password"
                />

                <InputError :message="form.errors.password_confirmation" />
              </Field>


              <Button
                type="submit"
                class="w-full"
                :disabled="form.processing"
              >
                Reset Password
              </Button>

            </FieldGroup>

          </form>
        </CardContent>

      </Card>
    </div>
  </GuestLayout>
</template>
