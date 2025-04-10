<script setup lang="ts">
import qs from "qs";
import { property, debounce } from "lodash-es";

import { useMyFetch } from "~/composables/useMyFetch";
import type {
  FieldSelectableType,
  FilterSelectableType,
  SelectTableType,
} from "~/types/SelectTableType";
import { type Pagination } from "~/interfaces/LaravelPaginationInterface";

const slots = useSlots() as Record<string, any>;

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
  searchPlaceholder: "Search anything related..",
  noTitle: false,
  isEdit: true,
  noAction: false,
  noDelete: false,
  editLink: "",
  createOption: () => ({
    link: "",
    show: false,
    icon: "mdi-plus",
    title: "Create",
  }),
  queryModal: () => ({}),

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
  deleteApi: "",
  deleteMethodApi: "post",

  selectStrategy: "single",

  itemsProp: "data",
  mappingDetail: "data",
  totalProp: "meta.total",

  // Table
  height: "450",
  multiple: false,
  returnObject: false,
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

const generatedFiltersObj = ref<FilterSelectableType[]>([]);

const defaultFieldProps: FilterSelectableType = {
  key: "",
  title: "",
  value: "",
  type: "text",
};

const defaultHeaderProps: SelectTableType = {
  title: "",
  sortable: true,
  key: "",
  value: "",
  align: "start" as "start" | "end" | "center",
  // width: 150,
  // minWidth: "150",
  // maxWidth: "150",
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
  "update:filters",
  "click:delete",
]);

let headersModal = ref(props.fields);

const generateHeadersObj = () => {
  headersModal.value = [];

  // headersModal.value = [
  //   ...props.fields,
  //   {
  //     title: "Action",
  //     key: "action",
  //     value: "action",
  //     align: "center",
  //     sortable: false,
  //     show: true,
  //   },
  // ];

  const actionHeader: FieldSelectableType = {
    ...defaultHeaderProps,
    title: "Action",
    key: "action",
    value: "action",
    align: "center",
    sortable: false,
    show: true,
    headerProps: { class: "cursor-pointer action-table sticky-right" },
    cellProps: {
      class: "action-table sticky-right",
    },
  };

  props.fields.forEach((field) => {
    headersModal.value.push({
      ...defaultHeaderProps,
      ...field,
    });
  });

  if (!props.noAction) {
    headersModal.value.push(actionHeader);
  }
};

let api = ref<string>(props.api);

let showModal = ref<boolean>(props.showModal);
let multiple = ref<boolean>(props.multiple);
let selectStrategy = ref<"single" | "page" | "all" | undefined>(
  props.multiple ? "all" : "single"
);
let icon = ref<string>(props.icon);

const openModal = (event: boolean) => {
  showModal.value = event;

  emits("openModal", showModal.value);
};

