import { useAuth } from "~/composables/useAuth";
import type { AuthUserType } from "~/types/AuthType";

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return; // Avoid execution on the server-side

  const { isTokenExpired, jwtVerify } = useAuth;

  // Retrieve the auth store from localStorage
  const authStore = JSON.parse(localStorage.getItem("AuthStore") || "{}") as { authUser: AuthUserType };
  if (!authStore || !authStore.authUser) {
    if (to.path !== "/login") {
      return navigateTo("/login"); // Redirect to login if no auth data exists
    }
    return;
  }

  const token = authStore.authUser.optional?.token || null;
  const lastVisited = localStorage.getItem("_lastVisited");

  // If the user is already on the login page and has a valid token, redirect to the home page
  if (to.path === "/login") {
    if (token && jwtVerify(token)) {
      return navigateTo("/");
    }
    return;
  }

  // Verify the token and check if it's expired
  if (!token || !jwtVerify(token) || isTokenExpired()) {
    if (to.path !== "/login") {
      localStorage.removeItem("_token");
      localStorage.removeItem("expired");
      return navigateTo("/login"); // Redirect to login if the token is invalid or expired
    }
    return;
  }

  // Redirect to the last visited page if it exists
  if (lastVisited && to.path !== lastVisited) {
    return navigateTo(lastVisited);
  }
});