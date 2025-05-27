<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useInventoryStore from "~/stores/inventories/InventoryStore";
import type { QInvIndexType } from "~/types/inventories/InventoryType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";
import { format } from "date-fns";

const {
  queryModal,
  tabIndex,
  formOpnameSingle,
  formClosing,
  loadingCsv,
  metaModal,
} = storeToRefs(useInventoryStore());
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Stocks",
});

const fieldsConfig = ref<FieldSelectableType[]>([
  {
    title: "Warehouse",
    key: "warehouse_name",
    value: "warehouse_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Item",
    key: "item_name",
    value: "item_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Qty",
    key: "qty",
    value: "qty",
    align: "start",
    sortable: true,
  },
]);

const filtersConfig = ref<FilterSelectableType[]>([
  {
    title: "Warehouse",
    key: "warehouse_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      query: {
        is_active: 1,
      },
      api: "/v1/warehouses/index-warehouse",
      singleApi: "/v1/warehouses/index-warehouse",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Roles",
      innerSearchKey: "global",
      multiple: true,
      returnObject: false,
      itemColor: "brown-lighten-2",
    },
  },
  {
    title: "Item",
    key: "item_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      query: {
        is_active: 1,
      },
      api: "/v1/products/index-product",
      singleApi: "/v1/products/index-product",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Roles",
      innerSearchKey: "global",
      multiple: true,
      returnObject: false,
      itemColor: "brown-lighten-2",
    },
  },
  {
    title: "Group",
    key: "item_group_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      query: {
        is_active: 1,
      },
      api: "/v1/item-groups/index-item-group",
      singleApi: "/v1/item-groups/index-item-group",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Roles",
      innerSearchKey: "global",
      multiple: true,
      returnObject: false,
      itemColor: "brown-lighten-2",
    },
  },
  {
    title: "Sub Group",
    key: "item_sub_group_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      query: {
        is_active: 1,
      },
      api: "/v1/item-sub-groups/index-item-sub-group",
      singleApi: "/v1/item-sub-groups/index-item-sub-group",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Roles",
      innerSearchKey: "global",
      multiple: true,
      returnObject: false,
      itemColor: "brown-lighten-2",
    },
  },
  {
    title: "Start Date",
    key: "start_at",
    type: "date",
  },
  {
    title: "End Date",
    key: "end_at",
    type: "date",
    others: {
      fallbackDate: new Date().toISOString().split("T")[0],
      clearable: false,
    },
  },
]);

const headStockClosings = ref<FieldSelectableType[]>([
  { title: "No", key: "row_num", sortable: false },
  {
    title: "Last Closing Date",
    key: "last_closing_at",
    value: (item: any) => useEmptyTableCell(item, "last_closing_at"),
    // sortable: false,
  },
  {
    title: "Closing Date",
    key: "closing_at",
    value: (item: any) => useEmptyTableCell(item, "closing_at"),
    // sortable: false,
  },
  {
    title: "Item Name",
    key: "item_name",
    // sortable: false
  },
  {
    title: "Warehouse",
    key: "warehouse_name",
    // sortable: false
  },
  {
    title: "Begin",
    key: "begin_qty",
    align: "end",
    // sortable: false
  },
  {
    title: "Adjustment",
    key: "adjustment_qty",
    align: "end",
    // sortable: false,
  },
  {
    title: "IN",
    key: "in_qty",
    align: "end",
    // sortable: false
  },
  {
    title: "OUT",
    key: "out_qty",
    align: "end",
    // sortable: false
  },
  {
    title: "END",
    key: "end_qty",
    align: "end",
    // sortable: false
  },
  // { title: "OPNAME", key: "opname", sortable: false },
]);

const openModalOpnameSingle = (item: any) => {
  formOpnameSingle.value.isOpen = true;
  formOpnameSingle.value.id = item.id ?? null;
  formOpnameSingle.value.item_id = item.item_id;
  formOpnameSingle.value.warehouse_id = item.warehouse_id;
  formOpnameSingle.value.item_name = item.item_name;
  formOpnameSingle.value.warehouse_name = item.warehouse_name;
  formOpnameSingle.value.qty = item.qty;
  formOpnameSingle.value.qty_adjustment = item.qty_adjustment;
  formOpnameSingle.value.date_adjustment = item.date_closing;
  formOpnameSingle.value.prev_adjustment_date = item.adjustment_date ?? null;
};

const openModalCloseStock = () => {
  formClosing.value.isOpen = true;
  formClosing.value.end_closing_at = !!queryModal.value.qIndexStockClosings
    .end_at
    ? queryModal.value.qIndexStockClosings.end_at
    : format(new Date(), "yyyy-MM-dd");
};

const showHide = ref(false);
const toggleShowHide = () => {
  showHide.value = !showHide.value;
};

const submitStockClosing = async () => {
  await useInventoryStore().createClosing();
};

const fetchFilter = async () => {
  await useInventoryStore().indexStockClosings();
};

