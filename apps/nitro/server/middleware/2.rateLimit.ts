import { HttpErrors } from "helpers"

interface RateLimitStore {
  count: number
  resetTime: number
}

// In-memory store for rate limiting (use Redis in production for multi-instance setups)
const store = new Map<string, RateLimitStore>()

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 100

/**
 * Rate limiting middleware
 * Standard limit: 100 requests per 15 minutes per IP
 */
export default defineEventHandler((event) => {
  const ip = getRequestIP(event) || "unknown"
  const now = Date.now()

  // Get or create rate limit entry
  let entry = store.get(ip)

  // Reset if window expired
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + WINDOW_MS
    }
    store.set(ip, entry)
  }

  // Increment count
  entry.count++

  // Check if limit exceeded
  if (entry.count > MAX_REQUESTS) {
    throw HttpErrors.TooManyRequests(
      "Too many requests, please try again later"
    )
  }

  // Add rate limit headers
  setResponseHeaders(event, {
    "X-RateLimit-Limit": String(MAX_REQUESTS),
    "X-RateLimit-Remaining": String(Math.max(0, MAX_REQUESTS - entry.count)),
    "X-RateLimit-Reset": new Date(entry.resetTime).toISOString()
  })

  // Cleanup expired entries periodically (every 100 requests)
  if (Math.random() < 0.01) {
    for (const [key, value] of store.entries()) {
      if (now > value.resetTime) {
        store.delete(key)
      }
    }
  }
})
