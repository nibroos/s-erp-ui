<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import usePurchaseOrderStore from "~/stores/purchases/PurchaseOrderStore";
import type {
  OptionRefBtnType,
  RefBtnType,
} from "~/types/components/OptionRefBtnType";
import type { FormLayoutType } from "~/types/FormLayoutType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";
import type { FormVatType } from "~/types/masters/VatType";
import type { FormPph23Type } from "~/types/masters/Pph23Type";
import type { FormCurrencyType } from "~/types/masters/CurrencyType";
import type {
  FormPoDtProductListType,
  ModalIndexProductFilterAutoCompleteType,
  ModalIndexProductFilterTextType,
  PoDtDiscType,
  PoDtType,
} from "~/types/purchase-orders/PurchaseOrderType";
import { debounce } from "lodash-es";
import type { SoDtBomType } from "~/types/sales-orders/SalesOrderType";
import type {
  ModalIndexRefFilterDateType,
  ModalIndexSalesOrderFilterAutoCompleteType,
  ModalIndexSalesOrderFilterTextType,
} from "~/types/inventories/InventoryType";

const router = useRouter();
const layoutStore = useLayoutsStore();
const { topTitle } = storeToRefs(layoutStore);

const purchaseOrderStore = usePurchaseOrderStore();
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
} = storeToRefs(purchaseOrderStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Edit Purchase Order",
});

const id = ref(router.currentRoute.value.params.id);

