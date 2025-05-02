<template>
  <d-button
    @click="toggleGlobalTheme()"
    icon="mdi-theme-light-dark"
    is-no-text
    class="p-2 !bg-zinc-200 dark:!bg-transparent rounded-full ease-in-out transition-all hover:!bg-zinc-300 dark:hover:!bg-zinc-600"
    text-class="text-zinc-100 dark:text-zinc-400"
    icon-class="text-zinc-500 dark:text-zinc-400"
    rounded="xl"
    size=""
  ></d-button>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";

const theme = useTheme();
const { toggleTheme } = useThemeSwitch();

const toggleGlobalTheme = (): void => {
  toggleTheme();
  AuthStore().theme = theme.global.current.value.dark ? "light" : "dark";
  theme.global.name.value = AuthStore().theme;
};
</script>