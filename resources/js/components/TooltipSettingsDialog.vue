<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core"
import { computed, ref, watch } from "vue"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

import { Input } from "@/components/ui/input"
import Textarea from "@/components/ui/textarea/Textarea.vue"

import FieldSet from "./ui/field/FieldSet.vue"
import FieldGroup from "./ui/field/FieldGroup.vue"
import Field from "./ui/field/Field.vue"
import FieldLabel from "./ui/field/FieldLabel.vue"
import FieldDescription from "./ui/field/FieldDescription.vue"

import Select from "./ui/select/Select.vue"
import SelectTrigger from "./ui/select/SelectTrigger.vue"
import SelectValue from "./ui/select/SelectValue.vue"
import SelectItem from "./ui/select/SelectItem.vue"
import SelectContent from "./ui/select/SelectContent.vue"

import NumberField from "./ui/number-field/NumberField.vue"
import NumberFieldContent from "./ui/number-field/NumberFieldContent.vue"
import NumberFieldDecrement from "./ui/number-field/NumberFieldDecrement.vue"
import NumberFieldInput from "./ui/number-field/NumberFieldInput.vue"
import NumberFieldIncrement from "./ui/number-field/NumberFieldIncrement.vue"

import type { MapPointer } from "@/types"
import FieldError from "./ui/field/FieldError.vue"

const props = defineProps<{
  open: boolean
  pointer: MapPointer | null
}>()

const emit = defineEmits(["update:open", "save"])

const isDesktop = useMediaQuery("(min-width: 640px)")

const Modal = computed(() => ({
  Root: isDesktop.value ? Dialog : Drawer,
  Content: isDesktop.value ? DialogContent : DrawerContent,
  Header: isDesktop.value ? DialogHeader : DrawerHeader,
  Title: isDesktop.value ? DialogTitle : DrawerTitle,
  Description: isDesktop.value ? DialogDescription : DrawerDescription,
  Footer: isDesktop.value ? DialogFooter : DrawerFooter,
  Close: isDesktop.value ? DialogClose : DrawerClose,
}))

const form = ref({
  trigger: "hover",
  placement: "top",
  offset: 0,
  title: "",
  description: "",
  link: "",
  target: "_self",
})

const linkError = ref<string | null>(null)

/*
Load pointer values when dialog opens
*/
watch(
  () => props.open,
  (open) => {
    if (open && props.pointer) {
      form.value = {
        trigger: props.pointer.trigger ?? "hover",
        placement: props.pointer.placement ?? "top",
        offset: props.pointer.offset ?? 0,
        title: props.pointer.title ?? "",
        description: props.pointer.description ?? "",
        link: props.pointer.link ?? "",
        target: props.pointer.target ?? "_self",
      }
    }
    resetErrors()
  },
)

/*
Basic URL sanitization
*/
function validateUrl(url: string): boolean {
  if (!url) return true

  try {
    const parsed = new URL(url)

    return ["http:", "https:"].includes(parsed.protocol)
  } catch {
    return false
  }
}

function save() {
  if (!props.pointer) return

  linkError.value = null

  if (!validateUrl(form.value.link)) {
    linkError.value = "Enter a valid http or https URL."
    return
  }

  const safeUrl = form.value.link ? new URL(form.value.link).toString() : ""

  emit("save", {
    ...form.value,
    link: safeUrl,
  })

  emit("update:open", false)
}

function resetErrors() {
  linkError.value = ""
}
</script>

<template>
  <component
    :is="Modal.Root"
    :open="open"
    @update:open="emit('update:open', $event)"
  >
    <component
      :is="Modal.Content"
      class="sm:max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden"
      :dismissible="false"
      @pointer-down-outside.prevent
      @interact-outside.prevent
    >
      <component :is="Modal.Header" class="px-6 pt-6 pb-4 border-b">
        <component :is="Modal.Title"> Tooltip Settings </component>

        <component :is="Modal.Description">
          Configure how this pointer displays its tooltip.
        </component>
      </component>

      <div class="flex-1 overflow-y-auto px-6 py-4 dialog-scroll">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Trigger</FieldLabel>
              <Select v-model="form.trigger">
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hover">Hover</SelectItem>
                  <SelectItem value="click">Click</SelectItem>
                  <SelectItem value="always">Always visible</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                Choose how the tooltip appears.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Placement</FieldLabel>
              <Select v-model="form.placement">
                <SelectTrigger>
                  <SelectValue placeholder="Select placement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription> Preferred tooltip position. </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Offset</FieldLabel>
              <NumberField v-model="form.offset" :step="5" :min="-50" :max="50">
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
              <FieldDescription> Distance from the pointer. </FieldDescription>
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input v-model="form.title" placeholder="Tooltip title" />
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                v-model="form.description"
                placeholder="Short description"
                :rows="4"
              />
            </Field>

            <Field :data-invalid="linkError">
              <FieldLabel>Link</FieldLabel>

              <Input
                v-model="form.link"
                placeholder="https://example.com"
                :aria-invalid="!!linkError"
              />

              <FieldError v-if="linkError">
                {{ linkError }}
              </FieldError>

              <FieldDescription>
                Optional. Only secure links (https) are allowed.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>Link Target</FieldLabel>
              <Select v-model="form.target" :disabled="!form.link">
                <SelectTrigger>
                  <SelectValue placeholder="Select target" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_self">Open in same tab</SelectItem>
                  <SelectItem value="_blank">Open in new tab</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>

      <component
        :is="Modal.Footer"
        class="px-6 pt-4 pb-6 border-t flex justify-end gap-2"
      >
        <component :is="Modal.Close" as-child>
          <Button variant="outline">Cancel</Button>
        </component>

        <Button @click="save"> Save </Button>
      </component>
    </component>
  </component>
</template>
