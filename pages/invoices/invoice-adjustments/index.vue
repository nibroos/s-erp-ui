<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useInvoiceAdjustmentStore from "~/stores/invoices/InvoiceAdjustmentStore";
import type { QInvoiceAdjustmentIndexType } from "~/types/invoice-adjustments/InvoiceAdjustmentType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const { queryModal } = useInvoiceAdjustmentStore();
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Invoice Adjustments",
});

const fieldsConfig = ref<FieldSelectableType[]>([
  {
    title: "Customer",
    key: "customer_name",
    value: "customer_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Invoice No",
    key: "invoice_no",
    value: "invoice_no",
    align: "start",
    sortable: true,
  },
  {
    title: "Title",
    key: "title",
    value: "title",
    align: "start",
    sortable: true,
  },
  {
    title: "Adjustment Date",
    key: "adjustment_date",
    value: "adjustment_date",
    align: "start",
    sortable: true,
  },
  {
    title: "Payment Date",
    key: "payment_date",
    value: "payment_date",
    align: "start",
    sortable: true,
  },
  {
    title: "Bank",
    key: "bank_name",
    value: "bank_name",
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
    title: "Payment Amount",
    key: "payment_amount",
    value: "payment_amount",
    align: "end",
    sortable: true,
  },
  {
    title: "Total Invoice",
    key: "total_invoice",
    value: "total_invoice",
    align: "end",
    sortable: true,
  },
  {
    title: "Total Adjustment",
    key: "total_adjustment",
    value: "total_adjustment",
    align: "end",
    sortable: true,
  },
  {
    title: "Total Balance",
    key: "total_balance",
    value: "total_balance",
    align: "end",
    sortable: true,
  },
  {
    title: "Admin Bank",
    key: "total_admin_bank",
    value: "total_admin_bank",
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
    title: "Created By",
    key: "created_by_name",
    value: "created_by_name",
    align: "start",
    sortable: true,
  },
]);

const filtersConfig = ref<FilterSelectableType[]>([
  {
    title: "Customer",
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
      label: "Customer",
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
      label: "Currency",
      innerSearchKey: "global",
      multiple: true,
      returnObject: false,
      itemColor: "brown-lighten-2",
    },
  },
  {
    title: "Invoice No",
    key: "invoice_no",
  },
  {
    title: "Title",
    key: "title",
  },
]);
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
        api="/v1/invoice-adjustments/index-invoice-adjustment"
        detail-link="/invoices/invoice-adjustments"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        class="col-span-2 lg:col-span-1"
        search-placeholder="Search anything related to Invoice Adjustments..."
        is-quick-select
        no-title
        edit-link="/invoices/invoice-adjustments/edit"
        delete-api="/v1/invoice-adjustments/delete-invoice-adjustment"
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndex"
        :create-option="{
          link: '/invoices/invoice-adjustments/create',
          show: true,
          cta: '+ Create',
        }"
        @update:filters="
          (filters: QInvoiceAdjustmentIndexType) => {
            queryModal.qIndex = filters;
          }
        "
      >
        <template #item.bank_name="{ item }">
          <span v-if="item.bank_name && item.account_number && item.account_name">
            {{ item.bank_name }} - {{ item.account_number }} - {{ item.account_name }}
          </span>
          <span v-else>
            {{ item.bank_name || '-' }}
          </span>
        </template>
        <template #item.exchange_rate="{ item }">
          <d-num-layout :value="item.exchange_rate" />
        </template>
        <template #item.payment_amount="{ item }">
          <d-num-layout :value="item.payment_amount" />
        </template>
        <template #item.total_invoice="{ item }">
          <d-num-layout :value="item.total_invoice" />
        </template>
        <template #item.total_adjustment="{ item }">
          <d-num-layout :value="item.total_adjustment" />
        </template>
        <template #item.total_balance="{ item }">
          <d-num-layout :value="item.total_balance" />
        </template>
        <template #item.total_admin_bank="{ item }">
          <d-num-layout :value="item.total_admin_bank" />
        </template>
        <template #item.grand_total="{ item }">
          <d-num-layout :value="item.grand_total" />
        </template>
      </d-datatable>
    </d-index-layout>
  </div>
</template>
