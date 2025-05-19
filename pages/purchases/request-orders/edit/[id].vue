<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useRequestOrderStore from "~/stores/purchases/RequestOrderStore";
import type {
  OptionRefBtnType,
  RefBtnType,
} from "~/types/components/OptionRefBtnType";
import type { FormLayoutType } from "~/types/FormLayoutType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";
import type {
  FormRoDtProductListType,
  RoDtRefType,
  RoDtType,
} from "~/types/request-orders/RequestOrderType";
import { debounce } from "lodash-es";
import type {
  ModalIndexProductFilterAutoCompleteType,
  ModalIndexProductFilterTextType,
} from "~/types/purchase-orders/PurchaseOrderType";
import type {
  ModalIndexRefFilterDateType,
  ModalIndexSalesOrderFilterAutoCompleteType,
  ModalIndexSalesOrderFilterTextType,
} from "~/types/inventories/InventoryType";
import useAuthStore from "~/stores/AuthStore";

const layoutStore = useLayoutsStore();
const { topTitle } = storeToRefs(layoutStore);
const authStore = useAuthStore();
const route = useRoute();

const requestOrderStore = useRequestOrderStore();
const {
  tabFormIndex,
  form,
  errors,
  itemsCheck,
  isOpenModal,
  queryModal,
  metaModal,
  optionRefBtnRef,
  formLayout: formLayoutStore,
  loading,
} = storeToRefs(requestOrderStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Edit Request Order",
});

const headers = ref<FieldSelectableType[]>([
  { key: "ref_type", title: "Ref Type", sortable: true },
  { key: "sales_order_no", title: "Ref No.", sortable: true },
  { key: "product_name", title: "Product Name", sortable: true },
  { key: "item_name", title: "Item Name", sortable: true },
  { key: "unit_name", title: "Unit", sortable: true },
  { key: "order_item_qty", title: "Order Qty", sortable: true, align: "end" },
  { key: "wh_qty", title: "WH Qty", sortable: true, align: "end" },
  { key: "req_qty", title: "Request Qty", sortable: true, align: "end" },
  { key: "remark", title: "Remark", sortable: true },
  {
    key: "action",
    title: "Action",
    sortable: false,
    headerProps: { class: "cursor-pointer action-table sticky-right" },
    cellProps: {
      class: "action-table sticky-right",
    },
  },
]);

const headersModalProducts = ref<FieldSelectableType[]>([
  {
    title: "Product Name",
    key: "product_name",
    value: "product_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Item Name",
    key: "item_name",
    value: "item_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Unit",
    key: "unit_name",
    value: "unit_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Price",
    key: "price_sell",
    value: "price_sell",
    align: "end",
    sortable: true,
  },
  {
    title: "Order Qty",
    key: "order_item_qty",
    value: "order_item_qty",
    align: "end",
    sortable: true,
  },
  {
    title: "WH Qty",
    key: "wh_qty",
    value: "wh_qty",
    align: "end",
    sortable: true,
  },
  {
    title: "Req Qty",
    key: "req_qty",
    value: "req_qty",
    align: "end",
    sortable: true,
  },
  {
    title: "Remark",
    key: "remark",
    value: "remark",
    align: "start",
    sortable: true,
  },
]);

const filtersTextProducts = ref([
  {
    title: "Product Name",
    key: "product_name",
  },
  {
    title: "Item Name",
    key: "item_name",
  },
  {
    title: "Global",
    key: "global",
  },
]);

const headersModalSalesOrders = ref<FieldSelectableType[]>([
  {
    title: "Sales Order No",
    key: "sales_order_no",
    value: "sales_order_no",
    align: "start",
    sortable: true,
  },
  {
    title: "Order Date",
    key: "order_date",
    value: "order_date",
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
    title: "Product Name",
    key: "product_name",
    value: "product_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Item Name",
    key: "item_name",
    value: "item_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Unit",
    key: "unit_name",
    value: "unit_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Order Qty",
    key: "order_item_qty",
    value: "order_item_qty",
    align: "end",
    sortable: true,
  },
  {
    title: "WH Qty",
    key: "wh_qty",
    value: "wh_qty",
    align: "end",
    sortable: true,
  },
  {
    title: "Req Qty",
    key: "req_qty",
    value: "req_qty",
    align: "end",
    sortable: true,
  },
  {
    title: "Remark",
    key: "remark",
    value: "remark",
    align: "start",
    sortable: true,
  },
]);

