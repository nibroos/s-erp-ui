<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useInventoryStore from "~/stores/inventories/InventoryStore";
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
  FormInvDtProductListType,
  ModalIndexProductFilterAutoCompleteType,
  ModalIndexProductFilterTextType,
  ModalIndexSalesOrderFilterAutoCompleteType,
  ModalIndexSalesOrderFilterTextType,
  InvDtDiscType,
  InvDtType,
  VatModeType,
  ModalIndexRefFilterDateType,
} from "~/types/inventories/InventoryType";
import { updateInvRefsModalFromMain } from "~/composables/maps/inventoryComp";
import type {
  FormSoDtBomListType,
  SoDtType,
} from "~/types/sales-orders/SalesOrderType";
import type { ProductBomListType } from "~/types/masters/ProductType";
import { debounce } from "lodash-es";
import useAuthStore from "~/stores/AuthStore";

const layoutStore = useLayoutsStore();
const { topTitle } = storeToRefs(layoutStore);

const inventoryStore = useInventoryStore();
const {
  tabFormIndex,
  form,
  errors,
  itemsCheck,
  isOpenModal,
  queryModal,
  metaModal,
  optionRefBtnRefOut,
  openedModal,
  formLayout: formLayoutStore,
} = storeToRefs(inventoryStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Edit Inventory OUT",
});

