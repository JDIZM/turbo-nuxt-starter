import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // This store syntax uses the setup stores format
  // https://pinia.vuejs.org/core-concepts/#Setup-Stores

  // State
  const count = ref(0)

  // Getters
  const doubleCount = computed(() => count.value * 2)

  // Actions
  // https://pinia.vuejs.org/core-concepts/actions.html
  function increment(n: number = 1) {
    count.value += n
  }

  // Reset method
  // https://pinia.vuejs.org/core-concepts/state.html#Resetting-the-state
  function $reset() {
    count.value = 0
  }

  return { count, doubleCount, increment, $reset }
})
