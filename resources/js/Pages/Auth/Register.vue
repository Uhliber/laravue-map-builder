<script setup lang="ts">
import GuestLayout from "@/Layouts/GuestLayout.vue"
import { Head, Link, useForm } from "@inertiajs/vue3"

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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import InputError from "@/components/InputError.vue"
import Alert from "@/components/ui/alert/Alert.vue"
import AlertTitle from "@/components/ui/alert/AlertTitle.vue"
import AlertDescription from "@/components/ui/alert/AlertDescription.vue"

const form = useForm({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
})

const submit = () => {
  form.post(route("register"), {
    onFinish: () => {
      form.reset("password", "password_confirmation")
    },
  })
}
</script>

<template>
  <GuestLayout>
    <Head title="Register" />

    <div class="grid gap-4 w-full max-w-sm">
      <Alert>
        <AlertTitle class="text-destructive">Demo Mode</AlertTitle>
        <AlertDescription>
          In Demo Mode, you can sign up with any email and password. No
          verification is required.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form @submit.prevent="submit">
            <FieldGroup>
              <Field>
                <FieldLabel for="name"> Full Name </FieldLabel>

                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
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
                  placeholder="m@example.com"
                  v-model="form.email"
                  required
                  autocomplete="username"
                />

                <FieldDescription>
                  We'll use this to contact you.
                </FieldDescription>

                <InputError :message="form.errors.email" />
              </Field>

              <Field>
                <FieldLabel for="password"> Password </FieldLabel>

                <Input
                  id="password"
                  type="password"
                  v-model="form.password"
                  required
                  autocomplete="new-password"
                />

                <FieldDescription>
                  Must be at least 8 characters long.
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

                <FieldDescription>
                  Please confirm your password.
                </FieldDescription>

                <InputError :message="form.errors.password_confirmation" />
              </Field>

              <FieldGroup class="pt-4 space-y-3">
                <Button
                  type="submit"
                  class="w-full"
                  :disabled="form.processing"
                >
                  Create Account
                </Button>

                <FieldDescription class="text-center">
                  Already have an account?
                  <Link
                    :href="route('login')"
                    class="text-primary hover:underline ml-1"
                  >
                    Sign in
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  </GuestLayout>
</template>
