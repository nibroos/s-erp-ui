<script setup lang="ts">
import useLayouts from "~/stores/configs/LayoutsStore";

import { useTheme } from "vuetify";

const theme = useTheme();
const { setTheme } = useThemeSwitch();

const initialTheme = () => {
  setTheme();

  const storageTheme = localStorage.getItem("theme");
  if (
    storageTheme === "dark" ||
    (!storageTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    theme.global.name.value = "dark";
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    theme.global.name.value = "light";
    localStorage.setItem("theme", "light");
  }
};

onMounted(() => {
  initialTheme();
});

const layoutState = useLayouts();
const {
  titlePath,
  subTitlePath,
  lastPathSegment,
  parentTitle,
  topTitle,
  lastFullPath,
  isCloseSidebar,
  currentRoute,
  lastVisitedMasterRoute,
  currentRouteName,
} = storeToRefs(layoutState);

const route = useRoute();

const handleClikSidebar = () => {
  if (isCloseSidebar.value) {
    isCloseSidebar.value = false;
  } else {
    isCloseSidebar.value = true;
  }
};

// watchEffect(() => {
//   if (!!route) {
//     layoutState.defineTitlePath();
//     layoutState.lastVisitedRoute = route.fullPath;
//   }
// });

watchEffect(() => {
  layoutState.defineTitlePath();
});

onMounted(() => {
  console.log("Updated20250323-1NB");
  // layoutState.defineTitlePath();
});

onBeforeUnmount(() => {
  lastFullPath.value = route.fullPath;
});
</script>

<template>
  <div class="z-10 h-screen w-full text-zinc-900 dark:text-zinc-50">
    <v-app class="bg-white dark:!bg-dark3">
      <!-- ---------------------------------------------- -->
      <!---Sidebar -->
      <!-- ---------------------------------------------- -->
      <v-navigation-drawer
        left
        class="leftSidebar transition delay-75 ease-in-out"
        variant="flat"
        :rail="isCloseSidebar"
        expand-on-hover
        color="#1E293A"
        temporary
        permanent
      >
        <LayoutSidebar />
      </v-navigation-drawer>

      <!-- ---------------------------------------------- -->
      <!---Header -->
      <!-- ---------------------------------------------- -->
      <v-app-bar
        elevation="0"
        class="!bg-zinc-50 dark:!bg-dark3 !border-b !border-dark1"
      >
        <div class="flex justify-between items-center w-full">
          <v-app-bar-nav-icon class="" @click.stop="handleClikSidebar" flat />

          <div class="flex items-center justify-between">
            <div class="mb-3">
              <slot name="buttonBack" />
            </div>

            <h1
              class="text-xl font-bold leading-5 md:text-2xl md:leading-6 lg:text-3xl lg:leading-10"
            >
              <slot name="titleHeader" />
            </h1>
            <div class="flex flex-col">
              <h1 class="text-xl font-semibold capitalize whitespace-nowrap">
                {{ topTitle.replace(/-/g, " ") }}
              </h1>
              <div class="flex w-full items-center">
                <v-breadcrumbs
                  :items="currentRoute"
                  density="compact"
                  class="!p-0"
                  color="blue"
                  active-class="!opacity-100"
                >
                  <template #divider>
                    <v-icon icon="mdi-chevron-right"></v-icon>
                  </template>
                  <template #title="{ item }">
                    <span
                      v-if="!!item.active"
                      class="text-sm capitalize whitespace-nowrap"
                      :class="
                        classMerge(
                          'text-scDarker2 dark:!text-scDarker2 font-bold opacity-100'
                        )
                      "
                    >
                      {{ item.title }}
                    </span>
                    <nuxt-link
                      v-else
                      :to="item.href"
                      class="text-sm capitalize whitespace-nowrap"
                      role="button"
                      :class="classMerge('!text-dark2 dark:!text-primary1')"
                    >
                      {{ item.title }}
                    </nuxt-link>
                    <!-- test abc{{ item.disabled }} -->
                  </template>
                </v-breadcrumbs>
                <!-- <div v-if="parentTitle" class="flex flex-row items-center">
                  <h1 class="text-base">{{ parentTitle }}</h1>
                </div>
                <div v-if="titlePath" class="flex items-center">
                  <div
                    class="h-2 w-2 rounded-full mx-2 bg-zinc-900 dark:!bg-scDarker"
                  />
                  <p class="text-sm capitalize">
                    {{ titlePath.replace(/-/g, " ") }}
                  </p>
                </div>

                <div v-if="subTitlePath" class="flex items-center">
                  <div
                    class="h-2 w-2 rounded-full mx-2 bg-zinc-900 dark:!bg-scDarker"
                  />
                  <p class="text-sm capitalize">
                    {{ subTitlePath.replace(/-/g, " ") }}
                  </p>
                </div>

                <div v-if="lastPathSegment" class="flex items-center">
                  <div
                    class="h-2 w-2 rounded-full mx-2 bg-zinc-900 dark:!bg-scDarker"
                  />
                  <p class="text-sm capitalize">{{ lastPathSegment }}</p>
                </div> -->
              </div>
            </div>
          </div>
          <v-spacer />
          <LayoutHeader />
        </div>
      </v-app-bar>
      <v-container fluid class="page-wrapper">
        <v-main class="">
          <div class="h-full w-full">
            <slot />
          </div>
        </v-main>
      </v-container>
    </v-app>
  </div>
</template>
