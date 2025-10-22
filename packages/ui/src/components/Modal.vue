<script lang="ts" setup>
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from "@headlessui/vue"
import { computed } from "vue"

export interface ModalProps {
  /**
   * Modal open state
   */
  open: boolean
  /**
   * Modal title
   */
  title?: string
  /**
   * Modal size
   */
  size?: "sm" | "md" | "lg" | "xl" | "full"
  /**
   * Show close button
   */
  showClose?: boolean
}

const props = withDefaults(defineProps<ModalProps>(), {
  open: false,
  size: "md",
  showClose: true
})

const emit = defineEmits<{
  "update:open": [value: boolean]
  close: []
}>()

const sizeClasses = computed(() => {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4"
  }
  return sizes[props.size]
})

const closeModal = () => {
  emit("update:open", false)
  emit("close")
}
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              :class="[
                'w-full transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all',
                sizeClasses
              ]"
            >
              <div v-if="title || showClose" class="mb-4 flex items-center justify-between">
                <DialogTitle
                  v-if="title"
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                  {{ title }}
                </DialogTitle>
                <button
                  v-if="showClose"
                  type="button"
                  class="focus:ring-primary-500 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2"
                  @click="closeModal"
                >
                  <span class="sr-only">Close</span>
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div class="mt-2">
                <slot />
              </div>

              <div v-if="$slots.footer" class="mt-4">
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
