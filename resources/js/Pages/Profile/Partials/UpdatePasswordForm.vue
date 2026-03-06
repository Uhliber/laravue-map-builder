<script setup lang="ts">
import { ref } from "vue"
import { useForm } from "@inertiajs/vue3"

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

const passwordInput = ref<HTMLInputElement | null>(null)
const currentPasswordInput = ref<HTMLInputElement | null>(null)

const form = useForm({
  current_password: "",
  password: "",
  password_confirmation: "",
})

const updatePassword = () => {
  form.put(route("password.update"), {
    preserveScroll: true,

    onSuccess: () => {
      form.reset()
    },

    onError: () => {
      if (form.errors.password) {
        form.reset("password", "password_confirmation")
        passwordInput.value?.focus()
      }

      if (form.errors.current_password) {
        form.reset("current_password")
        currentPasswordInput.value?.focus()
      }
    },
  })
}
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Update Password</CardTitle>

      <CardDescription>
        Ensure your password is long and secure.
      </CardDescription>
    </CardHeader>

    <CardContent class="max-w-xl">
      <form @submit.prevent="updatePassword" class="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel for="current_password"> Current Password </FieldLabel>

            <Input
              id="current_password"
              ref="currentPasswordInput"
              v-model="form.current_password"
              type="password"
              autocomplete="current-password"
            />

            <InputError :message="form.errors.current_password" />
          </Field>

          <Field>
            <FieldLabel for="password"> New Password </FieldLabel>

            <Input
              id="password"
              ref="passwordInput"
              v-model="form.password"
              type="password"
              autocomplete="new-password"
            />

            <InputError :message="form.errors.password" />
          </Field>

          <Field>
            <FieldLabel for="password_confirmation">
              Confirm Password
            </FieldLabel>

            <Input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              autocomplete="new-password"
            />

            <InputError :message="form.errors.password_confirmation" />
          </Field>

          <div class="flex items-center gap-4 pt-2">
            <Button type="submit" :disabled="form.processing">
              Save Changes
            </Button>

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
