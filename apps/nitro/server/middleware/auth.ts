export default defineEventHandler((event) => {
  // Extends or modify the event
  event.context.user = { name: 'Nitro' }
})