const filtersTextSalesOrders = ref([
  {
    title: "Sales Order No",
    key: "sales_order_no",
  },
  {
    title: "Product Name",
    key: "product_name",
  },
  {
    title: "Item Name",
    key: "item_name",
  },
  {
    title: "Global",
    key: "global",
  },
]);

const customSummary = computed(() => {
  return {
    total_order_product_qty: {
      label: "Total Order Product Qty",
      value: form.value.grand_total_order_product_qty || 0,
      format: {
        precision: 2,
      },
    },
    total_order_item_qty: {
      label: "Total Order Item Qty",
      value: form.value.grand_total_order_item_qty || 0,
      format: {
        precision: 2,
      },
    },
    total_wh_qty: {
      label: "Total WH Qty",
      value: form.value.grand_total_wh_qty || 0,
      format: {
        precision: 2,
      },
    },
    total_req_qty: {
      label: "Total Request Qty",
      value: form.value.grand_total_req_qty || 0,
      format: {
        precision: 2,
      },
    },
  };
});

const formLayout = ref({
  title: "Basic Information",
  parentPath: "/purchases/request-orders",
  currentTab: tabFormIndex.value,
  tabs: useStatics.formTabRequestOrder
    ? Object.keys(useStatics.formTabRequestOrder).map(
        (key) => key.charAt(0).toUpperCase() + key.slice(1)
      )
    : ["Items", "Remarks"],
  mode: "edit",
  button: {
    create: {
      path: "/purchases/request-orders/create",
      show: true,
    },
    save: {
      show: true,
      loading: false,
      type: "submit",
      text: "Update",
    },
    clear: {
      show: true,
    },
  },
  summary: customSummary.value,
} as FormLayoutType);

const initialFormLayout = () => {
  formLayout.value.currentTab = tabFormIndex.value;
  formLayout.value.mode = "edit";
  formLayout.value.summary = customSummary.value;
};

const handleSubmit = async () => {
  form.value.request_order_dts = itemsCheck.value.checkMain;
  await requestOrderStore.update();
};

const fetchInitialData = async () => {
  form.value.id = parseInt(route.params.id as string, 10);
  await requestOrderStore.show();
  requestOrderStore.calculateTotalAmount();
};

const calculateTotalAmountLocal = () => {
  requestOrderStore.calculateTotalAmount();
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  if (dateString.includes('T')) {
    return dateString.split('T')[0];
  }
  return dateString;
};

watch(
  () => isOpenModal.value.products,
  (oldVal, newVal) => {
    if (oldVal != newVal) {
      if (!oldVal) {
        itemsCheck.value.checkProducts = [];
      }
    }
  },
  { immediate: true, deep: true }
);

onMounted(async () => {
  await fetchInitialData();
  initialFormLayout();
});

watch(
  () => form.value.status,
  (newStatus, oldStatus) => {
    if (formLayout.value.button?.save) {
      formLayout.value.button.save.disabled = newStatus === 'APPROVED';
    }
  },
  { immediate: true }
);

