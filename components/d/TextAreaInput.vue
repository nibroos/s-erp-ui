<script setup lang="ts">
import type { VAutocomplete } from "vuetify/components";
import { property } from "lodash-es";

type SelectItemKey = VAutocomplete["$props"]["itemValue"];
type Variant = VAutocomplete["$props"]["variant"];
type Density = VAutocomplete["$props"]["density"];

interface IProps {
  disabled?: boolean;
  variant?: Variant;
  modelValue?: string | number | null;
  label?: string;
  density?: Density;
  clearable?: boolean;
  placeholder?: string;
  type?: string;
  class?: string;
  errors?: any[];
  replaceDetailsWithError?: boolean;
  initialValue?: string;
  rows?: number;
  autoGrow?: boolean;
  isStatic?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  disabled: false,
  variant: "outlined",
  modelValue: "",
  label: "",
  density: "compact",
  clearable: true,
  placeholder: "",
  type: "text",
  class: "",
  errors: () => [],
  replaceDetailsWithError: false,
  initialValue: "",
  rows: 1,
  autoGrow: true,
  isStatic: false,
});

const realValue = ref(props.modelValue);
const cloneInitialValue = props.modelValue;

const slots = useSlots();

const emits = defineEmits(["update:modelValue"]);

const updateValue = (value: string) => {
  realValue.value = value;
  emits("update:modelValue", value);
};

onMounted(() => {
  if (props.initialValue) {
    realValue.value = props.initialValue;
  }
});

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      realValue.value = newVal;
    }
  }
);

watchEffect(() => {
  if (props.isStatic) {
    console.log(
      "Static value:",
      props.modelValue,
      "Initial value:",
      cloneInitialValue
    );

    realValue.value = cloneInitialValue;
  }
});
</script>
<template>
  <div
    :class="{ 'gap-2': slots.details || errors.length > 0 }"
    class="flex flex-col"
  >
    <v-textarea
      :label="label"
      :variant="variant"
      :model-value="realValue"
      :density="density"
      :placeholder="placeholder"
      :type="type"
      :class="
        classMerge(
          'w-full text-dark1 dark:text-primary1',
          disabled
            ? 'cursor-pointer bg-zinc-200 text-dark3 dark:bg-dark1 dark:text-primary1'
            : '',
          props.class
        )
      "
      :rows="rows"
      :auto-grow="autoGrow"
      :clearable="clearable"
      @update:model-value="updateValue"
      hide-details
      :disabled="disabled"
    ></v-textarea>
    <div v-if="slots.details && !errors" class="flex flex-col gap-1 abc">
      <slot name="details" />
    </div>
    <div class="flex flex-col gap-1" v-if="!!errors">
      <div v-for="error in errors" :key="error" class="text-sm text-red-500">
        {{ error }}
      </div>
    </div>
  </div>
</template>
