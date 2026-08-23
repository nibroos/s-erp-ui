<template>
  <div
    class="min-h-screen flex flex-row p-8 sm:p-0 justify-center items-center bg-zinc-50 dark:bg-zinc-900"
  >
    <div
      class="max-h-screen flex flex-row w-2/5 lg:w-1/2 md:w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-700 shadow-sm overflow-hidden rounded-xl"
    >
      <div
        v-auto-animate
        class="flex items-center p-10 lg:p-6 py-auto w-full bg-zinc-100 dark:bg-zinc-800"
      >
        <form
          @submit.prevent="authStore.loginAuth()"
          class="dark:text-zinc-100 w-full"
        >
          <div class="flex justify-between items-center">
            <div class="mb-4 text-left w-1/2">
              <p class="text-2xl font-bold mb-1 text-dark3 dark:text-primary1">
                <span>Sign-in</span>
              </p>
              <p
                class="max-w-full text-sm mx-auto text-gray-500 dark:text-zinc-400"
              >
                To access system.
              </p>
            </div>
            <div>
              <!-- dark/light theme switch -->
              <u-theme-switch />
            </div>
          </div>
          <!-- Email -->
          <div class="flex flex-col gap-4">
            <d-text-input
              v-model="form.email"
              label="Email"
              class="w-full"
              :errors="[]"
            />

            <d-text-input
              v-model="form.password"
              label="Password"
              type="password"
              class="w-full"
              :errors="[]"
            />
          </div>

          <!-- Buttons -->
          <div class="flex mt-6">
            <d-button
              :cta="'Login'"
              :class="'!bg-sc hover:!bg-scDarker text-white transition-all ease-in-out border-1.5 p-3 rounded-lg w-full'"
              :text-class="classMerge('text-white mx-auto')"
              type="submit"
              size="xl"
              @click="authStore.loginAuth()"
              no-icon
            />
          </div>
          <!-- Build identity. Helps answer "which version am I looking at?"
               before anyone has logged in — the one screen always reachable. -->
          <p
            v-if="appVersion"
            class="mt-6 text-xs text-center text-gray-400 dark:text-zinc-500 select-text"
            data-test="app-version"
          >
            {{ appVersion }}
          </p>

          <!-- <p class="text-sm mx-auto text-gray-500 text-center">
            Belum punya akun?
            <span
              class="text-teal-600 hover:text-teal-800 cursor-pointer underline"
              @click="registerView = !registerView"
              >Daftar sekarang</span
            >
          </p> -->
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useAuthStore from "@/stores/AuthStore";
import { formatVersion } from "~/utils/version";

definePageMeta({
  layout: "guest" as any,
  middleware: ["auth"],
});

const authStore = useAuthStore();
const { form, formState, registerView } = storeToRefs(authStore);

const runtimeConfig = useRuntimeConfig();
const appVersion = computed(() =>
  formatVersion(
    runtimeConfig.public.APP_VERSION,
    runtimeConfig.public.APP_BUILD
  )
);
// const token = localStorage.getItem("_token");

// onMounted(() => {
//   authStore.getProfile();

//   if (!!token) {
//     navigateTo("/");
//   }
// });

// watchEffect(() => {
//   if (!!data.value.token) {
//     console.log(data.value.token, 'tokennnn');

//     navigateTo('/')
//   }
// })
</script>