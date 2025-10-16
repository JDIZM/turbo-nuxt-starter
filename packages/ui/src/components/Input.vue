<script lang="ts" setup>
import { computed } from "vue"

export interface InputProps {
  /**
   * Input type
   */
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search"
  /**
   * Input value
   */
  modelValue?: string | number
  /**
   * Placeholder text
   */
  placeholder?: string
  /**
   * Input label
   */
  label?: string
  /**
   * Error message
   */
  error?: string
  /**
   * Helper text
   */
  helperText?: string
  /**
   * Disabled state
   */
  disabled?: boolean
  /**
   * Required field
   */
  required?: boolean
  /**
   * Full width input
   */
  fullWidth?: boolean
  /**
   * Input size
   */
  size?: "sm" | "md" | "lg"
}

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  disabled: false,
  required: false,
  fullWidth: false,
  size: "md"
})

const emit = defineEmits<{
  "update:modelValue": [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const baseClasses =
  "block rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:disabled:bg-gray-900 dark:disabled:text-gray-400"

const errorClasses = "border-red-500 focus:border-red-500 focus:ring-red-500"

const sizeClasses = computed(() => {
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-5 text-lg"
  }
  return sizes[props.size]
})

const widthClass = computed(() => (props.fullWidth ? "w-full" : ""))

const inputClasses = computed(() =>
  [baseClasses, props.error ? errorClasses : "", sizeClasses.value, widthClass.value].join(" ")
)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit("update:modelValue", target.value)
}
</script>

<template>
  <div :class="fullWidth ? 'w-full' : ''">
    <label
      v-if="label"
      :for="inputId"
      class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
      @input="handleInput"
      @blur="emit('blur', $event as FocusEvent)"
      @focus="emit('focus', $event as FocusEvent)"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="helperText" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ helperText }}
    </p>
  </div>
</template>
