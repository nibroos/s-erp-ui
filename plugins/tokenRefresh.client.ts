// Proactive access-token refresh.
//
// Access token = 15 min, refresh token = 30 days (httpOnly cookie). Rather than
// wait for a request to fail with 401, we refresh ~1 minute BEFORE the access
// token expires, so the user never experiences an interruption. The route
// middleware and the API 401 interceptor remain as safety nets; all three go
// through the single coalesced refreshAuth(), so they can never collide.
import useAuthStore from "~/stores/AuthStore";

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();

  let timer: ReturnType<typeof setTimeout> | null = null;
  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const schedule = () => {
    clear();

    const token = authStore.authUser?.optional?.token;
    const expired = authStore.expired || localStorage.getItem("expired");
    if (!token || !expired) return; // not logged in

    const expMs = new Date(expired).getTime();
    if (Number.isNaN(expMs)) return;

    // Fire 60s before expiry; clamp to [5s, ~24 days] to stay within setTimeout limits.
    const delay = Math.min(
      Math.max(expMs - Date.now() - 60_000, 5_000),
      2_147_000_000
    );

    timer = setTimeout(() => {
      // The timer fires outside any Nuxt context; runWithContext restores it so
      // refreshAuth() → useAuthFetch() → useRuntimeConfig() are legal here.
      nuxtApp.runWithContext(async () => {
        const newToken = await authStore.refreshAuth();
        // On success, `expired` changes → the watcher below reschedules the next
        // refresh. On failure, stop; the middleware/interceptor will handle the
        // eventual logout once the refresh token is truly gone.
        if (!newToken) clear();
      });
    }, delay);
  };

  // (Re)schedule whenever the token expiry changes — i.e. after login and after
  // every successful refresh. `immediate` also covers a reload with a live session.
  watch(() => authStore.expired, schedule, { immediate: true });
});
