<script lang="ts" setup>
import { computed } from "vue"

export interface AlertProps {
  /**
   * Alert variant
   */
  variant?: "info" | "success" | "warning" | "danger"
  /**
   * Alert title
   */
  title?: string
  /**
   * Show close button
   */
  dismissible?: boolean
}

const props = withDefaults(defineProps<AlertProps>(), {
  variant: "info",
  dismissible: false
})

const emit = defineEmits<{
  close: []
}>()

const baseClasses = "rounded-lg border p-4"

const variantClasses = computed(() => {
  const variants = {
    info: "border-blue-200 bg-blue-50 text-blue-800",
    success: "border-green-200 bg-green-50 text-green-800",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
    danger: "border-red-200 bg-red-50 text-red-800"
  }
  return variants[props.variant]
})

const iconClasses = computed(() => {
  const icons = {
    info: "text-blue-400",
    success: "text-green-400",
    warning: "text-yellow-400",
    danger: "text-red-400"
  }
  return icons[props.variant]
})

const iconPaths = computed(() => {
  const paths = {
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    warning:
      "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    danger: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
  }
  return paths[props.variant]
})

const alertClasses = computed(() => [baseClasses, variantClasses.value].join(" "))

const handleClose = () => {
  emit("close")
}
</script>

<template>
  <div :class="alertClasses" role="alert">
    <div class="flex">
      <div class="flex-shrink-0">
        <svg
          :class="['h-5 w-5', iconClasses]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPaths" />
        </svg>
      </div>
      <div class="ml-3 flex-1">
        <h3 v-if="title" class="text-sm font-medium">{{ title }}</h3>
        <div class="text-sm" :class="{ 'mt-2': title }">
          <slot />
        </div>
      </div>
      <div v-if="dismissible" class="ml-auto pl-3">
        <button
          type="button"
          class="inline-flex rounded-md p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="iconClasses"
          @click="handleClose"
        >
          <span class="sr-only">Dismiss</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
