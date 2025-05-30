<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useInvoiceAdjustmentStore from "~/stores/invoices/InvoiceAdjustmentStore";
import type { FormLayoutType } from "~/types/FormLayoutType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";
import type { FormCurrencyType } from "~/types/masters/CurrencyType";
import type { SummaryPartType } from "~/components/d/SummaryLayout.vue";
import { debounce } from "lodash-es";

const layoutStore = useLayoutsStore();
const { topTitle } = storeToRefs(layoutStore);

const invoiceAdjustmentStore = useInvoiceAdjustmentStore();
const { tabFormIndex, form, errors } = storeToRefs(invoiceAdjustmentStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Create Invoice Adjustment",
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

const headersInvoices = ref([
  { title: "", key: "select", sortable: false, align: "center", width: "50px" },
  { title: "Reference Type", key: "ref_type", sortable: false },
  { title: "Reference No", key: "invoice_no", sortable: false },
  { title: "Invoice Date", key: "invoice_date", sortable: false },
  {
    title: "Invoice Amount",
    key: "invoice_amount",
    align: "end",
    sortable: false,
  },
  {
    title: "Total Adjustment",
    key: "total_adjustment",
    align: "end",
    sortable: false,
  },
  {
    title: "Balance Amount",
    key: "balance_amount",
    align: "end",
    sortable: false,
  },
  {
    title: "Adjustment Amount",
    key: "adjustment_amount",
    align: "end",
    sortable: false,
  },
  { title: "Admin Bank", key: "admin_bank", align: "end", sortable: false },
  { title: "Total Amount", key: "total_amount", align: "end", sortable: true },
  { title: "Actions", key: "actions", sortable: false, align: "center" },
] as any);

const refTypeOptions = ref([
  { title: "Sales Invoice", value: "sales_invoice" },
  { title: "Invoice DP", value: "invoice_dp" },
  { title: "Invoice Maintenance", value: "invoice_maintenance" },
  { title: "All", value: "all" },
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
      query: {
        is_active: 1,
      },
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
  total_invoice: {
    label: "Total Invoice",
    symbol: "",
    value: 0,
    format: {
      precision: 2,
    },
  } as SummaryPartType,
  total_adjustment: {
    label: "Total Adjustment",
    symbol: "",
    value: 0,
    format: {
      precision: 2,
    },
  } as SummaryPartType,
  total_balance: {
    label: "Total Balance",
    symbol: "",
    value: 0,
    format: {
      precision: 2,
    },
  } as SummaryPartType,
  total_admin_bank: {
    label: "Admin Bank",
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

const formatDate = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formLayout = ref({
  title: "Basic Information",
  parentPath: "/invoices/invoice-adjustments",
  currentTab: tabFormIndex.value,
  tabs: ["Items", "Remark"],
  button: {
    clear: {
      show: true,
      handler: () => invoiceAdjustmentStore.handleClickClear(),
    },
  },
  summary: customSummary.value,
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

const formatRefType = (refType: string) => {
  switch (refType) {
    case "sales_invoice":
      return "Sales Invoice";
    case "invoice_dp":
      return "Invoice DP";
    case "invoice_maintenance":
      return "Invoice Maintenance";
    default:
      return refType;
  }
};

const handleSubmit = async () => {
  invoiceAdjustmentStore.transferSelectedInvoicesToCheckMain();

  invoiceAdjustmentStore.calculateTotalAmount();

  await invoiceAdjustmentStore.store();
};

const calculateTotalAmountLocal = () => {
  customSummary.value.total_invoice.value =
    invoiceAdjustmentStore.form.total_invoice;
  customSummary.value.total_adjustment.value =
    invoiceAdjustmentStore.form.total_adjustment;
  customSummary.value.total_balance.value =
    invoiceAdjustmentStore.form.total_balance;
  customSummary.value.total_admin_bank.value =
    invoiceAdjustmentStore.form.total_admin_bank;
  customSummary.value.grand_total.value =
    invoiceAdjustmentStore.form.grand_total;

  if (invoiceAdjustmentStore.currencySymbolLabel) {
    const symbol = invoiceAdjustmentStore.currencySymbolLabel;
    customSummary.value.total_invoice.symbol = symbol;
    customSummary.value.total_adjustment.symbol = symbol;
    customSummary.value.total_balance.symbol = symbol;
    customSummary.value.total_admin_bank.symbol = symbol;
    customSummary.value.grand_total.symbol = symbol;
  }
};

const handleItemSelectionChange = (item: any) => {
  if (!item.selected) {
    item.adjustment_amount = 0;
    item.total_amount = 0;
  }
};

onMounted(async () => {
  invoiceAdjustmentStore.handleClickClear();
  initialFormLayout();
  calculateTotalAmountLocal();
});

watch(
  () => form.value,
  (newForm) => {
    calculateTotalAmountLocal();
  },
  { deep: true }
);

watch(
  () => invoiceAdjustmentStore.metaModal.indexInvoices.data,
  () => {
    calculateTotalAmountLocal();
  },
  { deep: true }
);

watchEffect(() => {
  topTitle.value = "Invoices";
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <d-form-layout
      :config="formLayout"
      @click:save="handleSubmit()"
      @click:clear="invoiceAdjustmentStore.handleClickClear()"
      @update:current-tab="tabFormIndex = $event"
    >
      <template #header>
        <form
          :class="
            classMerge(
              '',
              Object.keys(errors).length > 0 ? '!items-start' : '!items-center'
            )
          "
          @submit.prevent="handleSubmit"
        >
          <div class="grid grid-cols-6 lg:grid-cols-1 gap-2">
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
                :query="{
                  is_active: 1,
                  customer_type_names: 'buyer',
                }"
                class="col-span-2 lg:col-span-1"
                is-quick-select
                @click:selected="
                  (data) => invoiceAdjustmentStore.autocompleteCustomer(data)
                "
                modal-custom-class="!w-4/5"
                :fields="useStatics.headersCustomer"
                :filters="useStatics.filtersCustomer"
              />
              <div v-if="errors.customer_id" class="text-rose-500 text-sm mt-1">
                {{ errors.customer_id }}
              </div>
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
              <d-text-input
                v-model="form.title"
                :label="`Title`"
                :placeholder="`Title`"
                :errors="errors.title"
              />
            </div>

            <div class="lg:col-span-6">
              <d-date-picker-light
                v-model="form.adjustment_date"
                label="Adjustment Date"
              ></d-date-picker-light>
            </div>

            <div class="lg:col-span-6">
              <d-date-picker-light
                v-model="form.payment_date"
                label="Payment Date"
              ></d-date-picker-light>
            </div>

            <div class="lg:col-span-6">
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
                  (data: FormCurrencyType) => {
                    invoiceAdjustmentStore.autocompleteCurrency(data);
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
                v-model="form.bank_id"
                api="/v1/company-profiles/index-bank-information"
                page-end-prop="meta.next_page_url"
                item-title="name"
                item-value="id"
                method-api="post"
                inner-search-key="global"
                label="Bank"
                :display-multiple-keys="[
                  'company_name',
                  'name',
                  'account_number',
                ]"
                :display-multiple-format="(item: any) => `${item.company_name} - ${item.name} (${item.account_number})`"
                is-display-multiple-key
                :errors="errors.bank_id"
                @click:selected="(data: any) => invoiceAdjustmentStore.autocompleteBankInfo(data)"
              ></d-autocomplete>
            </div>

            <div class="lg:col-span-6">
              <d-num-v-format
                v-model="form.payment_amount"
                :precision="{
                  min: 3,
                  max: 3,
                }"
                hide-currency-display
                label="Payment Amount"
                @update:modelValue="calculateTotalAmountLocal"
              />
            </div>
          </div>
          <d-bt type="submit" class="!hidden"></d-bt>
        </form>
      </template>

      <template #content>
        <div v-if="tabFormIndex == 0">
          <div class="mt-2">
            <div class="w-full flex gap-2 mb-1">
              <div class="w-4/6 flex gap-2">
                <div class="font-medium text-[15px] text-[#6C757D] w-1/3">
                  <p>REFERENCE DATA</p>
                </div>
                <div class="font-medium text-[15px] text-[#6C757D] w-2/3">
                  <p>PERIODE DATA</p>
                </div>
              </div>
              <div class="font-medium text-[15px] text-[#6C757D] w-2/6">
                <p>AUTOMATION ACTION</p>
              </div>
            </div>

            <div class="w-full flex gap-2 mb-1">
              <div class="w-4/6 flex gap-2">
                <div class="w-1/3">
                  <d-autocomplete-client
                    v-model="form.reference"
                    :items="refTypeOptions"
                    item-title="title"
                    item-value="value"
                    label="Reference"
                  />
                  <div
                    v-if="errors.reference"
                    class="text-rose-500 text-sm mt-1"
                  >
                    {{ errors.reference }}
                  </div>
                </div>

                <div class="w-2/3 flex gap-2">
                  <div class="w-1/3">
                    <d-date-picker-light
                      v-model="form.ref_start_date"
                      label="Start Date"
                    ></d-date-picker-light>
                    <div
                      v-if="errors.ref_start_date"
                      class="text-rose-500 text-sm mt-1"
                    >
                      {{ errors.ref_start_date }}
                    </div>
                  </div>

                  <div class="w-1/3">
                    <d-date-picker-light
                      v-model="form.ref_end_date"
                      label="End Date"
                    ></d-date-picker-light>
                    <div
                      v-if="errors.ref_end_date"
                      class="text-rose-500 text-sm mt-1"
                    >
                      {{ errors.ref_end_date }}
                    </div>
                  </div>

                  <div class="w-1/3 flex gap-1">
                    <v-btn
                      color="#ffffff"
                      class="!bg-[#695149] hover:!bg-[#463630] rounded-md !min-w-0 !h-10 !px-3 !py-2"
                      variant="text"
                      @click="invoiceAdjustmentStore.searchReferenceInvoices()"
                    >
                      <v-icon icon="mdi-magnify" size="18" />
                    </v-btn>

                    <v-btn
                      color="#ffffff"
                      class="!bg-[#6C757D] hover:!bg-[#4e545a] rounded-md !min-w-0 !h-10 !px-3 !py-2"
                      variant="text"
                      @click="
                        invoiceAdjustmentStore.handleClearReferenceQuery()
                      "
                    >
                      <v-icon icon="mdi-refresh" size="18" />
                    </v-btn>
                  </div>
                </div>
              </div>

              <div class="w-2/6 flex gap-2">
                <div class="w-full flex gap-2 mb-3">
                  <v-btn
                    color="#695149"
                    class="text-white rounded-md !h-10 !px-4"
                    density="compact"
                    @click="
                      invoiceAdjustmentStore.autoAdjustedAmountCalculate()
                    "
                  >
                    <span style="font-size: 12.5px"
                      >Adjusted Amount Auto Calculate</span
                    >
                  </v-btn>

                  <v-btn
                    color="#695149"
                    class="text-white rounded-md !h-10 !px-4"
                    density="compact"
                    @click="invoiceAdjustmentStore.autoCalculateSelection()"
                  >
                    <span style="font-size: 12.5px"
                      >Auto Calculate Selection</span
                    >
                  </v-btn>
                </div>
              </div>
            </div>

            <v-data-table-virtual
              :items="invoiceAdjustmentStore.metaModal.indexInvoices.data"
              :headers="headersInvoices"
              item-value="invoice_uuid"
              density="compact"
              height="500"
              fixed-header
              class="col-span-3 sm:col-span-1 table-hover"
              :header-props="{
                class:
                  '!bg-scLightest dark:!bg-scDarker whitespace-nowrap py-3',
              }"
              :row-props="{
                class: 'whitespace-nowrap',
              }"
            >
              <template #item.select="{ item }">
                <v-checkbox
                  v-model="item.selected"
                  hide-details
                  density="compact"
                  color="#000000"
                  @change="handleItemSelectionChange(item)"
                ></v-checkbox>
              </template>

              <template #item.ref_type="{ item }">
                <span>{{ formatRefType(item.ref_type) }}</span>
              </template>

              <template #item.invoice_date="{ item }">
                {{ formatDate(item.invoice_date) }}
              </template>

              <template #item.invoice_amount="{ item }">
                <d-num-layout :value="item.invoice_amount" />
              </template>

              <template #item.total_adjustment="{ item }">
                <d-num-layout :value="item.total_adjustment" />
              </template>

              <template #item.balance_amount="{ item }">
                <d-num-layout :value="item.balance_amount" />
              </template>

              <template #item.adjustment_amount="{ item }">
                <d-num-layout :value="item.adjustment_amount" />
              </template>

              <template #item.admin_bank="{ item }">
                <d-num-v-format
                  v-model="item.admin_bank"
                  :precision="{
                    min: 3,
                    max: 3,
                  }"
                  hide-currency-display
                  class="w-full"
                  @update:modelValue="
                    invoiceAdjustmentStore.calculateTotalsFromSearchResults()
                  "
                />
              </template>

              <template #item.total_amount="{ item }">
                <d-num-layout
                  :value="
                    Math.max(
                      0,
                      (item.adjustment_amount || 0) - (item.admin_bank || 0)
                    )
                  "
                />
              </template>
            </v-data-table-virtual>
          </div>
        </div>
        <div v-else-if="tabFormIndex == 1">
          <div class="lg:col-span-6 mt-1">
            <d-rich-text
              v-model="form.remark"
              :label="`Remark`"
              :placeholder="`Write the Remark...`"
              class=""
            />
          </div>
        </div>
      </template>
    </d-form-layout>
  </div>
</template>