watchEffect(() => {
  topTitle.value = "Edit Request Order";
  formLayout.value.summary = customSummary.value;
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <d-form-layout
      :config="formLayout"
      @click:save="handleSubmit()"
      @click:clear="requestOrderStore.handleClickClear()"
      @update:current-tab="tabFormIndex = $event"
    >
      <template #header>
        <form
          :class="
            classMerge(
              'grid grid-cols-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-2 mt-2',
              Object.keys(errors).length > 0 ? '!items-start' : '!items-center'
            )
          "
          @submit.prevent="handleSubmit"
        >
          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.request_no"
              label="Request No"
              readonly
              disabled
            />
          </div>
          <div class="sm:col-span-1">
            <d-autocomplete
              v-model="form.warehouse_id"
              :query="{
                is_active: 1,
              }"
              api="/v1/warehouses/index-warehouse"
              single-api="/v1/warehouses/show-warehouse"
              page-end-prop="meta.next_page_url"
              item-title="name"
              item-value="id"
              method-api="post"
              inner-search-key="global"
              label="Warehouse"
              :errors="errors.warehouse_id"
            ></d-autocomplete>
          </div>
          <div class="sm:col-span-1">
            <d-date-picker-light
              v-model="form.request_date"
              label="Request Date"
              :min-date="form.request_date"
            ></d-date-picker-light>
          </div>
          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.requested"
              :label="`Requested`"
              :placeholder="`Requested`"
              :errors="errors.requested"
            />
          </div>
          <div class="sm:col-span-1">
            <d-autocomplete-client
              v-model="form.status"
              :items="useStatics.formStatusRequestOrder"
              label="Status"
              item-value="id"
              item-title="name"
              :clearable="false"
              :disabled="form.status === 'APPROVED'"
            />
          </div>

          <d-bt type="submit" class="!hidden"></d-bt>
        </form>
      </template>
      <template #content>
        <div
          v-if="tabFormIndex == 0"
          class="grid grid-cols-3 sm:grid-cols-1 gap-2 mt-1"
        >
          <d-option-ref-btn
            :refs="optionRefBtnRef"
            class="col-span-2"
            @click:ref="
              (ref) => requestOrderStore.onClickOpenModalOptionRefBtn(ref)
            "
          >
          </d-option-ref-btn>

          <d-bt
            :cta="'Clear References'"
            :class="
              classMerge(
                '!bg-zinc-200 justify-self-end hover:!bg-grey2 dark:!bg-dark2 gap-1 dark:hover:!bg-dark1 text-sm transition-all ease-in-out !border-2 p-2 rounded-lg !border-zinc-200 dark:border-none w-max'
              )
            "
            :text-class="classMerge('text-scDarker dark:text-white mx-auto')"
            :icon-class="classMerge('text-scDarker dark:text-white mx-auto')"
            icon="mdi-refresh"
            type="button"
            @click="
              () => {
                requestOrderStore.clickClearRefs();
                calculateTotalAmountLocal();
              }
            "
          />
          <v-data-table-virtual
            :items="itemsCheck.checkMain ?? []"
            :headers="headers"
            item-value="uid"
            density="compact"
            height="500"
            fixed-header
            class="col-span-3 sm:col-span-1 table-hover mt-1"
            :header-props="{
              class: '!bg-scLightest dark:!bg-scDarker whitespace-nowrap',
            }"
            :row-props="{
              class: 'whitespace-nowrap',
            }"
          >
            <template #item.ref_type="{ item }">
              <span class="capitalize">{{ item.ref_type }} </span>
            </template>
            <template #item.product_type="{ item }">
              <span class="uppercase">{{ item.product_type }}</span>
            </template>
            <template #item.req_qty="{ item }">
              <d-num-v-format
                                v-model="item.req_qty"
                :precision="{
                  min: 3,
                  max: 3,
                }"
                hide-currency-display
                label=""
                class="w-full"
                @update:modelValue="
                  requestOrderStore.updateQuantity(item);
                  calculateTotalAmountLocal();
                "
              />
            </template>
            <template #item.order_product_qty="{ item }">
              <d-num-layout :value="item.order_product_qty ?? 0" />
            </template>
            <template #item.order_item_qty="{ item }">
              <d-num-layout :value="item.order_item_qty ?? 0" />
            </template>
            <template #item.wh_qty="{ item }">
              <d-num-layout :value="item.wh_qty ?? 0" />
            </template>
            <template #item.code="{ item }">
              <span>{{ item.code || '-' }}</span>
            </template>
            <template #item.product_name="{ item }">
              <span>{{ item.product_name || '-' }}</span>
            </template>
            <template #item.item_name="{ item }">
              <span>{{ item.item_name || '-' }}</span>
            </template>
            <template #item.remark="{ item }">
              <span>{{ item.remark || '-' }}</span>
            </template>
            <template #item.action="{ item, index }">
              <div class="action-button flex gap-2">
                <d-bt
                  @click="
                    () => {
                      requestOrderStore.onClickDeleteSelected(item, index);
                      calculateTotalAmountLocal();
                    }
                  "
                  icon="mdi-delete"
                  is-no-text
                  class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                  icon-class="text-cancel dark:text-primary1"
                  rounded="xl"
                  size=""
                  cta="delete"
                  icon-size="16"
                  :is-notif="true"
                  :notif-text="`${item.item_name} deleted`"
                ></d-bt>
              </div>
            </template>
          </v-data-table-virtual>
        </div>
        <div v-if="tabFormIndex == 1">
          <div class="sm:col-span-1 mt-1">
            <d-text-area-input
              v-model="form.remark"
              :label="`Remark`"
              :placeholder="`Remark`"
              :errors="errors.remark"
            />
          </div>
        </div>
      </template>
    </d-form-layout>
    
    <!-- Products Modal -->
    <modals-final-modal
      :is-open="isOpenModal.products"
      size="xl"
      custom-class="overflow-y-auto"
      label="List of Products"
      parent-class="!z-[1500]"
      @update:is-open="isOpenModal.products = $event"
    >
      <template #header-end>
        <d-form-product @submit:form="requestOrderStore.fetchModalFilter()" />
      </template>
      <template #top>
        <form
          class="grid grid-cols-5 w-full flex-row items-center gap-2"
          @submit.prevent="requestOrderStore.fetchModalFilter()"
        >
          <d-text-input
            v-for="filter in filtersTextProducts"
            :key="filter.key"
            v-model="queryModal.qIndexProducts[filter.key as ModalIndexProductFilterTextType]"
            :label="filter.title"
            :placeholder="filter.title"
            append-inner-icon="mdi-magnify"
          />

          <d-submit-button
            @click:submit="requestOrderStore.fetchModalFilter()"
            @click:clear="requestOrderStore.handleClearQuery()"
            class="grid-cols-1"
          />
        </form>
      </template>

      <v-data-table-server
        v-model="itemsCheck.checkProducts"
        v-model:page="queryModal.qIndexProducts.page"
        :items="metaModal.indexProducts.data ?? []"
        :headers="headersModalProducts"
        :items-per-page="queryModal.qIndexProducts.per_page"
        :items-length="metaModal.indexProducts.meta.total ?? 0"
        :items-per-page-options="useInitials.perPageOptions"
        :loading="metaModal.indexProducts.loading"
        density="compact"
        :header-props="{
          class: '!bg-scLightest dark:!bg-dark2 whitespace-nowrap',
        }"
        :row-props="{
          class: 'cursor-pointer',
        }"
        item-value="uid"
        show-current-page
        return-object
        multiple
        show-select
        @update:options="(data:any) => requestOrderStore.fetchDataServerFetch(data)"
        fixed-header
        height="450"
        hover
      >
        <template #item.product_type="{ item }">
          <span class="capitalize">{{
            defineItemTypeRequestOrder(item as FormRoDtProductListType)
          }}</span>
        </template>
        <template #item.price_sell="{ item }">
          <d-num-layout :value="item.price_sell" />
        </template>
        <template #item.order_item_qty="{ item }">
          <d-num-layout :value="item.order_item_qty" />
        </template>
        <template #item.wh_qty="{ item }">
          <d-num-layout :value="item.wh_qty" />
        </template>
        <template #item.req_qty="{ item }">
          <d-num-layout :value="item.req_qty" />
        </template>
        <template #item.code="{ item }">
          <span>{{ item.code || '-' }}</span>
        </template>
        <template #item.product_name="{ item }">
          <span>{{ item.product_name || '-' }}</span>
        </template>
        <template #item.item_name="{ item }">
          <span>{{ item.item_name || '-' }}</span>
        </template>
        <template #item.remark="{ item }">
          <span>{{ item.remark || '-' }}</span>
        </template>
      </v-data-table-server>

      <template #footer>
        <div class="flex h-max w-full justify-end items-center gap-2">
          <button
            class="flex items-center gap-2 rounded-md bg-sc px-3 py-2 text-[15px] font-bold text-white shadow-md hover:shadow-xl"
            @click="requestOrderStore.onClickUpdateProductsModal()"
          >
            <Icon name="material-symbols:save-rounded" size="20" />
            Add Selected Products ({{ itemsCheck.checkProducts.length }})
          </button>
        </div>
      </template>
    </modals-final-modal>

    <!-- Sales Order Modal -->
    <modals-final-modal
      :is-open="isOpenModal.so"
      size="xl"
      custom-class="overflow-y-auto"
      label="List of Sales Orders"
      parent-class="!z-[1500]"
      @update:is-open="isOpenModal.so = $event"
    >
      <template #header-end>
        <d-form-sales-order
          @submit:form="requestOrderStore.fetchModalFilter()"
        />
      </template>
      <template #top>
        <form
          class="grid grid-cols-5 w-full flex-row items-center gap-2"
          @submit.prevent="requestOrderStore.fetchModalFilter()"
        >
          <d-select-table
            api="/v1/customers/index-customer"
            detail-api="/v1/customers/index-customer"
            method-api="post"
            detail-method-api="post"
            mapping-detail="data[0]"
            total-prop="meta.total"
            label="Customer"
            v-model="queryModal.qIndexSo.customer_id"
            :query="{
              is_active: 1,
            }"
            class=""
            is-quick-select
            modal-custom-class="!w-4/5"
            :fields="useStatics.headersCustomer"
            :filters="useStatics.filtersCustomer"
          />

          <d-text-input
            v-for="filter in filtersTextSalesOrders"
            :key="filter.key"
            v-model="queryModal.qIndexSo[filter.key as ModalIndexSalesOrderFilterTextType]"
            :label="filter.title"
            :placeholder="filter.title"
            append-inner-icon="mdi-magnify"
          />

          <d-submit-button
            @click:submit="requestOrderStore.fetchModalFilter()"
            @click:clear="requestOrderStore.handleClearQuery()"
            class="grid-cols-1"
          />
        </form>
      </template>

      <v-data-table-server
        v-model="itemsCheck.checkSo"
        v-model:page="queryModal.qIndexSo.page"
        :items="metaModal.indexSo.data ?? []"
        :headers="headersModalSalesOrders"
        :items-per-page="queryModal.qIndexSo.per_page"
        :items-length="metaModal.indexSo.meta.total ?? 0"
        :items-per-page-options="useInitials.perPageOptions"
        :loading="metaModal.indexSo.loading"
        density="compact"
        :header-props="{
          class: '!bg-scLightest dark:!bg-dark2 whitespace-nowrap',
        }"
        :row-props="{
          class: 'cursor-pointer',
        }"
        item-value="uid"
        show-current-page
        return-object
        multiple
        show-select
        @update:options="(data:any) => requestOrderStore.fetchDataServerFetch(data)"
        fixed-header
        height="450"
        hover
      >
        <template #item.product_type="{ item }">
          <span class="capitalize">{{ item.product_type }}</span>
        </template>
        <template #item.order_product_qty="{ item }">
          <d-num-layout :value="item.order_product_qty" />
        </template>
        <template #item.order_item_qty="{ item }">
          <d-num-layout :value="item.order_item_qty" />
        </template>
        <template #item.wh_qty="{ item }">
          <d-num-layout :value="item.wh_qty" />
        </template>
        <template #item.req_qty="{ item }">
          <d-num-layout :value="item.req_qty" />
        </template>
        <template #item.code="{ item }">
          <span>{{ item.code || '-' }}</span>
        </template>
        <template #item.product_name="{ item }">
          <span>{{ item.product_name || '-' }}</span>
        </template>
        <template #item.item_name="{ item }">
          <span>{{ item.item_name || '-' }}</span>
        </template>
        <template #item.remark="{ item }">
          <span>{{ item.remark || '-' }}</span>
        </template>
        <template #item.order_date="{ item }">
          <span>{{ item.order_date ? formatDate(item.order_date) : '-' }}</span>
        </template>
      </v-data-table-server>

      <template #footer>
        <div class="flex h-max w-full justify-end items-center gap-2">
          <button
            class="flex items-center gap-2 rounded-md bg-sc px-3 py-2 text-[15px] font-bold text-white shadow-md hover:shadow-xl"
            @click="requestOrderStore.onClickUpdateProductsModal()"
          >
            <Icon name="material-symbols:save-rounded" size="20" />
            Add Selected Sales Order ({{ itemsCheck.checkSo.length }})
          </button>
        </div>
      </template>
    </modals-final-modal>
  </div>
</template>