const headers = ref<FieldSelectableType[]>([
  // { key: "ref_type", title: "Ref Type", sortable: true },
  { title: "", key: "expand", width: 20, sortable: false },
  // {
  //   key: "ref_type",
  //   title: "Ref Type",
  //   sortable: true,

  //   cellProps: {
  //     class: "capitalize",
  //   },
  // },
  { key: "ref_num", title: "Ref Num", sortable: true },
  { key: "item_code", title: "Item Code", sortable: true },
  { key: "item_name", title: "Item Name", sortable: true },
  { key: "unit_name", title: "Unit", sortable: true },
  {
    key: "expired_at",
    title: "Expired Date",
    sortable: true,
    cellProps: {
      class: "w-[15rem]",
    },
  },
  { key: "price_sell", title: "Price Sell", sortable: true, align: "end" },
  { key: "qty_out", title: "Qty Out", sortable: true, align: "end" },
  { key: "ref_qty", title: "Ref Qty", sortable: true, align: "end" },
  {
    key: "qty",
    title: "Qty",
    sortable: true,
    align: "end",
    cellProps: {
      class: "w-[12rem]",
    },
  },
  { key: "subtotal_sell", title: "Total Amount", sortable: true, align: "end" },
  {
    key: "remark",
    title: "Remark",
    sortable: true,
    cellProps: {
      class: "w-[12rem]",
    },
  },
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

const headersModalSalesOrders = ref<FieldSelectableType[]>([
  { title: "", key: "expand", width: 20, sortable: false },
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
    title: "Out Qty",
    key: "qty_out",
    value: "qty_out",
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

const headersModalInventory = ref<FieldSelectableType[]>([
  { title: "", key: "expand", width: 20, sortable: false },
  {
    title: "Surat Jalan No",
    key: "surat_jalan_no",
    value: "surat_jalan_no",
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
    title: "IN Date",
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
    title: "Supplier",
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
    title: "Out Qty",
    key: "out_qty",
    value: "out_qty",
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

const filtersTextInventories = ref([
  {
    title: "Inventory No",
    key: "inventory_no",
  },
  {
    title: "Surat Jalan No",
    key: "surat_jalan_no",
  },
  {
    title: "DO No",
    key: "do_no",
  },
  {
    title: "Invoice No",
    key: "invoice_no",
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

const formLayout = ref({
  title: "Basic Information",
  parentPath: "/inventories/out",
  currentTab: tabFormIndex.value,
  tabs: ["Items", "Remark"],
  mode: "edit",
  button: {
    create: {
      path: "/inventories/out/create",
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
  // permission: {
  //   name: ["c_ms"],
  //   isActive: true,
  // },
  // summary: formLayoutStore.value.summary,
} as FormLayoutType);

const initialFormLayout = () => {
  formLayout.value.currentTab = tabFormIndex.value;
  formLayout.value.mode = "edit";
  formLayout.value.button = {
    create: {
      path: "/inventories/out/create",
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
  // const validatedForm = formSchema.safeParse(form.value);

  // if (!validatedForm.success) {
  //   errors.value = {};
  //   console.log("log", validatedForm.error.errors);

  //   validatedForm.error.errors.map((ZodIssue) => {
  //     errors.value[ZodIssue.path[0]] = ZodIssue.message;
  //   });

  //   return;
  // }

  form.value.inv_dts = itemsCheck.value.checkMain;
  form.value.io_type = "INVENTORY_OUT";

  await inventoryStore.update();
};

const router = useRouter();
const id = ref(router.currentRoute.value.params.id);

const fetchInitialData = async () => {
  form.value.id = Number(id.value);
  // await inventoryStore.indexProduct();

  await Promise.all([await inventoryStore.show()]);
};

const calculateTotalAmountLocal = () => {
  inventoryStore.calculateTotalAmount();

  // if (formLayout.value.summary) {
  //   formLayout.value.summary.total_amount.value = form.value.subtotal;
  //   formLayout.value.summary.total_vat.value = form.value.total_vat;
  //   formLayout.value.summary.total_pph23.value = form.value.total_pph23;
  //   formLayout.value.summary.grand_total.value = form.value.grand_total;

  //   // TODO foreach currency symbol
  // }
};

watch(
  () => itemsCheck.value.checkSalesOrders,
  (newVal) => {
    if (newVal.length === 1) {
      inventoryStore.indexSalesOrder();
    } else if (newVal.length === 0) {
      inventoryStore.removeSalesOrder();
    }
  }
);

watch(
  () => isOpenModal.value.so,
  (oldVal, newVal) => {
    if (oldVal != newVal) {
      if (!oldVal) {
        itemsCheck.value.checkSalesOrders = [];
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
  inventoryStore.handleClickClear();
  form.value.io_type = "INVENTORY_OUT";
  await fetchInitialData();
  initialFormLayout();
});

watchEffect(() => {
  // changeTitle();
  topTitle.value = "Inventory OUT";
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <d-form-layout
      :config="formLayout"
      @click:save="handleSubmit()"
      @click:clear="inventoryStore.handleClickClear()"
      @update:current-tab="tabFormIndex = $event"
    >
      <template #header>
        <form
          :class="
            classMerge(
              'grid grid-cols-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-2',
              Object.keys(errors).length > 0 ? '!items-start' : '!items-center'
            )
          "
          @submit.prevent="handleSubmit"
        >
          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.inventory_no"
              :label="`Inventory Out No`"
              :placeholder="`Inventory Out No`"
              :errors="errors.inventory_no"
            />
          </div>
          <div class="sm:col-span-1">
            <d-date-picker-light
              v-model="form.ingoing_at"
              label="OUT Date"
            ></d-date-picker-light>
          </div>
          <div class="sm:col-span-1">
            <d-autocomplete
              v-model="form.io_type_id"
              api="/v1/io-types/index-io-type"
              single-api="/v1/io-types/show-io-type"
              page-end-prop="meta.next_page_url"
              item-title="name"
              item-value="id"
              method-api="post"
              inner-search-key="global"
              label="OUT Type"
              :query="{
                io_type: 'INVENTORY_OUT',
              }"
              :errors="errors.io_type_id"
            ></d-autocomplete>
          </div>
          <div class="sm:col-span-1">
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
                (data) => inventoryStore.autocompleteCustomer(data)
              "
              modal-parent-class="!z-[2500]"
              modal-custom-class="!w-4/5"
              :fields="headersCustomer"
              :filters="filtersCustomer"
            />
          </div>
          <div class="sm:col-span-1 col-span-2">
            <d-text-input
              v-model="form.ship_dest"
              :label="`Shipping Address`"
              :placeholder="`Shipping Address`"
              :errors="errors.ship_dest"
            />
          </div>

          <div class="sm:col-span-1">
            <d-autocomplete-client
              v-model="form.status"
              :items="useStatics.formStatusInventory"
              label="Status"
              item-value="id"
              item-title="name"
              :clearable="false"
            />
          </div>
          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.surat_jalan_no"
              :label="`Surat Jalan No.`"
              :placeholder="`Surat Jalan No.`"
              :errors="errors.surat_jalan_no"
            />
          </div>
          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.invoice_no"
              :label="`Invoice No`"
              :placeholder="`Invoice No`"
              :errors="errors.invoice_no"
            />
          </div>
          <div class="sm:col-span-1">
            <d-date-picker-light
              v-model="form.invoice_at"
              label="Invoice Date"
            ></d-date-picker-light>
          </div>
          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.do_no"
              :label="`DO No`"
              :placeholder="`DO No`"
              :errors="errors.do_no"
            />
          </div>
          <div class="sm:col-span-1">
            <d-date-picker-light
              v-model="form.do_at"
              label="DO Date"
            ></d-date-picker-light>
          </div>
          <div class="sm:col-span-1">
            <d-autocomplete
              v-model="form.warehouse_id"
              :initial-value="useAuthStore().authUser.data?.warehouse_id"
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
                (data: FormCurrencyType) => inventoryStore.autocompleteCurrency(data)
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
                  inventoryStore.autocompletePph(data);
                  calculateTotalAmountLocal();
                }
              "
            ></d-autocomplete>
          </div>

          <div class="sm:col-span-1">
            <d-switch-status
              v-model="form.is_vat"
              :label="`VAT`"
              @update:modelValue="
                (data) => inventoryStore.onClickSwitchVAT(data)
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
              :query="{
                date_at: form.ingoing_at,
                order_column: 'date_at',
                order_direction: 'desc',
              }"
              :errors="errors.vat_id"
              @after:fetch="
                (data) => {
                  if (form.is_vat) {
                    form.vat_id = data[0].id;
                  } else {
                    form.vat_id = null;
                  }

                  // quotationStore.referenceOptions.vats = data;
                }
              "
              @click:selected="
                (data) => {
                  inventoryStore.autocompleteVat(data);
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
          v-if="tabFormIndex == useStatics.formTabInventory.items"
          class="grid grid-cols-3 sm:grid-cols-1 gap-2"
        >
          <d-option-ref-btn
            :refs="optionRefBtnRefOut"
            class="col-span-2"
            @click:ref="
              (ref) => inventoryStore.onClickOpenModalOptionRefBtn(ref)
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
                inventoryStore.clickClearRefs();
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
            <template #item.expired_at="{ item }">
              <div class="!w-full">
                <d-date-picker-light
                  v-model="item.expired_at"
                  label=""
                  placeholder="Expired Date"
                  dp-class="!w-full"
                ></d-date-picker-light>
              </div>
            </template>
            <template #item.item_type="{ item }">
              <span class="capitalize">{{ item.item_type }} </span>
            </template>
            <template #item.remark="{ item }">
              <d-text-area-input
                v-model="item.remark"
                :label="``"
                :placeholder="`Remark`"
                class="w-full"
              />
            </template>
            <template #item.price_sell="{ item }">
              <!-- <div class="flex w-full gap-2 grow">
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
              </div> -->
              <d-num-layout :value="item.price_sell" />
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
                @update:modelValue="calculateTotalAmountLocal"
              />
            </template>

            <template #item.subtotal_sell="{ item }">
              <d-num-layout :value="item.qty * item.price_sell" />
            </template>
            <template #item.qty_out="{ item }">
              <d-num-layout :value="item.qty_out ?? 0" />
            </template>
            <template #item.ref_qty="{ item }">
              <d-num-layout :value="item.ref_qty ?? 0" />
            </template>
            <template #item.action="{ item, index }">
              <div class="action-button flex gap-2">
                <d-bt
                  @click="
                    () => {
                      inventoryStore.onClickDeleteSelected(item, index);
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
                  @click:selected="
                    (data) => {
                      inventoryStore.autocompleteVat(data);
                      calculateTotalAmountLocal();
                    }
                  "
                ></d-autocomplete>
              </div>
              <div class="sm:col-span-1 hidden">
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
                      inventoryStore.autocompletePph(data);
                      calculateTotalAmountLocal();
                    }
                  "
                ></d-autocomplete>
              </div>
            </template>
          </v-data-table-virtual>
        </div>
        <div v-if="tabFormIndex == useStatics.formTabInventory.remarks">
          <div class="sm:col-span-1">
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
          @submit.prevent="inventoryStore.fetchModalFilter()"
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
            @click:submit="inventoryStore.fetchModalFilter()"
            @click:clear="inventoryStore.handleClearQuery()"
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
        @update:options="(data:any) => inventoryStore.fetchDataServerFetch(data)"
        fixed-header
        height="450"
        hover
      >
        <template #item.item_type="{ item }">
          <span class="capitalize"
            >{{ defineItemTypeInventory(item as InvDtType) }}
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
      </v-data-table-server>

      <template #footer>
        <div class="flex h-max w-full justify-end">
          <button
            class="flex items-center gap-2 rounded-md bg-sc px-3 py-2 text-[15px] font-bold text-white shadow-md hover:shadow-xl"
            @click="inventoryStore.onClickUpdateProductsModal()"
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
      <template #top>
        <form
          class="grid grid-cols-5 w-full flex-row items-center gap-2"
          @submit.prevent="inventoryStore.fetchModalFilter()"
        >
          <d-autocomplete-client
            v-model="queryModal.qIndexSalesOrders.date_type"
            :items="useStatics.SoIndexDateType"
            label="Date Type"
            item-value="value"
            item-title="title"
            :clearable="false"
          />
          <d-date-picker-light
            v-for="filter in filtersDateInventories"
            :key="filter.key"
            v-model="queryModal.qIndexSalesOrders[filter.key as ModalIndexRefFilterDateType]"
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
            class=""
            is-quick-select
            @click:selected="
              (data) => inventoryStore.autocompleteCustomer(data)
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
            v-model="queryModal.qIndexSalesOrders.product_id"
            class=""
            is-quick-select
            modal-parent-class="!z-[2500]"
            modal-custom-class="!w-4/5"
            :fields="useInitials.productFieldsFilterConfig.fields"
            :filters="useInitials.productFieldsFilterConfig.filters"
          />
          <d-autocomplete
            v-for="filter in filtersOptionsSalesOrders"
            :key="filter.key"
            v-model="queryModal.qIndexSalesOrders[filter.key as ModalIndexSalesOrderFilterAutoCompleteType]"
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
            v-model="queryModal.qIndexSalesOrders[filter.key as ModalIndexSalesOrderFilterTextType]"
            :label="filter.title"
            :placeholder="filter.title"
            append-inner-icon="mdi-magnify"
          />

          <d-submit-button
            @click:submit="inventoryStore.fetchModalFilter()"
            @click:clear="inventoryStore.handleClearQuery()"
            class="grid-cols-1"
          />
        </form>
      </template>

      <v-data-table-server
        v-model="itemsCheck.checkSalesOrders"
        v-model:page="queryModal.qIndexSalesOrders.page"
        :items="metaModal.indexSalesOrders.data ?? []"
        :headers="headersModalSalesOrders"
        :items-per-page="queryModal.qIndexSalesOrders.per_page"
        :items-length="metaModal.indexSalesOrders.meta.total ?? 0"
        :items-per-page-options="useInitials.perPageOptions"
        :loading="metaModal.indexSalesOrders.loading"
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
        @update:options="(data:any) => inventoryStore.fetchDataServerFetch(data)"
        fixed-header
        height="450"
        hover
      >
        <template #item.item_type="{ item }">
          <span class="capitalize"
            >{{ item.item_type ?? defineItemTypeInventory(item as InvDtType) }}
          </span>
        </template>
        <template #item.ref_qty="{ item }">
          <d-num-layout :value="item.ref_qty" />
        </template>
        <template #item.qty_out="{ item }">
          <d-num-layout :value="item.qty_out" />
        </template>
        <template #item.balance="{ item }">
          <d-num-layout :value="item.balance" />
        </template>
        <template #item.status="{ item }">
          <d-active-status :value="item.status" />
        </template>
      </v-data-table-server>

      <template #footer>
        <div class="flex h-max w-full justify-end">
          <button
            class="flex items-center gap-2 rounded-md bg-sc px-3 py-2 text-[15px] font-bold text-white shadow-md hover:shadow-xl"
            @click="inventoryStore.onClickUpdateProductsModal()"
          >
            <Icon name="material-symbols:save-rounded" size="20" />
            Add Selected Sales Order ({{ itemsCheck.checkSalesOrders.length }})
          </button>
        </div>
      </template>
    </modals-final-modal>
    <modals-final-modal
      :is-open="isOpenModal.inv_in"
      size="xl"
      custom-class="overflow-y-auto"
      label="List of Inventory IN"
      parent-class="!z-[1500]"
      @update:is-open="isOpenModal.inv_in = $event"
    >
      <template #top>
        <form
          class="grid grid-cols-5 w-full flex-row items-center gap-2"
          @submit.prevent="inventoryStore.fetchModalFilter()"
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
              (data) => inventoryStore.autocompleteCustomer(data)
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
            v-model="queryModal.qIndexSalesOrders.product_id"
            class=""
            is-quick-select
            modal-parent-class="!z-[2500]"
            modal-custom-class="!w-4/5"
            :fields="useInitials.productFieldsFilterConfig.fields"
            :filters="useInitials.productFieldsFilterConfig.filters"
          />
          <d-autocomplete
            v-for="filter in filtersOptionsSalesOrders"
            :key="filter.key"
            v-model="queryModal.qIndexSalesOrders[filter.key as ModalIndexSalesOrderFilterAutoCompleteType]"
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
            v-model="queryModal.qIndexSalesOrders[filter.key as ModalIndexSalesOrderFilterTextType]"
            :label="filter.title"
            :placeholder="filter.title"
            append-inner-icon="mdi-magnify"
          />

          <d-submit-button
            @click:submit="inventoryStore.fetchModalFilter()"
            @click:clear="inventoryStore.handleClearQuery()"
            class="grid-cols-1"
          />
        </form>
      </template>

      <v-data-table-server
        v-model="itemsCheck.checkInventoryIns"
        v-model:page="queryModal.qIndexInventoryIns.page"
        :items="metaModal.indexInventoryIns.data ?? []"
        :headers="headersModalInventory"
        :items-per-page="queryModal.qIndexInventoryIns.per_page"
        :items-length="metaModal.indexInventoryIns.meta.total ?? 0"
        :items-per-page-options="useInitials.perPageOptions"
        :loading="metaModal.indexInventoryIns.loading"
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
        @update:options="(data:any) => inventoryStore.fetchDataServerFetch(data)"
        fixed-header
        height="450"
        hover
      >
        <template #item.item_type="{ item }">
          <span class="capitalize"
            >{{ item.item_type ?? defineItemTypeInventory(item as InvDtType) }}
          </span>
        </template>
        <template #item.ref_qty="{ item }">
          <d-num-layout :value="item.ref_qty" />
        </template>
        <template #item.qty="{ item }">
          <d-num-layout :value="item.qty" />
        </template>
        <template #item.status="{ item }">
          <d-active-status :value="item.status" />
        </template>
      </v-data-table-server>

      <template #footer>
        <div class="flex h-max w-full justify-end">
          <button
            class="flex items-center gap-2 rounded-md bg-sc px-3 py-2 text-[15px] font-bold text-white shadow-md hover:shadow-xl"
            @click="inventoryStore.onClickUpdateProductsModal()"
          >
            <Icon name="material-symbols:save-rounded" size="20" />
            Add Selected Inventory IN ({{
              itemsCheck.checkInventoryIns.length
            }})
          </button>
        </div>
      </template>
    </modals-final-modal>
  </div>
</template>