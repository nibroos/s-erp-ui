<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

const id = useRoute().params.id;
</script>

<template>
  <d-form-customer :id="id" type="page" />
</template>