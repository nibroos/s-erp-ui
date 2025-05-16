<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useDashboardStore from "~/stores/dashboard/DashboardStore";
import type { WidgetSingleType } from "~/types/sales-orders/SalesOrderType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const { queryModal, metaModal } = useDashboardStore();
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Dashboard",
});

const fieldsConfigByOrderType = ref<FieldSelectableType[]>([
  //   status
  // widget_type
  // order_count
  // total_qty
  // grand_total
  {
    title: "Order Type",
    key: "status",
    value: "status",
    align: "start",
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
    title: "Grand Total",
    key: "grand_total",
    value: "grand_total",
    align: "end",
    sortable: true,
  },
]);

const fieldsConfigByStatus = ref<FieldSelectableType[]>([
  //   status
  // widget_type
  // order_count
  // total_qty
  // grand_total
  {
    title: "Status",
    key: "status",
    value: "status",
    align: "start",
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
    title: "Grand Total",
    key: "grand_total",
    value: "grand_total",
    align: "end",
    sortable: true,
  },
]);

const fieldsConfigByBestCustomer = ref<FieldSelectableType[]>([
  //   status
  // widget_type
  // order_count
  // total_qty
  // grand_total
  {
    title: "Customer",
    key: "status",
    value: "status",
    align: "start",
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
    title: "Grand Total",
    key: "grand_total",
    value: "grand_total",
    align: "end",
    sortable: true,
  },
]);
</script>

