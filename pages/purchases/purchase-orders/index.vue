<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import usePurchaseOrderStore from "~/stores/purchases/PurchaseOrderStore";
import type { QIndexType } from "~/types/purchase-orders/PurchaseOrderType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

import type { WidgetSingleType } from "~/types/sales-orders/SalesOrderType";

const { queryModal, metaModal } = usePurchaseOrderStore();
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Purchase Orders",
});

const fieldsConfig = ref<FieldSelectableType[]>([
  {
    title: "Purchase No",
    key: "po_no",
    value: "po_no",
    align: "start",
    sortable: true,
  },
  {
    title: "Supplier",
    key: "customer_name",
    value: "customer_name",
    align: "start",
    sortable: true,
  },
  {
    title: "PO Date",
    key: "po_date",
    value: "po_date",
    align: "start",
    sortable: true,
  },
  {
    title: "Delivery Date",
    key: "delivery_date",
    value: "delivery_date",
    align: "start",
    sortable: true,
  },
  {
    title: "PO Buyer No",
    key: "po_buyer_no",
    value: "po_buyer_no",
    align: "start",
    sortable: true,
  },
  {
    title: "Customer",
    key: "so_customer_name",
    value: "so_customer_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Currency",
    key: "currency_name",
    value: "currency_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Total",
    key: "grand_total",
    value: "grand_total",
    align: "end",
    sortable: true,
  },
  {
    title: "Status",
    key: "status",
    value: "status",
    align: "start",
    sortable: true,
  },
  {
    title: "Created By",
    key: "created_by_name",
    value: "created_by_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Updated By",
    key: "updated_by_name",
    value: "updated_by_name",
    align: "start",
    sortable: true,
  },
]);

const filtersConfig = ref<FilterSelectableType[]>([
  {
    title: "Supplier",
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
      label: "Suppliers",
      innerSearchKey: "global",
      multiple: true,
      returnObject: false,
      itemColor: "brown-lighten-2",
    },
  },
  {
    title: "Purchase Type",
    key: "purchase_type_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      query: {
        is_active: 1,
      },
      api: "/v1/purchase-types/index-purchase-type",
      singleApi: "/v1/purchase-types/index-purchase-type",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Purchase Types",
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
      items: useStatics.POIndexDateType,
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
    title: "Items",
    key: "product_ids",
    type: "select-table",
    others: {
      methodApi: "post",
      query: {
        is_active: 1,
      },
      api: "/v1/products/index-product",
      singleApi: "/v1/products/index-product",
      mappingDetail: "data[0]",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      totalProp: "meta.total",
      itemTitle: "name",
      itemValue: "id",
      label: "Items",
      innerSearchKey: "global",
      multiple: true,
      returnObject: false,
      modalCustomClass: "!w-4/5",
      fields: useInitials.productFieldsFilterConfig.fields,
      filters: useInitials.productFieldsFilterConfig.filters,
    },
  },
  {
    title: "Status",
    key: "status",
    type: "autocomplete-client",
    others: {
      items: useStatics.POIndexStatus,
    },
  },
  {
    title: "Purchase No",
    key: "po_no",
  },
]);

function getStatusColorFromStatics(status: string): string {
  const statusItem = useStatics.POIndexStatus.find((s) => s.value === status);
  return statusItem ? statusItem.color : "grey";
}

onMounted(() => {
  usePurchaseOrderStore().indexWidget();
});
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
        api="/v1/purchase-orders/index-purchase-order"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        label="Purchase Orders"
        class="col-span-2 lg:col-span-1"
        search-placeholder="Search anything related to Purchase Orders..."
        is-quick-select
        no-title
        edit-link="/purchases/purchase-orders/edit"
        delete-api="/v1/purchase-orders/delete-purchase-order"
        pdf-api="/v1/purchase-orders/pdf-purchase-order"
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndex"
        :create-option="{
          link: '/purchases/purchase-orders/create',
          show: true,
          cta: '+ Create',
        }"
        @click:find="usePurchaseOrderStore().indexWidget()"
        @update:filters="
          (filters: QIndexType) => {
            queryModal.qIndex = filters;
          }
        "
      >
        <template #topFilters>
          <d-widget-array
            :data="(metaModal.indexWidgets.data as WidgetSingleType[])"
            :class="''"
            :isLoading="metaModal.indexWidgets.loading"
          />
        </template>
        <template #item.total_qty="{ item }">
          <d-num-layout :value="item.total_qty" :precision="0" />
        </template>
        <template #item.subtotal="{ item }">
          <d-num-layout :value="item.subtotal" />
        </template>
        <template #item.total_discount="{ item }">
          <d-num-layout :value="item.total_discount" />
        </template>
        <template #item.total_pph23="{ item }">
          <d-num-layout :value="item.total_pph23" />
        </template>
        <template #item.total_vat="{ item }">
          <d-num-layout :value="item.total_vat" />
        </template>
        <template #item.grand_total="{ item }">
          <d-num-layout :value="item.grand_total" />
        </template>
        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColorFromStatics(item.status)"
            size="small"
            class="text-white"
          >
            {{ item.status }}
          </v-chip>
        </template>
      </d-datatable>
    </d-index-layout>
  </div>
</template>
