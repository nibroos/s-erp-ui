<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useInventoryStore from "~/stores/inventories/InventoryStore";
import type { QInvIndexType } from "~/types/inventories/InventoryType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const inventoryStore = useInventoryStore();
const { queryModal, metaModal, tabIndex } = storeToRefs(inventoryStore);
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Inventory OUT",
});

const fieldsConfig = ref<FieldSelectableType[]>([
  {
    title: "Inventory No",
    key: "inventory_no",
    value: "inventory_no",
    align: "start",
    sortable: true,
  },
  {
    title: "DO No",
    key: "do_no",
    value: "do_no",
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
    title: "OUT Type",
    key: "io_type_name",
    value: "io_type_name",
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
    title: "OUT Date",
    key: "ingoing_at",
    value: "ingoing_at",
    align: "start",
    sortable: true,
  },
  {
    title: "DO Date",
    key: "do_at",
    value: "do_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Invoice Date",
    key: "invoice_at",
    value: "invoice_at",
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
    title: "Total Qty",
    key: "total_qty",
    value: "total_qty",
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
    title: "Subtotal",
    key: "subtotal",
    value: "subtotal",
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
    title: "Date Type",
    key: "date_type",
    type: "autocomplete-client",
    others: {
      items: useStatics.invOutdexDateType,
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
    title: "OUT Type",
    key: "io_type_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      api: "/v1/io-types/index-io-type",
      singleApi: "/v1/io-types/index-io-type",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      query: {
        io_type: "INVENTORY_OUT",
        is_active: 1,
      },
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
      items: useStatics.invIndexStatus,
    },
  },
  {
    title: "DO No",
    key: "do_no",
  },
  {
    title: "Invoice No",
    key: "invoice_no",
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
    title: "Inventory No",
    key: "inventory_no",
    value: "inventory_no",
    align: "start",
    sortable: true,
  },
  {
    title: "DO No",
    key: "do_no",
    value: "do_no",
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
    title: "OUT Type",
    key: "io_type_name",
    value: "io_type_name",
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
    title: "OUT Date",
    key: "ingoing_at",
    value: "ingoing_at",
    align: "start",
    sortable: true,
  },
  {
    title: "DO Date",
    key: "do_at",
    value: "do_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Invoice Date",
    key: "invoice_at",
    value: "invoice_at",
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
  // {
  //   title: "Price",
  //   key: "price",
  //   value: "price",
  //   align: "end",
  //   sortable: false,
  // },
  // {
  //   title: "Total",
  //   key: "total",
  //   value: "total",
  //   align: "end",
  //   sortable: false,
  // },
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
//     topTitle: "Inventory",
//     parentTitle: "Orders",
//     subTitlePath: "Inventory",
//     lastPathSegment: "",
//   };

//   layoutStore.defineTitlePath(config);
// };

const fetchFilter = async () => {
  await useInventoryStore().indexInventoryOutDetails();
};

const fetchDataServerFetch = async (options: { [key: string]: any }) => {
  queryModal.value.qIndexOut.page = options.page;
  queryModal.value.qIndexOut.per_page = options.itemsPerPage;

  if (options.sortBy.length > 0) {
    queryModal.value.qIndexOut.order_column = options.sortBy[0].key;
    queryModal.value.qIndexOut.order_direction = options.sortBy[0].order;
  } else {
    queryModal.value.qIndexOut.order_column = "";
    queryModal.value.qIndexOut.order_direction = "";
  }

  await fetchFilter();
};

const onClickFind = async (filters: QInvIndexType) => {
  if (tabIndex.value.index === useStatics.indexTabQuotation.detail) {
    queryModal.value.qIndexOut.export_type = "detail";
  } else {
    queryModal.value.qIndexOut.export_type = "all";
  }

  if (tabIndex.value.index === 1) {
    queryModal.value.qIndexOut = filters;
    await fetchFilter();
  }

  // await useInventoryStore().indexWidget();
};

// const changeTitle = () => {
//   let config = {
//     topTitle: "Inventory",
//     parentTitle: "Orders",
//     subTitlePath: "Inventory",
//     lastPathSegment: "",
//   };

//   layoutStore.defineTitlePath(config);
// };

onMounted(() => {
  queryModal.value.qIndexOut.io_type = "INVENTORY_OUT";
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
        api="/v1/inventories/index-inventory"
        detail-link="/inventories/out"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        class="col-span-2 lg:col-span-1"
        label="Inventory OUT"
        search-placeholder="Search anything related to inventory.."
        is-quick-select
        no-title
        edit-link="/inventories/out/edit"
        delete-api="/v1/inventories/delete-inventory"
        pdf-api="/v1/inventories/pdf-inventory"
        csv-api="/v1/inventories/csv-inventory"
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndexOut"
        :tabs="['All', 'Detail']"
        :tab-index="tabIndex.index"
        :create-option="{
          link: '/inventories/out/create',
          show: true,
          cta: '+ Create',
        }"
        @update:filters="
          (filters: QInvIndexType) => {
            queryModal.qIndexOut = filters;
          }
        "
        @click:find="onClickFind"
        @update:currentTab="
          (currentTab: number) => {
            tabIndex.index = currentTab;

            if (currentTab === useStatics.indexTab.detail) {
              queryModal.qIndexOut.export_type = 'detail';
            } else {
              queryModal.qIndexOut.export_type = 'all';
            }
          }
        "
      >
        <template #item.total_vat="{ item }">
          <d-num-layout :value="item.total_vat" />
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
            v-model:page="queryModal.qIndexOut.page"
            v-model:items-per-page="queryModal.qIndexOut.per_page"
            :items="metaModal.indexOutDetail.data ?? []"
            :headers="fieldsDetailConfig"
            :items-length="metaModal.indexOutDetail.meta.total ?? 0"
            :loading="metaModal.indexOutDetail.loading"
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
                  queryModal.qIndexOut.per_page,
                  queryModal.qIndexOut.page,
                  index
                )
              }}
            </template>
            <template #item.item_name="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.inv_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                {{ product.item_name }}
              </div>
            </template>
            <template #item.qty="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.inv_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                <d-num-layout
                  symbol=""
                  :min-precision="2"
                  :max-precision="2"
                  :value="product.qty"
                />
              </div>
            </template>
            <template #item.price="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.inv_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                <d-num-layout
                  symbol=""
                  :min-precision="0"
                  :value="product.price"
                />
              </div>
            </template>
            <template #item.total="{ item }: { item: any }">
              <div
                v-for="(product, iProduct) in item.inv_dts"
                :key="iProduct"
                class="whitespace-nowrap align-top"
              >
                <d-num-layout
                  symbol=""
                  :min-precision="0"
                  :value="product.subtotal"
                />
              </div>
            </template>
          </v-data-table-server>
        </template>
      </d-datatable>
    </d-index-layout>
  </div>
</template>