<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useSalesOrderStore from "~/stores/orders/SalesOrderStore";
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
  FormSoDtProductListType,
  ModalIndexProductFilterAutoCompleteType,
  ModalIndexProductFilterTextType,
  ModalIndexQuotationFilterAutoCompleteType,
  ModalIndexQuotationFilterTextType,
  SoDtBomType,
  SoDtDiscType,
  SoDtType,
  VatModeType,
} from "~/types/sales-orders/SalesOrderType";
import { updateSoRefsModalFromMain } from "~/composables/maps/salesOrderComp";
import type {
  FormQuoDtBomListType,
  QuoDtBomType,
  QuoDtType,
} from "~/types/quotations/QuotationType";
import type { ProductBomListType } from "~/types/masters/ProductType";
import { debounce } from "lodash-es";

const layoutStore = useLayoutsStore();
const { topTitle } = storeToRefs(layoutStore);

const salesOrderStore = useSalesOrderStore();
const {
  tabFormIndex,
  form,
  errors,
  itemsCheck,
  isOpenModal,
  queryModal,
  metaModal,
  optionRefBtnRef,
  openedModal,
  loading,
  formLayout: formLayoutStore,
} = storeToRefs(salesOrderStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Create Sales Order",
});

const headers = ref<FieldSelectableType[]>([
  // { key: "ref_type", title: "Ref Type", sortable: true },
  { title: "", key: "expand", width: 20, sortable: false },
  {
    key: "ref_type",
    title: "Ref Type",
    sortable: true,

    cellProps: {
      class: "capitalize",
    },
  },
  { key: "ref_num", title: "Ref Num", sortable: true },
  { key: "item_type", title: "Item Type", sortable: true },
  { key: "item_code", title: "Product Code", sortable: true },
  { key: "item_name", title: "Product Name", sortable: true },
  { key: "unit_name", title: "Unit", sortable: true },
  { key: "price_sell", title: "Price", sortable: true, align: "end" },
  { key: "qty", title: "Qty", sortable: true, align: "end" },
  { key: "disc_perc", title: "Disc (%)", sortable: true, align: "end" },
  { key: "disc_am", title: "Disc (Am)", sortable: true, align: "end" },
  { key: "total_am", title: "Total Amount", sortable: true, align: "end" },
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

const headersBOM = ref<FieldSelectableType[]>([
  { key: "item_code", title: "Product Code", sortable: true },
  { key: "item_name", title: "Product Name", sortable: true },
  { key: "unit_name", title: "Unit", sortable: true },
  { key: "qty", title: "Qty", sortable: true, align: "end" },
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

const headersBOMModal = ref<FieldSelectableType[]>([
  { key: "item_code", title: "Product Code", sortable: true },
  { key: "item_name", title: "Product Name", sortable: true },
  { key: "unit_name", title: "Unit", sortable: true },
  { key: "item_sku", title: "SKU", align: "end", sortable: true },
  { key: "item_barcode", title: "Barcode", align: "end", sortable: true },
  {
    key: "item_specification",
    title: "Specification",
    align: "end",
    sortable: true,
  },
  { key: "price_buy", title: "Price Buy", align: "end", sortable: true },
  { key: "qty", title: "Qty", align: "end", sortable: true },
  {
    title: "Total Amount",
    key: "subtotal_buy",
    value: "subtotal_buy",
    align: "end",
    sortable: true,
  },
  { key: "remark", title: "Remark", sortable: true },
]) as Ref<FieldSelectableType[]>;

const headersCustomer = ref<FieldSelectableType[]>([
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

const filtersCustomer = ref<FilterSelectableType[]>([
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
  { title: "", key: "expand", width: 20, sortable: false },
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
    title: "Name",
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
  {
    title: "Qty",
    key: "qty",
    value: "qty",
    align: "end",
    sortable: true,
  },
  {
    title: "Price Sell",
    key: "price_sell",
    value: "price_sell",
    align: "end",
    sortable: true,
  },
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

const headersModalQuotations = ref<FieldSelectableType[]>([
  { title: "", key: "expand", width: 20, sortable: false },
  {
    title: "Quotation No",
    key: "quo_no",
    value: "quo_no",
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
    title: "Item Type",
    key: "item_type",
    value: "item_type",
    align: "start",
    sortable: true,
  },
  {
    title: "Code",
    key: "item_code",
    value: "item_code",
    align: "start",
    sortable: true,
  },
  {
    title: "Name",
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
    title: "Qty",
    key: "qty",
    value: "qty",
    align: "end",
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
    title: "Subtotal",
    key: "subtotal_sell",
    value: "subtotal_sell",
    align: "end",
    sortable: true,
  },
  {
    title: "Disc (%)",
    key: "disc_perc",
    value: "disc_perc",
    align: "end",
    sortable: true,
  },
  {
    title: "Disc (Am)",
    key: "disc_am",
    value: "disc_am",
    align: "end",
    sortable: true,
  },
  {
    title: "VAT (%)",
    key: "vat_perc",
    value: "vat_perc",
    align: "end",
    sortable: true,
  },
  {
    title: "Total Amount",
    key: "total_am",
    value: "total_am",
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

const filtersOptionsQuotations = ref([
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

const filtersTextQuotations = ref([
  {
    title: "Quo No",
    key: "quo_no",
  },
  {
    title: "Global",
    key: "global",
  },
]);

const formLayout = ref({
  title: "Basic Information",
  parentPath: "/sales/sales-orders",
  currentTab: tabFormIndex.value,
  tabs: ["Items", "Remark", "Schedule", "Attachments"],
  button: {
    clear: {
      show: true,
    },
  },
  // permission: {
  //   name: ["c_ms"],
  //   isActive: true,
  // },
  summary: formLayoutStore.value.summary,
} as FormLayoutType);

const initialFormLayout = () => {
  formLayout.value.currentTab = tabFormIndex.value;
  formLayout.value.mode = "create";
  formLayout.value.button = {
    clear: {
      show: true,
    },
  };
};

const handleSubmit = async () => {
  // const validatedForm = formSchema.safeParse(form.value);

  // if (!validatedForm.success) {
  //   errors.value = {};
  //   console.log("log", validatedForm.error.errors);

  //   validatedForm.error.errors.map((ZodIssue) => {
  //     errors.value[ZodIssue.path[0]] = ZodIssue.message;
  //   });

  //   return;
  // }

  form.value.so_dts = itemsCheck.value.checkMain;

  await salesOrderStore.store();
};

const fetchInitialData = async () => {
  // await salesOrderStore.indexProduct();
};

const calculateTotalAmountLocal = () => {
  salesOrderStore.calculateTotalAmount();

  if (formLayout.value.summary) {
    formLayout.value.summary.total_amount.value = form.value.subtotal;
    formLayout.value.summary.total_after_disc.value =
      form.value.total_after_disc;
    formLayout.value.summary.total_discount.value = form.value.total_discount;
    formLayout.value.summary.total_vat.value = form.value.total_vat;
    formLayout.value.summary.total_pph23.value = form.value.total_pph23;
    formLayout.value.summary.grand_total.value = form.value.grand_total;

    // TODO foreach currency symbol
  }
};

const kanbanBoardExposeRef = ref();

// Trigger the openModal method
const resetBoard = async () => {
  if (kanbanBoardExposeRef.value) {
    console.log("resetBoard-SO");

    kanbanBoardExposeRef.value.resetBoard();
  } else {
    console.error("openModal method is not available on kanbanBoardExposeRef");
  }

  // await openModal(filteredModalForms.value);
};

watch(
  () => itemsCheck.value.checkQuotations,
  (newVal) => {
    if (newVal.length === 1) {
      salesOrderStore.indexQuotation();
    } else if (newVal.length === 0) {
      salesOrderStore.removeQuotation();
    }
  }
);

watch(
  () => isOpenModal.value.quotations,
  (oldVal, newVal) => {
    if (oldVal != newVal) {
      if (!oldVal) {
        itemsCheck.value.checkQuotations = [];
      }
    }
  },
  { immediate: true, deep: true }
);

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
  salesOrderStore.handleClickClear();
  await fetchInitialData();
  initialFormLayout();
});

watchEffect(() => {
  // changeTitle();
  topTitle.value = "Sales Orders";
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <d-form-layout
      :config="formLayout"
      @click:save="handleSubmit()"
      @click:clear="salesOrderStore.handleClickClear()"
      @update:current-tab="tabFormIndex = $event"
    >
      <template #header>
        <form
          :class="
            classMerge(
              'grid grid-cols-6 lg:grid-cols-1 gap-2',
              Object.keys(errors).length > 0 ? '!items-start' : '!items-center'
            )
          "
          @submit.prevent="handleSubmit"
        >
          <div class="lg:col-span-6">
            <d-text-input
              v-model="form.po_buyer_no"
              :label="`PO Buyer No`"
              :placeholder="`PO Buyer No`"
              :errors="errors.po_buyer_no"
            />
          </div>
          <div class="lg:col-span-6">
            <d-autocomplete
              v-model="form.order_type_id"
              api="/v1/order-types/index-order-type"
              single-api="/v1/order-types/show-order-type"
              page-end-prop="meta.next_page_url"
              item-title="name"
              item-value="id"
              method-api="post"
              inner-search-key="global"
              label="Order Type"
              :errors="errors.order_type_id"
            ></d-autocomplete>
          </div>
          <div class="lg:col-span-6">
            <d-select-table
              api="/v1/customers/index-customer"
              detail-api="/v1/customers/index-customer"
              method-api="post"
              detail-method-api="post"
              mapping-detail="data[0]"
              total-prop="meta.total"
              label="Customer"
              v-model="form.customer_id"
              class="col-span-2 lg:col-span-1"
              is-quick-select
              @click:selected="
                (data) => salesOrderStore.autocompleteCustomer(data)
              "
              modal-parent-class="!z-[2500]"
              modal-custom-class="!w-4/5"
              :fields="headersCustomer"
              :filters="filtersCustomer"
            />
          </div>

          <div class="lg:col-span-6">
            <d-text-input
              v-model="form.email"
              :label="`Email`"
              :placeholder="`Email`"
              :errors="errors.email"
              disabled
            />
          </div>
          <div class="lg:col-span-6">
            <d-text-input
              v-model="form.phone"
              :label="`Phone`"
              :placeholder="`Phone`"
              :errors="errors.phone"
              disabled
            />
          </div>

          <div class="lg:col-span-6">
            <d-autocomplete-client
              v-model="form.status"
              :items="useStatics.formStatusSalesOrder"
              label="Status"
              item-value="id"
              item-title="name"
              :clearable="false"
            />
          </div>

          <div class="lg:col-span-6">
            <d-date-picker-light
              v-model="form.order_at"
              label="Order Date"
            ></d-date-picker-light>
          </div>
          <div class="lg:col-span-6">
            <d-date-picker-light
              v-model="form.shipping_at"
              label="Shipping Date"
            ></d-date-picker-light>
          </div>
          <div
            class="sm:col-span-1"
            v-if="
              [
                useStatics.orderTypes.maintenance,
                useStatics.orderTypes.service,
              ].includes(form.order_type_id || 0)
            "
          >
            <d-date-picker-light
              v-model="form.agree_at"
              label="Agreement Date"
            ></d-date-picker-light>
          </div>
          <div
            class="sm:col-span-1"
            v-if="
              [
                useStatics.orderTypes.maintenance,
                useStatics.orderTypes.service,
              ].includes(form.order_type_id || 0)
            "
          >
            <d-date-picker-light
              v-model="form.due_at"
              label="Due Date"
            ></d-date-picker-light>
          </div>
          <div class="lg:col-span-6">
            <d-autocomplete
              v-model="form.currency_id"
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
                (data: FormCurrencyType) => salesOrderStore.autocompleteCurrency(data)
              "
            ></d-autocomplete>
          </div>
          <div class="lg:col-span-6">
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
              api="/v1/pph23s/index-pph23"
              single-api="/v1/pph23s/show-pph23"
              page-end-prop="meta.next_page_url"
              item-title="name"
              item-value="id"
              method-api="post"
              inner-search-key="global"
              label="PPH (%)"
              :display-multiple-keys="['name', 'num']"
              is-display-multiple-key
              :errors="errors.pph23_id"
              @click:selected="
                (data) => {
                  salesOrderStore.autocompletePph(data);
                  calculateTotalAmountLocal();
                }
              "
            ></d-autocomplete>
          </div>
          <div class="lg:col-span-6 flex gap-2">
            <d-switch-status v-model="form.is_vat" :label="`VAT`" />
          </div>

          <div class="lg:col-span-6 col-span-6">
            <d-text-area-input
              v-model="form.ship_dest"
              :label="``"
              :placeholder="`Shipping Address`"
              class=""
              :auto-grow="false"
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
                date_at: form.due_at,
                order_column: 'date_at',
                order_direction: 'desc',
              }"
              @after:fetch="
                (data) => {
                  if (form.is_vat) {
                    form.vat_id = data[0].id;
                  } else {
                    form.vat_id = null;
                  }

                  salesOrderStore.referenceOptions.vats = data;
                }
              "
              @click:selected="
                (data) => {
                  salesOrderStore.autocompleteVat(data);
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
          v-if="tabFormIndex == useStatics.formTabSalesOrder.items"
          class="grid grid-cols-3 sm:grid-cols-1 gap-2"
        >
          <d-option-ref-btn
            :refs="optionRefBtnRef"
            class="col-span-2"
            @click:ref="
              (ref) => salesOrderStore.onClickOpenModalOptionRefBtn(ref)
            "
          >
            <!-- <template #append-cta-product>
              <v-icon
                icon="mdi-magnify"
                class="text-dark1 dark:text-primary1"
              />
            </template> -->
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
                salesOrderStore.clickClearRefs();
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
            class="col-span-3 sm:col-span-1 table-hover"
            :header-props="{
              class: '!bg-scLightest dark:!bg-scDarker whitespace-nowrap',
            }"
            :row-props="{
              class: 'whitespace-nowrap',
            }"
          >
            <template #item.item_type="{ item }">
              <span class="capitalize">{{ item.item_type }} </span>
            </template>
            <template #item.remark="{ item }">
              <d-text-area-input
                v-model="item.remark"
                :label="``"
                :placeholder="`Remark`"
                class="w-[9rem]"
              />
            </template>
            <template #item.price_sell="{ item }">
              <div class="flex w-full gap-2 grow">
                <d-num-v-format
                  v-model="item.price_sell"
                  :precision="{
                    min: 3,
                    max: 3,
                  }"
                  hide-currency-display
                  @update:modelValue="calculateTotalAmountLocal"
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
                @update:modelValue="calculateTotalAmountLocal"
              />
            </template>
            <template #header.disc_perc="{ column }">
              <d-num-v-format
                v-model="form.disc_perc"
                :precision="{
                  min: 3,
                  max: 3,
                }"
                hide-currency-display
                @update:modelValue="calculateTotalAmountLocal"
                label="Disc (%)"
                class="pt-2 min-w-[7rem] w-full"
              />
            </template>
            <template #header.disc_am="{ column }">
              <d-num-v-format
                v-model="form.disc_am"
                :precision="{
                  min: 3,
                  max: 3,
                }"
                hide-currency-display
                @update:modelValue="calculateTotalAmountLocal"
                label="Disc Amount"
                class="pt-2 min-w-[7rem] w-full"
              />
            </template>
            <template #item.disc_am="{ item }">
              <d-num-v-format
                v-model="item.disc_am"
                :precision="{
                  min: 3,
                  max: 3,
                }"
                hide-currency-display
                @update:modelValue="calculateTotalAmountLocal"
                label=""
                class="w-[9rem]"
                :disabled="!!item.disc_perc"
              />
            </template>
            <template #item.disc_perc="{ item }">
              <d-num-v-format
                v-model="item.disc_perc"
                :precision="{
                  min: 3,
                  max: 3,
                }"
                hide-currency-display
                @update:modelValue="calculateTotalAmountLocal"
                label=""
                class="w-[9rem]"
                :disabled="!!item.disc_am"
              />
            </template>

            <template #item.total_am="{ item }">
              <d-num-layout :value="item.total_am" />
            </template>
            <template #item.action="{ item, index }">
              <div class="action-button flex gap-2">
                <d-bt
                  v-if="item.item_type == 'product'"
                  @click="salesOrderStore.onClickOpenModalBOM((item as unknown as FormSoDtProductListType), index)"
                  class="px-2 py-1 bg-scLighter hover:bg-scDarker hover:text-primary1 rounded-lg ease-in-out transition-all hover:dark:!bg-scDarker3 dark:!bg-sc"
                  text-class="text-primary1 dark:text-white"
                  rounded="xl"
                  cta="+ Add BOM"
                  no-icon
                ></d-bt>
                <d-bt
                  @click="
                    () => {
                      salesOrderStore.onClickDeleteSelected(item, index);
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
                  :notif-text="`${item.name ?? item.item_name} deleted`"
                ></d-bt>
              </div>
            </template>

            <template #item.expand="{ toggleExpand, isExpanded, internalItem }">
              <button
                v-if="
                  !!internalItem.raw.so_dts_boms &&
                  internalItem.raw.so_dts_boms.length > 0
                "
                class="cursor-pointer"
                @click="toggleExpand(internalItem)"
                @submit.prevent
              >
                <v-icon
                  icon="mdi-chevron-down"
                  class="transition-transform"
                  :class="isExpanded(internalItem) ? 'rotate-180' : 'rotate-0'"
                />
              </button>
            </template>
            <template
              #expanded-row="{
            columns,
            item,
            internalItem,
            index
          }: {
            columns: any
            item: any
            internalItem: any
            index: number
          }"
            >
              <tr v-if="item.so_dts_boms.length > 0">
                <td :colspan="columns.length" class="!p-0">
                  <div class="">
                    <v-data-table-virtual
                      :headers="headersBOM"
                      :items="(item.so_dts_boms as SoDtBomType[]) || []"
                      item-value="uid"
                      density="compact"
                      return-object
                      fixed-header
                      class="table-hover"
                      :height="item.so_dts_boms.length > 1 ? '170' : '100'"
                      :header-props="{
                        class: '!bg-grey1 dark:!bg-dark2 whitespace-nowrap',
                      }"
                      :row-props="{
                        class: 'whitespace-nowrap',
                      }"
                    >
                      <template #item.remark="{ item }">
                        <d-text-area-input
                          v-model="item.remark"
                          :label="``"
                          :placeholder="`Remark`"
                          class="w-full"
                        />
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
                          class="w-full"
                          @update:modelValue="
                            () => {
                              salesOrderStore.calculatePrice(
                                item,
                                internalItem.raw
                              );
                              calculateTotalAmountLocal();
                            }
                          "
                        />
                      </template>
                      <template #item.price_buy="{ item }">
                        <d-num-v-format
                          v-model="item.price_buy"
                          :precision="{
                            min: 3,
                            max: 3,
                          }"
                          hide-currency-display
                          label=""
                          class="w-full"
                          @update:modelValue="
                            () => {
                              salesOrderStore.calculatePrice(
                                item,
                                internalItem.raw
                              );
                              calculateTotalAmountLocal();
                            }
                          "
                        />
                      </template>
                      <template #item.subtotal_buy="{ item }">
                        <d-num-layout :value="item.subtotal_buy" />
                      </template>
                      <template #item.action="{ item: itemBom, index: iBom }">
                        <div class="action-button">
                          <d-bt
                            @click="
                              () => {
                                salesOrderStore.onClickDeleteBom(
                                  index,
                                  iBom,
                                  internalItem
                                );
                                calculateTotalAmountLocal();
                              }
                            "
                            icon="mdi-delete"
                            is-no-text
                            class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                            icon-class="text-cancel dark:text-primary1"
                            rounded="xl"
                            cta="delete"
                            icon-size="16"
                            :is-notif="true"
                            :notif-text="`${(itemBom as SoDtBomType).item_name} deleted`"
                          ></d-bt>
                        </div>
                      </template>
                    </v-data-table-virtual>
                  </div>
                </td>
              </tr>
            </template>
          </v-data-table-virtual>
        </div>
        <div v-if="tabFormIndex == useStatics.formTabSalesOrder.remarks">
          <div class="lg:col-span-6">
            <d-text-area-input
              v-model="form.remark"
              :label="`Remark`"
              :placeholder="`Remark`"
              :errors="errors.remark"
            />
          </div>
        </div>
        <div
          v-if="tabFormIndex == useStatics.formTabSalesOrder.schedules"
          class="flex flex-col gap-2"
        >
          <div class="grid grid-cols-6 gap-2">
            <div class="lg:col-span-6">
              <d-text-input
                v-model="form.schedule.title"
                :label="`Title`"
                :placeholder="`Title`"
                :errors="errors.title"
              />
            </div>

            <!-- assignee_id -->
            <div class="lg:col-span-6">
              <d-autocomplete
                v-model="form.schedule.assignee_id"
                api="/v1/users/index-user"
                single-api="/v1/users/show-user"
                page-end-prop="meta.next_page_url"
                item-title="name"
                item-value="id"
                method-api="post"
                inner-search-key="global"
                label="Assignee"
              ></d-autocomplete>
            </div>

            <div class="lg:col-span-6">
              <d-date-picker-light
                v-model="form.schedule.start_at"
                label="Start Date"
              ></d-date-picker-light>
            </div>
            <div class="lg:col-span-6">
              <d-date-picker-light
                v-model="form.schedule.end_at"
                label="End Date"
              ></d-date-picker-light>
            </div>
            <div class="lg:col-span-6 col-span-2 flex gap-2 items-center">
              <v-menu
                :close-on-content-click="false"
                no-click-animation
                :open-delay="0"
                :close-delay="0"
                transition="slide-y-transition"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    density="compact"
                    :class="
                      classMerge(
                        'dark:text-white hover:text-gray-500 !h-full !border border-solid !border-zinc-400 dark:bg-dark3'
                      )
                    "
                    variant="flat"
                  >
                    <span :class="classMerge('text-xs dark:text-primary1')"
                      >Color</span
                    >
                    <div
                      :style="{
                        backgroundColor: form.schedule.color,
                        color: form.schedule.color ? 'white' : 'black',
                      }"
                      class="w-6 h-6 rounded-full border border-solid border-grey2 ml-2"
                    ></div>
                  </v-btn>
                </template>
                <v-color-picker
                  show-swatches
                  v-model="form.schedule.color"
                  :modes="['hex']"
                  hide-inputs
                >
                </v-color-picker>
              </v-menu>

              <d-bt
                :cta="'Reset Schedule'"
                :class="
                  classMerge(
                    '!bg-zinc-200 justify-self-end hover:!bg-grey2 dark:!bg-dark2 gap-1 dark:hover:!bg-dark1 text-sm transition-all ease-in-out !border-2 p-2 rounded-lg !border-zinc-200 dark:border-none w-max'
                  )
                "
                :text-class="
                  classMerge('text-scDarker dark:text-white mx-auto')
                "
                :icon-class="
                  classMerge('text-scDarker dark:text-white mx-auto')
                "
                icon="mdi-refresh"
                type="button"
                @click="resetBoard()"
              />
            </div>
          </div>

          <div class="overflow-x-auto">
            <v-skeleton-loader
              height="240"
              type="image"
              :loading="loading.editPageLoading"
            >
              <schedule-board
                ref="kanbanBoardExposeRef"
                class="mt-2"
                v-if="!loading.editPageLoading"
              />
            </v-skeleton-loader>
          </div>
        </div>
        <div
          v-if="tabFormIndex == useStatics.formTabSalesOrder.attachments"
          class="grid grid-cols-3 md:grid-cols-1 gap-2"
        >
          <div class="lg:col-span-6">
            <v-file-upload
              v-model="form.attachments"
              clearable
              density="compact"
              variant="compact"
              multiple
              @update:modelValue="salesOrderStore.handleUploadFile"
            >
              <template #item="{ props: itemProps }">
                <v-file-upload-item v-bind="itemProps" lines="one" nav>
                  <template v-slot:prepend>
                    <v-avatar size="32" rounded></v-avatar>
                  </template>

                  <template v-slot:clear="{ props: clearProps }">
                    <v-btn color="primary" v-bind="clearProps"></v-btn>
                  </template>
                </v-file-upload-item>
              </template>
            </v-file-upload>
          </div>
          <div
            class="md:col-span-1 col-span-2 grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-2 content-start"
          >
            <!-- attached files -->
            <div
              v-for="(file, index) in form.attachments"
              :key="index"
              class="flex justify-between items-center gap-2 p-2 border border-solid border-grey2 hover:bg-grey2 dark:hover:bg-dark2 rounded-lg"
            >
              <div class="flex gap-2">
                <v-img
                  :aspect-ratio="1"
                  :src="file.url"
                  :alt="file.name"
                  width="50"
                  cover
                  class="border border-solid border-grey3"
                ></v-img>

                <div class="flex flex-col justify-center">
                  <span class="text-sm dark:text-primary1">{{
                    file.name
                  }}</span>
                  <span class="text-xs dark:text-grey1">{{ file.size }}</span>
                </div>
              </div>
              <div class="flex gap-2">
                <d-bt
                  icon="mdi-download"
                  is-no-text
                  class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-scLightest rounded-full ease-in-out transition-all hover:dark:!bg-scDarker2 dark:!bg-sc"
                  icon-class="text-sc dark:text-primary1"
                  rounded="xl"
                  cta="download"
                  icon-size="16"
                ></d-bt>
                <d-bt
                  @click="salesOrderStore.handleDeleteFile(index)"
                  icon="mdi-delete"
                  is-no-text
                  class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                  icon-class="text-cancel dark:text-primary1"
                  rounded="xl"
                  cta="delete"
                  icon-size="16"
                  :is-notif="true"
                  :notif-text="`${file.name} deleted`"
                ></d-bt>
              </div>
            </div>
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
      <template #top>
        <form
          class="grid grid-cols-5 w-full flex-row items-center gap-2"
          @submit.prevent="salesOrderStore.fetchModalFilter()"
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

          <d-text-input
            v-for="filter in filtersTextProducts"
            :key="filter.key"
            v-model="queryModal.qIndexProducts[filter.key as ModalIndexProductFilterTextType]"
            :label="filter.title"
            :placeholder="filter.title"
            append-inner-icon="mdi-magnify"
          />

          <d-submit-button
            @click:submit="salesOrderStore.fetchModalFilter()"
            @click:clear="salesOrderStore.handleClearQuery()"
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
        item-value="ref_id"
        show-current-page
        return-object
        multiple
        show-select
        @update:options="(data:any) => salesOrderStore.fetchDataServerFetch(data)"
        fixed-header
        height="450"
        hover
      >
        <template #item.item_type="{ item }">
          <span class="capitalize"
            >{{ defineItemTypeSalesOrder(item as SoDtType) }}
          </span>
        </template>
        <template #item.price_sell="{ item }">
          <d-num-layout :value="item.price_sell" />
        </template>
        <template #item.price_buy="{ item }">
          <d-num-layout :value="item.price_buy" />
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
            @update:modelValue="calculateTotalAmountLocal"
          />
        </template>

        <template #item.status="{ item }">
          <d-active-status :value="item.status" />
        </template>
        <template #item.expand="{ toggleExpand, isExpanded, internalItem }">
          <button
            v-if="internalItem.raw.boms.length > 0"
            class="cursor-pointer"
            @click="toggleExpand(internalItem)"
            @submit.prevent
          >
            <v-icon
              icon="mdi-chevron-down"
              class="transition-transform"
              :class="isExpanded(internalItem) ? 'rotate-180' : 'rotate-0'"
            />
          </button>
        </template>
        <template
          #expanded-row="{
            columns,
            item,
            internalItem,
            index
          }: {
            columns: any
            item: any
            internalItem: any
            index: number
          }"
        >
          <tr v-if="!!item.quo_dts_boms && item.quo_dts_boms.length > 0">
            <td :colspan="columns.length" class="!p-0">
              <div class="">
                <v-data-table-virtual
                  :headers="headersBOMModal"
                  :items="(item.quo_dts_boms as QuoDtBomType[]) || []"
                  item-value="uid"
                  density="compact"
                  return-object
                  fixed-header
                  class="table-hover"
                  :height="item.quo_dts_boms.length > 1 ? '170' : '100'"
                  :header-props="{
                    class: '!bg-grey1 dark:!bg-dark2 whitespace-nowrap',
                  }"
                  :row-props="{
                    class: 'whitespace-nowrap',
                  }"
                >
                  <template #item.price_buy="{ item }">
                    <d-num-v-format
                      v-model="item.price_buy"
                      :precision="{
                        min: 3,
                        max: 3,
                      }"
                      hide-currency-display
                      label=""
                      class="w-[9rem]"
                      @update:modelValue="
                        () => {
                          salesOrderStore.calculatePrice(
                            item,
                            internalItem.raw
                          );
                        }
                      "
                    />
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
                        salesOrderStore.calculatePrice(item, internalItem.raw)
                      "
                    />
                  </template>
                  <template #item.subtotal_buy="{ item }">
                    <d-num-layout :value="item.subtotal_buy" />
                  </template>
                </v-data-table-virtual>
              </div>
            </td>
          </tr>
          <tr v-else-if="item.boms.length > 0">
            <td :colspan="columns.length" class="!p-0">
              <div class="">
                <v-data-table-virtual
                  :headers="headersBOMModal"
                  :items="(item.boms as SoDtBomType[]) || []"
                  item-value="uid"
                  density="compact"
                  return-object
                  fixed-header
                  class="table-hover"
                  :height="item.boms.length > 1 ? '170' : '100'"
                  :header-props="{
                    class: '!bg-grey1 dark:!bg-dark2 whitespace-nowrap',
                  }"
                  :row-props="{
                    class: 'whitespace-nowrap',
                  }"
                >
                  <template #item.price_buy="{ item }">
                    <d-num-v-format
                      v-model="item.price_buy"
                      :precision="{
                        min: 3,
                        max: 3,
                      }"
                      hide-currency-display
                      label=""
                      class="w-[9rem]"
                      @update:modelValue="
                        () => {
                          salesOrderStore.calculatePrice(
                            item,
                            internalItem.raw
                          );
                        }
                      "
                    />
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
                        salesOrderStore.calculatePrice(item, internalItem.raw)
                      "
                    />
                  </template>
                  <template #item.subtotal_buy="{ item }">
                    <d-num-layout :value="item.subtotal_buy" />
                  </template>
                </v-data-table-virtual>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table-server>

      <template #footer>
        <div class="flex h-max w-full justify-end">
          <button
            class="flex items-center gap-2 rounded-md bg-sc px-3 py-2 text-[15px] font-bold text-white shadow-md hover:shadow-xl"
            @click="salesOrderStore.onClickUpdateProductsModal()"
          >
            <Icon name="material-symbols:save-rounded" size="20" />
            Add Selected Products ({{ itemsCheck.checkProducts.length }})
          </button>
        </div>
      </template>
    </modals-final-modal>

    <modals-final-modal
      :is-open="isOpenModal.quotations"
      size="xl"
      custom-class="overflow-y-auto"
      label="List of Quotations"
      parent-class="!z-[1500]"
      @update:is-open="isOpenModal.quotations = $event"
    >
      <template #top>
        <form
          class="grid grid-cols-5 w-full flex-row items-center gap-2"
          @submit.prevent="salesOrderStore.fetchModalFilter()"
        >
          <d-select-table
            api="/v1/customers/index-customer"
            detail-api="/v1/customers/index-customer"
            method-api="post"
            detail-method-api="post"
            mapping-detail="data[0]"
            total-prop="meta.total"
            label="Customer"
            v-model="form.customer_id"
            class=""
            is-quick-select
            @click:selected="
              (data) => salesOrderStore.autocompleteCustomer(data)
            "
            modal-parent-class="!z-[2500]"
            modal-custom-class="!w-4/5"
            :fields="headersCustomer"
            :filters="filtersCustomer"
          />
          <d-select-table
            api="/v1/products/index-product"
            detail-api="/v1/products/index-product"
            method-api="post"
            detail-method-api="post"
            mapping-detail="data[0]"
            total-prop="meta.total"
            label="Product"
            v-model="queryModal.qIndexQuotations.product_id"
            class=""
            is-quick-select
            modal-parent-class="!z-[2500]"
            modal-custom-class="!w-4/5"
            :fields="useInitials.productFieldsFilterConfig.fields"
            :filters="useInitials.productFieldsFilterConfig.filters"
          />
          <d-autocomplete
            v-for="filter in filtersOptionsQuotations"
            :key="filter.key"
            v-model="queryModal.qIndexQuotations[filter.key as ModalIndexQuotationFilterAutoCompleteType]"
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
            v-for="filter in filtersTextQuotations"
            :key="filter.key"
            v-model="queryModal.qIndexQuotations[filter.key as ModalIndexQuotationFilterTextType]"
            :label="filter.title"
            :placeholder="filter.title"
            append-inner-icon="mdi-magnify"
          />

          <d-submit-button
            @click:submit="salesOrderStore.fetchModalFilter()"
            @click:clear="salesOrderStore.handleClearQuery()"
            class="grid-cols-1"
          />
        </form>
      </template>

      <v-data-table-server
        v-model="itemsCheck.checkQuotations"
        v-model:page="queryModal.qIndexQuotations.page"
        :items="metaModal.indexQuotations.data ?? []"
        :headers="headersModalQuotations"
        :items-per-page="queryModal.qIndexQuotations.per_page"
        :items-length="metaModal.indexQuotations.meta.total ?? 0"
        :items-per-page-options="useInitials.perPageOptions"
        :loading="metaModal.indexQuotations.loading"
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
        @update:options="(data:any) => salesOrderStore.fetchDataServerFetch(data)"
        fixed-header
        height="450"
        hover
      >
        <template #item.item_type="{ item }">
          <span class="capitalize"
            >{{ item.item_type ?? defineItemTypeSalesOrder(item as QuoDtType) }}
          </span>
        </template>
        <template #item.qty="{ item }">
          <d-num-layout :value="item.qty" />
        </template>
        <template #item.price_sell="{ item }">
          <d-num-layout :value="item.price_sell" />
        </template>
        <template #item.subtotal_sell="{ item }">
          <d-num-layout :value="item.subtotal_sell" />
        </template>
        <template #item.disc_perc="{ item }">
          <d-num-layout :value="item.disc_perc" />
        </template>
        <template #item.disc_am="{ item }">
          <d-num-layout :value="item.disc_am" />
        </template>
        <template #item.vat_perc="{ item }">
          <d-num-layout :value="item.vat_perc" />
        </template>
        <template #item.total_am="{ item }">
          <d-num-layout :value="item.total_am" />
        </template>
        <template #item.status="{ item }">
          <d-active-status :value="item.status" />
        </template>
        <template #item.expand="{ toggleExpand, isExpanded, internalItem }">
          <button
            v-if="
              !!internalItem.raw.quo_dts_boms &&
              internalItem.raw.quo_dts_boms.length > 0
            "
            class="cursor-pointer"
            @click="toggleExpand(internalItem)"
            @submit.prevent
          >
            <v-icon
              icon="mdi-chevron-down"
              class="transition-transform"
              :class="isExpanded(internalItem) ? 'rotate-180' : 'rotate-0'"
            />
          </button>
        </template>
        <template
          #expanded-row="{
            columns,
            item,
            internalItem,
            index
          }: {
            columns: any
            item: any
            internalItem: any
            index: number
          }"
        >
          <tr v-if="!!item.so_dts_boms && item.so_dts_boms.length > 0">
            <td :colspan="columns.length" class="!p-0">
              <div class="">
                <v-data-table-virtual
                  :headers="headersBOMModal"
                  :items="(item.so_dts_boms as SoDtBomType[]) || []"
                  item-value="uid"
                  density="compact"
                  return-object
                  fixed-header
                  class="table-hover"
                  :height="item.so_dts_boms.length > 1 ? '170' : '100'"
                  :header-props="{
                    class: '!bg-grey1 dark:!bg-dark2 whitespace-nowrap',
                  }"
                  :row-props="{
                    class: 'whitespace-nowrap',
                  }"
                >
                  <template #item.qty="{ item }">
                    <d-num-layout :value="item.qty" />
                  </template>
                  <template #item.price_buy="{ item }">
                    <d-num-layout :value="item.price_buy" />
                  </template>
                  <template #item.subtotal_buy="{ item }">
                    <d-num-layout :value="item.subtotal_buy" />
                  </template>
                </v-data-table-virtual>
              </div>
            </td>
          </tr>
          <tr v-else-if="!!item.quo_dts_boms && item.quo_dts_boms.length > 0">
            <td :colspan="columns.length" class="!p-0">
              <div class="">
                <v-data-table-virtual
                  :headers="headersBOMModal"
                  :items="(item.quo_dts_boms as QuoDtBomType[]) || []"
                  item-value="uid"
                  density="compact"
                  return-object
                  fixed-header
                  class="table-hover"
                  :height="item.quo_dts_boms.length > 1 ? '170' : '100'"
                  :header-props="{
                    class: '!bg-grey1 dark:!bg-dark2 whitespace-nowrap',
                  }"
                  :row-props="{
                    class: 'whitespace-nowrap',
                  }"
                >
                  <!-- <template #item.qty="{ item }">
                    <d-num-v-format
                      v-model="item.qty"
                      :precision="{
                        min: 3,
                        max: 3,
                      }"
                      hide-currency-display
                      label=""
                      class=""
                      @update:modelValue="
                        salesOrderStore.calculatePrice(item, internalItem.raw);
                        calculateTotalAmountLocal();
                      "
                    />
                  </template> -->
                  <template #item.qty="{ item }">
                    <d-num-layout :value="item.qty" />
                  </template>
                  <template #item.price_buy="{ item }">
                    <d-num-layout :value="item.price_buy" />
                  </template>
                  <template #item.subtotal_buy="{ item }">
                    <d-num-layout :value="item.subtotal_buy" />
                  </template>
                </v-data-table-virtual>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table-server>

      <template #footer>
        <div class="flex h-max w-full justify-end">
          <button
            class="flex items-center gap-2 rounded-md bg-sc px-3 py-2 text-[15px] font-bold text-white shadow-md hover:shadow-xl"
            @click="salesOrderStore.onClickUpdateProductsModal()"
          >
            <Icon name="material-symbols:save-rounded" size="20" />
            Add Selected Quotation ({{ itemsCheck.checkQuotations.length }})
          </button>
        </div>
      </template>
    </modals-final-modal>

    <modals-final-modal
      :is-open="isOpenModal.boms"
      size="xl"
      custom-class="overflow-y-auto"
      parent-class="!z-[2499]"
      label="List of Boms"
      @update:is-open="isOpenModal.boms = $event"
    >
      <template #top>
        <form
          class="grid grid-cols-5 w-full flex-row items-center gap-2"
          @submit.prevent="salesOrderStore.fetchModalFilter()"
        >
          <d-autocomplete
            v-for="filter in filtersOptionsProducts"
            :key="filter.key"
            v-model="queryModal.qIndexBoms[filter.key as ModalIndexProductFilterAutoCompleteType]"
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
            v-for="filter in filtersTextProducts"
            :key="filter.key"
            v-model="queryModal.qIndexBoms[filter.key as ModalIndexProductFilterTextType]"
            :label="filter.title"
            :placeholder="filter.title"
            append-inner-icon="mdi-magnify"
          />

          <d-submit-button
            @click:submit="salesOrderStore.fetchModalFilter()"
            @click:clear="salesOrderStore.handleClearQuery()"
            class="grid-cols-1"
          />
        </form>
      </template>

      <v-data-table-server
        v-model="itemsCheck.checkBoms"
        v-model:page="queryModal.qIndexBoms.page"
        :items="metaModal.indexBoms.data ?? []"
        :headers="headersModalProducts"
        :items-per-page="queryModal.qIndexBoms.per_page"
        :items-length="metaModal.indexBoms.meta.total ?? 0"
        :items-per-page-options="useInitials.perPageOptions"
        :loading="metaModal.indexBoms.loading"
        density="compact"
        :header-props="{
          class: '!bg-scLightest dark:!bg-dark2 whitespace-nowrap',
        }"
        :row-props="{
          class: 'cursor-pointer',
        }"
        item-value="ref_id"
        show-current-page
        return-object
        multiple
        show-select
        @update:options="(data:any) => salesOrderStore.fetchDataServerFetch(data)"
        fixed-header
        height="450"
        hover
      >
        <template #item.item_type="{ item }">
          <span class="capitalize"
            >{{ defineItemTypeSalesOrder(item as SoDtType) }}
          </span>
        </template>
        <template #item.price_sell="{ item }">
          <d-num-layout :value="item.price_sell" />
        </template>
        <template #item.price_buy="{ item }">
          <d-num-layout :value="item.price_buy" />
        </template>
        <template #item.status="{ item }">
          <d-active-status :value="item.status" />
        </template>
      </v-data-table-server>

      <template #footer>
        <div class="flex h-max w-full justify-end">
          <button
            class="flex items-center gap-2 rounded-md bg-sc px-3 py-2 text-[15px] font-bold text-white shadow-md hover:shadow-xl"
            @click="salesOrderStore.onClickUpdateBomsModal()"
          >
            <Icon name="material-symbols:save-rounded" size="20" />
            Add Selected Boms ({{ itemsCheck.checkBoms.length }})
          </button>
        </div>
      </template>
    </modals-final-modal>
  </div>
</template>