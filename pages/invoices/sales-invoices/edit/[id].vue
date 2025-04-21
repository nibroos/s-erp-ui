<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useSalesInvoiceStore from "~/stores/invoices/SalesInvoiceStore";
import type { FormLayoutType } from "~/types/FormLayoutType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";
import type { FormPph23Type } from "~/types/masters/Pph23Type";
import type { FormCurrencyType } from "~/types/masters/CurrencyType";
import type { SummaryPartType } from "~/components/d/SummaryLayout.vue";
import { debounce } from "lodash-es";

const layoutStore = useLayoutsStore();
const { topTitle } = storeToRefs(layoutStore);

const salesInvoiceStore = useSalesInvoiceStore();
const { tabFormIndex, form, errors, isOpenModal, queryModal, metaModal } =
  storeToRefs(salesInvoiceStore);

const route = useRoute();
const id = route.params.id;

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Edit Sales Invoice",
});

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

const headersSelectedItems = ref([
  { title: "", key: "expand", width: 20, sortable: false },
  { title: "Ref Type", key: "ref_type", sortable: true },
  { title: "Ref Number", key: "ref_num", sortable: true },
  { title: "Item Type", key: "product_type", sortable: true },
  { title: "Product Code", key: "product_code", sortable: true },
  { title: "Product Name", key: "product_name", sortable: true },
  { title: "Unit", key: "unit_name", sortable: true },
  { title: "Price", key: "price", align: "end", sortable: true },
  { title: "Qty", key: "qty", align: "end", sortable: false },
  { title: "Discount", key: "discount", align: "end", sortable: true },
  { title: "Sub Amount", key: "total_amount", align: "end", sortable: true },
  { title: "DP Amount", key: "total_dp", align: "end", sortable: true },
  { title: "Balance Amount", key: "total_balance", align: "end", sortable: true },
  { title: "Remark", key: "remark", sortable: true },
  { title: "Actions", key: "actions", sortable: false, align: "center" },
]);

const headersSalesOrder = ref([
  { title: "", key: "expand", width: 20, sortable: false },
  { title: "Sales Order No", key: "sales_order_no", sortable: true },
  { title: "Buyer PO No", key: "po_buyer_no", sortable: true },
  { title: "Customer", key: "customer_name", sortable: true },
  { title: "Order Date", key: "order_date", sortable: true },
  { title: "Shipping Date", key: "shipping_date", sortable: true },
  { title: "Item Type", key: "item_type", sortable: true },
  { title: "Unit", key: "unit_name", sortable: true },
  { title: "Product Code", key: "item_code", sortable: true },
  { title: "Product Name", key: "item_name", sortable: true },
  { title: "Price", key: "price_sell", align: "end", sortable: true },
  { title: "Qty", key: "qty", align: "end", sortable: true },
  { title: "Discount", key: "discount", align: "end", sortable: true },
  { title: "DP Amount", key: "total_dp", align: "end", sortable: true },
  { title: "Balance Amount", key: "total_balance", align: "end", sortable: true },
  { title: "Remark", key: "remark", sortable: true },
]);

