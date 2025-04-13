<script setup lang="ts">
import qs from "qs";
import { mergeProps } from "vue";
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
    createApi: "",
    editApi: "",
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

const initHeadersModal = () => {
  let initialHeader = props.fields;

  // check if key actions exists
  const hasActionsKey = initialHeader.some(
    (header) => header.key === "actions"
  );
  if (!!props.formOptions.editable && !hasActionsKey) {
    initialHeader.push({
      title: "Actions",
      key: "actions",
      align: "end",
      sortable: false,
      class: "text-center",
      width: 100,
    });
  }

  return initialHeader;
};

let headersModal = ref<FieldSelectableType[]>(initHeadersModal());
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

const showEditMetaModal = ref<Record<string, any>>({
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

const fetchSingleEdit = async (id: number) => {
  // return
  if (!id) {
    return;
  }

  showEditMetaModal.value.loading = true;
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
        showEditMetaModal.value.single = (<Record<string, any>>(
          property(props.mappingDetail)(res.data)
        )) as any;

        filteredModalForms.value = props.fields.map((field) => {
          if (field.key in showEditMetaModal.value.single) {
            return {
              ...field,
              payload: showEditMetaModal.value.single[field.key],
            };
          }
          return field;
        });
      })
      .finally(() => {
        showEditMetaModal.value.loading = false;
      });
  } else {
    apiUrl = `${props.detailApi}/${id}`;
    await useMyFetch()
      .get(apiUrl)
      .then((res) => {
        showEditMetaModal.value.single = (<Record<string, any>>(
          property(props.mappingDetail)(res.data)
        )) as any;
      })
      .finally(() => {
        showEditMetaModal.value.loading = false;
      });
  }

  console.log("showEditMetaModal.value.single", showEditMetaModal.value.single);
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

const filteredModalForms = ref<FieldSelectableType[]>(props.fields) ?? [];
const genFormOptions = ref<FormOptionSelectableType>({
  // json stringify parse
  ...JSON.parse(
    JSON.stringify(mergeProps(props.formOptions, props.formOptions))
  ),
  // ...useInitials.formOptionDefault,
  // ...props.formOptions,
});

const toggleOpenModal = (
  mode: FormOptionModeSelectableType = "",
  isActive: boolean,
  item?: any
) => {
  genFormOptions.value.mode = mode;

  console.log("toggleOpenModal", mode, genFormOptions.value);

  if (!!item) {
    // get item from api
    fetchSingleEdit(item[props.itemValue]);
  }

  if (genFormOptions.value.modal) {
    // if (!mode) {
    //   return (genFormOptions.value.modal.show = false);
    // }
    // genFormOptions.value.modal.show = true;
    toggleOpenCloseModal(isActive);
  }
};

const toggleOpenCloseModal = (event: boolean = true) => {
  // if (!!genFormOptions.value.modal) {
  //   // genFormOptions.value.modal.title = action?.modal?.title;
  //   genFormOptions.value.modal.show = event;
  // }

  console.log("genFormOptions", event, genFormOptions.value);

  // if (event === false) {
  //   if (!!genFormOptions.value.modal) {
  //     genFormOptions.value.mode = "";
  //   }
  // }

  genFormOptions.value.modal.show = event;
  // if (event === true) {
  //   genFormOptions.value.modal.show = true;
  // }

  emits(`open:modal-form`, event);
};

