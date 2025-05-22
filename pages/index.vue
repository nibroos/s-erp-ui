<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";

const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

const isDark = usePreferredDark();

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

onMounted(() => {
  navigateTo("/dashboard/overview");
});
</script>

<template>
  <div>
    <v-skeleton-loader
      v-for="i in 6"
      elevation="0"
      type="list-item-three-line"
      boilerplate
    ></v-skeleton-loader>
  </div>
</template>