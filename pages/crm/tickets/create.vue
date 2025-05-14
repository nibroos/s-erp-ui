<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});
</script>

<template>
  <d-form-ticket type="page" />
</template>