const headers = ref<FieldSelectableType[]>([
  { key: "ref_type", title: "Ref Type", sortable: true },
  { key: "ref_num", title: "Ref No.", sortable: true },
  { key: "item_type", title: "Item Type", sortable: true },
  { key: "product_code", title: "Product Code", sortable: true },
  { key: "product_name", title: "Product Name", sortable: true },
  { key: "unit_name", title: "Unit", sortable: true },
  { key: "price", title: "Price", sortable: true, align: "end" },
  { key: "qty_po", title: "Qty PO", sortable: true, align: "end" },
  { key: "ref_qty", title: "Ref Qty", sortable: true, align: "end" },
  { key: "qty", title: "Qty", sortable: true, align: "end" },
  {
    key: "discount_percentage",
    title: "Disc (%)",
    sortable: true,
    align: "end",
  },
  { key: "discount_amount", title: "Disc (Am)", sortable: true, align: "end" },
  { key: "total_amount", title: "Total Amount", sortable: true, align: "end" },
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

const headersSupplier = ref<FieldSelectableType[]>([
  {
    title: "Name",
    key: "name",
    value: "name",
    align: "start",
    sortable: true,
  },
  {
    title: "Code",
    key: "code",
    value: "code",
    align: "start",
    sortable: true,
  },
  {
    title: "Phone",
    key: "phone",
    value: "phone",
    align: "start",
    sortable: true,
  },
  {
    title: "Email",
    key: "email",
    value: "email",
    align: "start",
    sortable: true,
  },
  {
    title: "Address",
    key: "address",
    value: "address",
    align: "start",
    sortable: true,
  },
  {
    title: "Customer Type",
    key: "customer_type_name",
    value: "customer_type_name",
    align: "start",
    sortable: true,
  },
]);

const filtersSupplier = ref<FilterSelectableType[]>([
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Code",
    key: "code",
  },
  {
    title: "Phone",
    key: "phone",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Address",
    key: "address",
  },
  {
    title: "Customer Type",
    key: "customer_type_ids",
    type: "autocomplete",
    display: "name",
    others: {
      methodApi: "post",
      api: "/v1/customer-types/index-customer-type",
      singleApi: "/v1/customer-types/index-customer-type",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Customer Type",
      innerSearchKey: "global",
    },
  },
]);

const headersModalProducts = ref<FieldSelectableType[]>([
  {
    title: "Group",
    key: "item_group_name",
    value: "item_group_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Sub Group",
    key: "item_sub_group_name",
    value: "item_sub_group_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Item Type",
    key: "item_type",
    value: "item_type",
    align: "start",
    sortable: true,
  },
  {
    title: "Code",
    key: "code",
    value: "code",
    align: "start",
    sortable: true,
  },
  {
    title: "Product Name",
    key: "product_bom_name",
    value: "product_bom_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Item Name",
    key: "name",
    value: "name",
    align: "start",
    sortable: true,
  },
  {
    title: "SKU",
    key: "sku",
    value: "sku",
    align: "start",
    sortable: true,
  },
  {
    title: "Factory Code",
    key: "factory_code",
    value: "factory_code",
    align: "start",
    sortable: true,
  },
  {
    title: "Specification",
    key: "specification",
    value: "specification",
    align: "start",
    sortable: true,
  },
  {
    title: "Price Buy",
    key: "price_buy",
    value: "price_buy",
    align: "end",
    sortable: true,
  },
  // {
  //   title: "Qty",
  //   key: "qty",
  //   value: "qty",
  //   align: "end",
  //   sortable: true,
  // },
  {
    title: "Tpb Code",
    key: "tpb_code",
    value: "tpb_code",
    align: "start",
    sortable: true,
  },
  {
    title: "Barcode",
    key: "barcode",
    value: "barcode",
    align: "start",
    sortable: true,
  },
]);

const headersBOMModal = ref<FieldSelectableType[]>([
  { key: "item_code", title: "Product Code", sortable: true },
  { key: "item_name", title: "Product Name", sortable: true },
  { key: "unit_name", title: "Unit", sortable: true },
  { key: "item_sku", title: "SKU", align: "end", sortable: true },
  { key: "item_barcode", title: "Barcode", align: "end", sortable: true },
  {
    key: "item_specification",
    title: "Specification",
    sortable: true,
  },
  { key: "price_buy", title: "Price Buy", align: "end", sortable: true },
  { key: "qty", title: "Qty", align: "end", sortable: true },
  { key: "subtotal", title: "Total Amount", align: "end", sortable: true },
  { key: "remark", title: "Remark", sortable: true },
]) as Ref<FieldSelectableType[]>;

const filtersOptionsProducts = ref([
  {
    title: "Group",
    key: "item_group_ids",
    type: "autocomplete",
    methodApi: "post",
    api: "/v1/item-groups/index-item-group",
    singleApi: "/v1/item-groups/index-item-group",
    pageEndProp: "meta.next_page_url",
    innerSearchKey: "global",
    multiple: true,
    returnObject: false,
    itemColor: "brown-lighten-2",
    itemValue: "id",
    itemTitle: "name",
  },
  {
    title: "Sub Group",
    key: "item_sub_group_ids",
    type: "autocomplete",
    methodApi: "post",
    api: "/v1/item-sub-groups/index-item-sub-group",
    singleApi: "/v1/item-sub-groups/index-item-sub-group",
    pageEndProp: "meta.next_page_url",
    innerSearchKey: "global",
    multiple: true,
    returnObject: false,
    itemColor: "brown-lighten-2",
    itemValue: "id",
    itemTitle: "name",
  },
]);

const filtersTextProducts = ref([
  {
    title: "Code",
    key: "code",
  },
  {
    title: "Name",
    key: "name",
  },
  {
    title: "SKU",
    key: "sku",
  },
  {
    title: "Factory Code",
    key: "factory_code",
  },
  {
    title: "Barcode",
    key: "barcode",
  },
  {
    title: "TPB Code",
    key: "tpb_code",
  },
  {
    title: "Global",
    key: "global",
  },
]);

const filtersDateInventories = ref([
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
]);

const headersModalSalesOrders = ref<FieldSelectableType[]>([
  {
    title: "PO Buyer No",
    key: "ref_num",
    value: "ref_num",
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
    title: "Customer",
    key: "customer_name",
    value: "customer_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Group",
    key: "item_group_name",
    value: "item_group_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Sub Group",
    key: "item_sub_group_name",
    value: "item_sub_group_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Item Code",
    key: "item_code",
    value: "item_code",
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
    title: "SKU",
    key: "item_sku",
    value: "item_sku",
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
    title: "Qty PO",
    key: "qty_po",
    value: "qty_po",
    align: "end",
    sortable: true,
  },
  {
    title: "Ref Qty",
    key: "ref_qty",
    value: "ref_qty",
    align: "end",
    sortable: true,
  },
  {
    title: "Balance",
    key: "balance",
    value: "balance",
    align: "end",
    sortable: true,
  },
  // {
  //   title: "Price",
  //   key: "price_sell",
  //   value: "price_sell",
  //   align: "end",
  //   sortable: true,
  // },
  // {
  //   title: "Subtotal",
  //   key: "subtotal_sell",
  //   value: "subtotal_sell",
  //   align: "end",
  //   sortable: true,
  // },
  {
    title: "Remark",
    key: "remark",
    value: "remark",
    align: "start",
    sortable: true,
  },
]);

const filtersOptionsSalesOrders = ref([
  {
    title: "Group",
    key: "item_group_ids",
    type: "autocomplete",
    methodApi: "post",
    api: "/v1/item-groups/index-item-group",
    singleApi: "/v1/item-groups/index-item-group",
    pageEndProp: "meta.next_page_url",
    innerSearchKey: "global",
    multiple: true,
    returnObject: false,
    itemColor: "brown-lighten-2",
    itemValue: "id",
    itemTitle: "name",
  },
  {
    title: "Sub Group",
    key: "item_sub_group_ids",
    type: "autocomplete",
    methodApi: "post",
    api: "/v1/item-sub-groups/index-item-sub-group",
    singleApi: "/v1/item-sub-groups/index-item-sub-group",
    pageEndProp: "meta.next_page_url",
    innerSearchKey: "global",
    multiple: true,
    returnObject: false,
    itemColor: "brown-lighten-2",
    itemValue: "id",
    itemTitle: "name",
  },
]);

const filtersTextSalesOrders = ref([
  {
    title: "PO Buyer No",
    key: "po_buyer_no",
  },
  {
    title: "Global",
    key: "global",
  },
]);

const formLayout = ref({
  title: "Basic Information",
  parentPath: "/purchases/purchase-orders",
  currentTab: tabFormIndex.value,
  tabs: ["Items", "Remark"],
  mode: "edit",
  button: {
    create: {
      path: "/purchases/purchase-orders/create",
    },
    save: {
      show: true,
      loading: false,
      type: "submit",
    },
    clear: {
      show: true,
    },
  },
  summary: formLayoutStore.value.summary,
} as FormLayoutType);

const initialFormLayout = () => {
  formLayout.value.currentTab = tabFormIndex.value;
  formLayout.value.mode = "edit";
  formLayout.value.button = {
    create: {
      path: "/purchases/purchase-orders/create",
    },
    save: {
      show: true,
      loading: false,
      type: "submit",
    },
    clear: {
      show: true,
    },
  };
};

const handleSubmit = async () => {
  form.value.po_dts = itemsCheck.value.checkMain;
  await purchaseOrderStore.update();
};

const fetchInitialData = async () => {
  form.value.id = Number(id.value);
  await Promise.all([
    purchaseOrderStore.show(),
    // purchaseOrderStore.indexProduct(),
    // purchaseOrderStore.indexQuotation(),
  ]);
};

const calculateTotalAmountLocal = () => {
  purchaseOrderStore.calculateTotalAmount();
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
  purchaseOrderStore.handleClickClear();
  // if (!form.value.po_no) {
  //   form.value.po_no = purchaseOrderStore.generatePoNumber();
  // }
  await fetchInitialData();
  initialFormLayout();
});

