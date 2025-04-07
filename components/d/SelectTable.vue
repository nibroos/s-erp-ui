<script setup lang="ts">
import qs from "qs";
import { property, debounce, random } from "lodash-es";

import { useMyFetch } from "~/composables/useMyFetch";
import type {
  FieldSelectableType,
  FilterSelectableType,
  FormOptionModeSelectableType,
  FormOptionSelectableType,
  MethodAttributeSelectableType,
  SelectTableType,
} from "~/types/SelectTableType";
import { type Pagination } from "~/interfaces/LaravelPaginationInterface";
import { useInitials } from "../../composables/useInitials";
import type {
  DisplayColumnType,
  ModelFormType,
} from "~/types/DatatableClientType";

const props = withDefaults(defineProps<SelectTableType>(), {
  modelValue: null,
  label: "Item",
  // cta: `Select ${props.label}`,
  cta: (props: SelectTableType) => `Select ${props.label}`,
  noIcon: false,
  class: "",
  btnClass: "",
  textClass: "",
  type: "button",
  icon: "mdi-magnify",
  appendIcon: "mdi-magnify",
  iconSize: 25,
  iconClass: "",
  disabled: false,
  loading: false,
  disabledTextClass: "",
  disabledClass: "",
  activateLoading: false,
  isLoadingDefault: true,
  isNoText: false,
  itemValue: "id",
  displayKey: "name",
  isDisplayMultipleKey: false,
  displaySingleMultipleKeys: () => [],
  displayMultipleSeparator: "-",
  maxLengthDisplay: 20,
  isQuickSelect: false,
  isResetWhenClose: false,
  isResetWhenOpen: false,

  // Modal
  showModal: false,
  modalSize: "sm",
  // modalTitle: 'List Of Items',
  modalTitle: (props: SelectTableType) => `List Of ${props.label}`,
  modalHeaderClass: "",
  modalHeaderTextClass: "text-lg",
  modalCustomClass: "p-6",
  api: "/api/master/items/index",
  methodApi: "get",
  detailApi: "/api/master/items/show",
  detailMethodApi: "get",
  selectedDetailApi: "/api/master/items/bulk-show",

  selectStrategy: "single",

  itemsProp: "data",
  mappingDetail: "data",
  totalProp: "meta.total",

  // Table
  height: "450",
  multiple: false,
  returnObject: false,
  formOptions: () => ({
    mode: "",
    creatable: false,
    deletable: false,
    keyDif: random(0, 1000),
    modal: {
      show: false,
    },
  }),
  filters: (props: SelectTableType) => [],
  fields: (props: SelectTableType) => [
    {
      title: "ID",
      key: "id",
      value: "id",
      align: "start",
      sortable: true,
    },
    {
      title: "Name",
      key: "name",
      value: "name",
      align: "start",
      sortable: true,
    },
  ],
});

const slots = useSlots() as Record<string, any>;
const modelForms = ref<ModelFormType>({});
const generatedFiltersObj = ref<FilterSelectableType[]>([]);

const defaultFieldProps: FilterSelectableType = {
  key: "",
  title: "",
  value: "",
  type: "text",
};

const generateFiltersObj = () => {
  generatedFiltersObj.value = [];

  props.filters.forEach((filter) => {
    generatedFiltersObj.value.push({
      ...defaultFieldProps,
      ...filter,
    });
  });
};

const emits = defineEmits([
  "openModal",
  "update:modelValue",
  "click:selected",
  "click:clear",
  "open:modal-form",
  "submit:create",
  "submit:edit",
  "submit:view",
  "submit:",
]);

let headersModal = ref(props.fields);
let api = ref<string>(props.api);

let showModal = ref<boolean>(props.showModal);
let multiple = ref<boolean>(props.multiple);
let selectStrategy = ref<"single" | "page" | "all" | undefined>(
  props.multiple ? "all" : "single"
);
let icon = ref<string>(props.icon);

const openModal = (event: boolean) => {
  showModal.value = event;

  if (props.isResetWhenOpen) {
    itemsCheck.value = [];
    selectedText.value = "";
  }

  emits("openModal", showModal.value);
};

const filters = ref<Record<string, any>>({
  page: 1,
  per_page: 100,
  global: "",
  order_column: "id",
  order_direction: "asc",
});

