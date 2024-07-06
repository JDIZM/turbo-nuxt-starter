<template>
  <section class="relative w-full">
    <div class="absolute bottom-0 left-0 right-0 top-0 z-0">
      <slot name="backgroundImage"></slot>
    </div>
    <div
      class="content-container z-10 py-8"
      :class="{
        'lg:flex lg:items-start lg:justify-center lg:gap-4 lg:py-24': !alternate,
        'lg:flex-row-reverse': reversed
      }"
    >
      <div
        class="z-20 text-base"
        :class="{
          'lg:mx-0 lg:mb-0 lg:basis-1/2': !alternate
        }"
      >
        <slot name="firstChild"></slot>
      </div>
      <div
        class="z-20 text-base"
        :class="{
          'lg:mx-0 lg:mb-0 lg:basis-1/2': !alternate
        }"
      >
        <slot name="secondChild"></slot>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  defineProps({
    alternate: {
      type: Boolean,
      default: false
    },
    reversed: {
      type: Boolean,
      default: false
    }
  })
</script>