watchEffect(() => {
  topTitle.value = "Purchase Orders";
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <d-form-layout
      :config="formLayout"
      @click:save="handleSubmit()"
      @click:clear="purchaseOrderStore.handleClickClear()"
      @update:current-tab="tabFormIndex = $event"
    >
      <template #header>
        <form
          :class="
            classMerge(
              'grid grid-cols-7 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-2 mt-2',
              Object.keys(errors).length > 0 ? '!items-start' : '!items-center'
            )
          "
          @submit.prevent="handleSubmit"
        >
          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.po_no"
              :label="`Purchase Order No`"
              :placeholder="`Purchase Order No`"
              :errors="errors.po_no"
            />
          </div>
          <div class="sm:col-span-1">
            <d-autocomplete
              v-model="form.purchase_type_id"
              api="/v1/purchase-types/index-purchase-type"
              single-api="/v1/purchase-types/show-purchase-type"
              page-end-prop="meta.next_page_url"
              item-title="name"
              item-value="id"
              method-api="post"
              inner-search-key="global"
              label="Purchase Type"
              :errors="errors.purchase_type_id"
            ></d-autocomplete>
          </div>
          <div class="sm:col-span-1">
            <d-autocomplete-client
              v-model="form.status"
              :items="useStatics.formStatusPurchaseOrder"
              label="Status"
              item-value="id"
              item-title="name"
              :clearable="false"
            />
          </div>
          <div class="sm:col-span-1">
            <d-select-table
              api="/v1/customers/index-customer"
              detail-api="/v1/customers/index-customer"
              method-api="post"
              detail-method-api="post"
              mapping-detail="data[0]"
              total-prop="meta.total"
              label="Supplier"
              v-model="form.customer_id"
              :query="{
                is_active: 1,
              }"
              class="col-span-2 lg:col-span-1"
              is-quick-select
              @click:selected="
                (data) => purchaseOrderStore.autocompleteCustomer(data)
              "
              modal-custom-class="!w-4/5"
              :fields="headersSupplier"
              :filters="filtersSupplier"
            />
          </div>
          <div class="sm:col-span-1 col-span-3">
            <d-text-input
              v-model="form.shipping_destination"
              :label="`Shipping Address`"
              :placeholder="`Shipping Address`"
              :errors="errors.shipping_destination"
            />
          </div>
          <div class="sm:col-span-1">
            <d-date-picker-light
              v-model="form.po_date"
              label="PO Date"
            ></d-date-picker-light>
          </div>
          <div class="sm:col-span-1">
            <d-date-picker-light
              v-model="form.delivery_date"
              label="Delivery Date"
            ></d-date-picker-light>
          </div>
          <div class="sm:col-span-1">
            <d-autocomplete
              v-model="form.payment_term_id"
              api="/v1/payment-terms/index-payment-term"
              single-api="/v1/payment-terms/show-payment-term"
              page-end-prop="meta.next_page_url"
              item-title="name"
              item-value="id"
              method-api="post"
              inner-search-key="global"
              label="Payment Term"
              :errors="errors.payment_term_id"
            ></d-autocomplete>
          </div>
          <div class="sm:col-span-1">
            <d-autocomplete
              v-model="form.currency_id"
              :query="{
                is_active: 1,
              }"
              api="/v1/currencies/index-currency"
              single-api="/v1/currencies/show-currency"
              page-end-prop="meta.next_page_url"
              item-title="name"
              item-value="id"
              method-api="post"
              inner-search-key="global"
              label="Currency"
              :errors="errors.currency_id"
              @click:selected="
                (data: FormCurrencyType) => purchaseOrderStore.autocompleteCurrency(data)
              "
            ></d-autocomplete>
          </div>
          <div class="sm:col-span-1">
            <d-num-v-format
              v-model="form.exchange_rate"
              :precision="{
                min: 3,
                max: 3,
              }"
              hide-currency-display
              label="Exchange Rate"
            />
          </div>
          <div class="sm:col-span-1">
            <d-autocomplete
              v-model="form.pph23_id"
              :query="{
                is_active: 1,
              }"
              api="/v1/pph23s/index-pph23"
              single-api="/v1/pph23s/show-pph23"
              page-end-prop="meta.next_page_url"
              item-title="name"
              item-value="id"
              method-api="post"
              inner-search-key="global"
              label="PPH"
              :display-multiple-keys="['name', 'num']"
              is-display-multiple-key
              :errors="errors.pph23_id"
              @click:selected="
                (data) => {
                  purchaseOrderStore.autocompletePph(data);
                  calculateTotalAmountLocal();
                }
              "
            >
            </d-autocomplete>
          </div>
          <div class="lg:col-span-6 flex gap-2">
            <d-switch-status
              v-model="form.is_vat"
              :label="`VAT`"
              @update:modelValue="
                () => {
                  calculateTotalAmountLocal();
                }
              "
            />
          </div>
          <div class="sm:col-span-1 hidden">
            <d-autocomplete
              v-model="form.vat_id"
              api="/v1/vats/index-vat"
              single-api="/v1/vats/show-vat"
              page-end-prop="meta.next_page_url"
              item-title="name"
              item-value="id"
              method-api="post"
              inner-search-key="global"
              label="VAT"
              :errors="errors.vat_id"
              :query="{
                date_at: form.po_date,
                order_column: 'date_at',
                order_direction: 'desc',
                is_active: 1,
              }"
              @after:fetch="
                (data) => {
                  if (form.is_vat) {
                    form.vat_id = data[0].id;
                  } else {
                    form.vat_id = null;
                  }

                  purchaseOrderStore.referenceOptions.vats = data;
                }
              "
              @click:selected="
                (data) => {
                  purchaseOrderStore.autocompleteVat(data);
                  calculateTotalAmountLocal();
                }
              "
            ></d-autocomplete>
          </div>

          <d-bt type="submit" class="!hidden"></d-bt>
        </form>
      </template>
      <template #content>
        <div
          v-if="tabFormIndex == useStatics.formTabPurchaseOrder.items"
          class="grid grid-cols-3 sm:grid-cols-1 gap-2 mt-1"
        >
          <d-option-ref-btn
            :refs="optionRefBtnRef"
            class="col-span-2"
            @click:ref="
              (ref) => purchaseOrderStore.onClickOpenModalOptionRefBtn(ref)
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
                purchaseOrderStore.clickClearRefs();
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
            <template #header.discount_amount="{ column }">
              <d-num-v-format
                v-model="form.discount_amount"
                :precision="{
                  min: 3,
                  max: 3,
                }"
                hide-currency-display
                @update:modelValue="
                  // purchaseOrderStore.calculateHeaderDiscount();
                  calculateTotalAmountLocal()
                "
                label="Disc Amount"
                :disabled="!!form.discount_percentage"
                class="pt-2 min-w-[7rem] w-full"
              />
            </template>
            <template #header.discount_percentage="{ column }">
              <d-num-v-format
                v-model="form.discount_percentage"
                :precision="{
                  min: 3,
                  max: 3,
                }"
                hide-currency-display
                @update:modelValue="
                  // purchaseOrderStore.calculateHeaderDiscount();
                  calculateTotalAmountLocal()
                "
                label="Disc (%)"
                :disabled="!!form.discount_amount"
                class="pt-2 min-w-[7rem] w-full"
              />
            </template>
            <template #item.ref_type="{ item }">
              <span class="capitalize">{{ item.ref_type }} </span>
            </template>
            <template #item.item_type="{ item }">
              <span class="uppercase">{{ item.product_type }}</span>
            </template>
            <template #item.remark="{ item }">
              <d-text-input
                v-model="item.remark"
                :label="``"
                :placeholder="`Remark`"
                class="w-[250px]"
              />
            </template>
            <template #item.price="{ item }">
              <div class="flex w-full gap-2 grow">
                <d-num-v-format
                  v-model="item.price"
                  :precision="{
                    min: 3,
                    max: 3,
                  }"
                  hide-currency-display
                  @update:modelValue="
                    purchaseOrderStore.updatePrice(item);
                    calculateTotalAmountLocal();
                  "
                  label=""
                  class="w-[9rem]"
                />
              </div>
            </template>
            <template #item.qty="{ item }">
              <d-num-v-format
                v-model="item.qty"
                :precision="{
                  min: 3,
                  max: 3,
                }"
                hide-currency-display
                label=""
                class="w-[9rem]"
                @update:modelValue="
                  purchaseOrderStore.updateQuantity(item);
                  calculateTotalAmountLocal();
                "
              />
            </template>
            <template #item.discount_amount="{ item }">
              <d-num-v-format
                v-model="item.discount_amount"
                :precision="{
                  min: 3,
                  max: 3,
                }"
                hide-currency-display
                @update:modelValue="
                  // purchaseOrderStore.calculateDiscount(item);
                  calculateTotalAmountLocal()
                "
                label=""
                class="w-[9rem]"
                :disabled="!!item.discount_percentage"
              />
            </template>
            <template #item.discount_percentage="{ item }">
              <d-num-v-format
                v-model="item.discount_percentage"
                :precision="{
                  min: 3,
                  max: 3,
                }"
                hide-currency-display
                @update:modelValue="
                  // purchaseOrderStore.calculateDiscount(item);
                  calculateTotalAmountLocal()
                "
                label=""
                class="w-[9rem]"
                :disabled="!!item.discount_amount"
              />
            </template>

            <template #item.ref_qty="{ item }">
              <d-num-layout :value="item.ref_qty ?? 0" />
            </template>
            <template #item.qty_po="{ item }">
              <d-num-layout :value="item.qty_po ?? 0" />
            </template>
            <template #item.total_amount="{ item }">
              <d-num-layout :value="item.total_amount" />
            </template>
            <template #item.action="{ item, index }">
              <div class="action-button flex gap-2">
                <d-bt
                  @click="
                    () => {
                      purchaseOrderStore.onClickDeleteSelected(item, index);
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
                  :notif-text="`${item.product_name} deleted`"
                ></d-bt>
              </div>
            </template>
          </v-data-table-virtual>
        </div>
        <div v-if="tabFormIndex == useStatics.formTabPurchaseOrder.remarks">
          <div class="sm:col-span-1 mt-1">
            <d-rich-text
              v-model="form.remark"
              :label="`Remark`"
              :placeholder="`Write the Remark...`"
              class=""
            />
          </div>
        </div>
        <div v-if="tabFormIndex == useStatics.formTabPurchaseOrder.attachments">
          <!-- Attachments tab content will go here -->
          <div class="text-center py-4 text-gray-500">
            Attachments functionality will be implemented later
          </div>
        </div>
      </template>
    </d-form-layout>
    <modals-final-modal
      :is-open="isOpenModal.products"
      size="xl"
      custom-class="overflow-y-auto"
      label="List of Products"
      parent-class="!z-[1500]"
      @update:is-open="isOpenModal.products = $event"
    >
      <template #header-end>
        <d-form-product @submit:form="purchaseOrderStore.fetchModalFilter()" />
      </template>
      <template #top>
        <form
          class="grid grid-cols-5 w-full flex-row items-center gap-2"
          @submit.prevent="purchaseOrderStore.fetchModalFilter()"
        >
          <d-autocomplete
            v-for="filter in filtersOptionsProducts"
            :key="filter.key"
            v-model="queryModal.qIndexProducts[filter.key as ModalIndexProductFilterAutoCompleteType]"
            :api="filter.api"
            :single-api="filter.singleApi"
            :method-api="filter.methodApi"
            inner-search-key="global"
            :page-end-prop="filter.pageEndProp"
            :label="filter.title"
            :item-value="filter.itemValue"
            :item-title="filter.itemTitle"
            multiple
            :placeholder="`Type ${filter.title} ...`"
          ></d-autocomplete>

          <d-select-table
            api="/v1/products/index-product"
            detail-api="/v1/products/index-product"
            method-api="post"
            detail-method-api="post"
            mapping-detail="data[0]"
            total-prop="meta.total"
            label="Product"
            v-model="queryModal.qIndexProducts.product_bom_ids"
            class=""
            :query="{
              prod_type: 'product',
            }"
            multiple
            :return-object="false"
            modal-custom-class="!w-4/5"
            :fields="useInitials.productFieldsFilterConfig.fields"
            :filters="useInitials.productFieldsFilterConfig.filters"
          />

          <d-text-input
            v-for="filter in filtersTextProducts"
            :key="filter.key"
            v-model="queryModal.qIndexProducts[filter.key as ModalIndexProductFilterTextType]"
            :label="filter.title"
            :placeholder="filter.title"
            append-inner-icon="mdi-magnify"
          />

          <d-submit-button
            @click:submit="purchaseOrderStore.fetchModalFilter()"
            @click:clear="purchaseOrderStore.handleClearQuery()"
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
        @update:options="(data:any) => purchaseOrderStore.fetchDataServerFetch(data)"
        fixed-header
        height="450"
        hover
      >
        <template #item.item_type="{ item }">
          <span class="capitalize">{{
            defineItemTypePurchaseOrder(item as FormPoDtProductListType)
          }}</span>
        </template>
        <template #item.price_sell="{ item }">
          <d-num-layout :value="item.price_sell" />
        </template>
        <template #item.price_buy="{ item }">
          <d-num-layout :value="item.price_buy" />
        </template>

        <template #item.qty="{ item }">
          <d-num-layout :value="item.qty" />
        </template>

        <template #item.status="{ item }">
          <d-active-status :value="item.status" />
        </template>
      </v-data-table-server>

      <template #footer>
        <div class="flex h-max w-full justify-end items-center gap-2">
          <button
            class="flex items-center gap-2 rounded-md bg-sc px-3 py-2 text-[15px] font-bold text-white shadow-md hover:shadow-xl"
            @click="purchaseOrderStore.onClickUpdateProductsModal()"
          >
            <Icon name="material-symbols:save-rounded" size="20" />
            Add Selected Products ({{ itemsCheck.checkProducts.length }})
          </button>
        </div>
      </template>
    </modals-final-modal>

    <modals-final-modal
      :is-open="isOpenModal.so"
      size="xl"
      custom-class="overflow-y-auto"
      label="List of Sales Orders"
      parent-class="!z-[1500]"
      @update:is-open="isOpenModal.so = $event"
    >
      <template #header-end>
        <d-form-product @submit:form="purchaseOrderStore.fetchModalFilter()" />
      </template>
      <template #top>
        <form
          class="grid grid-cols-5 w-full flex-row items-center gap-2"
          @submit.prevent="purchaseOrderStore.fetchModalFilter()"
        >
          <d-autocomplete-client
            v-model="queryModal.qIndexSo.date_type"
            :items="useStatics.SoIndexDateType"
            label="Date Type"
            item-value="value"
            item-title="title"
            :clearable="false"
          />
          <d-date-picker-light
            v-for="filter in filtersDateInventories"
            :key="filter.key"
            v-model="queryModal.qIndexSo[filter.key as ModalIndexRefFilterDateType]"
            :label="filter.title"
          />
          <d-select-table
            api="/v1/customers/index-customer"
            detail-api="/v1/customers/index-customer"
            method-api="post"
            detail-method-api="post"
            mapping-detail="data[0]"
            total-prop="meta.total"
            label="Customer"
            v-model="form.customer_id"
            :query="{
              is_active: 1,
            }"
            class=""
            is-quick-select
            @click:selected="
              (data) => purchaseOrderStore.autocompleteCustomer(data)
            "
            modal-custom-class="!w-4/5"
            :fields="useStatics.headersCustomer"
            :filters="useStatics.filtersCustomer"
          />
          <d-select-table
            api="/v1/products/index-product"
            detail-api="/v1/products/index-product"
            method-api="post"
            detail-method-api="post"
            mapping-detail="data[0]"
            total-prop="meta.total"
            label="Product"
            v-model="queryModal.qIndexSo.product_id"
            class=""
            is-quick-select
            modal-custom-class="!w-4/5"
            :fields="useInitials.productFieldsFilterConfig.fields"
            :filters="useInitials.productFieldsFilterConfig.filters"
          />
          <d-autocomplete
            v-for="filter in filtersOptionsSalesOrders"
            :key="filter.key"
            v-model="queryModal.qIndexSo[filter.key as ModalIndexSalesOrderFilterAutoCompleteType]"
            :api="filter.api"
            :single-api="filter.singleApi"
            :method-api="filter.methodApi"
            inner-search-key="global"
            :page-end-prop="filter.pageEndProp"
            :label="filter.title"
            :item-value="filter.itemValue"
            :item-title="filter.itemTitle"
            multiple
            :placeholder="`Type ${filter.title} ...`"
          ></d-autocomplete>

          <d-text-input
            v-for="filter in filtersTextSalesOrders"
            :key="filter.key"
            v-model="queryModal.qIndexSo[filter.key as ModalIndexSalesOrderFilterTextType]"
            :label="filter.title"
            :placeholder="filter.title"
            append-inner-icon="mdi-magnify"
          />

          <d-submit-button
            @click:submit="purchaseOrderStore.fetchModalFilter()"
            @click:clear="purchaseOrderStore.handleClearQuery()"
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
        item-value="quo_dt_id"
        show-current-page
        return-object
        multiple
        show-select
        @update:options="(data:any) => purchaseOrderStore.fetchDataServerFetch(data)"
        fixed-header
        height="450"
        hover
      >
        <template #item.item_type="{ item }">
          <span class="capitalize"
            >{{ item.item_type ?? defineItemTypePurchaseOrder(item as FormPoDtProductListType) }}
          </span>
        </template>
        <template #item.ref_qty="{ item }">
          <d-num-layout :value="item.ref_qty" />
        </template>
        <template #item.qty_po="{ item }">
          <d-num-layout :value="item.qty_po" />
        </template>
        <template #item.balance="{ item }">
          <d-num-layout :value="item.balance" />
        </template>
        <template #item.status="{ item }">
          <d-active-status :value="item.status" />
        </template>
      </v-data-table-server>

      <template #footer>
        <div class="flex h-max w-full justify-end items-center gap-2">
          <button
            class="flex items-center gap-2 rounded-md bg-sc px-3 py-2 text-[15px] font-bold text-white shadow-md hover:shadow-xl"
            @click="purchaseOrderStore.onClickUpdateProductsModal()"
          >
            <Icon name="material-symbols:save-rounded" size="20" />
            Add Selected Sales Order ({{ itemsCheck.checkSo.length }})
          </button>
        </div>
      </template>
    </modals-final-modal>
  </div>
</template>
