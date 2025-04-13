<script setup lang="ts">
type ImgType = {
  src: string;
  alt?: string;
  class?: string;
  style?: string;
  width?: string | number;
  cover?: boolean;
  aspectRatio?: string | number;
  height?: string | number;
};
// props
const props = withDefaults(defineProps<ImgType>(), {
  src: "",
  alt: "Image",
  class: "",
  style: "",
  width: "",
  cover: true,
  aspectRatio: "1",
  height: "",
});

const config = useRuntimeConfig();
const IMG_BASE_URL = config.public.BASE_URL_IMAGE;
</script>

<template>
  <v-img
    :aspect-ratio="props.aspectRatio"
    :alt="props.alt"
    :src="`${IMG_BASE_URL}/${props.src}`"
    :width="props.width"
    :cover="props.cover"
    :class="classMerge('border border-solid border-grey3', props.class)"
  ></v-img>
</template>
