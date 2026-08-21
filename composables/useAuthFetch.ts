import axios from 'axios'
import type { AuthUserType } from '~/types/AuthType'

// Dedicated axios client for the s-erp-auth microservice.
//
// withCredentials:true is REQUIRED so the browser sends/receives the httpOnly
// refresh cookie on /refresh and /logout. The refresh token itself is never
// readable from JS (that is the whole point) — we only ever hold the short-lived
// access token in memory/localStorage.
export const useAuthFetch = function () {
  const config = useRuntimeConfig()
  const AUTH_URL = config.public.AUTH_URL

  const client = axios.create({
    baseURL: AUTH_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Lets the auth service attribute sessions to this app (multi-app ready).
      'X-Client-Id': 's-erp-ui'
    }
  })

  // Attach the current access token when present (used by /me).
  client.interceptors.request.use((cfg) => {
    const authStore = JSON.parse(
      localStorage.getItem('AuthStore') || '{}'
    ) as { authUser?: AuthUserType }
    const token = authStore?.authUser?.optional?.token || null
    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`
    }
    return cfg
  })

  return client
}
