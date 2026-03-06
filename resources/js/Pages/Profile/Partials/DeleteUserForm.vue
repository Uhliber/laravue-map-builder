<script setup lang="ts">
import { nextTick, ref } from "vue"
import { useForm } from "@inertiajs/vue3"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import InputError from "@/components/InputError.vue"

const confirmingUserDeletion = ref(false)
const passwordInput = ref<HTMLInputElement | null>(null)

const form = useForm({
  password: "",
})

const confirmUserDeletion = () => {
  confirmingUserDeletion.value = true

  nextTick(() => passwordInput.value?.focus())
}

const deleteUser = () => {
  form.delete(route("profile.destroy"), {
    preserveScroll: true,

    onSuccess: () => closeModal(),

    onError: () => passwordInput.value?.focus(),

    onFinish: () => {
      form.reset()
    },
  })
}

const closeModal = () => {
  confirmingUserDeletion.value = false

  form.clearErrors()
  form.reset()
}
</script>

<template>
  <Card class="border-destructive/30">
    <CardHeader>
      <CardTitle class="text-destructive"> Delete Account </CardTitle>

      <CardDescription>
        Once deleted, all data will be permanently removed. Download any data
        you want to keep before continuing.
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-4">
      <Dialog v-model:open="confirmingUserDeletion">
        <DialogTrigger as-child>
          <Button variant="destructive" @click="confirmUserDeletion">
            Delete Account
          </Button>
        </DialogTrigger>

        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle> Are you absolutely sure? </DialogTitle>

            <DialogDescription>
              This action cannot be undone. Please enter your password to
              confirm.
            </DialogDescription>
          </DialogHeader>

          <div class="space-y-4 pt-2">
            <Input
              ref="passwordInput"
              v-model="form.password"
              type="password"
              placeholder="Password"
              autocomplete="current-password"
              @keyup.enter="deleteUser"
            />

            <InputError :message="form.errors.password" />
          </div>

          <DialogFooter class="gap-2">
            <Button variant="secondary" @click="closeModal"> Cancel </Button>

            <Button
              variant="destructive"
              :disabled="form.processing"
              @click="deleteUser"
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardContent>
  </Card>
</template>
