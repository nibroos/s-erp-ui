<script setup lang="ts">
import qs from "qs";
import { property, debounce } from "lodash-es";

import { useMyFetch } from "~/composables/useMyFetch";
import type {
  FieldSelectableType,
  FilterSelectableType,
  SelectTableType,
} from "~/types/SelectTableType";
import {
  type Meta,
  type Pagination,
} from "~/interfaces/LaravelPaginationInterface";

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
  fixedHeader: true,
  noAction: false,
  noDelete: false,
  noPdf: true,
  noFilter: false,
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
  pdfApi: "",
  pdfMethodApi: "post",
  isCsv: false,
  csvApi: "",

  selectStrategy: "all",

  itemsProp: "data",
  mappingDetail: "data",
  metaProp: "meta",
  totalProp: "meta.total",
  pageEndProp: "meta.next_page_url",
  isInfinateScroll: false,
  hideDefaultFooter: false,
  tabs: () => [],
  tabIndex: 0,
  isDefaultTabSlotExists: true,
  defaultTabName: "",
  isRowNum: true,
  isCustomHeader: false,
  metaModal: () => ({
    data: [],
    loading: false,
    meta: {
      total: 0,
      current_page: 1,
      last_page: 1,
      from: 1,
      to: 1,
      per_page: 100,
    },
  }),
  defaultClearFilter: () => ({
    page: 1,
    per_page: 100,
    global: "",
    order_column: "id",
    order_direction: "asc",
  }),

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

const emits = defineEmits([
  "openModal",
  "update:modelValue",
  "click:find",
  "update:filters",
  "click:delete",
  "click:pdf",
  "update:currentTab",
  "click:csv",
  "update:afterFetch",
]);

const loadings = ref({
  pdfLoading: false,
  csvLoading: false,
  deleteLoading: false,
});