const metaModal = ref<Pagination<any[]>>({
  data: [],
  loading: false,
});

const showMetaModal = ref<Record<string, any>>({
  data: [],
  single: {},
  loading: false,
});

const itemsCheck = ref<Record<string, any>[]>([]);

const filterData = async () => {
  if (metaModal.value.loading) return;
  metaModal.value.loading = true;
  let queryString = qs.stringify(filters.value);

  let response;
  let apiUrl;

  if (props.methodApi == "post") {
    apiUrl = `${api.value}`;
    response = await useMyFetch()
      .post(apiUrl, filters.value)
      .then((res) => {
        metaModal.value.data = <any[]>property(props.itemsProp)(res.data);
        metaModal.value.total = property(props.totalProp)(res.data) as string;
      })
      .finally(() => {
        metaModal.value.loading = false;
      });
  } else {
    apiUrl = `${api.value}?${queryString}`;
    response = await useMyFetch()
      .get(apiUrl)
      .then((res) => {
        metaModal.value.data = <any[]>property(props.itemsProp)(res.data);
        metaModal.value.total = property(props.totalProp)(res.data) as string;
      })
      .finally(() => {
        metaModal.value.loading = false;
      });
  }
};

const selectedText = ref<string>("");

const fetchDataServerFetch = async (options: {
  page: number;
  sortBy: [
    {
      key: string;
      order: string;
    }
  ];
  itemsPerPage: number;
}) => {
  filters.value.page = options.page;
  filters.value.per_page = options.itemsPerPage;

  if (options.sortBy.length > 0) {
    filters.value.order_column = options.sortBy[0].key;
    filters.value.order_direction = options.sortBy[0].order;
  } else {
    filters.value.order_column = "";
    filters.value.order_direction = "";
  }

  await filterData();
};

const fetchSingle = async (id: number, oldId: number | null) => {
  // return
  if (!id) {
    return;
  }

  showMetaModal.value.loading = true;
  let apiUrl;

  if (props.detailMethodApi == "post") {
    let payload;

    if (props.multiple && !props.returnObject) {
      payload = { ids: itemsCheck.value };
    } else {
      payload = { ids: [id] };
    }

    apiUrl = `${props.detailApi}`;
    await useMyFetch()
      .post(apiUrl, payload)
      .then((res) => {
        if (!!props.multiple) {
        } else {
          showMetaModal.value.single = (<Record<string, any>>(
            property(props.mappingDetail)(res.data)
          )) as any;

          selectedFull.value = showMetaModal.value.single;
          emits("click:selected", showMetaModal.value.single, oldId);

          selectedText.value = showMetaModal.value.single[props.displayKey];
          if (!!props.isDisplayMultipleKey) {
            selectedText.value = props.displaySingleMultipleKeys
              .map((key) => showMetaModal.value.single[key])
              .join(props.displayMultipleSeparator);
          }
        }
      })
      .finally(() => {
        showMetaModal.value.loading = false;
      });
  } else {
    apiUrl = `${props.detailApi}/${id}`;
    await useMyFetch()
      .get(apiUrl)
      .then((res) => {
        showMetaModal.value.single = (<Record<string, any>>(
          property(props.mappingDetail)(res.data)
        )) as any;

        selectedText.value = showMetaModal.value.single[props.displayKey];
        if (!!props.isDisplayMultipleKey) {
          selectedText.value = props.displaySingleMultipleKeys
            .map((key) => showMetaModal.value.single[key])
            .join(props.displayMultipleSeparator);
        }
      })
      .finally(() => {
        showMetaModal.value.loading = false;
      });
  }
};

const fetchBulk = async (ids: number[]) => {
  showMetaModal.value.loading = true;
  let apiUrl;

  apiUrl = `${props.selectedDetailApi}`;
  await useMyFetch()
    .post(apiUrl, { ids })
    .then((res) => {
      showMetaModal.value = res.data;
    })
    .finally(() => {
      showMetaModal.value.loading = false;
    });
};

const selectedFull = ref<any>();

