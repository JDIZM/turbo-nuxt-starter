export default eventHandler((event) => {
  console.log(`New request: ${getRequestURL(event)}`)
  return "User GET"
})