const filters = ref<Record<string, any>>({
  page: 1,
  ...props.queryModal,
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

const clearFilters = () => {
  filters.value = {
    page: 1,
    per_page: 100,
    global: "",
    order_column: "id",
    order_direction: "asc",
  };
};

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

const fetchSingle = async (id: number) => {
  // return
  if (!id) {
    return;
  }

  showMetaModal.value.loading = true;
  let apiUrl;

  if (props.detailMethodApi == "post") {
    apiUrl = `${props.detailApi}`;
    await useMyFetch()
      .post(apiUrl, { id })
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

const onSelectItems = async () => {
  if (itemsCheck.value.length == 0) {
    emits("update:modelValue", null);
  } else if (!multiple.value && itemsCheck.value.length > 0) {
    emits("update:modelValue", itemsCheck.value[0]);
  } else if (multiple.value && itemsCheck.value.length > 0) {
    emits("update:modelValue", itemsCheck.value);
  }

  // selectedText.value = itemsCheck.value.map((item) => item.name).join(', ')
  openModal(false);
};

const clearSelected = () => {
  itemsCheck.value = [];
  selectedText.value = "";
  emits("update:modelValue", null);
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
        // single show
        await fetchSingle(newValue);
      }

      if (!newValue && !showMetaModal.value.loading) {
        selectedText.value = "";
      }
    }
  }
);

const onSelectOption = (event: any, row: any) => {
  if (props.isQuickSelect) {
    itemsCheck.value = [row.item[props.itemValue]];

    onSelectItems();
  }
};

const onClickDelete = async (event: any, row: any) => {
  emits("click:delete", row);

  let response;

  const isConfirmed = await useAlert.showPopupConfirmation(
    "Delete Confirmation",
    "Are you sure want to delete this data? Data will be deleted permanently"
  );

  if (!isConfirmed) {
    return;
  }

  try {
    if (props.deleteMethodApi == "post") {
      response = await useMyFetch().post(props.deleteApi, {
        id: row.item.id,
      });

      useAlert.alertSuccess(response.data.message);
      filterData();
    } else if (props.deleteMethodApi == "delete") {
      response = await useMyFetch().delete(`${props.deleteApi}/${row.item.id}`);
    }
  } catch (error) {
    useAlert.alertError((error as any).response.data.message);
  }
};

const showHideColumn = (event: any) => {
  console.log("showHideColumn", event);
};

const showHideFilter = (event: any) => {
  console.log("showHideFilter", event);
};

const onDoubleClick = async (event: any, row: any) => {
  navigateTo(`${props.editLink}/${row.item.id}`);
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

// emit when filters change
watch(
  () => filters.value,
  debounce((newValue: Record<string, any>) => {
    emits("update:filters", newValue);
  }, 1000),
  { deep: true }
);

onMounted(async () => {
  filters.value = {
    ...filters.value,
    ...props.queryModal,
  };

  await Promise.all([filterData(), fetchSingle(props.modelValue)]);

  generateHeadersObj();
  generateFiltersObj();

  if (!!props.modelValue) {
    itemsCheck.value.push(props.modelValue);
  }
});
</script>

<template>
  <!-- Modal Add Style -->
  <div class="flex flex-col dark:bg-dark1 dark:text-primary1">
    <div v-if="!props.noTitle" class="flex items-center gap-2">
      <span class="whitespace-nowrap text-xl">
        {{ props.modalTitle }}
      </span>
    </div>

    <form
      :class="classMerge('flex flex-col gap-2 p-3')"
      @submit.prevent="filterData()"
    >
      <div
        v-if="generatedFiltersObj.length > 0"
        :class="
          classMerge(
            'grid grid-cols-5 gap-2 items-center sm:grid-cols-1 md:grid-cols-2',
            generatedFiltersObj.length <= 2
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
            :single-api="filter.others?.singleApi"
            :multiple="filter.others?.multiple"
            :return-object="filter.others?.returnObject"
            :item-color="filter.others?.itemColor"
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

        <d-text-input
          id="global_search_modal"
          v-model="filters.global"
          label="Global Search"
          :placeholder="props.searchPlaceholder"
          append-inner-icon="mdi-magnify"
          parent-class=""
        />
      </div>
      <div :class="classMerge('grid grid-cols-7 items-center gap-2 w-full')">
        <d-submit-button
          @click:submit="filterData"
          @click:clear="clearFilters"
          class="col-span-4 md:col-span-full"
        >
          <template #append>
            <div
              class="flex gap-2 items-center w-full col-span-3 sm:col-span-6"
            >
              <nuxt-link
                v-if="!!props.createOption.show"
                :class="
                  classMerge(
                    'flex items-center grow whitespace-nowrap border-scDarker text-scDarker dark:text-primary1 dark:hover:bg-scDarker dark:bg-scDarker3 dark:border-scDarker font-bold justify-center gap-1 rounded-lg tracking-normal bg-primaryDarker hover:bg-primaryDarkest border-1.5 p-2 transition-all ease-in-out',
                    props.createOption.class
                  )
                "
                :to="props.createOption.link"
                :title="props.createOption.title ?? props.createOption.cta"
              >
                <v-icon
                  v-if="!!props.createOption.icon"
                  :icon="props.createOption.icon"
                  size="24"
                />
                <div class="text-sm capitalize">
                  {{ props.createOption.cta }}
                </div>
              </nuxt-link>

              <div class="flex items-center gap-2">
                <d-button
                  @click="showHideFilter"
                  icon="mdi-filter-cog"
                  is-no-text
                  class="p-1.5 dark:bg-transparent rounded-full ease-in-out transition-all hover:bg-scDarker3 dark:hover:bg-zinc-600 !bg-sc"
                  text-class="text-zinc-100 dark:text-primary1"
                  icon-class="text-zinc-100 dark:text-primary1"
                  rounded="xl"
                  size=""
                  cta="custom filter"
                  icon-size="18"
                ></d-button>
                <d-button
                  @click="showHideColumn"
                  icon="mdi-eye-off"
                  is-no-text
                  class="p-1.5 dark:bg-transparent rounded-full ease-in-out transition-all hover:bg-scDarker3 dark:hover:bg-zinc-600 !bg-sc"
                  text-class="text-zinc-100 dark:text-primary1"
                  icon-class="text-zinc-100 dark:text-primary1"
                  rounded="xl"
                  size=""
                  cta="show/hide column"
                  icon-size="18"
                ></d-button>
              </div>
            </div>
          </template>
        </d-submit-button>
      </div>
    </form>

    <div class="flex h-max w-full flex-col">
      <v-data-table-server
        v-model="itemsCheck"
        v-model:page="filters.page"
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
          class: 'cursor-pointer whitespace-nowrap',
        }"
        :item-value="props.itemValue"
        show-current-page
        :return-object="props.returnObject"
        :multiple="props.multiple"
        @update:options="fetchDataServerFetch"
        fixed-header
        :height="props.height"
        hover
        @click:row="onSelectOption"
        @dblclick:row="onDoubleClick"
      >
        <template #no-data> No data available </template>

        <template
          v-for="(field, index) in headersModal"
          :key="index"
          v-slot:[`item.${field.value}`]="{ item, index }"
        >
          <slot
            v-if="field.key == 'action'"
            :name="`item.${field.key}`"
            :item="item"
            :index="index"
            class="abcd"
          >
            <div class="flex items-center justify-center gap-2 abc">
              <slot name="actions.delete" :item="item" :index="index">
                <d-button
                  v-if="!props.noDelete"
                  @click="onClickDelete($event, { item, index })"
                  icon="mdi-delete"
                  is-no-text
                  class="p-1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                  icon-class="text-cancel dark:text-primary1"
                  rounded="xl"
                  size=""
                  cta="select"
                  icon-size="16"
                ></d-button>
              </slot>
            </div>
          </slot>
          <slot v-else :name="`item.${field.key}`" :item="item" :index="index">
            <span v-if="metaModal.data[index] && field.value">{{
              metaModal.data[index][field.value]
            }}</span>
          </slot>
        </template>

        <template #footer.prepend>
          <div class="flex grow items-center">
            <!-- <span class="text-sm"> Show/Hide Filter & Column </span> -->
          </div>
        </template>
      </v-data-table-server>
    </div>
  </div>
</template>
