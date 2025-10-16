<script lang="ts" setup>
import { computed } from "vue"

export interface SpinnerProps {
  /**
   * Spinner size
   */
  size?: "sm" | "md" | "lg" | "xl"
  /**
   * Spinner color
   */
  color?: "primary" | "secondary" | "white" | "gray"
  /**
   * Loading text
   */
  text?: string
}

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: "md",
  color: "primary"
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  }
  return sizes[props.size]
})

const colorClasses = computed(() => {
  const colors = {
    primary: "border-primary-600",
    secondary: "border-secondary-600",
    white: "border-white",
    gray: "border-gray-600"
  }
  return colors[props.color]
})

const spinnerClasses = computed(() =>
  [
    sizeClasses.value,
    colorClasses.value,
    "animate-spin rounded-full border-2 border-t-transparent"
  ].join(" ")
)
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-2">
    <div :class="spinnerClasses" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <p v-if="text" class="text-sm text-gray-600">{{ text }}</p>
  </div>
</template>
