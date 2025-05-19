<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useInventoryStore from "~/stores/inventories/InventoryStore";
import type {
  ModalIndexRefFilterDateType,
  ModalIndexSalesOrderFilterAutoCompleteType,
  ModalIndexSalesOrderFilterTextType,
  ModalInvStatusFilterTextType,
  QInvIndexType,
} from "~/types/inventories/InventoryType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const inventoryStore = useInventoryStore();
const { queryModal, metaModal } = storeToRefs(inventoryStore);
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Inventory Status",
});

const fieldsConfig = ref<FieldSelectableType[]>([
  { title: "No", key: "no", width: 20, sortable: false },
  { title: "Group", key: "group_name", sortable: false },
  { title: "Sub Group", key: "sub_group_name", sortable: false },
  { title: "Warehouse", key: "warehouse_name", sortable: false },
  { title: "I/O Type", key: "io_type_name", sortable: false },
  { title: "Customer", key: "customer_name", sortable: false },
  { title: "I/O Date", key: "ingoing_at", sortable: false },
  {
    title: "Items",
    key: "items",
    align: "center",
    children: [
      {
        title: "Item Code",
        key: "item_code",
        align: "end",
        sortable: false,
      },
      {
        title: "Item Name",
        key: "item_name",
        align: "end",
        sortable: false,
      },
      {
        title: "Unit",
        key: "unit_name",
        align: "end",
        sortable: false,
      },
      {
        title: "Currency",
        key: "currency_name",
        align: "end",
        sortable: false,
      },
      {
        title: "Price",
        key: "price",
        align: "end",
        sortable: false,
      },
      {
        title: "In",
        key: "qty_in",
        align: "end",
        sortable: false,
      },
      {
        title: "Out",
        key: "qty_out",
        align: "end",
        sortable: false,
      },
      {
        title: "Balance",
        key: "balance",
        align: "end",
        sortable: false,
      },
    ],
  },
]);

const filtersOptionsSalesOrders = ref([
  {
    title: "Warehouse",
    key: "warehouse_ids",
    type: "autocomplete",
    methodApi: "post",
    query: {
      is_active: 1,
    },
    api: "/v1/warehouses/index-warehouse",
    singleApi: "/v1/warehouses/index-warehouse",
    pageEndProp: "meta.next_page_url",
    innerSearchKey: "global",
    multiple: true,
    returnObject: false,
    itemColor: "brown-lighten-2",
    itemValue: "id",
    itemTitle: "name",
  },
  {
    title: "Group",
    key: "item_group_ids",
    type: "autocomplete",
    methodApi: "post",
    query: {
      is_active: 1,
    },
    api: "/v1/item-groups/index-item-group",
    singleApi: "/v1/item-groups/index-item-group",
    pageEndProp: "meta.next_page_url",
    innerSearchKey: "global",
    multiple: true,
    returnObject: false,
    itemColor: "brown-lighten-2",
    itemValue: "id",
    itemTitle: "name",
  },
  {
    title: "Sub Group",
    key: "item_sub_group_ids",
    type: "autocomplete",
    methodApi: "post",
    query: {
      is_active: 1,
    },
    api: "/v1/item-sub-groups/index-item-sub-group",
    singleApi: "/v1/item-sub-groups/index-item-sub-group",
    pageEndProp: "meta.next_page_url",
    innerSearchKey: "global",
    multiple: true,
    returnObject: false,
    itemColor: "brown-lighten-2",
    itemValue: "id",
    itemTitle: "name",
  },
]);

const filtersTextInventories = ref([
  {
    title: "Inventory No",
    key: "inventory_no",
  },
  {
    title: "Surat Jalan No",
    key: "surat_jalan_no",
  },
  {
    title: "DO No",
    key: "do_no",
  },
  {
    title: "Global",
    key: "global",
  },
]);

const filtersDateInventories = ref([
  {
    title: "Start Date",
    key: "start_date",
    type: "date",
  },
  {
    title: "End Date",
    key: "end_date",
    type: "date",
  },
]);

// const changeTitle = () => {
//   let config = {
//     topTitle: "Inventory",
//     parentTitle: "Orders",
//     subTitlePath: "Inventory",
//     lastPathSegment: "",
//   };

//   layoutStore.defineTitlePath(config);
// };