const onSelectItems = async () => {
  // filter selected items
  if (itemsCheck.value.length == 0) {
    emits("update:modelValue", null);
  } else if (!multiple.value && itemsCheck.value.length > 0) {
    emits("update:modelValue", itemsCheck.value[0]);
  } else if (multiple.value && itemsCheck.value.length > 0) {
    emits("update:modelValue", itemsCheck.value);
  }

  // selectedText.value = itemsCheck.value.map((item) => item.name).join(', ')

  if (props.isResetWhenClose) {
    itemsCheck.value = [];
    selectedText.value = "";
  }
  openModal(false);
};

const clearSelected = () => {
  itemsCheck.value = [];
  selectedText.value = "";
  emits("update:modelValue", null);
  emits("click:clear");
  showModal.value = false;
};

watch(
  () => props.modelValue,
  async (newValue: any, oldValue: any) => {
    if (newValue !== oldValue) {
      // if (!!multiple.value) {

      //   // bulk show
      //   await fetchBulk(newValue.map((item) => item[props.itemValue]))
      // }

      if (!multiple.value && !!newValue) {
        itemsCheck.value = [newValue];
        // single show
        await fetchSingle(newValue, oldValue);
      }

      if (!newValue) {
        selectedText.value = "";
      }

      if (!newValue && !!showMetaModal.value.loading) {
        selectedText.value = "Loading...";
      }
    }
  }
);

const onSelectOption = async (event: any, row: any) => {
  if (props.isQuickSelect) {
    itemsCheck.value = [row.item[props.itemValue]];
    if (!multiple.value) {
      // single show
      await fetchSingle(row.item[props.itemValue], props.modelValue);
    }
    onSelectItems();
  }
};

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

const filteredModalForms = ref<FieldSelectableType[]>(props.fields) ?? [];
const genFormOptions = ref<FormOptionSelectableType>({
  ...useInitials.formOptionDefault,
  ...props.formOptions,
});

const toggleOpenModal = (mode: FormOptionModeSelectableType = "") => {
  genFormOptions.value.mode = mode;

  console.log("toggleOpenModal", mode, genFormOptions.value);

  if (genFormOptions.value.modal) {
    if (!mode) {
      return (genFormOptions.value.modal.show = false);
    }

    genFormOptions.value.modal.show = true;
    toggleOpenCloseModal(true);
  }
};

const toggleOpenCloseModal = (event: boolean = true) => {
  // if (!!genFormOptions.value.modal) {
  //   // genFormOptions.value.modal.title = action?.modal?.title;
  //   genFormOptions.value.modal.show = event;
  // }

  console.log("genFormOptions", event, genFormOptions.value);

  if (event === false) {
    if (!!genFormOptions.value.modal) {
      genFormOptions.value.mode = "";
    }
  }

  if (event === true) {
    genFormOptions.value.modal.show = true;
  }

  emits(`open:modal-form`, event);
};

const submitModal = () => {
  metaModal.value.loading = true;

  if (!!genFormOptions.value?.modal) {
    genFormOptions.value.modal.show = false;
  }

  let combinePayload: Record<string, any> = {};
  let payload: Record<string, any> = {};
  for (let [key, value] of Object.entries(modelForms.value)) {
    payload[key] = value.payload;
  }
  console.log(modelForms.value, "modelForms");

  combinePayload = { ...payload };

  let args = {
    action: genFormOptions.value,
    config: modelForms.value,
    payload: combinePayload,
  };

  const key = genFormOptions.value?.mode;
  console.log(args, "submitModal");

  emits(`submit:${key}`, args);
  if (key == "create") {
  } else if (key == "edit") {
  }

  metaModal.value.loading = false;
};

watch(
  () => itemsCheck.value,
  (newValue: any, oldValue: any) => {
    if (newValue !== oldValue && props.isQuickSelect) {
      onSelectItems();
    }
  }
);

watch(showModal, async (newVal) => {
  if (newVal) {
    await nextTick();
    setTimeout(() => {
      const input = document.getElementById("global_search_modal");
      if (input) {
        input.focus();
      }
    }, 300); // Adjust the delay as needed
  }
});

onMounted(async () => {
  // await filterData()
  await Promise.all([
    // filterData(),
    fetchSingle(props.modelValue, null),
  ]);

  generateFiltersObj();

  console.log("props.modelValue", props.modelValue);

  if (!!props.modelValue && props.modelValue.length > 0) {
    itemsCheck.value.push(props.modelValue);
  }
});
</script>

