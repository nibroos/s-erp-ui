<script setup lang="ts">
import type { FormLayoutType, LoadingsType } from "~/types/FormLayoutType";
import { classMerge } from "~/utils/strings";
import type { FieldSelectableType } from "../../types/SelectTableType";
import type { DisplayColumnType } from "~/types/DatatableClientType";

type TProps = {
  inputs: FieldSelectableType[];
  contentClass?: string | string[];
};

const defaultProps: TProps = {
  inputs: [],
  contentClass: "",
};

const props = defineProps<TProps>();

const slots = useSlots();

const fields = ref<FieldSelectableType[]>(props.inputs);

const emits = defineEmits([
  "click:create",
  "click:save",
  "click:cancel",
  "click:pdf",
  "click:csv",
  "update:currentTab",
  "update:triggerLayout",
  "click:duplicate",
  "click:clear",
  "click:save:loading",
  "click:pdf:loading",
  "click:csv:loading",
  "click:duplicate:loading",
  "click:clear:loading",
  "click:submit",
]);

const isColumnDisplay = (
  formOption: FieldSelectableType,
  type: DisplayColumnType
): boolean => {
  if (formOption.type == type) {
    return true;
  } else if (formOption.type == "view") {
    return true;
  } else if (formOption.type == "disabled") {
    return true;
  } else if (formOption.type == "autocomplete-client") {
    return true;
  } else if (formOption.type == "autocomplete") {
    return true;
  } else if (formOption.type == "date") {
    return true;
  } else if (formOption.type == "datetime") {
    return true;
  } else if (formOption.type == "currency") {
    return true;
  } else if (formOption.type == "number") {
    return true;
  } else if (formOption.type == "boolean") {
    return true;
  } else if (formOption.type == "image") {
    return true;
  }
  return false;
};

const submitModal = () => {
  emits("click:submit", fields.value);
};

defineExpose({
  submitModal,
});

watch(
  () => props.inputs,
  (newVal) => {
    fields.value = newVal;
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <form
    @submit.prevent="submitModal()"
    :class="
      classMerge(
        'grid grid-cols-4 md:grid-cols-1 gap-2 pt-1',
        props.contentClass
      )
    "
  >
    <div v-for="(modelForm, keyModelForm) in fields" :key="keyModelForm">
      <slot
        :name="`input:${keyModelForm}`"
        v-bind="{
          item: modelForm,
          configKey: fields[keyModelForm],
          keyModelForm: keyModelForm,
          options: modelForm,
          fields: fields,
        }"
      >
        <div v-if="isColumnDisplay(modelForm, 'text')" :class="classMerge('')">
          <d-text-input
            :model-value="fields[keyModelForm].payload"
            @update:model-value="fields[keyModelForm].payload = $event"
            :label="modelForm.title"
          />
        </div>
        <div v-if="isColumnDisplay(modelForm, 'view')" class="">
          {{ modelForm.title }}
        </div>
        <div v-if="isColumnDisplay(modelForm, 'disabled')" class="">
          <d-text-input
            :model-value="fields[keyModelForm].payload"
            @update:model-value="fields[keyModelForm].payload = $event"
            :label="modelForm.title"
            :disabled="true"
          />
        </div>
        <div v-if="isColumnDisplay(modelForm, 'autocomplete-client')" class="">
          <d-autocomplete-client
            :model-value="fields[keyModelForm].payload"
            @update:model-value="fields[keyModelForm].payload = $event"
            :label="modelForm.title"
            :items="modelForm.others?.items"
            :item-title="modelForm.others?.itemTitle ?? 'name'"
            :item-value="modelForm.others?.itemValue ?? 'id'"
            :is-display-multiple-key="
              modelForm.others?.isDisplayMultipleKey ?? false
            "
            :display-multiple-keys="
              modelForm.others?.displayMultipleKeys ?? ['id', 'name']
            "
            :max-length-display="modelForm.others?.maxLengthDisplay ?? 70"
          />
        </div>
        <div v-if="isColumnDisplay(modelForm, 'date')" class="">
          <d-date-picker-light
            v-model="fields[keyModelForm].payload"
            :label="modelForm.title"
            :dp-class="modelForm.others?.dpClass"
            :clearable="modelForm.others?.clearable"
            :placeholder="modelForm.placeholder"
            :density="modelForm.others?.density"
            :variant="modelForm.others?.variant"
          ></d-date-picker-light>
        </div>
        <div v-if="isColumnDisplay(modelForm, 'datetime')" class="">
          <d-date-picker-light
            v-model="fields[keyModelForm].payload"
            :label="modelForm.title"
            :dp-class="modelForm.others?.dpClass"
            :clearable="modelForm.others?.clearable"
            :placeholder="modelForm.placeholder"
            :density="modelForm.others?.density"
            :variant="modelForm.others?.variant"
          ></d-date-picker-light>
        </div>
        <div v-if="isColumnDisplay(modelForm, 'currency')" class="">
          {{ modelForm.title }}
        </div>
        <div v-if="isColumnDisplay(modelForm, 'number')" class="">
          <d-num-v-format
            :label="modelForm.title"
            :reverse="false"
            :hide-currency-display="true"
            v-model="fields[keyModelForm].payload"
          />
        </div>
        <div v-if="isColumnDisplay(modelForm, 'boolean')" class="">
          {{ modelForm.title }}
        </div>
        <div v-if="isColumnDisplay(modelForm, 'image')" class="">
          {{ modelForm.title }}
        </div>
      </slot>
    </div>

    <slot
      :name="`input:append`"
      v-bind="{
        fields: fields,
      }"
    ></slot>
    <button type="submit" class="hidden"></button>
  </form>
</template>
