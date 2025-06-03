<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useRequestOrderStore from "~/stores/purchases/RequestOrderStore";
import type {
  IndexRequestOrderType,
  QIndexType,
} from "~/types/request-orders/RequestOrderType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";
import type { WidgetSingleType } from "~/types/sales-orders/SalesOrderType";

// const { queryModal, metaModal } = useRequestOrderStore();
const requestOrderStore = useRequestOrderStore();
const { queryModal, metaModal, tabIndex } = storeToRefs(requestOrderStore);
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Request Orders",
});

const fieldsConfig = ref<FieldSelectableType[]>([
  {
    title: "Request No",
    key: "request_no",
    value: "request_no",
    align: "start",
    sortable: true,
  },
  {
    title: "Request Date",
    key: "request_date",
    value: "request_date",
    align: "start",
    sortable: true,
  },
  {
    title: "Requested",
    key: "requested",
    value: "requested",
    align: "start",
    sortable: true,
  },
  {
    title: "Request Qty",
    key: "grand_total_req_qty",
    value: "grand_total_req_qty",
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
    title: "Request No",
    key: "request_no",
  },
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
      label: "Suppliers",
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
      items: useStatics.RequestOrderIndexStatus,
    },
  },
]);

const fieldsDetailConfig = ref<FieldSelectableType[]>([
  {
    title: "Request No",
    key: "request_no",
    value: "request_no",
    align: "start",
    sortable: true,
  },
  {
    title: "Request Date",
    key: "request_date",
    value: "request_date",
    align: "start",
    sortable: true,
  },
  {
    title: "Requested",
    key: "requested",
    value: "requested",
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
  await useRequestOrderStore().indexRequestOrderDetails();
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

const onClickFind = async (filters: QIndexType) => {
  if (tabIndex.value.index === useStatics.indexTabQuotation.detail) {
    queryModal.value.qIndex.export_type = "detail";
  } else {
    queryModal.value.qIndex.export_type = "all";
  }

  if (tabIndex.value.index === 1) {
    queryModal.value.qIndex = filters;
    await fetchFilter();
  }

  await useRequestOrderStore().indexWidget();
};

function getStatusColor(status: string): string {
  switch (status) {
    case "PENDING":
      return "orange";
    case "APPROVED":
      return "blue";
    case "CANCELED":
      return "grey";
    default:
      return "white";
  }
}

onMounted(() => {
  useRequestOrderStore().indexWidget();
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
        api="/v1/request-orders/index-request-order"
        detail-link="/purchases/request-orders"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        class="col-span-2 lg:col-span-1"
        label="Request Orders"
        search-placeholder="Search anything related to Request Orders..."
        is-quick-select
        no-title
        edit-link="/purchases/request-orders/edit"
        delete-api="/v1/request-orders/delete-request-order"
        pdf-api="/v1/request-orders/pdf-request-order"
        csv-api="/v1/request-orders/csv-request-order"
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndex"
        :tabs="['All', 'Detail']"
        :tab-index="tabIndex.index"
        :create-option="{
          link: '/purchases/request-orders/create',
          show: true,
          cta: '+ Create',
        }"
        @click:find="onClickFind"
        @update:filters="
          (filters: QIndexType) => {
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
        <template #item.grand_total_order_product_qty="{ item }">
          <d-num-layout
            :value="item.grand_total_order_product_qty"
            :precision="0"
          />
        </template>
        <template #item.grand_total_order_item_qty="{ item }">
          <d-num-layout
            :value="item.grand_total_order_item_qty"
            :precision="0"
          />
        </template>
        <template #item.grand_total_wh_qty="{ item }">
          <d-num-layout :value="item.grand_total_wh_qty" :precision="0" />
        </template>
        <template #item.grand_total_req_qty="{ item }">
          <d-num-layout :value="item.grand_total_req_qty" :precision="0" />
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
                v-for="(product, iProduct) in item.request_order_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                {{ product.item_name }}
                <!-- <br /> -->

                <div
                  v-for="(soDtBom, iSoDtBom) in product.request_order_dts_boms"
                  :key="iSoDtBom"
                  class="whitespace-nowrap align-top"
                >
                  <br
                    v-if="iSoDtBom < product.request_order_dts_boms.length - 1"
                  />
                </div>
              </div>
            </template>
            <template #item.qty="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.request_order_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                <d-num-layout
                  symbol=""
                  :min-precision="2"
                  :max-precision="2"
                  :value="product.req_qty"
                />

                <!-- <br /> -->
                <div
                  v-for="(soDtBom, iSoDtBom) in product.request_order_dts_boms"
                  :key="iSoDtBom"
                  class="whitespace-nowrap align-top"
                >
                  <br
                    v-if="iSoDtBom < product.request_order_dts_boms.length - 1"
                  />
                </div>
              </div>
            </template>
            <template #item.price="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.request_order_dts"
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
                  v-for="(soDtBom, iSoDtBom) in product.request_order_dts_boms"
                  :key="iSoDtBom"
                  class="whitespace-nowrap align-top"
                >
                  <br
                    v-if="iSoDtBom < product.request_order_dts_boms.length - 1"
                  />
                </div>
              </div>
            </template>
            <template #item.total="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.request_order_dts"
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
                  v-for="(soDtBom, iSoDtBom) in product.request_order_dts_boms"
                  :key="iSoDtBom"
                  class="whitespace-nowrap align-top"
                >
                  <br
                    v-if="iSoDtBom < product.request_order_dts_boms.length - 1"
                  />
                </div>
              </div>
            </template>
          </v-data-table-server>
        </template>
      </d-datatable>
    </d-index-layout>
  </div>
</template>