const fetchDataServerFetch = async (options: { [key: string]: any }) => {
  queryModal.value.qIndexStockClosings.page = options.page;
  queryModal.value.qIndexStockClosings.per_page = options.itemsPerPage;

  if (options.sortBy.length > 0) {
    queryModal.value.qIndexStockClosings.order_column = options.sortBy[0].key;
    queryModal.value.qIndexStockClosings.order_direction =
      options.sortBy[0].order;
  } else {
    queryModal.value.qIndexStockClosings.order_column = "";
    queryModal.value.qIndexStockClosings.order_direction = "";
  }

  await fetchFilter();
};

const onClickFind = async (filters: QInvIndexType) => {
  console.log("onClickFind", filters);

  if (tabIndex.value.indexStock === 1) {
    queryModal.value.qIndexStockClosings = filters;
    await useInventoryStore().indexStockClosings();
  }
};

// const changeTitle = () => {
//   let config = {
//     topTitle: "Inventory",
//     parentTitle: "Orders",
//     subTitlePath: "Inventory",
//     lastPathSegment: "",
//   };

//   layoutStore.defineTitlePath(config);
// };

// onMounted(() => {
//   changeTitle();
// });

// watchEffect(() => {
//   changeTitle();
// });
</script>

<template>
  <div class="flex flex-col gap-2">
    <d-index-layout
      :config="{
        permission: {
          isActive: true,
          name: ['r_ms', 'superadmin'],
        },
      }"
    >
      <d-datatable
        api="/v1/inventories/stocks/index-stock"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        class="col-span-2 lg:col-span-1"
        search-placeholder="Search anything related to stock.."
        is-quick-select
        no-title
        no-action
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndexStock"
        :tabs="['Balance Stock', 'Summary Card Stock']"
        :tab-index="tabIndex.indexStock"
        no-delete
        :default-clear-filter="useInitials.qIndexStockClosings"
        @click:find="onClickFind"
        @update:filters="
          (filters: QInvIndexType) => {
            queryModal.qIndexStock = filters;
          }
        "
        @update:currentTab="
          (currentTab: number) => {
            tabIndex.indexStock = currentTab;
          }
        "
      >
        <template #actions>
          <d-bt
            v-if="useAuth.permit('INVENTORY_CREATE')"
            cta="Close Stock"
            class="whitespace-nowrap rounded-md bg-sc px-3 py-2 text-sm transition-all ease-in-out hover:!bg-scDarker2 disabled:!cursor-not-allowed disabled:!bg-[#B0B0B0]"
            text-class="!text-white mx-auto"
            :no-icon="true"
            type="submit"
            :disabled="!!queryModal.qIndexStockClosings.start_at"
            @click="openModalCloseStock()"
          />
        </template>
        <template #tab.content.summary-card-stock>
          <v-data-table-server
            v-model:page="queryModal.qIndexStockClosings.page"
            v-model:items-per-page="queryModal.qIndexStockClosings.per_page"
            :items="metaModal.indexStockClosings.data ?? []"
            :headers="headStockClosings"
            :items-length="metaModal.indexStockClosings.meta.total ?? 0"
            :loading="metaModal.indexStockClosings.loading"
            item-value="id"
            density="compact"
            :header-props="{
              class: '!bg-scLightest dark:!bg-dark2 whitespace-nowrap',
            }"
            :row-props="{
              class: 'whitespace-nowrap',
            }"
            hover
            show-current-page
            fixed-header
            height="450"
            @update:options="fetchDataServerFetch"
          >
            <template
              #item.row_num="{ item, index }: { item: any, index: number }"
            >
              {{
                useNumber.determineRowNumber(
                  queryModal.qIndexStockClosings.per_page,
                  queryModal.qIndexStockClosings.page,
                  index
                )
              }}
            </template>
            <template #item.begin_qty="{ item }: { item: any }">
              <d-num-layout
                :value="item.begin_qty"
                :min-precision="0"
                :is-negative-check="true"
              />
            </template>

            <template #item.adjustment_qty="{ item }: { item: any }">
              <d-num-layout
                :value="item.adjustment_qty"
                :min-precision="0"
                :is-negative-check="true"
              />
            </template>

            <template #item.in_qty="{ item }: { item: any }">
              <d-num-layout
                :value="item.in_qty"
                :min-precision="0"
                :is-negative-check="true"
              />
            </template>

            <template #item.out_qty="{ item }: { item: any }">
              <d-num-layout
                :value="item.out_qty"
                :min-precision="0"
                :is-negative-check="true"
              />
            </template>

            <template #item.end_qty="{ item }: { item: any }">
              <d-num-layout
                :value="item.end_qty"
                :min-precision="0"
                :is-negative-check="true"
              />
            </template>

            <template #item.opname="{ item }: { item: any }">
              <d-button
                cta="Opname"
                class="my-1 items-center justify-center rounded-lg !border-0 !bg-sky-100 p-1.5 hover:!bg-sky-200"
                text-class="text-sky-600 uppercase text-xs"
                :no-icon="true"
                type="submit"
                @click="openModalOpnameSingle(item)"
              ></d-button>
            </template>
          </v-data-table-server>
        </template>
        <template #item.total_vat="{ item }">
          <d-num-layout :value="item.total_vat" />
        </template>
        <template #item.total_pph23="{ item }">
          <d-num-layout :value="item.total_pph23" />
        </template>
        <template #item.subtotal="{ item }">
          <d-num-layout :value="item.subtotal" />
        </template>
        <template #item.grand_total="{ item }">
          <d-num-layout :value="item.grand_total" />
        </template>
        <template #item.status="{ item }">
          {{ item.status }}
        </template>
      </d-datatable>
    </d-index-layout>

    <modals-final-modal
      :is-open="formClosing.isOpen"
      size="xs"
      label="Closing Stock Confirmation"
      custom-class="!w-1/2"
      parent-class="!z-[1500]"
      @update:is-open="formClosing.isOpen = $event"
    >
      <form class="flex flex-col gap-5" @submit.prevent="submitStockClosing">
        <div class="flex flex-col gap-3">
          <d-date-picker-light
            v-model="formClosing.end_closing_at"
            label="Closing Date"
          />

          <v-text-field
            v-model="formClosing.password"
            :append-inner-icon="
              showHide ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
            "
            variant="outlined"
            density="compact"
            hide-details="auto"
            label="Password"
            placeholder="Password"
            :type="showHide ? 'text' : 'password'"
            @click:append-inner="toggleShowHide"
          ></v-text-field>
          <d-switch-status
            v-model="formClosing.is_finalized"
            :label="`Finalized`"
            :true-value="1"
            :false-value="0"
          />
          <div
            v-if="formClosing.end_closing_at && formClosing.password"
            class="flex flex-col"
          >
            <p>
              Are you sure you want to close the stock on
              <span class="font-semibold">
                {{ formClosing.end_closing_at }}
              </span>
              ?
            </p>
            <p>
              This action cannot be undone. You can only close the stock once a
              day.
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <d-button
            cta="Close"
            class="grow justify-center rounded-lg !bg-rose-500 hover:!bg-rose-700"
            text-class="text-white"
            :no-icon="true"
            @click="formClosing.isOpen = false"
          ></d-button>
          <d-button
            class="w-9/12 justify-center rounded-lg !bg-sc hover:!bg-scDarker2"
            text-class="text-white"
            cta="Create Closing"
            :no-icon="true"
            type="submit"
          ></d-button>
        </div>
      </form>
    </modals-final-modal>
    <modals-final-modal
      :is-open="formOpnameSingle.isOpen"
      size="xs"
      label="Adjustment Confirmation"
      @update:is-open="formOpnameSingle.isOpen = $event"
    >
      <form
        class="flex flex-col gap-5"
        @submit.prevent="useInventoryStore().createOrUpdateAdjustment()"
      >
        <div class="flex flex-col gap-3">
          <d-date-picker-light
            v-model="formOpnameSingle.date_adjustment"
            label="Adjustment Date"
          />
          <d-num-v-format
            label="Qty"
            :model-value="formOpnameSingle.qty_adjustment"
            :precision="{
              min: 3,
              max: 3,
            }"
            currency="USD"
            :hide-currency-display="true"
            :reverse="false"
            @input:model-value="
              (val) => (formOpnameSingle.qty_adjustment = val)
            "
          />

          <!-- <v-text-field
            v-model="formOpnameSingle.password"
            :append-inner-icon="
              showHide ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
            "
            variant="outlined"
            density="compact"
            hide-details="auto"
            label="Password"
            placeholder="Password"
            :type="showHide ? 'text' : 'password'"
            @click:append-inner="toggleShowHide"
          ></v-text-field> -->
          <div v-if="formOpnameSingle.date_adjustment" class="flex flex-col">
            <p>Are you sure you want to adjust the stock on:</p>
            <ul>
              <li>
                <span class="font-semibold">Item:</span>
                {{ formOpnameSingle.item_name }}
              </li>
              <li>
                <span class="font-semibold">Warehouse:</span>
                {{ formOpnameSingle.warehouse_name }}
              </li>
            </ul>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <d-button
            cta="Close"
            class="grow justify-center rounded-lg !bg-rose-500 hover:!bg-rose-700"
            text-class="text-white"
            :no-icon="true"
            @click="formOpnameSingle.isOpen = false"
          ></d-button>
          <d-button
            class="w-9/12 justify-center rounded-lg !bg-sky-600 hover:!bg-sky-700"
            text-class="text-white"
            :cta="
              formOpnameSingle.prev_adjustment_date
                ? 'Update Adjustment'
                : 'Create Adjustment'
            "
            :no-icon="true"
            type="submit"
          ></d-button>
        </div>
      </form>
    </modals-final-modal>
  </div>
</template>