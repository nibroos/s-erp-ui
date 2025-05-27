<script setup lang="ts">
import type { TiptapType } from "~/types/components/TiptapType";
import {
  BaseKit,
  Bold,
  Color,
  Fullscreen,
  Heading,
  Highlight,
  History,
  BulletList,
  OrderedList,
  Blockquote,
  Image,
  Italic,
  Link,
  Strike,
  Table,
  Underline,
  Video,
  Clear,
  Indent,
  TextAlign,
  FontFamily,
  FontSize,
  SubAndSuperScript,
  VuetifyTiptap,
  VuetifyViewer,
} from "vuetify-pro-tiptap";
import "vuetify-pro-tiptap/style.css"; // import all(editor and markdown) styles
// import "vuetify-pro-tiptap/styles/editor.css";
// import "vuetify-pro-tiptap/styles/editor.css"; // only use editor style, not using markdown style
import "~/assets/css/erp.scss";

const extensions = [
  BaseKit.configure({
    placeholder: {
      placeholder: "Enter some text...",
    },
    characterCount: false,
  }),
  Bold,
  Italic,
  Underline,
  Strike,
  Indent,
  TextAlign,
  Color,
  FontFamily,
  FontSize,
  Heading,
  Link,
  Highlight,

  Image.configure({
    // imageTabs: [{ name: 'SELECT', component: markRaw(SelectImage) }],
    hiddenTabs: ["upload"],
    // upload(file: File) {
    //   const url = URL.createObjectURL(file)
    //   console.log('mock upload api :>> ', url)
    //   return Promise.resolve(url)
    // }
  }),
  Video,
  Table,
  Fullscreen.configure({
    spacer: false,
    useWindow: true,
  }),
  History,
  BulletList.configure({
    keepAttributes: true,
    HTMLAttributes: {
      style: "list-style-type: disc; padding-left: 1.5rem;",
    },
  }),
  OrderedList.configure({
    keepAttributes: true,
    HTMLAttributes: {
      style: "list-style-type: decimal; padding-left: 1.5rem;",
    },
  }),
  Blockquote,
  SubAndSuperScript,
  Clear,
];

const props = withDefaults(defineProps<TiptapType>(), {
  modelValue: "",
  placeholder: "Type something...",
  label: "",
  class: "",
  disabled: false,
  readonly: false,
  hideToolbar: false,
});

const textValue = ref(props.modelValue);

const emit = defineEmits([
  "update:modelValue",
  "click:clear",
  "click:selected",
  "after:fetch",
]);

// watch(
//   () => props.modelValue,
//   (newValue) => {
//     textValue.value = newValue;
//     emit("update:modelValue", newValue);
//   },
//   { immediate: true }
// );
const content = ref("");

watch(
  () => props.modelValue,
  (value) => {
    const isSame = textValue.value === value;

    if (isSame) {
      return;
    }

    textValue.value = value;
  },
  { immediate: true }
);

watch(
  () => textValue.value,
  (value) => {
    const isSame = value === props.modelValue;

    if (isSame) {
      return;
    }

    emit("update:modelValue", value);
  },
  { immediate: true }
);
</script>

<template>
  <div :class="classMerge(props.class)">
    <!-- <label for="editor" class="text-sm font-medium text-grey3">
      {{ props.label }}
    </label> -->
    <VuetifyTiptap
      v-model="textValue"
      :label="props.label"
      rounded
      :min-height="50"
      :max-height="200"
      :max-width="1200"
      :extensions="extensions"
      dense
      outlined
      :disabled="props.disabled"
      :readonly="props.readonly"
      :placeholder="props.placeholder"
      :hide-toolbar="props.hideToolbar"
    >
      <template #bottom>
        <div></div>
      </template>
    </VuetifyTiptap>
    <!-- <VuetifyViewer :value="textValue" markdown-theme="github" /> -->
  </div>
</template>