<template>
  <div class="flex flex-col gap-2 bg-zinc-100 p-2">
    <d-index-layout
      :config="{
        permission: {
          isActive: true,
          name: ['r_ms', 'superadmin'],
        },
        contentClass: '!border-0',
      }"
    >
      <div class="grid grid-cols-3 gap-3">
        <div class="flex flex-col gap-2 bg-white dark:bg-dark2">
          <div class="flex items-center justify-between px-4 pt-2">
            <div class="flex flex-col">
              <h1 class="text-lg text-dark1 font-bold dark:text-white">
                Summary Information
              </h1>
              <p class="text-xs text-dark1 dark:text-white">
                Ringkasan Total Seluruh Transaksi Sales & Project
              </p>
            </div>

            <d-bt
              icon="mdi-refresh"
              class="px-2 py-1.5 gap-1 !bg-zinc-100 hover:!bg-grey3 rounded-lg ease-in-out transition-all"
              icon-class="dark:text-primary1 text-dark1"
              text-class="dark:text-primary1 text-dark1"
              rounded="xl"
              is-no-text
              icon-size="16"
              :loading="metaModal.indexSalesByOrderType.loading"
              @click="useDashboardStore().indexSalesByOrderType()"
            ></d-bt>
          </div>
          <d-datatable
            api="/v1/sales-orders/widget-sales-order"
            method-api="post"
            detail-method-api="post"
            items-prop="data"
            total-prop="meta.total"
            label="Master Order Type"
            class="col-span-2 lg:col-span-1"
            header-table-class="!bg-white dark:bg-dark2"
            search-placeholder="Search anything related to Quotations.."
            :fixed-header="false"
            :height="undefined"
            no-title
            :fields="fieldsConfigByStatus"
            :query-modal="queryModal.qIndexSalesByOrderType"
            no-filter
            no-delete
            :is-edit="false"
            no-action
            :create-option="{
              link: '/sales/quotations/create',
              show: false,
              cta: '+ Create',
            }"
            @click:find="useDashboardStore().indexSalesByOrderType()"
            @update:filters="
          (filters: any) => {
            queryModal.qIndexSalesByOrderType = filters;
          }
        "
          >
            <template #item.total_qty="{ item }">
              <d-num-layout :value="item.total_qty" />
            </template>
            <template #item.grand_total="{ item }">
              <d-num-layout :value="item.grand_total" :symbol="'Rp'" />
            </template>
          </d-datatable>
        </div>
        <div class="flex flex-col gap-2 bg-white dark:bg-dark2">
          <div class="flex items-center justify-between px-4 pt-2">
            <div class="flex flex-col">
              <h1 class="text-lg text-dark1 font-bold dark:text-white">
                Summary Order Type
              </h1>
              <p class="text-xs text-dark1 dark:text-white">
                Ringkasan Total Transaksi Berdasarkan Jenis Order
              </p>
            </div>

            <d-bt
              icon="mdi-refresh"
              class="px-2 py-1.5 gap-1 !bg-zinc-100 hover:!bg-grey3 rounded-lg ease-in-out transition-all"
              icon-class="dark:text-primary1 text-dark1"
              text-class="dark:text-primary1 text-dark1"
              rounded="xl"
              is-no-text
              icon-size="16"
              :loading="metaModal.indexSalesByOrderType.loading"
              @click="useDashboardStore().indexSalesByOrderType()"
            ></d-bt>
          </div>
          <d-datatable
            api="/v1/sales-orders/widget-sales-order-by-order-type"
            method-api="post"
            detail-method-api="post"
            items-prop="data"
            total-prop="meta.total"
            label="Master Order Type"
            class="col-span-2 lg:col-span-1"
            header-table-class="!bg-white dark:bg-dark2"
            search-placeholder="Search anything related to Quotations.."
            is-quick-select
            no-title
            :fields="fieldsConfigByOrderType"
            :query-modal="queryModal.qIndexSalesByOrderType"
            no-filter
            no-delete
            :is-edit="false"
            no-action
            :create-option="{
              link: '/sales/quotations/create',
              show: false,
              cta: '+ Create',
            }"
            @click:find="useDashboardStore().indexSalesByOrderType()"
            @update:filters="
          (filters: any) => {
            queryModal.qIndexSalesByOrderType = filters;
          }
        "
          >
            <template #item.total_qty="{ item }">
              <d-num-layout :value="item.total_qty" />
            </template>
            <template #item.grand_total="{ item }">
              <d-num-layout :value="item.grand_total" :symbol="'Rp'" />
            </template>
          </d-datatable>
        </div>

        <div class="flex flex-col gap-2 bg-white dark:bg-dark2">
          <div class="flex items-center justify-between px-4 pt-2">
            <div class="flex flex-col">
              <h1 class="text-lg text-dark1 font-bold dark:text-white">
                10 Best Customer
              </h1>
              <p class="text-xs text-dark1 dark:text-white">
                Daftar Customer Terbaik Berdasarkan Total Transaksi
              </p>
            </div>

            <d-bt
              icon="mdi-refresh"
              class="px-2 py-1.5 gap-1 !bg-zinc-100 hover:!bg-grey3 rounded-lg ease-in-out transition-all"
              icon-class="dark:text-primary1 text-dark1"
              text-class="dark:text-primary1 text-dark1"
              rounded="xl"
              is-no-text
              icon-size="16"
              :loading="metaModal.indexSalesByOrderType.loading"
              @click="useDashboardStore().indexSalesByOrderType()"
            ></d-bt>
          </div>
          <d-datatable
            api="/v1/sales-orders/widget-sales-order-by-best-customer"
            method-api="post"
            detail-method-api="post"
            items-prop="data"
            total-prop="meta.total"
            label="Master Order Type"
            class="col-span-2 lg:col-span-1"
            header-table-class="!bg-white dark:bg-dark2"
            search-placeholder="Search anything related to Quotations.."
            is-quick-select
            no-title
            :fields="fieldsConfigByBestCustomer"
            :query-modal="queryModal.qIndexSalesByOrderType"
            no-filter
            no-delete
            :is-edit="false"
            no-action
            :create-option="{
              link: '/sales/quotations/create',
              show: false,
              cta: '+ Create',
            }"
            @click:find="useDashboardStore().indexSalesByBestCustomer()"
            @update:filters="
          (filters: any) => {
            queryModal.qIndexSalesByBestCustomer = filters;
          }
        "
          >
            <template #item.total_qty="{ item }">
              <d-num-layout :value="item.total_qty" />
            </template>
            <template #item.grand_total="{ item }">
              <d-num-layout :value="item.grand_total" :symbol="'Rp'" />
            </template>
          </d-datatable>
        </div>
      </div>
    </d-index-layout>
  </div>
</template>