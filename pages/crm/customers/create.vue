<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});
</script>

<template>
  <d-form-customer type="page" />
</template>