<template>
  <slot>
    <div
      :class="classMerge('flex w-full grow', props.class)"
      :title="selectedText"
    >
      <slot
        name="btn"
        :selectedText="selectedText"
        @openModal="openModal"
        @clearSelected="clearSelected"
        @selectItems="onSelectItems"
      >
        <lazy-d-bt
          type="button"
          :cta="selectedText ? `${props.label}: ${selectedText}` : props.cta"
          :no-icon="!!selectedText"
          :class="
            classMerge(
              'text-none flex w-full grow items-stretch justify-center gap-1 whitespace-nowrap !border-1.5 !border-solid dark:bg-dark1 hover:dark:bg-dark2',
              !!selectedText
                ? '!border-zinc-300 dark:!border-zinc-500 p-2.5 rounded-l-md'
                : '!border-zinc-200 dark:!border-zinc-500 rounded-md p-1.5',
              props.btnClass
            )
          "
          :text-class="
            classMerge(
              'text-sm dark:text-primary1  font-normal dark:!text-primary1',
              !!selectedText ? '!text-dark3' : '!text-zinc-400',
              props.disabled ? 'line-through' : '',
              props.textClass
            )
          "
          :icon="!selectedText ? icon : undefined"
          :icon-class="
            classMerge('!text-zinc-400 dark:text-primary1', props.iconClass)
          "
          @click="openModal(true)"
          :max-length-display="props.maxLengthDisplay"
          :loading="showMetaModal.loading"
          :disabled="props.disabled"
        >
          <template #append-cta>
            <slot name="append-cta" />
          </template>
        </lazy-d-bt>

        <d-bt
          v-if="selectedText"
          type="button"
          cta="Clear"
          :class="
            classMerge(
              'text-none m-0 rounded-r-md flex items-center justify-center border-y-1.5 border-r-1.5 border-solid py-0',
              !!selectedText
                ? 'border-zinc-300 dark:border-zinc-500'
                : 'border-zinc-200 dark:border-zinc-500'
            )
          "
          text-class="text-zinc-400"
          icon="mdi-close"
          icon-class="text-zinc-400"
          is-no-text
          @click="clearSelected"
          :disabled="props.disabled"
        />
      </slot>

      <lazy-modals-final-modal
        :is-open="showModal"
        :size="'sm'"
        :label="props.modalTitle"
        :name="randomId()"
        :header-text-class="classMerge('text-lg', props.modalHeaderTextClass)"
        :custom-class="props.modalCustomClass"
        :parent-class="props.modalParentClass"
        @update:is-open="openModal($event)"
      >
        <template #label>
          <div class="flex items-center gap-2">
            <span class="whitespace-nowrap text-xl dark:text-primary1">
              {{ props.modalTitle }}
            </span>
            <span
              class="rounded-sm bg-slate-200 dark:bg-sc px-2 py-1 font-normal"
              v-if="selectedText"
            >
              Selected : {{ selectedText }}
            </span>
          </div>
        </template>
        <template #top>
          <form
            :class="
              classMerge(
                'flex flex-col gap-3',
                generatedFiltersObj.length <= 3 ? 'flex-row' : 'flex-col'
              )
            "
            @submit.prevent="filterData()"
          >
            <div
              v-if="generatedFiltersObj.length > 0"
              :class="
                classMerge(
                  'grid grid-cols-5 gap-3',
                  generatedFiltersObj.length <= 3
                    ? `grow grid-cols-${generatedFiltersObj.length}`
                    : 'grid-cols-5'
                )
              "
            >
              <div v-for="(filter, index) in generatedFiltersObj" :key="index">
                <d-text-input
                  v-if="filter.type === 'text'"
                  v-model="filters[filter.key]"
                  :label="filter.title"
                />
                <d-date-picker-light
                  v-else-if="filter.type === 'date'"
                  v-model="filters[filter.key]"
                  :label="filter.title"
                />
                <d-autocomplete
                  v-else-if="filter.type === 'autocomplete'"
                  v-model="filters[filter.key]"
                  :label="filter.title"
                  :api="filter.others?.api"
                  :item-value="filter.others?.itemValue"
                  :item-title="filter.others?.itemTitle"
                  :mapping-detail="filter.others?.mappingDetail"
                  :inner-search-key="filter.others?.innerSearchKey"
                  :items-prop="filter.others?.itemsProp"
                  :page-end-prop="filter.others?.pageEndProp"
                  :method-api="filter.others?.methodApi"
                />
              </div>

              <div class="col-span-3 grid grid-cols-2 gap-2 w-full">
                <!-- <v-text-field
              id="global_search_modal"
              v-model="filters.global"
              hide-details
              label="Global Search"
              placeholder="Search anything related to styles, style name, factory, etc"
              variant="outlined"
              density="compact"
              append-inner-icon="mdi-magnify"
              class="col-span-1"
            /> -->
                <d-text-input
                  id="global_search_modal"
                  v-model="filters.global"
                  label="Global"
                  placeholder="Search anything related to styles, style name, factory, etc"
                />

                <d-submit-button
                  @click:submit="filterData"
                  class="grid-cols-1"
                />
              </div>
            </div>
          </form>
        </template>

        <div class="flex h-max w-full flex-col">
          <v-data-table-server
            v-model="itemsCheck"
            :items="metaModal.data ?? []"
            :headers="headersModal"
            :items-per-page="filters.per_page"
            :items-length="metaModal.total ?? 0"
            :items-per-page-options="useInitials.perPageOptions"
            :loading="metaModal.loading"
            density="compact"
            :header-props="{
              class: '!bg-scLightest dark:!bg-dark2 whitespace-nowrap',
            }"
            :row-props="{
              class: 'cursor-pointer',
            }"
            :item-value="props.itemValue"
            show-current-page
            show-select
            :return-object="props.returnObject"
            :multiple="props.multiple"
            :select-strategy="selectStrategy"
            @update:options="fetchDataServerFetch"
            fixed-header
            :height="props.height"
            hover
            @click:row="onSelectOption"
          ></v-data-table-server>
        </div>
        <template #footer>
          <div class="flex h-max w-full items-center justify-end gap-2">
            {{ genFormOptions.mode }}
            <slot
              v-if="!!genFormOptions.creatable"
              :name="`modal:create`"
              v-bind="{ modal: genFormOptions?.modal }"
              class="grow"
            >
              <d-bt
                @click="toggleOpenModal('create')"
                :class="
                  classMerge(
                    'justify-center rounded-lg !border !border-solid !border-sc py-2 transition-all ease-in-out hover:!bg-sc-50 ',
                    genFormOptions?.class ?? ''
                  )
                "
                :text-class="genFormOptions?.textClass ?? 'text-sc !font-bold'"
                :cta="genFormOptions?.cta ?? `Create New`"
                type="submit"
                :no-icon="true"
              ></d-bt>
            </slot>
            <d-bt
              type="button"
              cta="Clear"
              @click="clearSelected"
              class="!border border-solid border-rose-700 px-4 py-2 rounded-lg bg-white dark:!bg-rose-700 transition-all ease-in-out hover:!bg-rose-50 dark:hover:!bg-rose-900"
              text-class="text-rose-800 mx-auto text-sm dark:text-primary1"
              no-icon
            />

            <button
              type="button"
              class="flex items-center gap-2 rounded-md bg-sc px-3 py-2 text-[15px] font-bold text-white shadow-md hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scDarker"
              @click="onSelectItems"
            >
              <Icon name="material-symbols:save-rounded" size="20" />
              <span>Select {{ props.label }} ({{ itemsCheck.length }})</span>
            </button>
          </div>
        </template>
      </lazy-modals-final-modal>

      <v-dialog
        :id="randomId()"
        v-model="genFormOptions.modal.show"
        z-index="2510"
        :key="formOptions.keyDif"
      >
        <div class="flex flex-col gap-3 bg-white dark:bg-dark1 p-4 rounded-lg">
          <slot name="header">
            <div class="flex flex-row items-center justify-between">
              <h1
                class="text-lg font-semibold text-zinc-900 dark:text-primary1"
              >
                <slot
                  :name="`modal:label`"
                  v-bind="{ modal: genFormOptions?.modal }"
                >
                  <div
                    :class="[
                      'flex items-center gap-2',
                      genFormOptions?.modal?.headerClass ?? '',
                    ]"
                  >
                    {{ genFormOptions }}
                    <span
                      :class="[
                        'text-xl capitalize',
                        genFormOptions?.modal?.headerTextClass ?? '',
                      ]"
                    >
                      {{ genFormOptions.mode }} {{ props.label }}
                    </span>
                  </div>
                </slot>
              </h1>

              <d-bt
                icon="mdi-close"
                @click="genFormOptions.modal.show = false"
                class="cursor-pointer rounded-full p-1 transition-all duration-300 ease-in-out hover:bg-gray-200 dark:bg-dark1 dark:hover:bg-dark2 dark:text-primary1"
              ></d-bt>
            </div>
          </slot>

          <div class="max-h-[35rem] overflow-y-auto">
            <div v-if="genFormOptions?.modal?.show">
              <slot
                :name="`modal:content`"
                v-bind="{ modal: genFormOptions?.modal }"
              >
                <form
                  @submit.prevent="submitModal()"
                  :class="[
                    'grid grid-cols-4 md:grid-cols-1 gap-2 pt-1',
                    genFormOptions?.modal?.contentClass ?? '',
                  ]"
                >
                  <div
                    v-for="(modelForm, keyModelForm) in filteredModalForms"
                    :key="keyModelForm"
                  >
                    <slot
                      :name="`modal:${keyModelForm}`"
                      v-bind="{
                        item: modelForm,
                        configKey: filteredModalForms[keyModelForm],
                        keyModelForm: keyModelForm,
                        options: modelForm,
                        methodKey: key,
                        filteredModalForms: filteredModalForms,
                      }"
                    >
                      <div
                        v-if="isColumnDisplay(modelForm, 'text')"
                        :class="classMerge('')"
                      >
                        <d-text-input
                          :model-value="
                            filteredModalForms[keyModelForm].payload
                          "
                          @update:model-value="
                            filteredModalForms[keyModelForm].payload = $event
                          "
                          :label="modelForm.title"
                        />
                      </div>
                      <div v-if="isColumnDisplay(modelForm, 'view')" class="">
                        {{ modelForm.title }}
                      </div>
                      <div
                        v-if="isColumnDisplay(modelForm, 'disabled')"
                        class=""
                      >
                        <d-text-input
                          :model-value="
                            filteredModalForms[keyModelForm].payload
                          "
                          @update:model-value="
                            filteredModalForms[keyModelForm].payload = $event
                          "
                          :label="modelForm.title"
                          :disabled="true"
                        />
                      </div>
                      <div
                        v-if="isColumnDisplay(modelForm, 'autocomplete-client')"
                        class=""
                      >
                        <d-autocomplete-client
                          :model-value="
                            filteredModalForms[keyModelForm].payload
                          "
                          @update:model-value="
                            filteredModalForms[keyModelForm].payload = $event
                          "
                          :label="modelForm.title"
                          :items="modelForm.others?.items"
                          :item-title="modelForm.others?.itemTitle ?? 'name'"
                          :item-value="modelForm.others?.itemValue ?? 'id'"
                          :is-display-multiple-key="
                            modelForm.others?.isDisplayMultipleKey ?? false
                          "
                          :display-multiple-keys="
                            modelForm.others?.displayMultipleKeys ?? [
                              'id',
                              'name',
                            ]
                          "
                          :max-length-display="
                            modelForm.others?.maxLengthDisplay ?? 70
                          "
                        />
                      </div>
                      <div v-if="isColumnDisplay(modelForm, 'date')" class="">
                        <d-date-picker-light
                          v-model="filteredModalForms[keyModelForm].payload"
                          :label="modelForm.title"
                          :dp-class="modelForm.others?.dpClass"
                          :clearable="modelForm.others?.clearable"
                          :placeholder="modelForm.placeholder"
                          :density="modelForm.others?.density"
                          :variant="modelForm.others?.variant"
                        ></d-date-picker-light>
                      </div>
                      <div
                        v-if="isColumnDisplay(modelForm, 'datetime')"
                        class=""
                      >
                        <d-date-picker-light
                          v-model="filteredModalForms[keyModelForm].payload"
                          :label="modelForm.title"
                          :dp-class="modelForm.others?.dpClass"
                          :clearable="modelForm.others?.clearable"
                          :placeholder="modelForm.placeholder"
                          :density="modelForm.others?.density"
                          :variant="modelForm.others?.variant"
                        ></d-date-picker-light>
                      </div>
                      <div
                        v-if="isColumnDisplay(modelForm, 'currency')"
                        class=""
                      >
                        {{ modelForm.title }}
                      </div>
                      <div v-if="isColumnDisplay(modelForm, 'number')" class="">
                        <d-num-v-format
                          :label="modelForm.title"
                          :reverse="false"
                          :hide-currency-display="true"
                          v-model="filteredModalForms[keyModelForm].payload"
                        />
                      </div>
                      <div
                        v-if="isColumnDisplay(modelForm, 'boolean')"
                        class=""
                      >
                        {{ modelForm.title }}
                      </div>
                      <div v-if="isColumnDisplay(modelForm, 'image')" class="">
                        {{ modelForm.title }}
                      </div>
                    </slot>
                  </div>

                  <slot
                    :name="`modal:append`"
                    v-bind="{
                      methodKey: key,
                      filteredModalForms: filteredModalForms,
                    }"
                  ></slot>
                  <button type="submit" class="hidden"></button>
                </form>
              </slot>
            </div>
          </div>

          <slot
            :name="`modal:footer`"
            v-bind="{ modal: genFormOptions?.modal }"
          >
            <div class="flex w-full items-center gap-3 pt-3">
              <slot
                v-if="!!genFormOptions.creatable"
                :name="`modal:create`"
                v-bind="{ modal: genFormOptions?.modal }"
                class="grow"
              >
                <d-bt
                  @click="toggleOpenModal('')"
                  :class="
                    classMerge(
                      'grow justify-center items-center rounded-lg !border !border-solid !border-rose-700 py-2 !text-rose-700 transition-all ease-in-out hover:!bg-rose-50',
                      genFormOptions?.modal?.cancelClass ?? ''
                    )
                  "
                  :text-class="
                    genFormOptions?.modal?.cancelTextClass ??
                    'text-rose-700 text-lg'
                  "
                  :cta="genFormOptions?.modal?.cancelText"
                  type="submit"
                  :no-icon="true"
                ></d-bt>
              </slot>
              <d-bt
                v-if="!slots[`modal:confirm`]"
                :class="
                  classMerge(
                    'w-2/3 justify-center items-center rounded-lg !bg-sc py-2 text-white transition-all ease-in-out hover:!bg-scDarker',
                    genFormOptions?.modal?.confirmClass ?? ''
                  )
                "
                :text-class="
                  genFormOptions?.modal?.confirmTextClass ??
                  'text-white text-lg'
                "
                :cta="genFormOptions?.modal?.confirmText"
                @click="submitModal()"
                type="submit"
                :no-icon="true"
              ></d-bt>
              <slot
                v-else
                :name="`modal:confirm`"
                v-bind="{ modal: genFormOptions?.modal }"
              ></slot>
            </div>
          </slot>
        </div>
      </v-dialog>
      <!-- <lazy-modals-final-modal
        :id="randomId()"
        :name="randomId()"
        :is-open="genFormOptions.modal.show"
        :size="genFormOptions?.modal?.size ?? 'sm'"
        :label="genFormOptions?.modal?.title"
        :header-text-class="[
          'text-xl',
          genFormOptions?.modal?.headerTextClass ?? '',
        ]"
        :custom-class="['p-6 !w-4/5', genFormOptions?.modal?.customClass ?? '']"
        :parent-class="genFormOptions?.modal?.show ? '!z-[2501]' : '!z-[1001]'"
        :resize="false"
        @update:is-open="toggleOpenCloseModal($event)"
      >
        <template #label>
          <slot :name="`modal:label`" v-bind="{ modal: genFormOptions?.modal }">
            <div
              :class="[
                'flex items-center gap-2',
                genFormOptions?.modal?.headerClass ?? '',
              ]"
            >
              {{ genFormOptions }}
              <span
                :class="[
                  'text-xl capitalize',
                  genFormOptions?.modal?.headerTextClass ?? '',
                ]"
              >
                {{ genFormOptions.mode }} {{ props.label }}
              </span>
            </div>
          </slot>
        </template>

        <div v-if="genFormOptions?.modal?.show">
          <slot
            :name="`modal:content`"
            v-bind="{ modal: genFormOptions?.modal }"
          >
            <form
              @submit.prevent="submitModal()"
              :class="[
                'grid grid-cols-4 md:grid-cols-1 gap-2 pt-1',
                genFormOptions?.modal?.contentClass ?? '',
              ]"
            >
              <div
                v-for="(modelForm, keyModelForm) in filteredModalForms"
                :key="keyModelForm"
              >
                <slot
                  :name="`modal:${keyModelForm}`"
                  v-bind="{
                    item: modelForm,
                    configKey: filteredModalForms[keyModelForm],
                    keyModelForm: keyModelForm,
                    options: modelForm,
                    methodKey: key,
                    filteredModalForms: filteredModalForms,
                  }"
                >
                  <div
                    v-if="isColumnDisplay(modelForm, 'text')"
                    :class="classMerge('')"
                  >
                    <d-text-input
                      :model-value="filteredModalForms[keyModelForm].payload"
                      @update:model-value="
                        filteredModalForms[keyModelForm].payload = $event
                      "
                      :label="modelForm.title"
                    />
                  </div>
                  <div v-if="isColumnDisplay(modelForm, 'view')" class="">
                    {{ modelForm.title }}
                  </div>
                  <div v-if="isColumnDisplay(modelForm, 'disabled')" class="">
                    <d-text-input
                      :model-value="filteredModalForms[keyModelForm].payload"
                      @update:model-value="
                        filteredModalForms[keyModelForm].payload = $event
                      "
                      :label="modelForm.title"
                      :disabled="true"
                    />
                  </div>
                  <div
                    v-if="isColumnDisplay(modelForm, 'autocomplete-client')"
                    class=""
                  >
                    <d-autocomplete-client
                      :model-value="filteredModalForms[keyModelForm].payload"
                      @update:model-value="
                        filteredModalForms[keyModelForm].payload = $event
                      "
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
                      :max-length-display="
                        modelForm.others?.maxLengthDisplay ?? 70
                      "
                    />
                  </div>
                  <div v-if="isColumnDisplay(modelForm, 'date')" class="">
                    <d-date-picker-light
                      v-model="filteredModalForms[keyModelForm].payload"
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
                      v-model="filteredModalForms[keyModelForm].payload"
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
                      v-model="filteredModalForms[keyModelForm].payload"
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
                :name="`modal:append`"
                v-bind="{
                  methodKey: key,
                  filteredModalForms: filteredModalForms,
                }"
              ></slot>
              <button type="submit" class="hidden"></button>
            </form>
          </slot>
        </div>

        <template #footer>
          <slot
            :name="`modal:footer`"
            v-bind="{ modal: genFormOptions?.modal }"
          >
            <div class="flex w-full items-center gap-3 pt-3">
              <slot
                v-if="!!genFormOptions.creatable"
                :name="`modal:create`"
                v-bind="{ modal: genFormOptions?.modal }"
                class="grow"
              >
                <d-bt
                  @click="toggleOpenModal('')"
                  :class="
                    classMerge(
                      'grow justify-center items-center rounded-lg !border !border-solid !border-rose-700 py-2 !text-rose-700 transition-all ease-in-out hover:!bg-rose-50',
                      genFormOptions?.modal?.cancelClass ?? ''
                    )
                  "
                  :text-class="
                    genFormOptions?.modal?.cancelTextClass ??
                    'text-rose-700 text-lg'
                  "
                  :cta="genFormOptions?.modal?.cancelText"
                  type="submit"
                  :no-icon="true"
                ></d-bt>
              </slot>
              <d-bt
                v-if="!slots[`modal:confirm`]"
                :class="
                  classMerge(
                    'w-2/3 justify-center items-center rounded-lg !bg-sc py-2 text-white transition-all ease-in-out hover:!bg-scDarker',
                    genFormOptions?.modal?.confirmClass ?? ''
                  )
                "
                :text-class="
                  genFormOptions?.modal?.confirmTextClass ??
                  'text-white text-lg'
                "
                :cta="genFormOptions?.modal?.confirmText"
                @click="submitModal()"
                type="submit"
                :no-icon="true"
              ></d-bt>
              <slot
                v-else
                :name="`modal:confirm`"
                v-bind="{ modal: genFormOptions?.modal }"
              ></slot>
            </div>
          </slot>
        </template>
      </lazy-modals-final-modal> -->
    </div>
  </slot>
</template>
