<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useSalesInvoiceStore from "~/stores/invoices/SalesInvoiceStore";
import type { QSalesInvoiceIndexType } from "~/types/sales-invoices/SalesInvoiceType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";
import type { WidgetSingleType } from "~/types/sales-orders/SalesOrderType";

const invoiceStore = useSalesInvoiceStore();
const { queryModal, metaModal, tabIndex } = storeToRefs(invoiceStore);
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Invoice Sales",
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
    title: "Customer",
    key: "customer_name",
    value: "customer_name",
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
    title: "Title",
    key: "title",
    value: "title",
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
    title: "Due Date",
    key: "due_date",
    value: "due_date",
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
    title: "Buyer",
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
      label: "Buyer",
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
      items: useStatics.invDpIndexDateType,
      initialValue: "invoice_date",
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
  {
    title: "Title",
    key: "title",
  },
]);

const fieldsDetailConfig = ref<FieldSelectableType[]>([
  {
    title: "#",
    key: "row_num",
    value: "row_num",
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
    title: "Customer",
    key: "customer_name",
    value: "customer_name",
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
    title: "Title",
    key: "title",
    value: "title",
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
    title: "Due Date",
    key: "due_date",
    value: "due_date",
    align: "start",
    sortable: true,
  },
  {
    title: "Product/Item Name",
    key: "item_name",
    value: "item_name",
    align: "start",
    sortable: false,
  },
  {
    title: "Qty",
    key: "qty",
    value: "qty",
    align: "end",
    sortable: false,
  },
  {
    title: "Price",
    key: "price",
    value: "price",
    align: "end",
    sortable: false,
  },
  {
    title: "Total",
    key: "total",
    value: "total",
    align: "end",
    sortable: false,
  },
  {
    title: "BOM Item Name",
    key: "bom_item_name",
    value: "bom_item_name",
    align: "start",
    sortable: false,
  },
  {
    title: "BOM Qty",
    key: "bom_qty",
    value: "bom_qty",
    align: "end",
    sortable: false,
  },
  {
    title: "Created By",
    key: "created_by_name",
    value: "created_by_name",
    align: "start",
    sortable: false,
  },
  {
    title: "Updated By",
    key: "updated_by_name",
    value: "updated_by_name",
    align: "start",
    sortable: false,
  },
]);

function getStatusColor(status: string): string {
  switch (status) {
    case "PAID":
      return "green";
    case "UNPAID":
      return "orange";
    case "CANCELLED":
      return "grey";
    default:
      return "white";
  }
}

const handleExportCsv = async () => {
  await useSalesInvoiceStore().exportToCsv();
};

const fetchFilter = async () => {
  await useSalesInvoiceStore().indexSalesInvoiceDetails();
};

const fetchDataServerFetch = async (options: { [key: string]: any }) => {
  queryModal.value.qIndex.page = options.page;
  queryModal.value.qIndex.per_page = options.itemsPerPage;

  if (options.sortBy.length > 0) {
    queryModal.value.qIndex.order_column = options.sortBy[0].key;
    queryModal.value.qIndex.order_direction = options.sortBy[0].order;
  } else {
    queryModal.value.qIndex.order_column = "";
    queryModal.value.qIndex.order_direction = "";
  }

  await fetchFilter();
};

const onClickFind = async (filters: QSalesInvoiceIndexType) => {
  if (tabIndex.value.index === useStatics.indexTabQuotation.detail) {
    queryModal.value.qIndex.export_type = "detail";
  } else {
    queryModal.value.qIndex.export_type = "all";
  }

  if (tabIndex.value.index === 1) {
    queryModal.value.qIndex = filters;
    await fetchFilter();
  }

  await useSalesInvoiceStore().indexWidget();
};

