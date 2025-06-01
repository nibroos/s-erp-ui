<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useQuotationStore from "~/stores/orders/QuotationStore";
import type { QQuoIndexType } from "~/types/quotations/QuotationType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";
import type { WidgetSingleType } from "~/types/sales-orders/SalesOrderType";

// const { queryModal, metaModal } = useQuotationStore();
const quoStore = useQuotationStore();
const { queryModal, metaModal, tabIndex } = storeToRefs(quoStore);
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Quotations",
});

const fieldsConfig = ref<FieldSelectableType[]>([
  {
    title: "Quotation No",
    key: "quo_no",
    value: "quo_no",
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
    title: "Expired Date",
    key: "expired_at",
    value: "expired_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Quot Date",
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
  // {
  //   title: "Total Qty",
  //   key: "total_qty",
  //   value: "total_qty",
  //   align: "end",
  //   sortable: true,
  // },
  // {
  //   title: "VAT",
  //   key: "total_vat",
  //   value: "total_vat",
  //   align: "end",
  //   sortable: true,
  // },
  // {
  //   title: "PPH",
  //   key: "total_pph23",
  //   value: "total_pph23",
  //   align: "end",
  //   sortable: true,
  // },
  // {
  //   title: "Discount",
  //   key: "total_discount",
  //   value: "total_discount",
  //   align: "end",
  //   sortable: true,
  // },
  // {
  //   title: "Subtotal",
  //   key: "subtotal",
  //   value: "subtotal",
  //   align: "end",
  //   sortable: true,
  // },
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
    title: "Status",
    key: "status",
    type: "autocomplete-client",
    others: {
      items: useStatics.QuoIndexStatus,
    },
  },
  {
    title: "Date Type",
    key: "date_type",
    type: "autocomplete-client",
    others: {
      items: useStatics.QuoIndexDateType,
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
    title: "Quotation No",
    key: "quo_no",
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
    title: "Quotation No",
    key: "quo_no",
    value: "quo_no",
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
    title: "Customer",
    key: "customer_name",
    value: "customer_name",
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
    title: "Quot Date",
    key: "due_at",
    value: "due_at",
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

// const changeTitle = () => {
//   let config = {
//     topTitle: "Quotation",
//     parentTitle: "Orders",
//     subTitlePath: "Quotation",
//     lastPathSegment: "",
//   };

//   layoutStore.defineTitlePath(config);
// };

const fetchFilter = async () => {
  await useQuotationStore().indexQuotationDetails();
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

const onClickFind = async (filters: QQuoIndexType) => {
  if (tabIndex.value.indexQuotation === useStatics.indexTabQuotation.detail) {
    queryModal.value.qIndex.export_type = "detail";
  } else {
    queryModal.value.qIndex.export_type = "all";
  }

  if (tabIndex.value.indexQuotation === 1) {
    queryModal.value.qIndex = filters;
    await fetchFilter();
  }

  await useQuotationStore().indexWidget();
};

onMounted(() => {
  useQuotationStore().indexWidget();
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
        api="/v1/quotations/index-quotation"
        detail-link="/sales/quotations"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        label="Quotations"
        class="col-span-2 lg:col-span-1"
        search-placeholder="Search anything related to Quotations.."
        is-quick-select
        no-title
        edit-link="/sales/quotations/edit"
        delete-api="/v1/quotations/delete-quotation"
        pdf-api="/v1/quotations/pdf-quotation"
        csv-api="/v1/quotations/csv-quotation"
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndex"
        :tabs="['All', 'Detail']"
        :tab-index="tabIndex.indexQuotation"
        :create-option="{
          link: '/sales/quotations/create',
          show: true,
          cta: '+ Create',
        }"
        @click:find="onClickFind"
        @update:filters="
          (filters: QQuoIndexType) => {
            queryModal.qIndex = filters;
          }
        "
        @update:currentTab="
          (currentTab: number) => {
            tabIndex.indexQuotation = currentTab;

            if (currentTab === useStatics.indexTabQuotation.detail) {
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
        <template #item.is_approved="{ item }">
          <d-active-status
            :value="item.is_approved"
            :labels="useStatics.formApprovedQuotation"
          />
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
                v-for="(product, iProduct) in item.quo_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                {{ product.item_name }}
                <!-- <br /> -->

                <div
                  v-for="(quoDtBom, iQuoDtBom) in product.quo_dts_boms"
                  :key="iQuoDtBom"
                  class="whitespace-nowrap align-top"
                >
                  <br v-if="iQuoDtBom < product.quo_dts_boms.length - 1" />
                </div>
              </div>
            </template>
            <template #item.qty="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.quo_dts"
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
                  v-for="(quoDtBom, iQuoDtBom) in product.quo_dts_boms"
                  :key="iQuoDtBom"
                  class="whitespace-nowrap align-top"
                >
                  <br v-if="iQuoDtBom < product.quo_dts_boms.length - 1" />
                </div>
              </div>
            </template>
            <template #item.price="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.quo_dts"
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
                  v-for="(quoDtBom, iQuoDtBom) in product.quo_dts_boms"
                  :key="iQuoDtBom"
                  class="whitespace-nowrap align-top"
                >
                  <br v-if="iQuoDtBom < product.quo_dts_boms.length - 1" />
                </div>
              </div>
            </template>
            <template #item.total="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.quo_dts"
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
                  v-for="(quoDtBom, iQuoDtBom) in product.quo_dts_boms"
                  :key="iQuoDtBom"
                  class="whitespace-nowrap align-top"
                >
                  <br v-if="iQuoDtBom < product.quo_dts_boms.length - 1" />
                </div>
              </div>
            </template>

            <template #item.bom_item_name="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.quo_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                <div v-if="product.quo_dts_boms.length === 0">-</div>
                <div v-else class="whitespace-nowrap align-top">
                  <div
                    v-for="(quoDtBom, iQuoDtBom) in product.quo_dts_boms"
                    :key="iQuoDtBom"
                  >
                    {{ quoDtBom.item_name }}
                    <br />
                  </div>
                </div>
                <d-divider v-if="iProduct != item.quo_dts.length - 1" />
              </div>
            </template>
            <template #item.bom_qty="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.quo_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                <div v-if="product.quo_dts_boms.length === 0">-</div>
                <div v-else class="whitespace-nowrap align-top">
                  <div
                    v-for="(quoDtBom, iQuoDtBom) in product.quo_dts_boms"
                    :key="iQuoDtBom"
                  >
                    {{ useNumber.formatNumberSeparator(quoDtBom.qty, 2, 2) }}
                    <br />
                  </div>
                </div>
                <d-divider v-if="iProduct != item.quo_dts.length - 1" />
              </div>
            </template>
          </v-data-table-server>
        </template>
      </d-datatable>
    </d-index-layout>
  </div>
</template>