const formLoading = ref<boolean>(false);
const submitModal = async (inputs: ModelFormType[]) => {
  if (formLoading.value) return;
  formLoading.value = true;

  const isConfirmed = await useAlert.showPopupConfirmation(
    `Are you sure ${genFormOptions.value.mode} ${props.label}?`,
    `${props.label} will be ${genFormOptions.value.mode}ed.`
  );

  console.log("isConfirmed", isConfirmed);

  if (!isConfirmed) {
    formLoading.value = false;
    return;
  }

  if (!!genFormOptions.value?.modal) {
    genFormOptions.value.modal.show = false;
  }

  let combinePayload: Record<string, any> = {};
  let payload: Record<string, any> = {};

  // for (let [key, value] of Object.entries(inputs)) {
  //   payload[key] = value.payload;
  // }
  inputs.forEach((input) => {
    payload[input.key as unknown as string] = input.payload ?? null;
  });

  combinePayload = {
    id: showEditMetaModal.value.single.id,
    ...payload,
  };

  let args = {
    action: genFormOptions.value,
    config: modelForms.value,
    payload: combinePayload,
  };

  const key = genFormOptions.value?.mode;

  emits(`submit:${key}`, args);

  let api = "";
  if (key == "create") {
    // remove id from payload
    delete combinePayload["id"];

    api = genFormOptions.value.createApi as string;
  } else if (key == "edit") {
    api = genFormOptions.value.editApi as string;
  }

  console.log("combinePayload", combinePayload);

  try {
    const response = await useMyFetch().post(api, combinePayload);

    useAlert.hideAlert();
    useAlert.alertSuccess(response.data.message);

    filterData();

    // await useMyFetch().post(api.value, combinePayload).then((res) => {
    //   console.log("res", res);
    // });
  } catch (error: any) {
    const responseData = error.response.data;
    console.log("Failed To Create Data", error.response.data);
    let errors = "";

    if (typeof responseData.errors === "object") {
      await Promise.all(
        Object.keys(responseData.errors).map((row: any) => {
          errors += `- ${responseData.errors[row][0]} <br />`;
        })
      );
    }
    useAlert.alertError(errors + `<br /> ${responseData.message}`);

    console.error("Error showing loading:", error);
  } finally {
    formLoading.value = false;
  }
};

type ModalFormInstance = ComponentPublicInstance<
  {},
  { submitModal: () => void }
>;
const modalForm = ref<ModalFormInstance | null>(null);

// Trigger the submitModal method
const triggerSubmitModal = async () => {
  if (modalForm.value && modalForm.value.submitModal) {
    modalForm.value.submitModal();
  } else {
    console.error("submitModal method is not available on modalForm");
  }

  // await submitModal(filteredModalForms.value);
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

  if (!!props.modelValue && props.modelValue.length > 0) {
    itemsCheck.value.push(props.modelValue);
  }
});