onMounted(() => {
  useSalesInvoiceStore().indexWidget();
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
        api="/v1/sales-invoices/index-sales-invoice"
        detail-link="/invoices/sales-invoices"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        class="col-span-2 lg:col-span-1"
        label="Sales Invoice"
        search-placeholder="Search anything related to Sales Invoice..."
        is-quick-select
        no-title
        edit-link="/invoices/invoice-sales/edit"
        delete-api="/v1/sales-invoices/delete-sales-invoice"
        pdf-api="/v1/sales-invoices/pdf-sales-invoice"
        csv-api="/v1/sales-invoices/csv-sales-invoice"
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndex"
        :tabs="['All', 'Detail']"
        :tab-index="tabIndex.index"
        :create-option="{
          link: '/invoices/invoice-sales/create',
          show: true,
          cta: '+ Create',
        }"
        @click:find="onClickFind"
        @update:filters="
          (filters: QSalesInvoiceIndexType) => {
            queryModal.qIndex = filters;
          }
        "
        @update:currentTab="
          (currentTab: number) => {
            tabIndex.index = currentTab;

            if (currentTab === useStatics.indexTab.detail) {
              queryModal.qIndex.export_type = 'detail';
            } else {
              queryModal.qIndex.export_type = 'all';
            }
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
        <template #item.bank_name="{ item }">
          <span
            v-if="item.bank_name && item.account_number && item.account_name"
          >
            {{ item.bank_name }} - {{ item.account_number }} -
            {{ item.account_name }}
          </span>
          <span v-else>
            {{ item.bank_name || "-" }}
          </span>
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
        <template #actions.delete="{ item }">
          <template v-if="item.status !== 'UNPAID'">
            <slot name="actions.delete" :item="item">
              <d-button
                icon="mdi-delete"
                is-no-text
                class="p-1 rounded-full ease-in-out transition-all dark:!bg-gray-500 cursor-not-allowed"
                icon-class="text-gray-500 dark:text-gray-300"
                rounded="xl"
                size=""
                cta="select"
                icon-size="16"
              ></d-button>
            </slot>
          </template>
        </template>
        <template #tab.content.detail>
          <v-data-table-server
            v-model:page="queryModal.qIndex.page"
            v-model:items-per-page="queryModal.qIndex.per_page"
            :items="metaModal.indexDetail.data ?? []"
            :headers="fieldsDetailConfig"
            :items-length="metaModal.indexDetail.meta.total ?? 0"
            :loading="metaModal.indexDetail.loading"
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
                  queryModal.qIndex.per_page,
                  queryModal.qIndex.page,
                  index
                )
              }}
            </template>
            <template #item.item_name="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.sales_invoice_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                {{ product.item_name }}
                <!-- <br /> -->

                <div
                  v-for="(soDtBom, iSoDtBom) in product.so_dts_boms"
                  :key="iSoDtBom"
                  class="whitespace-nowrap align-top"
                >
                  <br v-if="iSoDtBom < product.so_dts_boms.length - 1" />
                </div>
              </div>
            </template>
            <template #item.qty="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.sales_invoice_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                <d-num-layout
                  symbol=""
                  :min-precision="2"
                  :max-precision="2"
                  :value="product.qty"
                />

                <!-- <br /> -->
                <div
                  v-for="(soDtBom, iSoDtBom) in product.so_dts_boms"
                  :key="iSoDtBom"
                  class="whitespace-nowrap align-top"
                >
                  <br v-if="iSoDtBom < product.so_dts_boms.length - 1" />
                </div>
              </div>
            </template>
            <template #item.price="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.sales_invoice_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                <d-num-layout
                  symbol=""
                  :min-precision="0"
                  :value="product.price"
                />

                <!-- <br /> -->
                <div
                  v-for="(soDtBom, iSoDtBom) in product.so_dts_boms"
                  :key="iSoDtBom"
                  class="whitespace-nowrap align-top"
                >
                  <br v-if="iSoDtBom < product.so_dts_boms.length - 1" />
                </div>
              </div>
            </template>
            <template #item.total="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.sales_invoice_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                <d-num-layout
                  symbol=""
                  :min-precision="0"
                  :value="product.subtotal"
                />

                <!-- <br /> -->
                <div
                  v-for="(soDtBom, iSoDtBom) in product.so_dts_boms"
                  :key="iSoDtBom"
                  class="whitespace-nowrap align-top"
                >
                  <br v-if="iSoDtBom < product.so_dts_boms.length - 1" />
                </div>
              </div>
            </template>

            <template #item.bom_item_name="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.sales_invoice_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                <div v-if="product.so_dts_boms.length === 0">-</div>
                <div v-else class="whitespace-nowrap align-top">
                  <div
                    v-for="(soDtBom, iSoDtBom) in product.so_dts_boms"
                    :key="iSoDtBom"
                  >
                    {{ soDtBom.item_name }}
                    <br />
                  </div>
                </div>
                <d-divider
                  v-if="iProduct != item.sales_invoice_dts.length - 1"
                />
              </div>
            </template>
            <template #item.bom_qty="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.sales_invoice_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                <div v-if="product.so_dts_boms.length === 0">-</div>
                <div v-else class="whitespace-nowrap align-top">
                  <div
                    v-for="(soDtBom, iSoDtBom) in product.so_dts_boms"
                    :key="iSoDtBom"
                  >
                    {{ useNumber.formatNumberSeparator(soDtBom.qty, 2, 2) }}
                    <br />
                  </div>
                </div>
                <d-divider
                  v-if="iProduct != item.sales_invoice_dts.length - 1"
                />
              </div>
            </template>
          </v-data-table-server>
        </template>
      </d-datatable>
    </d-index-layout>
  </div>
</template>
