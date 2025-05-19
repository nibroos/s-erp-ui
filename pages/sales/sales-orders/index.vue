<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useSalesOrderStore from "~/stores/orders/SalesOrderStore";
import type {
  QSoIndexType,
  WidgetSingleType,
} from "~/types/sales-orders/SalesOrderType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const { queryModal, metaModal } = useSalesOrderStore();
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Sales Orders",
});

const fieldsConfig = ref<FieldSelectableType[]>([
  {
    title: "Order No",
    key: "sales_order_no",
    value: "sales_order_no",
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
    title: "Order Type",
    key: "order_type_name",
    value: "order_type_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Customer",
    key: "customer_name",
    value: "customer_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Order Date",
    key: "order_at",
    value: "order_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Shipping Date",
    key: "shipping_at",
    value: "shipping_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Agreement Date",
    key: "agree_at",
    value: "agree_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Expired Date",
    key: "expired_at",
    value: "expired_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Due Date",
    key: "due_at",
    value: "due_at",
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
    title: "Exc. Rate",
    key: "exchange_rate",
    value: "exchange_rate",
    align: "end",
    sortable: true,
  },
  {
    title: "Qty",
    key: "total_qty",
    value: "total_qty",
    align: "end",
    sortable: true,
  },
  {
    title: "Subtotal",
    key: "subtotal",
    value: "subtotal",
    align: "end",
    sortable: true,
  },
  {
    title: "VAT",
    key: "total_vat",
    value: "total_vat",
    align: "end",
    sortable: true,
  },
  {
    title: "PPH",
    key: "total_pph23",
    value: "total_pph23",
    align: "end",
    sortable: true,
  },
  {
    title: "Discount",
    key: "total_discount",
    value: "total_discount",
    align: "end",
    sortable: true,
  },
  {
    title: "Grand Total",
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
    title: "Order Type",
    key: "order_type_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      query: {
        is_active: 1,
      },
      api: "/v1/order-types/index-order-type",
      singleApi: "/v1/order-types/index-order-type",
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
    title: "Date Type",
    key: "date_type",
    type: "autocomplete-client",
    others: {
      items: useStatics.SoIndexDateType,
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
    title: "Status",
    key: "status",
    type: "autocomplete-client",
    others: {
      items: useStatics.SoIndexStatus,
    },
  },
  {
    title: "Order No",
    key: "sales_order_no",
  },
  {
    title: "PO Buyer No",
    key: "po_buyer_no",
  },
]);

// const changeTitle = () => {
//   let config = {
//     topTitle: "SalesOrder",
//     parentTitle: "Orders",
//     subTitlePath: "SalesOrder",
//     lastPathSegment: "",
//   };

//   layoutStore.defineTitlePath(config);
// };

onMounted(() => {
  useSalesOrderStore().indexWidget();
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
        api="/v1/sales-orders/index-sales-order"
        detail-link="/sales/sales-orders"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        class="col-span-2 lg:col-span-1"
        search-placeholder="Search anything related to Order.."
        is-quick-select
        no-title
        :no-pdf="false"
        edit-link="/sales/sales-orders/edit"
        delete-api="/v1/sales-orders/delete-sales-order"
        pdf-api="/v1/sales-orders/pdf-sales-order"
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndex"
        :create-option="{
          link: '/sales/sales-orders/create',
          show: true,
          cta: '+ Create',
        }"
        @click:find="useSalesOrderStore().indexWidget()"
        @update:filters="
          (filters: QSoIndexType) => {
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
        <template #item.total_vat="{ item }">
          <d-num-layout :value="item.total_vat" />
        </template>
        <template #item.total_qty="{ item }">
          <d-num-layout :value="item.total_qty" />
        </template>
        <template #item.total_discount="{ item }">
          <d-num-layout :value="item.total_discount" />
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