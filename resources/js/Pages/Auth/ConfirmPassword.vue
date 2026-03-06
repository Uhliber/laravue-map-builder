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

const form = useForm({
  password: "",
})

const submit = () => {
  form.post(route("password.confirm"), {
    onFinish: () => {
      form.reset()
    },
  })
}
</script>

<template>
  <GuestLayout>
    <Head title="Confirm Password" />

    <div class="flex justify-center">
      <Card class="w-full max-w-md">

        <CardHeader>
          <CardTitle>Confirm your password</CardTitle>

          <CardDescription>
            This is a secure area of the application. Please confirm your password before continuing.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form @submit.prevent="submit">
            <FieldGroup>

              <Field>
                <FieldLabel for="password">
                  Password
                </FieldLabel>

                <Input
                  id="password"
                  type="password"
                  v-model="form.password"
                  required
                  autocomplete="current-password"
                  autofocus
                />

                <InputError :message="form.errors.password" />
              </Field>


              <Button
                type="submit"
                class="w-full"
                :disabled="form.processing"
              >
                Confirm Password
              </Button>

            </FieldGroup>
          </form>
        </CardContent>

      </Card>
    </div>
  </GuestLayout>
</template>
