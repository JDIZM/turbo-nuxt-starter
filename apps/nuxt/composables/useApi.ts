import type { UseFetchOptions } from "nuxt/app"

/**
 * API response format from Express API
 */
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

/**
 * Composable for making typed API requests
 * Uses runtimeConfig for base URL and handles auth tokens
 */
export function useApi<T>(endpoint: string, options: UseFetchOptions<ApiResponse<T>> = {}) {
  const config = useRuntimeConfig()

  return useFetch<ApiResponse<T>>(endpoint, {
    baseURL: config.public.apiBase,
    ...options,
    onRequest({ options: reqOptions }) {
      // Add auth token if available
      const token = useCookie("access_token")
      if (token.value) {
        reqOptions.headers = new Headers(reqOptions.headers)
        reqOptions.headers.set("Authorization", `Bearer ${token.value}`)
      }
    },
    onResponseError({ response }) {
      // Handle common error cases
      if (response.status === 401) {
        // Clear token and redirect to login
        const token = useCookie("access_token")
        token.value = null
        navigateTo("/login")
      }
    },
  })
}

/**
 * Composable for making typed API requests with lazy loading
 */
export function useApiLazy<T>(endpoint: string, options: UseFetchOptions<ApiResponse<T>> = {}) {
  return useApi<T>(endpoint, { ...options, lazy: true })
}

/**
 * Helper for POST requests
 */
export function useApiPost<T>(
  endpoint: string,
  body: Record<string, unknown>,
  options: UseFetchOptions<ApiResponse<T>> = {}
) {
  return useApi<T>(endpoint, {
    method: "POST",
    body,
    ...options,
  })
}

/**
 * Helper for server-side API calls (with secret key)
 */
export function useServerApi<T>(endpoint: string, options: UseFetchOptions<ApiResponse<T>> = {}) {
  const config = useRuntimeConfig()

  return useFetch<ApiResponse<T>>(endpoint, {
    baseURL: config.public.apiBase,
    ...options,
    headers: {
      ...(options.headers as Record<string, string>),
      "X-API-Secret": config.apiSecret || "",
    },
  })
}
