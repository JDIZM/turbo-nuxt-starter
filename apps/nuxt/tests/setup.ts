import { cleanup } from "@testing-library/vue"
import { afterEach } from "vitest"

// Run cleanup after each test
afterEach(() => {
  cleanup()
})
