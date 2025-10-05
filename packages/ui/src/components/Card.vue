<script lang="ts" setup>
import { computed } from 'vue'

export interface CardProps {
  /**
   * Card padding variant
   */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /**
   * Card hover effect
   */
  hoverable?: boolean
  /**
   * Card border
   */
  bordered?: boolean
  /**
   * Card shadow
   */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<CardProps>(), {
  padding: 'md',
  hoverable: false,
  bordered: true,
  shadow: 'sm'
})

const baseClasses = 'rounded-lg bg-white transition-shadow'

const paddingClasses = computed(() => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  return paddings[props.padding]
})

const shadowClasses = computed(() => {
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  }
  return shadows[props.shadow]
})

const hoverClasses = computed(() => (props.hoverable ? 'hover:shadow-lg cursor-pointer' : ''))

const borderClasses = computed(() => (props.bordered ? 'border border-gray-200' : ''))

const cardClasses = computed(() =>
  [
    baseClasses,
    paddingClasses.value,
    shadowClasses.value,
    hoverClasses.value,
    borderClasses.value
  ].join(' ')
)
</script>

<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>
