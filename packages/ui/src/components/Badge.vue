<script lang="ts" setup>
import { computed } from "vue"

export interface BadgeProps {
  /**
   * Badge variant
   */
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "info"
  /**
   * Badge size
   */
  size?: "sm" | "md" | "lg"
  /**
   * Rounded badge (pill shape)
   */
  rounded?: boolean
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: "default",
  size: "md",
  rounded: false
})

const baseClasses = "inline-flex items-center justify-center font-medium"

const variantClasses = computed(() => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800"
  }
  return variants[props.variant]
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  }
  return sizes[props.size]
})

const roundedClass = computed(() => (props.rounded ? "rounded-full" : "rounded"))

const badgeClasses = computed(() =>
  [baseClasses, variantClasses.value, sizeClasses.value, roundedClass.value].join(" ")
)
</script>

<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>
