import axios from "axios";
import type { AuthUserType } from "~/types/AuthType";
// NOTE: AuthStore is imported lazily inside the 401 handler (not at module top)
// to avoid a static import cycle — AuthStore imports useMyFetch, and every store
// imports useMyFetch, so a top-level `import useAuthStore` here would put a cycle
// under the whole app.
// import { API } from "~/config/api";

export const useMyFetch = function () {
  const config = useRuntimeConfig();
  const API_URL = config.public.API;
  // Captured here (valid context) so the 401 handler — which runs in an axios
  // callback outside any Nuxt context — can restore context via runWithContext.
  const nuxtApp = useNuxtApp();

  const headers = {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }

  const baseApi = axios.create({
    headers: headers,
    baseURL: API_URL,
  });

  baseApi.interceptors.request.use(config => {
    // const token = localStorage.getItem("_token");

    let authStore = JSON.parse(localStorage.getItem('AuthStore') || '{}') as { authUser: AuthUserType }
    const token = authStore?.authUser?.optional?.token || null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  })

  // On a 401 (expired short-lived access token), transparently refresh once via
  // the httpOnly refresh cookie and replay the original request. A single
  // guarded retry avoids infinite loops; concurrent 401s share one refresh.
  baseApi.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error?.config;
      const status = error?.response?.status;

      if (status !== 401 || !original || original._retry) {
        return Promise.reject(error);
      }
      original._retry = true;

      try {
        // refreshAuth() coalesces concurrent callers into one request, so many
        // simultaneous 401s (and the middleware/scheduler) share a single refresh.
        const { default: useAuthStore } = await import("~/stores/AuthStore");
        // runWithContext lets refreshAuth() call useRuntimeConfig()/useAuthFetch()
        // legally from inside this axios callback.
        const newToken = await nuxtApp.runWithContext(() => useAuthStore().refreshAuth());

        if (!newToken) {
          // Refresh failed → session is truly over.
          nuxtApp.runWithContext(() => useAuthStore().logoutUser());
          return Promise.reject(error);
        }

        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return baseApi(original);
      } catch (e) {
        return Promise.reject(e);
      }
    }
  );


  return baseApi;
};
