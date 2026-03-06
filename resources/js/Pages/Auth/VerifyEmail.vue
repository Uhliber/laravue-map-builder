<script setup lang="ts">
import { computed } from "vue"
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

const props = defineProps<{
  status?: string
}>()

const form = useForm({})

const submit = () => {
  form.post(route("verification.send"))
}

const verificationLinkSent = computed(
  () => props.status === "verification-link-sent"
)
</script>

<template>
  <GuestLayout>
    <Head title="Email Verification" />

    <div class="flex justify-center">
      <Card class="w-full max-w-md">

        <CardHeader>
          <CardTitle>Email verification</CardTitle>

          <CardDescription>
            Before continuing, please verify your email address using the link
            we sent you.
          </CardDescription>
        </CardHeader>

        <CardContent>

          <div class="text-sm text-muted-foreground mb-4">
            Thanks for signing up. Please check your email and click the
            verification link to activate your account. If you did not receive
            the email, you can request another one.
          </div>

          <div
            v-if="verificationLinkSent"
            class="text-sm font-medium text-green-600 mb-4"
          >
            A new verification link has been sent to your email address.
          </div>

          <form @submit.prevent="submit" class="space-y-4">

            <Button
              type="submit"
              class="w-full"
              :disabled="form.processing"
            >
              Resend Verification Email
            </Button>

            <Link
              :href="route('logout')"
              method="post"
              as="button"
              class="w-full text-sm text-muted-foreground hover:underline"
            >
              Log out
            </Link>

          </form>

        </CardContent>
      </Card>
    </div>
  </GuestLayout>
</template>
