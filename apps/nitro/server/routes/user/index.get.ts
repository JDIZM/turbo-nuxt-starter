export default eventHandler((event) => {
  // eslint-disable-next-line no-console
  console.log(`New request: ${getRequestURL(event)}`);
  return 'User GET'
})
