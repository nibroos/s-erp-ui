import { useAuth } from "~/composables/useAuth";
import useAuthStore from "~/stores/AuthStore";
import type { AuthUserType } from "~/types/AuthType";

// Silent-refresh auth guard.
//
// Access token = 15 min, refresh token = 30 days (httpOnly cookie held by the
// auth service). When the SHORT access token has expired we do NOT log the user
// out — we first try to exchange the refresh cookie for a new access token. The
// user is only sent back to /login when that refresh also fails (refresh token
// expired/revoked). This is what turns "expired in 15 min → must log in again"
// into "log in once, keep working for 30 days".
export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return; // client-only: refresh cookie + localStorage live in the browser

  const { isTokenExpired, jwtVerify } = useAuth;
  const authStore = useAuthStore();

  // Snapshot the persisted session.
  const persisted = JSON.parse(localStorage.getItem("AuthStore") || "{}") as {
    authUser?: AuthUserType;
  };
  let token = persisted?.authUser?.optional?.token || null;

  // Never logged in → login page.
  if (!persisted?.authUser || !token) {
    if (to.path !== "/login") return navigateTo("/login");
    return;
  }

  const accessUsable = jwtVerify(token) && !isTokenExpired();

  // Already on /login with a still-valid access token → go home.
  if (to.path === "/login") {
    if (accessUsable) return navigateTo("/");
    return; // let them sit on the login form
  }

  // Protected route, but the short access token is dead → try a silent refresh
  // using the 30-day refresh cookie before giving up.
  if (!accessUsable) {
    const newToken = await authStore.refreshAuth();
    if (!newToken) {
      // Refresh token also invalid/expired/revoked → real logout.
      localStorage.removeItem("_token");
      localStorage.removeItem("expired");
      return navigateTo("/login");
    }
    token = newToken; // refreshed transparently; continue as normal
  }

  // Restore the last visited route if one was stashed.
  const lastVisited = localStorage.getItem("_lastVisited");
  if (lastVisited && to.path !== lastVisited) {
    return navigateTo(lastVisited);
  }
});
