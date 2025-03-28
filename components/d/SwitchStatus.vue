<script setup lang="ts">
const emit = defineEmits(["update:modelValue"]);

type IProps = {
  modelValue: number | null | undefined;
  label: string;
  class?: string;
  trueValue?: any;
  falseValue?: any;
  color?: string;
};

const props = withDefaults(defineProps<IProps>(), {
  modelValue: 0,
  label: "",
  class: "",
  trueValue: 1,
  falseValue: 0,
  color: "brown",
});

const switchActive = ref<number | string | null | undefined>(props.modelValue);

const toggleSwitch = () => {
  switchActive.value = switchActive.value == 1 ? 0 : 1;
  emit("update:modelValue", switchActive.value);
};

// watch(
//   () => props.modelValue,
//   (oldValue, newValue) => {
//     if (oldValue != newValue) {
//       console.log("newValue", oldValue, newValue);

//       switchActive.value = newValue;
//     }
//   },
//   { immediate: true, deep: true }
// );

watch(
  () => props.modelValue,
  (newValue) => {
    switchActive.value = newValue;
  },
  { immediate: true }
);
</script>
<template>
  <v-switch
    :label="props.label"
    :class="
      classMerge('text-dark3 dark:text-primary1 whitespace-nowrap', props.class)
    "
    :modelValue="switchActive"
    @update:modelValue="toggleSwitch"
    hide-details
    :true-value="props.trueValue"
    :false-value="props.falseValue"
    :color="props.color"
    inset
  />
</template>