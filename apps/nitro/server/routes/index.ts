export default eventHandler((event) => {
  console.log(`New request: ${getRequestURL(event)}`)
  return "Start by editing <code>server/routes/index.ts</code>."
})
