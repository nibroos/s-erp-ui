<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useDashboardStore from "~/stores/dashboard/DashboardStore";
import type { WidgetSingleType } from "~/types/sales-orders/SalesOrderType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const { queryModal, metaModal, isOpenModal } = useDashboardStore();
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
    width: "200",
  },
  {
    title: "Qty",
    key: "total_qty",
    value: "total_qty",
    align: "end",
    sortable: true,
    width: "200",
  },
  {
    title: "Grand Total",
    key: "grand_total",
    value: "grand_total",
    align: "end",
    sortable: true,
    width: "200",
  },
]);

const bestCustomerExposeRef = ref();
const statusExposeRef = ref();
const orderTypeExposeRef = ref();
// Trigger the openModal method
const onClickFilter = async (type: "status" | "orderType" | "bestCustomer") => {
  if (bestCustomerExposeRef.value && type == "bestCustomer") {
    bestCustomerExposeRef.value.filterData();
  } else if (statusExposeRef.value && type == "status") {
    statusExposeRef.value.filterData();
  } else if (orderTypeExposeRef.value && type == "orderType") {
    orderTypeExposeRef.value.filterData();
  } else {
    console.error("method is not available on exposed Ref");
  }

  // await openModal(filteredModalForms.value);
};

onMounted(() => {
  useDashboardStore().queryModal.qIndexSalesByBestCustomer.page = 1;
  useDashboardStore().queryModal.qIndexSalesByStatus.page = 1;
  useDashboardStore().queryModal.qIndexSalesByOrderType.page = 1;
});

onBeforeUnmount(() => {
  useDashboardStore().queryModal.qIndexSalesByBestCustomer.page = 1;
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
              class="px-2 py-1.5 gap-1 !bg-zinc-100 hover:!bg-zinc-200 rounded-lg ease-in-out transition-all"
              icon-class="dark:text-primary1 text-dark1"
              text-class="dark:text-primary1 text-dark1"
              rounded="xl"
              is-no-text
              icon-size="16"
              :loading="metaModal.indexSalesByStatus.loading"
              @click="onClickFilter('status')"
            ></d-bt>
          </div>
          <d-datatable
            ref="statusExposeRef"
            api="/v1/sales-orders/widget-sales-order-by-status"
            method-api="post"
            detail-method-api="post"
            items-prop="data"
            total-prop="meta.total"
            label="Master Order Type"
            class="col-span-2 lg:col-span-1"
            header-table-class="!bg-white dark:bg-dark2"
            search-placeholder="Search anything related to Quotations.."
            height="270"
            no-title
            :fields="fieldsConfigByStatus"
            :query-modal="queryModal.qIndexSalesByStatus"
            no-filter
            no-delete
            :is-edit="false"
            :is-row-num="false"
            no-action
            hide-default-footer
            :create-option="{
              link: '/sales/quotations/create',
              show: false,
              cta: '+ Create',
            }"
            @update:filters="
          (filters: any) => {
            queryModal.qIndexSalesByStatus = filters;
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
              class="px-2 py-1.5 gap-1 !bg-zinc-100 hover:!bg-zinc-200 rounded-lg ease-in-out transition-all"
              icon-class="dark:text-primary1 text-dark1"
              text-class="dark:text-primary1 text-dark1"
              rounded="xl"
              is-no-text
              icon-size="16"
              :loading="metaModal.indexSalesByOrderType.loading"
              @click="onClickFilter('orderType')"
            ></d-bt>
          </div>
          <d-datatable
            ref="orderTypeExposeRef"
            api="/v1/sales-orders/widget-sales-order-by-order-type"
            method-api="post"
            detail-method-api="post"
            items-prop="data"
            total-prop="meta.total"
            label="Master Order Type"
            class="col-span-2 lg:col-span-1"
            header-table-class="!bg-white dark:bg-dark2"
            search-placeholder="Search anything related to Quotations.."
            height="270"
            is-quick-select
            no-title
            :fields="fieldsConfigByOrderType"
            :query-modal="queryModal.qIndexSalesByOrderType"
            no-filter
            no-delete
            :is-edit="false"
            :is-row-num="false"
            no-action
            hide-default-footer
            :create-option="{
              link: '/sales/quotations/create',
              show: false,
              cta: '+ Create',
            }"
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
                Best Customer
              </h1>
              <p class="text-xs text-dark1 dark:text-white">
                Daftar Customer Terbaik Berdasarkan Total Transaksi
              </p>
            </div>

            <div class="flex items-center gap-2">
              <d-bt
                icon="mdi-information-outline"
                is-no-text
                class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-scLightest rounded-full ease-in-out transition-all hover:dark:!bg-scDarker2 dark:!bg-sc"
                icon-class="text-sc dark:text-primary1"
                rounded="xl"
                icon-size="16"
                @click="isOpenModal.bestCustomer = true"
              ></d-bt>
              <d-bt
                icon="mdi-refresh"
                class="px-2 py-1.5 gap-1 !bg-zinc-100 hover:!bg-zinc-200 rounded-lg ease-in-out transition-all"
                icon-class="dark:text-primary1 text-dark1"
                text-class="dark:text-primary1 text-dark1"
                rounded="xl"
                is-no-text
                icon-size="16"
                :loading="metaModal.indexSalesByBestCustomer.loading"
                @click="onClickFilter('bestCustomer')"
              ></d-bt>
            </div>
          </div>
          <d-datatable
            ref="bestCustomerExposeRef"
            api="/v1/sales-orders/widget-sales-order-by-best-customer"
            method-api="post"
            detail-method-api="post"
            items-prop="data"
            total-prop="meta.total"
            label="Master Order Type"
            class="col-span-2 lg:col-span-1"
            header-table-class="!bg-white dark:bg-dark2"
            search-placeholder="Search anything related to Quotations.."
            height="270"
            is-quick-select
            no-title
            :fields="fieldsConfigByBestCustomer"
            :query-modal="queryModal.qIndexSalesByBestCustomer"
            no-filter
            no-delete
            :is-edit="false"
            is-infinate-scroll
            hide-default-footer
            no-action
            :create-option="{
              link: '/sales/quotations/create',
              show: false,
              cta: '+ Create',
            }"
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

    <modals-final-modal
      :is-open="isOpenModal.bestCustomer"
      size="xl"
      custom-class="overflow-y-auto"
      parent-class="!z-[1500]"
      label="Best Customer"
      @update:is-open="isOpenModal.bestCustomer = $event"
    >
      <d-datatable
        ref="bestCustomerExposeRef"
        api="/v1/sales-orders/widget-sales-order-by-best-customer"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        label="Master Order Type"
        class="col-span-2 lg:col-span-1"
        header-table-class="!bg-white dark:bg-dark2"
        search-placeholder="Search anything related to Quotations.."
        height="500"
        is-quick-select
        no-title
        :fields="fieldsConfigByBestCustomer"
        :query-modal="queryModal.qIndexSalesByBestCustomer"
        :filters="useStatics.filtersCustomer"
        no-delete
        :is-edit="false"
        no-action
      >
        <template #item.total_qty="{ item }">
          <d-num-layout :value="item.total_qty" />
        </template>
        <template #item.grand_total="{ item }">
          <d-num-layout :value="item.grand_total" :symbol="'Rp'" />
        </template>
      </d-datatable>
    </modals-final-modal>
  </div>
</template>