const headersBom = ref([
  { title: "Product Code", key: "item_code", sortable: true },
  { title: "Product Name", key: "item_name", sortable: true },
  { title: "Unit", key: "unit_name", sortable: true },
  { title: "Qty", key: "qty", sortable: true, align: "end" },
  { title: "Remark", key: "remark", sortable: true },
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

const customSummary = ref({
  total_balance: {
    label: "Total Balance",
    symbol: "",
    value: 0,
    format: {
      precision: 2,
    },
  } as SummaryPartType,
  total_discount: {
    label: "Discount",
    symbol: "",
    value: 0,
    format: {
      precision: 2,
    },
  } as SummaryPartType,
  total_vat: {
    label: "Total VAT",
    symbol: "",
    value: 0,
    format: {
      precision: 2,
    },
  } as SummaryPartType,
  total_pph23: {
    label: "Total PPH23",
    symbol: "",
    value: 0,
    format: {
      precision: 2,
    },
  } as SummaryPartType,
  grand_total: {
    label: "Grand Total",
    symbol: "",
    value: 0,
    format: {
      precision: 2,
    },
  } as SummaryPartType,
});

const nextSalesInvoice = ref<number | null>(null);
const fieldsConfig = ref<FieldSelectableType[]>([
  {
    title: "Invoice No",
    key: "invoice_no",
    value: "invoice_no",
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
    title: "Invoice Date",
    key: "invoice_date",
    value: "invoice_date",
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
    title: "Discount",
    key: "total_discount",
    value: "total_discount",
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
      api: "/v1/customers/index-customer",
      singleApi: "/v1/customers/index-customer",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Customers",
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
      items: [
        { id: "invoice_date", name: "Invoice Date" },
        { id: "created_at", name: "Created Date" },
      ],
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
    title: "Currency",
    key: "currency_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      api: "/v1/currencies/index-currency",
      singleApi: "/v1/currencies/index-currency",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Currencies",
      innerSearchKey: "global",
      multiple: true,
      returnObject: false,
      itemColor: "brown-lighten-2",
    },
  },
  {
    title: "Status",
    key: "status",
    type: "autocomplete-client",
    others: {
      items: useStatics.formStatusSalesInvoice,
    },
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

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

const formLayout = ref({
  title: "Basic Information",
  parentPath: "/invoices/sales-invoices",
  currentTab: tabFormIndex.value,
  tabs: useStatics.formTabSalesInvoice
    ? Object.keys(useStatics.formTabSalesInvoice).map(
        (key) => key.charAt(0).toUpperCase() + key.slice(1)
      )
    : ["Items", "Remark"],
  mode: "edit",
  button: {
    create: {
      path: "/invoices/sales-invoices/create",
      show: true,
    },
    save: {
      show: true,
      loading: false,
      type: "submit",
      text: "Update"
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
  formLayout.value.button = {
    create: {
      path: "/invoices/sales-invoices/create",
      show: true,
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
  await salesInvoiceStore.update();
};

const onDiscountPercentageChange = (value: number) => {
  if (value > 0) {
    form.value.discount_amount = 0;
  }
  calculateTotalAmountLocal();
};

const onDiscountAmountChange = (value: number) => {
  if (value > 0) {
    form.value.discount_percentage = 0;
  }
  calculateTotalAmountLocal();
};

const calculateTotalAmountLocal = () => {
  const result = salesInvoiceStore.calculateTotalAmount();

  customSummary.value.total_balance.value = form.value.total_balance_products;
  customSummary.value.total_discount.value = form.value.discount_final;
  customSummary.value.total_vat.value = form.value.total_vat;
  customSummary.value.total_pph23.value = form.value.total_pph23;
  customSummary.value.grand_total.value = form.value.grand_total;

  if (salesInvoiceStore.currencySymbolLabel) {
    const symbol = salesInvoiceStore.currencySymbolLabel;
    customSummary.value.total_balance.symbol = symbol;
    customSummary.value.total_discount.symbol = symbol;
    customSummary.value.total_vat.symbol = symbol;
    customSummary.value.    total_pph23.symbol = symbol;
    customSummary.value.grand_total.symbol = symbol;
  }
};

onMounted(async () => {
  form.value.id = id;
  initialFormLayout();
  await salesInvoiceStore.fetchVatOptions();
  await salesInvoiceStore.show();

  salesInvoiceStore.updateRefsModal();

  if (form.value.is_vat) {
    await salesInvoiceStore.onClickSwitchVAT(true);
  }

  if (!queryModal.value.qIndexSalesOrders.so_no) {
    queryModal.value.qIndexSalesOrders.so_no = "";
  }
  if (!queryModal.value.qIndexSalesOrders.po_buyer_no) {
    queryModal.value.qIndexSalesOrders.po_buyer_no = "";
  }
  if (!queryModal.value.qIndexSalesOrders.product_code) {
    queryModal.value.qIndexSalesOrders.product_code = "";
  }
  if (!queryModal.value.qIndexSalesOrders.product_name) {
    queryModal.value.qIndexSalesOrders.product_name = "";
  }
  if (!queryModal.value.qIndexSalesOrders.global) {
    queryModal.value.qIndexSalesOrders.global = "";
  }
  if (!queryModal.value.qIndexSalesOrders.customer_id) {
    queryModal.value.qIndexSalesOrders.customer_id = null;
  }

  calculateTotalAmountLocal();
});

watchEffect(() => {
  topTitle.value = "Invoices";
});

watch(() => form.value.invoice_date, async (newDate) => {
  if (form.value.is_vat) {
    await salesInvoiceStore.onClickSwitchVAT(true);
    calculateTotalAmountLocal();
  }
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <d-form-layout
      :config="formLayout"
      @click:save="handleSubmit()"
      @click:clear="salesInvoiceStore.handleClickClear()"
      @update:current-tab="tabFormIndex = $event"
    >
      <template #title-append>
        <d-select-table
          api="/v1/sales-invoices/index-sales-invoice"
          detail-api="/v1/sales-invoices/index-sales-invoice"
          method-api="post"
          detail-method-api="post"
          mapping-detail="data[0]"
          total-prop="meta.total"
          cta="Go To Sales Invoice"
          v-model="nextSalesInvoice"
          class="col-span-2 lg:col-span-1"
          is-quick-select
          @click:selected="
            (data) => {
              if (!!data) {
                salesInvoiceStore.goToSalesInvoice(data.id);
              }
            }
          "
          modal-parent-class="!z-[2500]"
          modal-custom-class="!w-4/5"
          :fields="fieldsConfig"
          :filters="filtersConfig"
        />
      </template>
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
              v-model="form.invoice_no"
              :label="`Invoice Number`"
              :placeholder="`Invoice Number`"
              :errors="errors.invoice_no"
              disabled
            />
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
                (data) => salesInvoiceStore.autocompleteCustomer(data)
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
            <d-date-picker-light
              v-model="form.invoice_date"
              label="Invoice Date"
            ></d-date-picker-light>
          </div>

          <div class="lg:col-span-6">
            <d-autocomplete-client
              v-model="form.status"
              :items="useStatics.formStatusSalesInvoice"
              label="Status"
              item-value="id"
              item-title="name"
              :clearable="false"
            />
          </div>

          <div class="lg:col-span-6">
            <d-autocomplete
              v-model="form.bank_id"
              api="/v1/company-profiles/index-bank-information"
              page-end-prop="meta.next_page_url"
              item-title="name"
              item-value="id"
              method-api="post"
              inner-search-key="global"
              label="Bank"
              :display-multiple-keys="['company_name', 'name', 'account_number']"
              :display-multiple-format="(item: any) => `${item.company_name} - ${item.name} (${item.account_number})`"
              is-display-multiple-key
              :errors="errors.bank_id"
              @click:selected="(data: any) => salesInvoiceStore.autocompleteBankInfo(data)"
            ></d-autocomplete>
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
                (data: FormCurrencyType) => {
                  salesInvoiceStore.autocompleteCurrency(data);
                  calculateTotalAmountLocal();
                }
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
              @update:modelValue="calculateTotalAmountLocal"
            />
          </div>

          <div class="lg:col-span-6">
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

          <div class="lg:col-span-6">
            <d-num-v-format
              v-model="form.discount_percentage"
              :precision="{
                min: 3,
                max: 3,
              }"
              hide-currency-display
              @update:modelValue="onDiscountPercentageChange"
              label="Discount (%)"
              :disabled="!!form.discount_amount && form.discount_amount > 0"
            />
          </div>
          
          <div class="lg:col-span-6">
            <d-num-v-format
              v-model="form.discount_amount"
              :precision="{
                min: 3,
                max: 3,
              }"
              hide-currency-display
              @update:modelValue="onDiscountAmountChange"
              label="Discount Amount"
              :disabled="!!form.discount_percentage && form.discount_percentage > 0"
            />
          </div>

          <div class="lg:col-span-6">
            <d-autocomplete
              v-model="form.pph23_id"
              api="/v1/pph23s/index-pph23"
              single-api="/v1/pph23s/show-pph23"
              page-end-prop="meta.next_page_url"
              item-title="name"
              item-value="id"
              method-api="post"
              inner-search-key="global"
              label="PPH23"
              :display-multiple-keys="['name', 'num']"
              is-display-multiple-key
              :errors="errors.pph23_id"
              @click:selected="
                (data: FormPph23Type) => {
                  salesInvoiceStore.autocompletePph(data);
                  calculateTotalAmountLocal();
                }
              "
              @click:clear="
                () => {
                  salesInvoiceStore.removePph();
                  calculateTotalAmountLocal();
                }
              "
            ></d-autocomplete>
          </div>

          <div class="lg:col-span-6 flex gap-2">
            <d-switch-status
              v-model="form.is_vat"
              :label="`VAT`"
              @update:model-value="
                async (value) => {
                  await salesInvoiceStore.onClickSwitchVAT(value);
                  calculateTotalAmountLocal();
                }
              "
            />
          </div>

          <d-bt type="submit" class="!hidden"></d-bt>
        </form>
      </template>
      <template #content>
        <div v-if="tabFormIndex == useStatics.formTabSalesInvoice.items">
          <div class="grid grid-cols-3 sm:grid-cols-1 gap-2">
            <d-option-ref-btn
              :refs="salesInvoiceStore.optionRefBtnRef"
              class="col-span-2"
              @click:ref="
                (ref) => salesInvoiceStore.onClickOpenModalOptionRefBtn(ref)
              "
            ></d-option-ref-btn>

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
                  salesInvoiceStore.clickClearRefs();
                  calculateTotalAmountLocal();
                }
              "
            />
          
          </div>

          <div class="mt-2">
            <v-data-table-virtual
              :items="salesInvoiceStore.itemsCheck.checkMain ?? []"
              :headers="headersSelectedItems"
              item-value="uid"
              density="compact"
              height="500"
              fixed-header
              class="col-span-3 sm:col-span-1 table-hover"
              :header-props="{
                class: '!bg-scLightest dark:!bg-scDarker whitespace-nowrap py-3',
              }"
              :row-props="{
                class: 'whitespace-nowrap',
              }"
            >
              <template #item.expand="{ toggleExpand, isExpanded, internalItem }">
                <button
                  v-if="(internalItem.raw.product_type === 'product' || internalItem.raw.item_type === 'product') && 
                        ((internalItem.raw.sales_invoice_dt_boms && internalItem.raw.sales_invoice_dt_boms.length > 0) || 
                        (internalItem.raw.so_dts_boms && internalItem.raw.so_dts_boms.length > 0))"
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

              <template #item.ref_type="{ item }">
                <span class="uppercase">{{ item.ref_type }}</span>
              </template>
              
              <template #item.product_type="{ item }">
                <span class="capitalize">{{ item.product_type }}</span>
              </template>
              
              <template #item.price="{ item }">
                <d-num-layout :value="item.price" />
              </template>
              
              <template #item.qty="{ item }">
                <d-num-v-format
                  v-model="item.qty"
                  :precision="{
                    min: 3,
                    max: 3,
                  }"
                  hide-currency-display
                  @update:modelValue="() => {
                    salesInvoiceStore.calculateTotalAmount();
                    calculateTotalAmountLocal();
                  }"
                  class="w-20"
                />
              </template>
              
              <template #item.discount="{ item }">
                <d-num-layout :value="item.discount || 0" />
              </template>
              
              <template #item.total_amount="{ item }">
                <d-num-layout :value="item.total_amount" />
              </template>
              <template #item.total_dp="{ item }">
                <d-num-layout :value="item.total_dp" />
              </template>
              
              <template #item.total_balance="{ item }">
                <d-num-layout :value="item.total_balance" />
              </template>
              
              <template #item.actions="{ item, index }">
                <button
                  class="text-red-500 hover:text-red-700"
                  @click="salesInvoiceStore.onClickDeleteSelected(item, index); calculateTotalAmountLocal();"
                >
                  <v-icon icon="mdi-delete" />
                </button>
              </template>
              
              <template #expanded-row="{ columns, item }">
                <tr v-if="(item.sales_invoice_dt_boms && item.sales_invoice_dt_boms.length > 0) || 
                          (item.so_dts_boms && item.so_dts_boms.length > 0)">
                  <td :colspan="columns.length" class="!p-0">
                    <div>
                      <v-data-table-virtual
                        :headers="headersBom"
                        :items="item.sales_invoice_dt_boms || item.so_dts_boms || []"
                        item-value="uid"
                        density="compact"
                        return-object
                        fixed-header
                        class="table-hover"
                        :height="(item.sales_invoice_dt_boms?.length || item.so_dts_boms?.length || 0) > 1 ? '170' : '100'"
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
                      </v-data-table-virtual>
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table-virtual>
          </div>
          
        </div>
        <div v-else-if="tabFormIndex == useStatics.formTabSalesInvoice.remarks">
          <div class="lg:col-span-6 mt-1">
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

    <!-- Sales Order Reference Modal -->
    <modals-final-modal
      :is-open="isOpenModal.salesOrders"
      size="xl"
      custom-class="overflow-y-auto"
      label="List of Sales Orders"
      parent-class="!z-[1500]"
      @update:is-open="isOpenModal.salesOrders = $event"
    >
      <template #top>
        <form
          class="grid grid-cols-5 w-full flex-row items-center gap-2"
          @submit.prevent="salesInvoiceStore.fetchModalFilter()"
        >
          <d-autocomplete
            v-model="queryModal.qIndexSalesOrders.customer_id"
            api="/v1/customers/index-customer"
            method-api="post"
            page-end-prop="meta.next_page_url"
            item-title="name"
            item-value="id"
            inner-search-key="global"
            label="Customer"
            placeholder="Select customer"
          />

          <d-autocomplete-client
            v-model="queryModal.qIndexSalesOrders.item_type"
            :items="[
              { id: 'product', name: 'Product' },
              { id: 'item', name: 'Item' },
            ]"
            label="Item Type"
            item-value="id"
            item-title="name"
          />

          <d-text-input
            v-model="queryModal.qIndexSalesOrders.so_no"
            label="Sales Order No"
            placeholder="Search by SO No"
            append-inner-icon="mdi-magnify"
          />

          <d-text-input
            v-model="queryModal.qIndexSalesOrders.po_buyer_no"
            label="Buyer PO No"
            placeholder="Search by PO No"
            append-inner-icon="mdi-magnify"
          />

          <d-text-input
            v-model="queryModal.qIndexSalesOrders.product_code"
            label="Product Code"
            placeholder="Search by Product Code"
            append-inner-icon="mdi-magnify"
          />

          <d-text-input
            v-model="queryModal.qIndexSalesOrders.product_name"
            label="Product Name"
            placeholder="Search by Product Name"
            append-inner-icon="mdi-magnify"
          />

          <d-text-input
            v-model="queryModal.qIndexSalesOrders.global"
            label="Global Search"
            placeholder="Search global"
            append-inner-icon="mdi-magnify"
          />

          <d-submit-button
            @click:submit="salesInvoiceStore.fetchModalFilter()"
            @click:clear="salesInvoiceStore.handleClearQuery()"
            class="grid-cols-1"
          />
        </form>
      </template>

      <v-data-table-server
        v-model="salesInvoiceStore.itemsCheck.checkSalesOrders"
        v-model:page="queryModal.qIndexSalesOrders.page"
        :items="metaModal.indexSalesOrders.data ?? []"
        :headers="headersSalesOrder"
        :items-per-page="queryModal.qIndexSalesOrders.per_page"
        :items-length="metaModal.indexSalesOrders.meta.total ?? 0"
        :items-per-page-options="[10, 25, 50, 100]"
        :loading="metaModal.indexSalesOrders.loading"
        density="compact"
        :header-props="{
          class: '!bg-scLightest dark:!bg-dark2 whitespace-nowrap',
        }"
        :row-props="{
          class: 'cursor-pointer',
        }"
        item-value="ref_dt_id"
        show-current-page
        return-object
        multiple
        show-select
        @update:options="(data:any) => salesInvoiceStore.fetchDataServerFetch(data)"
        fixed-header
        height="450"
        hover
      >
        <template #item.item_type="{ item }">
          <span class="capitalize">{{ item.item_type }}</span>
        </template>
        <template #item.order_date="{ item }">
          {{ formatDate(item.order_date) }}
        </template>
        <template #item.shipping_date="{ item }">
          {{ formatDate(item.shipping_date) }}
        </template>
        <template #item.price_sell="{ item }">
          <d-num-layout :value="item.price_sell" />
        </template>
        <template #item.qty="{ item }">
          <d-num-layout :value="item.qty" />
        </template>
        <template #item.discount="{ item }">
          <d-num-layout
            :value="item.disc_am > 0 ? item.disc_am : item.disc_perc_am"
          />
        </template>
        <template #item.total_dp="{ item }">
          <d-num-layout :value="item.total_dp || 0" />
        </template>
        <template #item.total_balance="{ item }">
          <d-num-layout :value="item.total_balance || 0" />
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
          <tr v-if="item.so_dts_boms && item.so_dts_boms.length > 0">
            <td :colspan="columns.length" class="!p-0">
              <div class="">
                <v-data-table-virtual
                  :headers="headersBom"
                  :items="item.so_dts_boms || []"
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
            @click="salesInvoiceStore.onClickUpdateProductsModal()"
          >
            <Icon name="material-symbols:save-rounded" size="20" />
            Add Selected Sales Orders ({{
              salesInvoiceStore.itemsCheck.checkSalesOrders.length
            }})
          </button>
        </div>
      </template>
    </modals-final-modal>
  </div>
</template>
