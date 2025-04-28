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
    title: "Branch",
    key: "branch_name",
    value: "branch_name",
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
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndexStock"
        no-delete
        @update:filters="
          (filters: QInvIndexType) => {
            queryModal.qIndexIn = filters;
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