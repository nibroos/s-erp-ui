<script setup lang="ts">
import type { VAutocomplete } from "vuetify/components";
import type { AutocompleteClientType } from "~/types/AutocompleteType";

const props = withDefaults(defineProps<AutocompleteClientType>(), {
  disabled: false,
  variant: "outlined",
  items: () => [],
  label: undefined,
  itemTitle: "title",
  itemValue: "value",
  density: "compact",
  displaySelectedTitleKey: "name",
  query: (): any => ({} as any),
  clearable: true,
  aClass: "",
  class: "",
  initialValue: "",
  placeholder: (props) => `Select/search ${props.label}`,
  chips: false,
  maxLengthDisplay: 16,
  startAlignDisplay: "left",
  isDisplayMultipleKey: false,
  displayMultipleKeys: () => ["id", "name"],
  displayMultipleSeparator: " - ",
  checkDuplicate: false,
});

const vAComp = ref<VAutocomplete>();
const shadowTab = ref<HTMLElement>();
const page = ref<number>(1);
const loadingData = ref<boolean>(false);
const loadingSearch = ref<boolean>(false);
const isFocused = ref<boolean>(false);
const isMenuShow = ref<boolean>(false);
const innerSearch = useDebouncedRef<string>("");
const queryString = ref<string>("");
const selectedDetails = ref<any>(undefined);
const options = ref<any[]>(props.items);
const displayTitle = ref<string>("");
const initialLoadSingle = ref<boolean>(false);
const initialItems = ref<any[]>(props.items);
let queryObject = ref<any>({});

const selected = ref<any>(undefined);
const emit = defineEmits([
  "update:modelValue",
  "click:clear",
  "click:selected",
]);

const onMenuChange = (menuState: boolean) => {
  isMenuShow.value = menuState;
};

const onFocus = (focusState: boolean) => {
  isFocused.value = focusState;
  if (focusState) {
    innerSearch.value = "";
  }
};

const handleClear = async () => {
  options.value = initialItems.value;
  emit("click:clear");
};
const removeDuplicates = (array: any) => {
  const uniqueIds = new Set();
  return array.filter((item: any) => {
    if (!uniqueIds.has(item[props.itemValue])) {
      uniqueIds.add(item[props.itemValue]);
      return true;
    }
    return false;
  });
};

watch(innerSearch, async (searchValue: string) => {
  if (isMenuShow.value) {
    loadingSearch.value = true;

    console.log("searchValue", searchValue);

    // // deep search all on props.items "like searchValue"

    const filteredItems = props.items.filter((item: any) => {
      if (typeof item === "string") {
        return item.toLowerCase().includes(searchValue.toLowerCase());
      }

      if (typeof item === "object") {
        return Object.keys(item).some((key) => {
          if (typeof item[key] === "string") {
            return item[key].toLowerCase().includes(searchValue.toLowerCase());
          }
          return false;
        });
      }

      // if array
      if (Array.isArray(item)) {
        return item.some((key) => {
          if (typeof key === "string") {
            return key.toLowerCase().includes(searchValue.toLowerCase());
          }
          return false;
        });
      }
    });

    if (props.checkDuplicate == true) {
      options.value = removeDuplicates(options.value);
    }
    options.value = filteredItems;

    // options.value = []
    // paginationDone.value = !property(props.pageEndProp)(resData)
    page.value = 1;
    loadingSearch.value = false;
  }
});

const onSelectOpt = (param?: string) => {
  if (!selected.value) {
    selected.value = null;
  } else {
    selectedDetails.value = props.items.find(
      (item: any) => item[props.itemValue] === (selected.value ?? "")
    );
  }

  emit("click:selected", selectedDetails.value);
  // emit('update:modelValue', selected.value)
};

const getDisplayMultipleKeys = (item: any) => {
  if (!props.isDisplayMultipleKey) {
    return "";
  }

  return props.displayMultipleKeys
    .map((key) => {
      return item[key];
    })
    .join(props.displayMultipleSeparator);
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      selected.value = null;
      displayTitle.value = "";
    }
  }
);

onMounted(() => {
  selected.value = null;
  if (props.checkDuplicate == true) {
    options.value = removeDuplicates(options.value);
  }

  if (props.modelValue) {
    selected.value = props.modelValue;
  }

  if (props.initialValue) {
    selected.value = props.initialValue;
  }
});

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      selected.value = newVal;
    }
  }
);

watch(
  () => selected.value,
  (newValue, oldValue) => {
    if (newValue != oldValue && !!newValue) {
      if (!selected.value) {
        selected.value = null;
      }

      if (!!newValue) {
        onSelectOpt(newValue);
      }
    }

    emit("update:modelValue", selected.value);
  }
);

watch(
  () => props.items,
  (newValue) => {
    if (props.checkDuplicate == true) {
      options.value = removeDuplicates(newValue);
    } else {
      options.value = newValue;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div :class="classMerge('', props.class)">
    <v-autocomplete
      v-model="selected"
      :label="props.label"
      :items="options"
      :variant="props.variant"
      :density="props.density"
      :item-title="props.itemTitle"
      :item-value="props.itemValue"
      :clearable="props.disabled ? false : props.clearable"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :class="classMerge('dark:text-primary1', props.aClass)"
      :loading="loadingSearch"
      :chips="props.chips"
      @update:search="innerSearch = $event"
      @update:menu="onMenuChange"
      @update:focused="onFocus"
      @click:clear="handleClear"
      hide-details
      no-filter
    >
      <template v-slot:selection="{ item }">
        <span class="whitespace-nowrap">
          <!-- {{ item.raw }} -->
          <d-shorttext
            :text="
              getDisplayMultipleKeys(item.raw) || displayTitle || item.title
            "
            :max-length="Number(props.maxLengthDisplay)"
            :class="props.aClass"
            :start-align="props.startAlignDisplay"
          />
        </span>
      </template>

      <template v-slot:item="{ props, item }">
        <v-list-item
          v-bind="props"
          :title="
            getDisplayMultipleKeys(item.raw) || displayTitle || item.title
          "
        ></v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>
