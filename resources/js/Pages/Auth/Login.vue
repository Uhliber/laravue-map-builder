<script setup lang="ts">
import GuestLayout from "@/Layouts/GuestLayout.vue"
import { Head, Link, useForm } from "@inertiajs/vue3"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Checkbox from "@/components/Checkbox.vue"
import Alert from "@/components/ui/alert/Alert.vue"
import AlertTitle from "@/components/ui/alert/AlertTitle.vue"
import AlertDescription from "@/components/ui/alert/AlertDescription.vue"

defineProps<{
  canResetPassword?: boolean
  status?: string
}>()

const form = useForm({
  email: "",
  password: "",
  remember: false,
})

const submit = () => {
  form.post(route("login"), {
    preserveScroll: true,
    onFinish: () => {
      form.reset("password")
    },
  })
}
</script>

<template>
  <GuestLayout>
    <Head title="Login" />

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
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>

        <form @submit.prevent="submit">
          <CardContent class="space-y-4">
            <div class="space-y-1.5">
              <Label for="email">Email</Label>

              <Input
                id="email"
                type="email"
                v-model="form.email"
                placeholder="m@example.com"
                required
                autofocus
              />

              <p v-if="form.errors.email" class="text-sm text-red-500">
                {{ form.errors.email }}
              </p>
            </div>

            <div class="space-y-1.5">
              <div class="flex items-center">
                <Label for="password">Password</Label>

                <Link
                  v-if="canResetPassword"
                  :href="route('password.request')"
                  class="ml-auto text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Input
                id="password"
                type="password"
                v-model="form.password"
                required
              />

              <p v-if="form.errors.password" class="text-sm text-red-500">
                {{ form.errors.password }}
              </p>
            </div>

            <label class="flex items-center space-x-2">
              <Checkbox v-model:checked="form.remember" />
              <span class="text-sm text-muted-foreground"> Remember me </span>
            </label>
          </CardContent>

          <CardFooter class="flex flex-col gap-3">
            <Button type="submit" class="w-full" :disabled="form.processing">
              <span v-if="form.processing">Logging in...</span>
              <span v-else>Login</span>
            </Button>
            <p class="text-sm">
              <span class="text-muted-foreground">Don't have an account? </span>
              <Link
                v-if="canResetPassword"
                :href="route('register')"
                class="text-primary hover:underline ml-1"
                >Sign up</Link
              >
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  </GuestLayout>
</template>
