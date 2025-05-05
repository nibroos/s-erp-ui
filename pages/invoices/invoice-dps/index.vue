<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useInvoiceDpStore from "~/stores/invoices/InvoiceDpStore";
import type { QInvoiceDpIndexType } from "~/types/invoice-dps/InvoiceDpType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";
import type { WidgetSingleType } from "~/types/sales-orders/SalesOrderType";

const { queryModal, metaModal } = useInvoiceDpStore();
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Invoice DP",
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
    title: "Grand Total DP",
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
      items: useStatics.InvoiceDpIndexStatus,
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
  const invoiceDpStore = useInvoiceDpStore();
  await invoiceDpStore.changeStatus(id, status);
  await invoiceDpStore.indexInvoiceDp();
}

onMounted(() => {
  useInvoiceDpStore().indexWidget();
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
        api="/v1/invoice-dps/index-invoice-dp"
        detail-link="/invoices/invoice-dps"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        class="col-span-2 lg:col-span-1"
        search-placeholder="Search anything related to Invoice DP..."
        is-quick-select
        no-title
        edit-link="/invoices/invoice-dps/edit"
        delete-api="/v1/invoice-dps/delete-invoice-dp"
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndex"
        :create-option="{
          link: '/invoices/invoice-dps/create',
          show: true,
          cta: '+ Create',
        }"
        @click:find="useInvoiceDpStore().indexWidget()"
        @update:filters="
          (filters: QInvoiceDpIndexType) => {
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
