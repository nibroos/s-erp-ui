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

// const { queryModal, metaModal } = useSalesOrderStore();
const salesOrderStore = useSalesOrderStore();
const { queryModal, metaModal, tabIndex } = storeToRefs(salesOrderStore);
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
    title: "Delivery Date",
    key: "shipping_at",
    value: "shipping_at",
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

const fieldsDetailConfig = ref<FieldSelectableType[]>([
  {
    title: "#",
    key: "row_num",
    value: "row_num",
    align: "start",
    sortable: true,
  },
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

const fetchFilter = async () => {
  await useSalesOrderStore().indexSalesOrderDetails();
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

const onClickFind = async (filters: QSoIndexType) => {
  if (tabIndex.value.index === useStatics.indexTabQuotation.detail) {
    queryModal.value.qIndex.export_type = "detail";
  } else {
    queryModal.value.qIndex.export_type = "all";
  }

  if (tabIndex.value.index === 1) {
    queryModal.value.qIndex = filters;
    await fetchFilter();
  }

  await useSalesOrderStore().indexWidget();
};

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
        label="Sales Orders"
        search-placeholder="Search anything related to Order.."
        is-quick-select
        no-title
        edit-link="/sales/sales-orders/edit"
        delete-api="/v1/sales-orders/delete-sales-order"
        pdf-api="/v1/sales-orders/pdf-sales-order"
        csv-api="/v1/sales-orders/csv-sales-order"
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndex"
        :tabs="['All', 'Detail']"
        :tab-index="tabIndex.index"
        :create-option="{
          link: '/sales/sales-orders/create',
          show: true,
          cta: '+ Create',
        }"
        @click:find="onClickFind"
        @update:filters="
          (filters: QSoIndexType) => {
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
                v-for="(product, iProduct) in item.so_dts"
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
                v-for="(product, iProduct) in item.so_dts"
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
                v-for="(product, iProduct) in item.so_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                <d-num-layout
                  symbol=""
                  :min-precision="0"
                  :value="product.price_sell"
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
                v-for="(product, iProduct) in item.so_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                <d-num-layout
                  symbol=""
                  :min-precision="0"
                  :value="product.subtotal_sell"
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
                v-for="(product, iProduct) in item.so_dts"
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
                <d-divider v-if="iProduct != item.so_dts.length - 1" />
              </div>
            </template>
            <template #item.bom_qty="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.so_dts"
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
                <d-divider v-if="iProduct != item.so_dts.length - 1" />
              </div>
            </template>
          </v-data-table-server>
        </template>
      </d-datatable>
    </d-index-layout>
  </div>
</template>