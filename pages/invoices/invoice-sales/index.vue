<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useSalesInvoiceStore from "~/stores/invoices/SalesInvoiceStore";
import type { QSalesInvoiceIndexType } from "~/types/sales-invoices/SalesInvoiceType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const { queryModal } = useSalesInvoiceStore();
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Sales Invoice",
});

const fieldsConfig = ref<FieldSelectableType[]>([
  {
    title: "Invoice No",
    key: "invoice_no",
    value: "invoice_no",
    align: "start",
    sortable: true,
  },
  {
    title: "Buyer",
    key: "customer_name",
    value: "customer_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Invoice Date",
    key: "invoice_date",
    value: "invoice_date",
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
    title: "Qty",
    key: "total_qty",
    value: "total_qty",
    align: "end",
    sortable: true,
  },
  {
    title: "Sub Amount",
    key: "total_amount_products",
    value: "total_amount_products",
    align: "end",
    sortable: true,
  },
  {
    title: "DP Amount",
    key: "total_dp_products",
    value: "total_dp_products",
    align: "end",
    sortable: true,
  },
  {
    title: "Balance",
    key: "total_balance_products",
    value: "total_balance_products",
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
    title: "Buyer",
    key: "customer_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      api: "/v1/customers/index-customer",
      singleApi: "/v1/customers/index-customer",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Buyer",
      innerSearchKey: "global",
      multiple: true,
      returnObject: false,
      itemColor: "brown-lighten-2",
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
    title: "Currency",
    key: "currency_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      api: "/v1/currencies/index-currency",
      singleApi: "/v1/currencies/index-currency",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Currency",
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
      items: useStatics.SalesInvoiceIndexStatus,
    },
  },
  {
    title: "Invoice No",
    key: "invoice_no",
  },
]);

function getStatusColor(status: string): string {
  switch (status) {
    case 'PAID':
      return 'green';
    case 'UNPAID':
      return 'orange';
    case 'CANCELLED':
      return 'grey';
    default:
      return 'white';
  }
}

async function changeStatus(id: number, status: string) {
  const salesInvoiceStore = useSalesInvoiceStore();
  await salesInvoiceStore.changeStatus(id, status);
  await salesInvoiceStore.indexSalesInvoice();
}
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
        api="/v1/sales-invoices/index-sales-invoice"
        detail-link="/invoices/sales-invoices"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        class="col-span-2 lg:col-span-1"
        search-placeholder="Search anything related to Sales Invoice..."
        is-quick-select
        no-title
        edit-link="/invoices/invoice-sales/edit"
        delete-api="/v1/sales-invoices/delete-sales-invoice"
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndex"
        :create-option="{
          link: '/invoices/invoice-sales/create',
          show: true,
          cta: '+ Create',
        }"
        @update:filters="
          (filters: QSalesInvoiceIndexType) => {
            queryModal.qIndex = filters;
          }
        "
      >
        <template #item.exchange_rate="{ item }">
          <d-num-layout :value="item.exchange_rate" />
        </template>
        <template #item.total_vat="{ item }">
          <d-num-layout :value="item.total_vat" />
        </template>
        <template #item.total_pph23="{ item }">
          <d-num-layout :value="item.total_pph23" />
        </template>
        <template #item.total_qty="{ item }">
          <d-num-layout :value="item.total_qty" :precision="0" />
        </template>
        <template #item.total_amount_products="{ item }">
          <d-num-layout :value="item.total_amount_products" />
        </template>
        <template #item.total_dp_products="{ item }">
          <d-num-layout :value="item.total_dp_products" />
        </template>
        <template #item.total_balance_products="{ item }">
          <d-num-layout :value="item.total_balance_products" />
        </template>
        <template #item.grand_total="{ item }">
          <d-num-layout :value="item.grand_total" />
        </template>
        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            class="text-white"
          >
            {{ item.status }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex gap-2">
            <v-btn
              v-if="item.status === 'UNPAID'"
              size="small"
              variant="text"
              @click="changeStatus(item.id, 'PAID')"
            >
              Mark as Paid
            </v-btn>
            <v-btn
              v-if="item.status === 'PAID'"
              size="small"
              variant="text"
              @click="changeStatus(item.id, 'UNPAID')"
            >
              Mark as Unpaid
            </v-btn>
          </div>
        </template>
      </d-datatable>
    </d-index-layout>
  </div>
</template>
