<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useInventoryStore from "~/stores/inventories/InventoryStore";
import type { QInvIndexType } from "~/types/inventories/InventoryType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const { queryModal } = useInventoryStore();
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
  { title: "Date", key: "ingoing_date", sortable: false },
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
        key: "in_qty",
        align: "end",
        sortable: false,
      },
      {
        title: "Out",
        key: "out_qty",
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

const filtersConfig = ref<FilterSelectableType[]>([
  {
    title: "Customers",
    key: "customer_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      query: {
        is_active: 1,
      },
      api: "/v1/customers/index-customer",
      singleApi: "/v1/customers/index-customer",
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
    title: "Date Type",
    key: "date_type",
    type: "autocomplete-client",
    others: {
      items: useStatics.invOutdexDateType,
    },
  },
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
  {
    title: "IN/OUT Type",
    key: "io_type_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      api: "/v1/io-types/index-io-type",
      singleApi: "/v1/io-types/index-io-type",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      query: {
        is_active: 1,
      },
      label: "Roles",
      innerSearchKey: "global",
      multiple: true,
      returnObject: false,
      itemColor: "brown-lighten-2",
    },
  },
  {
    title: "Currency",
    key: "currency_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      query: {
        is_active: 1,
      },
      api: "/v1/currencies/index-currency",
      singleApi: "/v1/currencies/index-currency",
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
    title: "Status",
    key: "status",
    type: "autocomplete-client",
    others: {
      items: useStatics.invIndexStatus,
    },
  },
  {
    title: "DO No",
    key: "do_no",
  },
  {
    title: "Invoice No",
    key: "invoice_no",
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

onMounted(() => {
  queryModal.qIndexOut.io_type = "INVENTORY_OUT";
});

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
        api="/v1/inventories/index-inventory-status"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        class="col-span-2 lg:col-span-1"
        search-placeholder="Search anything related to inventory.."
        is-quick-select
        no-title
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndexInventoryStatus"
        @update:filters="
          (filters: QInvIndexType) => {
            queryModal.qIndexInventoryStatus = filters;
          }
        "
      >
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
  </div>
</template>