defineExpose({
  openModal,
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

                <d-autocomplete-client
                  v-else-if="filter.type === 'autocomplete-client'"
                  v-model="filters[filter.key]"
                  :items="filter.others?.items"
                  :label="filter.title"
                  :item-value="filter.others?.itemValue"
                  :item-title="filter.others?.itemTitle"
                  :mapping-detail="filter.others?.mappingDetail"
                  :multiple="filter.others?.multiple"
                  :return-object="filter.others?.returnObject"
                  :item-color="filter.others?.itemColor"
                  :is-display-multiple-key="filter.others?.isDisplayMultipleKey"
                  :display-multiple-keys="
                    filter.others?.displayMultipleKeys ?? ['id', 'name']
                  "
                  :max-length-display="filter.others?.maxLengthDisplay ?? 70"
                />
              </div>

              <div class="col-span-3 grid grid-cols-2 gap-2 w-full">
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
          >
            <template #item.actions="{ item, index }">
              <slot name="actions.edit" :item="item" :index="index">
                <d-button
                  @click="
                    () => {
                      toggleOpenModal('edit', true, item);
                    }
                  "
                  icon="mdi-pencil"
                  is-no-text
                  class="p-1 hover:text-zinc-100 !bg-scDarker hover:bg-scDarker rounded-full ease-in-out transition-all hover:dark:!bg-scDarker3"
                  icon-class="text-primary1"
                  rounded="xl"
                  size=""
                  cta="select"
                  icon-size="16"
                ></d-button>
              </slot>
            </template>
          </v-data-table-server>
        </div>
        <template #footer>
          <div class="flex h-max w-full items-center justify-end gap-2">
            <slot
              v-if="!!genFormOptions.creatable"
              :name="`modal:create`"
              v-bind="{ modal: genFormOptions?.modal }"
              class="grow"
            >
              <v-dialog
                z-index="2510"
                width="80rem"
                v-model="genFormOptions.modal.show"
                :retain-focus="false"
              >
                <template
                  v-slot:activator="{
                    props: activatorProps,
                    isActive: isActiveModal,
                  }"
                >
                  <button
                    @click="
                      () => {
                        // isActiveModal.value = !isActive.value
                        toggleOpenModal('create', isActiveModal);
                      }
                    "
                    v-bind="activatorProps"
                    :class="
                      classMerge(
                        'flex cursor-pointer items-center font-semibold px-4 py-2 rounded-lg !text-sc bg-primaryDarker hover:bg-primaryDarkest dark:!text-primary1 dark:hover:bg-dark3 dark:bg-dark2 dark:border-scDarker transition-all ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scDarker sm:gap-x-1 !capitalize',
                        genFormOptions?.class ?? ''
                      )
                    "
                    type="button"
                    id="formOptions"
                  >
                    {{ genFormOptions?.cta ?? `Create New` }}
                  </button>
                </template>
                <template v-slot:default="{ isActive: isActiveModal }">
                  <div
                    class="flex flex-col gap-3 bg-white dark:!bg-zinc-900 p-4 rounded-lg"
                  >
                    <slot name="header">
                      <div class="flex flex-col gap-2">
                        <div class="flex items-center justify-between">
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
                                <span
                                  :class="[
                                    'text-xl capitalize',
                                    genFormOptions?.modal?.headerTextClass ??
                                      '',
                                  ]"
                                >
                                  {{ genFormOptions.mode }} {{ props.label }}
                                </span>
                              </div>
                            </slot>
                          </h1>

                          <d-bt
                            icon="mdi-close"
                            @click="
                              () => {
                                isActiveModal.value = false;
                                toggleOpenModal('', isActiveModal.value);
                              }
                            "
                            class="cursor-pointer rounded-full p-1 transition-all duration-300 ease-in-out hover:bg-gray-200 dark:bg-dark1 dark:hover:bg-dark2 dark:text-primary1"
                          ></d-bt>
                        </div>
                        <!-- 
                        <p
                          class="text-sm font-normal text-zinc-500 dark:text-primary1"
                        >
                          {{
                            genFormOptions?.modal?.desc ??
                            `${genFormOptions?.mode} a new ${props.label}`
                          }}
                        </p> -->
                      </div>
                    </slot>

                    <div class="max-h-[35rem] overflow-y-auto">
                      <div>
                        <slot
                          :name="`modal:content`"
                          v-bind="{ modal: genFormOptions?.modal }"
                        >
                          <lazy-d-modal-form
                            :inputs="filteredModalForms"
                            :content-class="genFormOptions.modal.contentClass"
                            ref="modalForm"
                            @click:submit="
                              async (inputs: ModelFormType[]) => {
                                await submitModal(inputs);
                              }
                            "
                          >
                          </lazy-d-modal-form>
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
                            @click="
                              () => {
                                genFormOptions.modal.show = false;
                                toggleOpenModal('', genFormOptions.modal.show);
                              }
                            "
                            :class="
                              classMerge(
                                'grow justify-center items-center !border border-solid border-rose-700 px-4 py-2 rounded-lg bg-white dark:!bg-rose-700 transition-all ease-in-out hover:!bg-rose-50 dark:hover:!bg-rose-900',
                                genFormOptions?.modal?.cancelClass ?? ''
                              )
                            "
                            :text-class="
                              genFormOptions?.modal?.cancelTextClass ??
                              'text-rose-700  dark:text-primary1 text-lg'
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
                          :cta="genFormOptions.mode"
                          @click="
                            () => {
                              // submitModal();
                              // Trigger the submitModal method from the ModalForm instance
                              // const modalForm = $refs.modalForm;
                              // if (modalForm && modalForm.submitModal) {
                              //   modalForm.submitModal();
                              // }
                              triggerSubmitModal();
                            }
                          "
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
                </template>
              </v-dialog>
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
    </div>
  </slot>
</template>