const fetchDataServerFetch = async (item: {
  page: number;
  sortBy: [
    {
      key: string;
      order: string;
    }
  ];
  itemsPerPage: number;
}) => {
  queryModal.value.qIndexInventoryStatus.page = item.page;
  queryModal.value.qIndexInventoryStatus.per_page = item.itemsPerPage;
  if (item.sortBy.length > 0) {
    queryModal.value.qIndexInventoryStatus.order_column = item.sortBy[0].key;
    queryModal.value.qIndexInventoryStatus.order_direction =
      item.sortBy[0].order;
  }

  inventoryStore.indexInventoryStatus();
};

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
      <!-- <d-datatable
        api="/v1/inventories/index-inventory-status"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        class="col-span-2 lg:col-span-1"
        search-placeholder="Search anything related to inventory.."
        no-title
        no-delete
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndexInventoryStatus"
        @update:filters="
          (filters: QInvIndexType) => {
            queryModal.qIndexInventoryStatus = filters;
          }
        "
      >
        <template #item.qty_in="{ item }">
          <d-num-layout :value="item.qty_in" />
        </template>
        <template #item.total_pph23="{ item }">
          <d-num-layout :value="item.total_pph23" />
        </template>
      </d-datatable> -->

      <v-data-table-server
        v-model:page="queryModal.qIndexInventoryStatus.page"
        :items="metaModal.indexInventoryStatus.data ?? []"
        :headers="fieldsConfig"
        :items-per-page="queryModal.qIndexInventoryStatus.per_page"
        :items-length="metaModal.indexInventoryStatus.meta.total ?? 0"
        :items-per-page-options="useInitials.perPageOptions"
        :loading="metaModal.indexInventoryStatus.loading"
        item-value="id"
        density="compact"
        fixed-header
        height="650"
        :row-props="{
          class: '!whitespace-nowrap',
        }"
        class="elevation-1"
        :header-props="{
          class: '!bg-scLightest dark:!bg-dark2 py-2',
        }"
        show-current-page
        hover
        @update:options="fetchDataServerFetch"
      >
        <template #top>
          <form
            class="grid grid-cols-5 w-full flex-row items-center gap-2 p-3"
            @submit.prevent="inventoryStore.indexInventoryStatus()"
          >
            <d-autocomplete-client
              v-model="queryModal.qIndexInventoryStatus.date_type"
              :items="useStatics.invIndexDateType"
              label="Date Type"
              item-value="value"
              item-title="title"
              :clearable="false"
            />
            <d-date-picker-light
              v-for="filter in filtersDateInventories"
              :key="filter.key"
              v-model="queryModal.qIndexInventoryStatus[filter.key as ModalIndexRefFilterDateType]"
              :label="filter.title"
            />
            <d-select-table
              api="/v1/products/index-product"
              detail-api="/v1/products/index-product"
              method-api="post"
              detail-method-api="post"
              mapping-detail="data[0]"
              total-prop="meta.total"
              label="Product"
              v-model="queryModal.qIndexInventoryStatus.item_ids"
              class=""
              multiple
              modal-custom-class="!w-4/5"
              :fields="useInitials.productFieldsFilterConfig.fields"
              :filters="useInitials.productFieldsFilterConfig.filters"
            />
            <d-autocomplete
              v-for="filter in filtersOptionsSalesOrders"
              :key="filter.key"
              v-model="queryModal.qIndexInventoryStatus[filter.key as ModalIndexSalesOrderFilterAutoCompleteType]"
              :api="filter.api"
              :single-api="filter.singleApi"
              :method-api="filter.methodApi"
              inner-search-key="global"
              :page-end-prop="filter.pageEndProp"
              :label="filter.title"
              :item-value="filter.itemValue"
              :item-title="filter.itemTitle"
              multiple
              :placeholder="`Type ${filter.title} ...`"
            ></d-autocomplete>

            <d-text-input
              v-for="filter in filtersTextInventories"
              :key="filter.key"
              v-model="queryModal.qIndexInventoryStatus[filter.key as ModalInvStatusFilterTextType]"
              :label="filter.title"
              :placeholder="filter.title"
              append-inner-icon="mdi-magnify"
            />

            <d-submit-button
              @click:submit="inventoryStore.indexInventoryStatus()"
              @click:clear="inventoryStore.handleClickClearInvStatus()"
              class="grid-cols-1"
            />
          </form>
        </template>
        <template #item="{ item, index }">
          <tr v-if="!!item.is_total">
            <td colspan="6" class="text-center bg-zinc-200 dark:!bg-scDarker2">
              Total
            </td>
            <td class="bg-zinc-200 dark:!bg-scDarker2"></td>
            <td class="bg-zinc-200 dark:!bg-scDarker2"></td>
            <td class="bg-zinc-200 dark:!bg-scDarker2"></td>
            <td class="bg-zinc-200 dark:!bg-scDarker2"></td>
            <td class="bg-zinc-200 dark:!bg-scDarker2"></td>
            <td class="bg-zinc-200 dark:!bg-scDarker2"></td>
            <td class="bg-zinc-200 dark:!bg-scDarker2">
              <d-num-layout :min-precision="0" :value="item.in_total" />
            </td>
            <td class="bg-zinc-200 dark:!bg-scDarker2">
              <d-num-layout :min-precision="0" :value="item.out_total" />
            </td>
            <td class="bg-zinc-200 dark:!bg-scDarker2">
              <d-num-layout :min-precision="0" :value="item.balance_total" />
            </td>
          </tr>

          <tr v-else>
            <td>
              <span>{{
                useNumber.determineRowNumber(
                  queryModal.qIndexInventoryStatus.per_page,
                  queryModal.qIndexInventoryStatus.page,
                  index
                )
              }}</span>
            </td>
            <td>{{ item.item_group_name }}</td>
            <td>{{ item.item_sub_group_name }}</td>
            <td>{{ item.warehouse_name }}</td>
            <td>{{ item.io_type_name }}</td>
            <td>{{ item.customer_name }}</td>
            <td>{{ item.ingoing_at }}</td>
            <td class="text-end">{{ item.item_code }}</td>
            <td class="text-end">{{ item.item_name }}</td>
            <td class="text-end">{{ item.unit_name }}</td>
            <td class="text-end">{{ item.currency_name }}</td>
            <td class="text-end">
              <d-num-layout
                :min-precision="0"
                :max-precision="0"
                :value="item.price"
              />
            </td>
            <td class="text-end">
              <d-num-layout :min-precision="0" :value="item.qty_in" />
            </td>
            <td class="text-end">
              <d-num-layout :min-precision="0" :value="item.qty_out" />
            </td>
            <td class="text-end">
              <d-num-layout :min-precision="0" :value="item.balance" />
            </td>
          </tr>
        </template>
      </v-data-table-server>
    </d-index-layout>
  </div>
</template>