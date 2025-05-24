<script setup lang="ts">
import { useCurrencyInput } from "vue-currency-input";
import type { VAutocomplete } from "vuetify/components";
import { classMerge } from "#imports";
import type { SnackbarType } from "~/types/components/FormType";

type Variant = VAutocomplete["$props"]["variant"];
type Density = VAutocomplete["$props"]["density"];

enum CurrencyDisplay {
  symbol = "symbol",
  narrowSymbol = "narrowSymbol",
  code = "code",
  name = "name",
  hidden = "hidden",
}

enum ValueScaling {
  precision = "precision",
  thousands = "thousands",
  millions = "millions",
  billions = "billions",
}

interface NumberRange {
  min?: number;
  max?: number;
}

interface CurrencyInputOptions {
  autoSign?: boolean;
  accountingSign?: boolean;
  autoDecimalDigits?: boolean;
  currency: string;
  currencyDisplay?: CurrencyDisplay;
  hideCurrencySymbolOnFocus?: boolean;
  hideGroupingSeparatorOnFocus?: boolean;
  hideNegligibleDecimalDigitsOnFocus?: boolean;
  locale?: string;
  precision?: NumberRange | number;
  useGrouping?: boolean;
  valueRange?: NumberRange;
  valueScaling?: ValueScaling;
}

// type CurrencyDisplay = 'symbol' | 'narrowSymbol'

interface IProps {
  modelValue: number | null | undefined;
  precision?: NumberRange;
  valueRange?: NumberRange;
  decimal?: string;
  separator?: string;
  prefix?: string;
  suffix?: string;
  nullValue?: number | string;
  masked?: boolean;
  class?: string;
  minimumFractionDigits?: number;
  initialValue?: number | string;
  label?: string;
  clearable?: boolean;
  variant?: Variant;
  density?: Density;
  disabled?: boolean;
  reverse?: boolean;
  currency?: string;
  currencyDisplay?: any; // CurrencyDisplay
  hideDetails?: boolean;
  hideCurrencyDisplay?: boolean;
  hideNegligibleDecimalDigitsOnFocus?: boolean;
  placeholder?: string;
  disabledCopy?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  precision: () =>
    ({
      min: 3,
      max: 3,
    } as NumberRange),
  decimal: ".",
  separator: ",",
  prefix: "⠀",
  suffix: "",
  nullValue: "",
  masked: false,
  reverseFill: false,
  class: "",
  minimumFractionDigits: 3,
  initialValue: 0,
  label: "",
  clearable: false,
  variant: "outlined",
  density: "compact",
  disabled: false,
  reverse: true,
  currency: "IDR",
  currencyDisplay: CurrencyDisplay.narrowSymbol,
  hideDetails: true,
  hideCurrencyDisplay: false,
  hideNegligibleDecimalDigitsOnFocus: false,
  autoSign: true,
  accountingSign: false,
  placeholder: (props) => `0`,
  disabledCopy: true,
});

const currencyInputOptions = ref({
  currency: props.currency,
  currencyDisplay: props.currencyDisplay,
  hideCurrencySymbolOnFocus: false,
  hideGroupingSeparatorOnFocus: false,
  hideNegligibleDecimalDigitsOnFocus: props.hideNegligibleDecimalDigitsOnFocus,
  precision: props.precision,
  valueRange: props.valueRange,
  accountingSign: props.accountingSign,
  autoSign: props.autoSign,
} as CurrencyInputOptions);

const emits = defineEmits(["input:model-value", "update:modelValue", "change"]);

const emitValue = (value: any): void => {
  if (!value) {
    value = 0;
  }
  emits("input:model-value", Number(value));
  emits("update:modelValue", Number(value));
  emits("change", Number(value));
  // console.log(value);
};

const snackbar = ref<SnackbarType>({
  isOpen: false,
  text: "Text copied!",
  timeout: 2000,
});

const { inputRef, formattedValue, numberValue, setValue, setOptions } =
  useCurrencyInput(currencyInputOptions.value);

const handleClick = () => {
  if (!!props.disabledCopy && !!props.disabled) {
    snackbar.value.isOpen = true;
    snackbar.value.text = `${numberValue.value} copied to clipboard!`;

    navigator.clipboard.writeText(numberValue.value?.toString() as string);
  }
};

watch(
  () => props.currency,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      currencyInputOptions.value.currency = newVal;
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => currencyInputOptions.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      setOptions(newVal);
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => props.modelValue,
  (value: any) => {
    // console.log(value,'aaaa');
    setValue(value);
    //  console.log(value,'ssdf');

    emitValue(numberValue.value);
  }
);

watch(
  () => numberValue.value,
  (value: any) => {
    emitValue(value);
  }
);

// with this, focus can be moved to another input field via arrow key
defineExpose({
  focus: () => inputRef.value?.focus(),
});

onMounted(() => {
  // console.log(props.modelValue,'porp');

  let value = Number(props.modelValue);

  if (!!props.initialValue) {
    value = Number(props.initialValue);
  }

  // console.log(props.modelValue,'porp 2');
  emitValue(value);
});

watchEffect(() => {
  if (props.hideCurrencyDisplay) {
    currencyInputOptions.value.currencyDisplay = CurrencyDisplay.hidden;
  }
});
</script>

<template>
  <div @click="handleClick">
    <v-text-field
      ref="inputRef"
      v-model="formattedValue"
      :density="props.density"
      :variant="props.variant"
      :suffix="props.suffix"
      :label="props.label"
      :hide-details="props.hideDetails"
      :class="
        classMerge(
          'h-max dark:!text-primary1',
          disabled
            ? 'dark:!text-primary1 bg-zinc-200 text-dark3 dark:bg-dark1 cursor-pointer'
            : '',
          props.class
        )
      "
      :clearable="props.clearable"
      :reverse="props.reverse"
      :disabled="props.disabled"
      :placeholder="props.placeholder"
    />

    <v-snackbar v-model="snackbar.isOpen" :timeout="snackbar.timeout">
      {{ snackbar.text }}
    </v-snackbar>
  </div>
</template>
