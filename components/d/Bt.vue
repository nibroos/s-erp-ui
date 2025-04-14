<script setup lang="ts">
import type { SnackbarType } from "~/types/components/FormType";
import { classMerge } from "~/utils/strings";
// import {normalizeClass}

defineOptions({
  inheritAttrs: false,
});
const attrs = useAttrs();

// Modify your activatorBindings computed
const activatorBindings = computed(() => {
  return {
    ...attrs,
    ...props.activator,
  };
});

interface IProps {
  cta?: string;
  noIcon?: boolean;
  class?: string;
  textClass?: string;
  type?: "button" | "submit";
  icon?: string;
  iconSize?: number | string;
  iconClass?: string;
  disabled?: boolean;
  loading?: boolean | undefined;
  disabledTextClass?: string;
  disabledClass?: string;
  activateLoading?: boolean;
  isLoadingDefault?: boolean;
  isNoText?: boolean;
  maxLengthDisplay?: number | string;
  variant?: string;
  size?: string;
  title?: string;
  disabledCopy?: boolean;
  appendIcon?: string;
  isNotif?: boolean;
  notifText?: string;
  notifTimeout?: number;
  attach?: any;
  activator?: {
    [key: string]: any;
  };
}

const props = withDefaults(defineProps<IProps>(), {
  cta: "",
  noIcon: false,
  class: "",
  textClass: "text-black",
  type: "button",
  icon: "mdi-keyboard-backspace",
  iconSize: 25,
  iconClass: "",
  disabled: false,
  loading: false,
  disabledTextClass: "",
  disabledClass: "",
  activateLoading: false,
  isLoadingDefault: true,
  isNoText: false,
  maxLengthDisplay: 30,
  variant: "flat",
  size: "small",
  title: "",
  disabledCopy: true,
  appendIcon: "",
  isNotif: false,
  notifText: (props) => `${props.cta}`,
  notifTimeout: 5000,
  activator: () => ({}),
  attach: null,
});

const mergedConfig = computed(() => {
  return props;
});

const emits = defineEmits(["click", "click:loading"]);

const localLoadingState = ref<boolean | undefined>(false);
const localDisabled = ref<boolean>(props.disabled);
const localDisabledTextClass = ref<string>(props.disabledTextClass);
const handleClick = () => {
  if (localDisabled.value) return;
  emits("click");
  emits("click:loading", true);

  if (!!props.isNotif) {
    // snackbar.value.text = props.notifText;
    // snackbar.value.timeout = props.notifTimeout;
    useAlert.alertAction(props.notifText, "Notification", "success");
  }

  if (!!props.activateLoading) {
    localLoadingState.value = true;
    localDisabled.value = true;

    if (props.isLoadingDefault) {
      setTimeout(() => {
        localLoadingState.value = false;
        localDisabled.value = false;
      }, 2000);
    }
  }

  // if (props.activateLoading) {
  // localLoadingState.value = true
  // localDisabled.value = true
  // console.log('localLoadingState.value', localLoadingState.value)
  // console.log('localDisabled.value', localDisabled.value)
  // }
};

watch(
  () => mergedConfig.value.loading,
  (newVal, oldVal) => {
    localLoadingState.value = newVal;
    // if (newVal !== oldVal && typeof newVal === 'boolean') {
    //   localDisabled.value = newVal
    // }
    // console.log('oldVal', oldVal, 'newVal mergedConfig', newVal)
  },
  { deep: true, immediate: true }
);

// watch(
//   () => props.loading,
//   (newVal, oldVal) => {
//     if (newVal !== oldVal) {
//       localLoadingState.value = props.loading
//       console.log('oldVal', oldVal, 'newVal', newVal)
//       console.log(props.loading, 'props.loading')
//     }
//   },
//   { deep: true, immediate: true }
// )

// watch(
//   () => localLoadingState.value,
//   (newVal, oldVal) => {
//     if (newVal !== oldVal) {
//       localDisabled.value = newVal !== undefined ? newVal : false

//       console.log('localLoadingsState.value watch', newVal)

//       emits('click:loading', newVal)
//     }
//   }
// )

watch(
  () => props.disabled,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      localDisabled.value = newVal;
    }
  }
);

watchEffect(() => {
  localLoadingState.value = mergedConfig.value.loading;
});

onMounted(() => {});
</script>

<template>
  <slot>
    <button
      v-if="type == 'submit'"
      v-bind="activatorBindings"
      :class="
        classMerge(
          'flex cursor-pointer items-center p-1.5 transition-all ease-in-out hover:bg-zinc-100 sm:gap-x-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scDarker',
          props.class,
          `${
            localDisabled && !!disabledClass
              ? disabledClass
              : localDisabled
              ? 'cursor-not-allowed bg-zinc-400 hover:!bg-zinc-400'
              : ''
          }`
        )
      "
      @click="handleClick"
      :type="type"
      :disabled="localDisabled"
      :variant="props.variant"
      :size="props.size"
      :title="props.cta ?? props.title"
    >
      <v-icon
        :icon="props.icon"
        :size="iconSize"
        v-if="!props.noIcon && !props.loading"
        :class="props.iconClass"
      />

      <span
        v-if="!props.isNoText"
        :class="
          classMerge(
            'flex items-center justify-center font-medium capitalize transition-all ease-in-out',
            props.textClass,
            `${
              localDisabled && !!localDisabledTextClass
                ? localDisabledTextClass ?? 'text-zinc-400'
                : ''
            }`,
            `${localLoadingState ? 'flex-row gap-3' : ''}`
          )
        "
      >
        <v-progress-circular
          indeterminate
          size="20"
          v-if="localLoadingState"
        ></v-progress-circular>
        <span>
          {{ props.cta }}
        </span>
      </span>
    </button>
    <button
      v-else
      v-bind="activatorBindings"
      :class="
        classMerge(
          'flex cursor-pointer flex-row items-center transition-all ease-in-out hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scDarker',
          props.class,
          `${localDisabled ? 'cursor-not-allowed' : ''}`
        )
      "
      @click="handleClick"
      :type="type"
      :disabled="localDisabled"
      :title="props.cta ?? props.title"
      :variant="props.variant"
      :size="props.size"
    >
      <v-icon
        :icon="props.icon"
        :size="iconSize"
        v-if="!props.noIcon && !props.loading"
        :class="props.iconClass"
      />
      <span
        v-if="!props.isNoText"
        :class="
          classMerge(
            'flex items-center justify-center font-medium capitalize transition-all ease-in-out',
            props.textClass,
            `${
              localDisabled && !!localDisabledTextClass
                ? localDisabledTextClass ?? 'text-zinc-400'
                : ''
            }`,
            `${localLoadingState ? 'flex-row gap-3' : ''}`
          )
        "
      >
        <v-progress-circular
          indeterminate
          size="20"
          v-if="localLoadingState"
        ></v-progress-circular>
        <slot name="cta" :item="props">
          <d-shorttext
            :text="props.cta"
            :class="props.textClass"
            :max-length="Number(props.maxLengthDisplay)"
          />
        </slot>
        <slot name="append-cta" :item="props" />
      </span>
    </button>
  </slot>
</template>