const tabs = ref(props.tabs);
const tabIndex = ref(props.tabIndex);
const onClickTab = (index: number) => {
  tabIndex.value = index;
  emits("update:currentTab", index);
};
const defaultTabName = computed(() => {
  if (!tabs.value) return "";

  if (props.defaultTabName) {
    return props.defaultTabName;
  }

  return tabs.value[0];
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

  if (props.isRowNum) {
    headersModal.value.unshift({
      ...defaultHeaderProps,
      title: "#",
      key: "row_num",
      value: "row_num",
      align: "center",
      sortable: false,
      show: true,
      width: "5%",
    });
  }

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
let paginationDone = ref<boolean>(false);

let showModal = ref<boolean>(props.showModal);
let multiple = ref<boolean>(props.multiple);
let selectStrategy = ref<"single" | "page" | "all" | undefined>(
  props.selectStrategy
);
let icon = ref<string>(props.icon);

const openModal = (event: boolean) => {
  showModal.value = event;

  emits("openModal", showModal.value);
};

const filters = ref<Record<string, any>>({
  page: 1,
  ...props.query,
  ...props.queryModal,
});

const oldPage = ref<number>(filters.value.page);

const metaModal = ref<Pagination<any[]>>(props.metaModal);

watch(
  () => props.metaModal,
  (newValue) => {
    metaModal.value = newValue;
  },
  { deep: true }
);

const showMetaModal = ref<Record<string, any>>({
  data: [],
  single: {},
  loading: false,
});

const itemsCheck = ref<Record<string, any>[]>([]);

const clearFilters = () => {
  filters.value = cloneObject(props.defaultClearFilter);
};

const addSelectableKey = (
  items: Record<string, any>[],
  key: string
): Record<string, any>[] => {
  return items.map((item) => {
    return {
      ...item,
      // selectable: false,
    };
  });
};

const filterData = async () => {
  emits("click:find", filters.value);

  // if tabs is not empty, fetch only the current tab
  if (
    !!tabs.value &&
    tabs.value.length > 0 &&
    tabIndex.value !== getDefaultTabSlotNameIndex()
  ) {
    return;
  }

  if (metaModal.value.loading) return;
  metaModal.value.loading = true;
  let queryString = qs.stringify(filters.value);

  let response;
  let apiUrl;

  if (props.methodApi == "post") {
    filters.value = {
      ...filters.value,
      ...props.query,
      ...props.queryModal,
    };

    apiUrl = `${api.value}`;
    response = await useMyFetch()
      .post(apiUrl, filters.value)
      .then((res) => {
        const resData = property(props.itemsProp)(res.data) as Record<
          string,
          any
        >[];
        if (props.isInfinateScroll) {
          // Only concat if it's a new page
          if (filters.value.page > oldPage.value) {
            metaModal.value.data = [...metaModal.value.data, ...resData];
          } else {
            // Reset data if not a new page
            metaModal.value.data = resData;
          }
          // Update oldPage after successful request
          oldPage.value = filters.value.page;
        } else {
          metaModal.value.data = resData;
        }

        metaModal.value.data = addSelectableKey(
          metaModal.value.data,
          props.itemValue
        );

        // metaModal.value.data = <any[]>property(props.itemsProp)(res.data);
        metaModal.value.total = property(props.totalProp)(res.data) as string;
        metaModal.value.meta = (<any>(
          property(props.metaProp)(res.data)
        )) as Meta;
      })
      .finally(() => {
        metaModal.value.loading = false;
        emits("update:afterFetch", metaModal.value);
      });
  } else {
    apiUrl = `${api.value}?${queryString}`;
    response = await useMyFetch()
      .get(apiUrl)
      .then((res) => {
        metaModal.value.data = <any[]>property(props.itemsProp)(res.data);
        metaModal.value.total = property(props.totalProp)(res.data) as string;
        metaModal.value.meta = (<any>(
          property(props.metaProp)(res.data)
        )) as Meta;
      })
      .finally(() => {
        metaModal.value.loading = false;
      });
  }

  paginationDone.value = !property(props.pageEndProp)(metaModal.value);
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

watch(
  () => itemsCheck.value,
  (newValue: any, oldValue: any) => {
    if (newValue !== oldValue) {
      onSelectItems();
    }
  },
  { deep: true }
);

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

const onClickPdf = async (event: any, row: any) => {
  if (loadings.value.pdfLoading) return;
  loadings.value.pdfLoading = true;

  emits("click:pdf", row);

  let response;

  try {
    if (props.pdfMethodApi == "post") {
      response = await useMyFetch().post(props.pdfApi, {
        id: row.item.id,
        is_id_only: 1,
      });

      const { data } = response.data;
      window.open(data.link, "_blank");
    } else if (props.pdfMethodApi == "pdf") {
      response = await useMyFetch().post(`${props.pdfApi}/${row.item.id}`);
    }
  } catch (error) {
    useAlert.alertError((error as any).response.data.message);
  } finally {
    loadings.value.pdfLoading = false;
  }
};

const showHideColumn = (event: any) => {
  console.log("showHideColumn", event);
};

const showHideFilter = (event: any) => {
  console.log("showHideFilter", event);
};

const onDoubleClick = async (event: any, row: any) => {
  if (!props.editLink) return;

  navigateTo(`${props.editLink}/${row.item.id}`);
};

const exportToCsv = async () => {
  if (loadings.value.csvLoading) return;
  loadings.value.csvLoading = true;

  emits("click:csv", filters.value);

  if (!!props.isCsv) {
    return;
  }

  let apiUrl = props.csvApi;
  if (props.methodApi === "post") {
    apiUrl = `${props.csvApi}`;

    try {
      const response = await useMyFetch().post(apiUrl, filters.value, {
        responseType: "blob",
      });

      const contentType = response.headers?.["content-type"] || "";

      if (contentType && contentType.includes("application/json")) {
        const jsonData = response.data;
        useAlert.alertError(jsonData.message || "Failed to generate CSV file");
      } else {
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const today = new Date();
        // format Date yyyy-mm-dd hh:mm:ss

        const dateStr = today
          .toISOString()
          .replace(/T/, "_")
          .replace(/:/g, "-")
          .split(".")[0];
        a.download = `${props.label.replace(/\s+/g, "_")}_${dateStr}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        useAlert.alertSuccess("CSV file downloaded successfully");
      }

      return response;
    } catch (error: any) {
      console.log("Failed To Export CSV", error);
      useAlert.alertError("Failed to export CSV!");
    } finally {
      loadings.value.csvLoading = false;
    }
  } else {
    apiUrl = `${props.csvApi}?${qs.stringify(filters.value)}`;
    window.open(apiUrl, "_blank");
  }
};

const getDefaultTabSlotNameIndex = (): number => {
  if (!props.isDefaultTabSlotExists || !tabs.value) {
    return -1;
  }

  return tabs.value.findIndex((tab) => tab === defaultTabName.value);
};

const onIntersect = (isIntersecting: boolean): void => {
  if (isIntersecting && !metaModal.value.loading && !paginationDone.value) {
    filters.value.page++;
    useDebouncedRef(filterData(), 100);
  }
};

watch(
  () => props.modelValue,
  (newValue: any, oldValue: any) => {
    if (newValue !== oldValue) {
      itemsCheck.value = props.modelValue;
    }
  }
);

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
    ...props.query,
    ...props.queryModal,
  };

  generateFiltersObj();
  await Promise.all([filterData(), fetchSingle(props.modelValue)]);

  generateHeadersObj();

  if (!!props.modelValue) {
    itemsCheck.value.push(props.modelValue);
  }
});

defineExpose({
  openModal,
  clearSelected,
  fetchDataServerFetch,
  filterData,
  showHideColumn,
  showHideFilter,
  onSelectItems,
  onClickDelete,
  fetchSingle,
  fetchBulk,
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

    <slot name="topFilters"></slot>

    <form
      :class="classMerge('flex flex-col gap-2 p-3')"
      @submit.prevent="filterData()"
      v-if="!props.noFilter"
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
            :initial-value="filter.others?.initialValue"
          />
          <d-date-picker-light
            v-else-if="filter.type === 'date'"
            v-model="filters[filter.key]"
            :label="filter.title"
            :fallback-date="filter.others?.fallbackDate"
            :clearable="filter.others?.clearable"
            :initial-value="filter.others?.initialValue"
          />
          <d-autocomplete
            v-else-if="filter.type === 'autocomplete'"
            v-model="filters[filter.key]"
            :label="filter.title"
            :api="filter.others?.api"
            :query="filter.others?.query"
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
            :initial-value="filter.others?.initialValue"
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
            :initial-value="filter.others?.initialValue"
          />

          <d-select-table
            v-if="filter.type === 'select-table'"
            :api="filter.others?.api"
            :detail-api="filter.others?.detailApi"
            method-api="post"
            detail-method-api="post"
            :mapping-detail="filter.others?.mappingDetail"
            :items-prop="filter.others?.itemsProp"
            :label="filter.title"
            :item-value="filter.others?.itemValue"
            :item-title="filter.others?.itemTitle"
            v-model="filters[filter.key]"
            :class="filter.others?.class"
            :multiple="filter.others?.multiple"
            :modal-custom-class="filter.others?.modalCustomClass"
            :fields="filter.others?.fields"
            :filters="filter.others?.filters"
            :inner-search-key="filter.others?.innerSearchKey"
            :initial-value="filter.others?.initialValue"
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
      <div
        :class="
          classMerge('grid grid-cols-7 items-center gap-2 w-full relative')
        "
      >
        <d-submit-button
          @click:submit="filterData"
          @click:clear="clearFilters"
          class="col-span-4 md:col-span-full"
        >
          <template #append>
            <div
              class="flex gap-2 items-center w-full col-span-3 sm:col-span-6"
            >
              <d-button
                v-if="props.isCsv || !!props.csvApi"
                :cta="'CSV'"
                :class="
                  classMerge(
                    'dark:!bg-dark2 hover:bg-[#b8fcdc] !gap-6 dark:hover:!bg-dark1 text-sm transition-all ease-in-out !border-2 p-2 rounded-lg !border-solid !border-[#198754] dark:!border-[#198754] '
                  )
                "
                :text-class="classMerge('text-[#198754] mx-auto')"
                :icon-class="'text-[#198754] dark:text-[#198754]'"
                type="button"
                size="xl"
                @click="exportToCsv()"
                icon="mdi-file-table-outline"
              />
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

              <!-- <div class="flex items-center gap-2">
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
              </div> -->

              <div class="absolute right-0">
                <slot name="actions"></slot>
              </div>
            </div>
          </template>
        </d-submit-button>
      </div>
    </form>

    <div class="flex h-max w-full flex-col">
      <!-- loop for tabs with slot by default -->

      <div v-if="!!tabs && tabs?.length > 0" class="flex flex-col">
        <slot name="tabs">
          <d-tabs
            :tabs="tabs"
            :current="tabIndex"
            :class="'border-x border-t border-dark2'"
            @update:current="onClickTab"
          />
        </slot>

        <slot
          v-for="(tab, index) in tabs"
          :name="`tab.${tab}`"
          :key="index"
          :meta="metaModal"
          :filters="filters"
          :props="props"
        >
          <div
            v-if="tabIndex == index"
            :class="classMerge('border-x border-t border-dark2')"
          >
            <template
              v-if="
                index === getDefaultTabSlotNameIndex() &&
                props.isDefaultTabSlotExists
              "
            >
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
                :fixed-header="props.fixedHeader"
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
                    <div class="flex items-center justify-center gap-2">
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

                      <slot name="actions.pdf" :item="item" :index="index">
                        <d-button
                          v-if="props.pdfApi"
                          @click="onClickPdf($event, { item, index })"
                          :icon="
                            loadings.pdfLoading ? 'mdi-loading' : 'mdi-download'
                          "
                          class="p-1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                          :icon-class="
                            classMerge(
                              'text-cancel dark:text-primary1',
                              loadings.pdfLoading ? 'animate-spin' : ''
                            )
                          "
                          text-class="text-cancel dark:text-primary1"
                          rounded="xl"
                          size=""
                          cta="PDF"
                          icon-size="16"
                        ></d-button>
                      </slot>
                    </div>
                  </slot>
                  <slot v-else-if="field.key == 'row_num'">
                    <span v-if="metaModal.data[index] && field.value">{{
                      useNumber.determineRowNumber(
                        filters.per_page,
                        filters.page,
                        index
                      )
                    }}</span>
                  </slot>
                  <slot
                    v-else
                    :name="`item.${field.key}`"
                    :item="item"
                    :index="index"
                  >
                    <span v-if="metaModal.data[index] && field.value">{{
                      metaModal.data[index][field.value]
                    }}</span>
                  </slot>
                </template>

                <template #footer.prepend>
                  <div class="flex grow items-center"></div>
                </template>
              </v-data-table-server>
            </template>
            <slot v-else :name="`tab.content.${stringWithSpaceToDash(tab)}`">
              {{ stringWithSpaceToDash(tab) }}
              <!-- Fallback content for tabs without custom slots -->
              No content available for {{ tab }} tab
            </slot>
          </div>
        </slot>
      </div>
      <v-data-table-server
        v-else
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
          class: classMerge(
            '!bg-scLightest dark:!bg-dark2 whitespace-nowrap',
            props.headerTableClass
          ),
        }"
        :row-props="{
          // class: 'cursor-pointer whitespace-nowrap',
          class: classMerge(
            'cursor-pointer whitespace-nowrap',
            props.rowTableClass
          ),
        }"
        :item-value="props.itemValue"
        show-current-page
        :return-object="props.returnObject"
        :show-select="!!props.multiple"
        :multiple="props.multiple"
        :select-strategy="props.selectStrategy"
        @update:options="fetchDataServerFetch"
        fixed-header
        :height="props.height"
        hover
        @click:row="onSelectOption"
        @dblclick:row="onDoubleClick"
        :hide-default-footer="props.hideDefaultFooter"
        item-selectable="selectable"
      >
        <template #body.append>
          <tr
            v-if="
              !paginationDone &&
              !!api &&
              metaModal.data.length > 0 &&
              props.isInfinateScroll
            "
            class="pa-4 teal--text w-full text-center"
          >
            <td
              class="text-center"
              v-intersect="onIntersect"
              :colspan="headersModal.length"
              style="height: 50px"
            >
              Loading more items ...
            </td>
          </tr>
        </template>
        <template #no-data> No data available </template>

        <template
          #header.data-table-select="{
                allSelected,
                selectAll,
                someSelected
              }: {
                allSelected: any
                selectAll: any
                someSelected: any
              }"
        >
          <div class="flex items-center justify-center w-full">
            <v-checkbox-btn
              v-if="props.isSelectHidden"
              :model-value="allSelected"
              :indeterminate="someSelected && !allSelected"
              hide-details
              @update:model-value="selectAll"
            />
          </div>
        </template>
        <!-- <template
          v-for="(field, index) in headersModal"
          :key="index"
          v-slot:[`header.${field.value}`]="{
            allSelected,
            selectAll,
            someSelected,
          }"
        >
          <slot
            :name="`header.${field.key}`"
            :field="field"
            :allSelected="allSelected"
            :selectAll="selectAll"
            :someSelected="someSelected"
          >
            {{ field.title }}
          </slot>
        </template> -->
        <!-- <template
          v-for="(field, index) in headersModal"
          :key="index"
          #[`header.${field.value}`]="{ allSelected, selectAll, someSelected }"
        >
          <slot
            v-if="slots[`header.${field.key}`]"
            :name="`header.${field.key}`"
            :field="field"
            :allSelected="allSelected"
            :selectAll="selectAll"
            :someSelected="someSelected"
          >
            {{ field.title }}
          </slot>
        </template> -->

        <template
          v-for="(field, index) in headersModal"
          :key="index"
          v-slot:[`item.${field.value}`]="{
            item,
            index,
            isSelected,
            toggleSelect,
            internalItem,
          }"
        >
          <slot
            v-if="field.key == 'action'"
            :name="`item.${field.key}`"
            :item="item"
            :index="index"
            :isSelected="isSelected"
            :toggleSelect="toggleSelect"
            :internalItem="internalItem"
            class="abcd"
          >
            <div class="flex items-center justify-center gap-2">
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

              <slot name="actions.pdf" :item="item" :index="index">
                <d-button
                  v-if="props.pdfApi"
                  @click="onClickPdf($event, { item, index })"
                  :icon="loadings.pdfLoading ? 'mdi-loading' : 'mdi-download'"
                  class="p-1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                  :icon-class="
                    classMerge(
                      'text-cancel dark:text-primary1',
                      loadings.pdfLoading ? 'animate-spin' : ''
                    )
                  "
                  text-class="text-cancel dark:text-primary1"
                  rounded="xl"
                  size=""
                  cta="PDF"
                  icon-size="16"
                ></d-button>
              </slot>
            </div>
          </slot>

          <slot v-else-if="field.key == 'row_num'">
            <span
              v-if="
                metaModal.data[index] && field.value && !props.isInfinateScroll
              "
              >{{
                useNumber.determineRowNumber(
                  filters.per_page,
                  filters.page,
                  index
                )
              }}
            </span>
            <span
              v-else-if="
                metaModal.data[index] && field.value && props.isInfinateScroll
              "
              >{{ index + 1 }}</span
            >
          </slot>
          <slot
            v-else
            :name="`item.${field.key}`"
            :item="item"
            :index="index"
            :isSelected="isSelected"
            :toggleSelect="toggleSelect"
            :internalItem="internalItem"
          >
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
