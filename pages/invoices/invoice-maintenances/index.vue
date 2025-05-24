<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useInvoiceMaintenanceStore from "~/stores/invoices/InvoiceMaintenanceStore";
import type { QInvoiceMaintenanceIndexType } from "~/types/invoice-maintenances/InvoiceMaintenanceType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";
import type { WidgetSingleType } from "~/types/sales-orders/SalesOrderType";
import { storeToRefs } from "pinia";

const invoiceMaintenanceStore = useInvoiceMaintenanceStore();
const { tabFormIndex, form, errors, isOpenModal, queryModal, metaModal } =
  storeToRefs(invoiceMaintenanceStore);
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Invoice Maintenance",
});

const fieldsConfig = ref<FieldSelectableType[]>([
  {
    title: "",
    key: "checkbox",
    value: "checkbox",
    align: "center",
    sortable: false,
    width: "50px",
  },
  {
    title: "Customer",
    key: "customer_name",
    value: "customer_name",
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
    title: "Title",
    key: "title",
    value: "title",
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
    title: "Due Date",
    key: "due_date",
    value: "due_date",
    align: "start",
    sortable: true,
  },
  {
    title: "Bank",
    key: "bank_name",
    value: "bank_name",
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
    title: "Qty",
    key: "total_qty",
    value: "total_qty",
    align: "end",
    sortable: true,
  },
  {
    title: "Sub Amount",
    key: "total_amount_products",
    value: "total_amount_products",
    align: "end",
    sortable: true,
  },
  {
    title: "DP Amount",
    key: "total_dp_products",
    value: "total_dp_products",
    align: "end",
    sortable: true,
  },
  {
    title: "Balance",
    key: "total_balance_products",
    value: "total_balance_products",
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
    title: "Approved Status",
    key: "approved_status",
    value: "approved_status",
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
    title: "Approved By",
    key: "approved_by_name",
    value: "approved_by_name",
    align: "start",
    sortable: true,
  },
]);

const headerRepeatInvoice = ref<FieldSelectableType[]>([
  {
    title: "",
    key: "checkbox",
    value: "checkbox",
    align: "start",
    sortable: false,
  },
  {
    title: "Customer",
    key: "customer_name",
    value: "customer_name",
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
    title: "Title",
    key: "title",
    value: "title",
    align: "start",
    sortable: true,
    width: "300px",
  },
  {
    title: "Invoice Date",
    key: "invoice_date",
    value: "invoice_date",
    align: "start",
    sortable: true,
    width: "230px",
  },
  {
    title: "Due Date",
    key: "due_date",
    value: "due_date",
    align: "start",
    sortable: true,
    width: "230px",
  },
  {
    title: "Remark",
    key: "remark",
    value: "remark",
    align: "start",
    sortable: true,
    width: "350px",
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
    title: "Approved Status",
    key: "approved_status",
    value: "approved_status",
    align: "start",
    sortable: true,
  },
]);

const filtersConfig = ref<FilterSelectableType[]>([
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
      label: "Customer",
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
      items: useStatics.invDpIndexDateType,
      initialValue: "invoice_date",
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
      query: {
        is_active: 1,
      },
      api: "/v1/currencies/index-currency",
      singleApi: "/v1/currencies/index-currency",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Currency",
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
      items: useStatics.MaintenanceInvoiceIndexStatus,
    },
  },
  {
    title: "Invoice No",
    key: "invoice_no",
  },
  {
    title: "Title",
    key: "title",
  },
]);

function getStatusColor(status: string): string {
  switch (status) {
    case "PAID":
      return "green";
    case "UNPAID":
      return "orange";
    case "CANCELLED":
      return "grey";
    case "APPROVED":
      return "blue";
    case "PENDING":
      return "brown";
    default:
      return "white";
  }
}

const approvalMode = ref(false);
const selectedInvoices = ref<number[]>([]);
const currentMode = ref("approve");

const actionOptions = ref([
  {
    title: "Approve Invoice",
    value: "approve",
    icon: "mdi-check-circle",
    iconColor: "text-green-500",
  },
  {
    title: "Cancel Approval",
    value: "cancel",
    icon: "mdi-cancel",
    iconColor: "text-red-500",
  },
  {
    title: "Send Email",
    value: "email",
    icon: "mdi-email",
    iconColor: "text-blue-500",
  },
]);

const selectedAction = ref(null);

function handleActionSelected(action: any) {
  if (action?.value === "approve") {
    enterApprovalMode("approve");
  } else if (action?.value === "cancel") {
    enterApprovalMode("cancel");
  } else if (action?.value === "email") {
    enterApprovalMode("email");
  }
}

function enterApprovalMode(mode: string = "approve") {
  approvalMode.value = true;
  selectedInvoices.value = [];
  currentMode.value = mode;
}

function cancelApprovalMode() {
  approvalMode.value = false;
  selectedInvoices.value = [];
  selectedAction.value = null;
}

function resetSelection() {
  selectedInvoices.value = [];
}

function isInvoiceSelectable(item: any): boolean {
  if (currentMode.value === "approve") {
    return item.approved_status === "PENDING";
  } else if (currentMode.value === "cancel") {
    return (
      item.approved_status === "APPROVED" && item.total_adjustment === null
    );
  } else if (currentMode.value === "email") {
    return item.approved_status === "APPROVED";
  }

  return false;
}

async function proceedApproval() {
  if (selectedInvoices.value.length === 0) {
    useAlert.alertError("Please select at least one invoice");
    return;
  }

  const actionText =
    // currentMode.value === "approve" ? "approve" : "cancel approval for";
    currentMode.value === "approve"
      ? "approve"
      : currentMode.value === "cancel"
      ? "cancel approval"
      : "send email";
  const isConfirmed = await useAlert.showPopupConfirmation(
    "Invoice Maintenance Validation",
    `Are you sure to ${actionText} selected invoice maintenance? Please ensure all information is correct before proceed.`
  );

  if (!isConfirmed) return;

  try {
    let response;

    if (currentMode.value === "approve") {
      response = await invoiceMaintenanceStore.approveInvoiceMaintenance(
        selectedInvoices.value
      );
    } else if (currentMode.value === "cancel") {
      response = await invoiceMaintenanceStore.cancelApprovalInvoiceMaintenance(
        selectedInvoices.value
      );
    } else if (currentMode.value === "email") {
      response = await invoiceMaintenanceStore.sendEmailInvoicesMaintenance(
        selectedInvoices.value
      );
    }

    cancelApprovalMode();

    const successMessage =
      currentMode.value === "approve"
        ? "Selected invoices have been approved successfully"
        : // : "Approval has been cancelled for selected invoices";
        currentMode.value === "cancel"
        ? "Approval has been cancelled for selected invoices"
        : "Email has been sent for selected invoices";

    useAlert.alertSuccess(successMessage);

    await invoiceMaintenanceStore.indexInvoiceMaintenance();

    await onClickFilter("invoiceMaintenance");
    // window.location.href = "/invoices/invoice-maintenances";
  } catch (error) {
    console.error(
      `Error ${
        currentMode.value === "approve"
          ? "approving"
          : "cancelling approval for"
      } invoices:`,
      error
    );
    useAlert.alertError(
      `Failed to ${
        currentMode.value === "approve" ? "approve" : "cancel approval for"
      } selected invoices`
    );
  }
}

function handleRepeatButtonClick() {
  console.log("Repeat button clicked");
  console.log(
    "Before: isOpenModal.repeatInvoice =",
    invoiceMaintenanceStore.isOpenModal.repeatInvoice
  );
  invoiceMaintenanceStore.openRepeatModal();
  console.log(
    "After: isOpenModal.repeatInvoice =",
    invoiceMaintenanceStore.isOpenModal.repeatInvoice
  );
}

const handleExportCsv = async () => {
  await invoiceMaintenanceStore.exportToCsv();
};

onMounted(() => {
  useInvoiceMaintenanceStore().indexWidget();
});

const invoiceMaintenanceExposeRef = ref();
// Trigger the openModal method
const onClickFilter = async (type: "invoiceMaintenance") => {
  if (invoiceMaintenanceExposeRef.value && type == "invoiceMaintenance") {
    invoiceMaintenanceExposeRef.value.filterData();
  } else {
    console.error("method is not available on exposed Ref");
  }

  // await openModal(filteredModalForms.value);
};
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
        ref="invoiceMaintenanceExposeRef"
        api="/v1/invoice-maintenances/index-invoice-maintenance"
        detail-link="/invoices/invoice-maintenances"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        class="col-span-2 lg:col-span-1"
        search-placeholder="Search anything related to Maintenance Invoice..."
        is-quick-select
        no-title
        edit-link="/invoices/invoice-maintenances/edit"
        delete-api="/v1/invoice-maintenances/delete-invoice-maintenance"
        pdf-api="/v1/invoice-maintenances/pdf-invoice-maintenance"
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndex"
        :create-option="{
          link: '/invoices/invoice-maintenances/create',
          show: true,
          cta: '+ Create',
        }"
        is-csv
        @click:csv="handleExportCsv"
        @click:find="useInvoiceMaintenanceStore().indexWidget()"
        @update:filters="
          (filters: QInvoiceMaintenanceIndexType) => {
            queryModal.qIndex = filters;
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
        <template #actions>
          <div class="flex items-center gap-2">
            <button
              @click="handleRepeatButtonClick"
              class="px-4 py-2 bg-brown-700 text-white rounded mr-2 flex items-center hover:bg-brown-800 transition-colors duration-300"
            >
              <i class="mdi mdi-repeat mr-1"></i> Repeat
            </button>

            <div class="flex items-center">
              <div class="w-[200px] actions-dropdown">
                <d-autocomplete-client
                  v-model="selectedAction"
                  :items="actionOptions"
                  label="Actions"
                  placeholder="Select action"
                  item-title="title"
                  item-value="value"
                  :clearable="false"
                  class="!bg-[#695149] rounded"
                  aClass="!text-white"
                  @click:selected="handleActionSelected"
                >
                  <template #selection="{ item }">
                    <div class="flex items-center text-white">
                      <span>{{ item.title }}</span>
                    </div>
                  </template>

                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <i :class="[item.raw.icon, item.raw.iconColor]"></i>
                      </template>
                      <v-list-item-title>{{
                        item.raw.title
                      }}</v-list-item-title>
                    </v-list-item>
                  </template>
                </d-autocomplete-client>
              </div>

              <div v-if="approvalMode" class="flex ml-2">
                <button
                  @click="proceedApproval"
                  class="px-4 py-1.5 bg-brown-700 text-white rounded mr-2 flex items-center border !border-[#70544b]"
                  type="button"
                >
                  <i class="mdi mdi-check mr-1"></i>
                  {{ currentMode === "approve" ? "Proceed" : "Proceed" }} ({{
                    selectedInvoices.length
                  }})
                </button>
                <button
                  @click="resetSelection"
                  class="px-4 py-1.5 bg-[#6C757D] text-white rounded mr-2 flex items-center"
                >
                  <i class="mdi mdi-refresh mr-1"></i> Reset
                </button>
                <button
                  @click="cancelApprovalMode"
                  class="px-4 py-1.5 bg-[#DC3545] !text-white rounded flex items-center"
                >
                  <i class="mdi mdi-close mr-1"></i> Cancel
                </button>
              </div>
            </div>
          </div>
        </template>

        <template #item.checkbox="{ item }">
          <div v-if="approvalMode && isInvoiceSelectable(item)">
            <v-checkbox
              v-model="selectedInvoices"
              :value="item.id"
              hide-details
              density="compact"
              color="#000000"
            ></v-checkbox>
          </div>
        </template>

        <template #item.bank_name="{ item }">
          <span
            v-if="item.bank_name && item.account_number && item.account_name"
          >
            {{ item.bank_name }} - {{ item.account_number }} -
            {{ item.account_name }}
          </span>
          <span v-else>
            {{ item.bank_name || "-" }}
          </span>
        </template>

        <template #item.exchange_rate="{ item }">
          <d-num-layout :value="item.exchange_rate" />
        </template>
        <template #item.total_vat="{ item }">
          <d-num-layout :value="item.total_vat" />
        </template>
        <template #item.total_pph23="{ item }">
          <d-num-layout :value="item.total_pph23" />
        </template>
        <template #item.total_qty="{ item }">
          <d-num-layout :value="item.total_qty" :precision="0" />
        </template>
        <template #item.total_amount_products="{ item }">
          <d-num-layout :value="item.total_amount_products" />
        </template>
        <template #item.total_dp_products="{ item }">
          <d-num-layout :value="item.total_dp_products" />
        </template>
        <template #item.total_balance_products="{ item }">
          <d-num-layout :value="item.total_balance_products" />
        </template>
        <template #item.grand_total="{ item }">
          <d-num-layout :value="item.grand_total" />
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
        <template #item.approved_status="{ item }">
          <v-chip
            :color="getStatusColor(item.approved_status)"
            size="small"
            class="text-white"
          >
            {{ item.approved_status }}
          </v-chip>
        </template>
        <template #actions.delete="{ item }">
          <template v-if="item.status !== 'UNPAID'">
            <slot name="actions.delete" :item="item">
              <d-button
                icon="mdi-delete"
                is-no-text
                class="p-1 rounded-full ease-in-out transition-all dark:!bg-gray-500 cursor-not-allowed"
                icon-class="text-gray-500 dark:text-gray-300"
                rounded="xl"
                size=""
                cta="select"
                icon-size="16"
              ></d-button>
            </slot>
          </template>
        </template>
      </d-datatable>
    </d-index-layout>

    <modals-final-modal
      size="xl"
      custom-class="overflow-y-auto"
      label="Repeat Invoice Maintenance"
      parent-class="!z-[1500]"
      :is-open="isOpenModal.repeatInvoice"
      @update:is-open="isOpenModal.repeatInvoice = $event"
    >
      <template #top>
        <hr class="border-t border-gray-300 my-1 w-full" />
        <div class="flex items-center gap-2">
          <d-button
            icon="mdi-eye-off"
            is-no-text
            class="p-1.5 dark:bg-transparent rounded-full ease-in-out transition-all hover:bg-scDarker3 dark:hover:bg-zinc-600 !bg-sc"
            text-class="text-zinc-100 dark:text-primary1"
            icon-class="text-zinc-100 dark:text-primary1"
            rounded="xl"
            size=""
            cta="show/hide column"
            icon-size="15"
          ></d-button>
          <p class="font-medium text-[17px] text-[#212529]">Filter Search</p>
        </div>
        <form class="grid grid-cols-7 w-full flex-row items-center gap-2 mb-4">
          <d-autocomplete
            v-model="queryModal.qRepeatInvoice.customer_id"
            :query="{
              is_active: 1,
            }"
            api="/v1/customers/index-customer"
            method-api="post"
            page-end-prop="meta.next_page_url"
            item-title="name"
            item-value="id"
            inner-search-key="global"
            label="Customer"
            placeholder="Select customer"
          />

          <d-text-input
            v-model="queryModal.qRepeatInvoice.invoice_no"
            label="Invoice No"
            placeholder="Search by Invoice No"
            append-inner-icon="mdi-magnify"
          />

          <d-date-picker-light
            v-model="queryModal.qRepeatInvoice.start_date"
            label="Start Date"
          ></d-date-picker-light>

          <d-date-picker-light
            v-model="queryModal.qRepeatInvoice.end_date"
            label="End Date"
          ></d-date-picker-light>

          <d-autocomplete-client
            v-model="queryModal.qRepeatInvoice.status"
            :items="useStatics.MaintenanceInvoiceIndexStatus"
            label="Status"
            item-value="value"
            item-title="title"
          />

          <d-text-input
            v-model="queryModal.qRepeatInvoice.global"
            label="Global Search"
            placeholder="Search global"
            append-inner-icon="mdi-magnify"
          />

          <div class="flex items-center gap-2">
            <div class="flex gap-2">
              <button
                type="button"
                class="bg-brown-700 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-brown-800"
                @click="invoiceMaintenanceStore.handleRepeatFilterChange()"
              >
                Search
              </button>
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                class="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-gray-600"
                @click="invoiceMaintenanceStore.clearRepeatFilters()"
              >
                Clear
              </button>
            </div>
          </div>
        </form>

        <div class="rounded-md mb-4">
          <div class="flex items-center gap-2 mb-3">
            <d-button
              icon="mdi-eye-off"
              is-no-text
              class="p-1.5 dark:bg-transparent rounded-full ease-in-out transition-all hover:bg-scDarker3 dark:hover:bg-zinc-600 !bg-sc"
              text-class="text-zinc-100 dark:text-primary1"
              icon-class="text-zinc-100 dark:text-primary1"
              rounded="xl"
              size=""
              cta="show/hide column"
              icon-size="15"
            ></d-button>
            <p class="font-medium text-[17px] text-[#212529]">
              Replace Invoice Maintenance Information
            </p>
          </div>
          <div class="grid grid-cols-6 gap-2">
            <d-text-input
              v-model="invoiceMaintenanceStore.repeatForm.title"
              label="Title"
              placeholder="Enter new title"
            />

            <d-date-picker-light
              v-model="invoiceMaintenanceStore.repeatForm.invoice_date"
              label="Invoice Date"
            ></d-date-picker-light>

            <d-date-picker-light
              v-model="invoiceMaintenanceStore.repeatForm.due_date"
              label="Due Date"
            ></d-date-picker-light>

            <d-text-input
              v-model="invoiceMaintenanceStore.repeatForm.remark"
              label="Remark"
              placeholder="Enter remark"
            />

            <button
              class="bg-brown-700 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-brown-800"
              @click="invoiceMaintenanceStore.generateSelectedInvoices()"
            >
              Generate
            </button>
          </div>
        </div>
      </template>

      <v-data-table-server
        v-model:page="queryModal.qRepeatInvoice.page"
        v-model:items-per-page="queryModal.qRepeatInvoice.per_page"
        :items="metaModal.repeatInvoice.data ?? []"
        :headers="headerRepeatInvoice"
        :items-length="metaModal.repeatInvoice.meta.total ?? 0"
        :items-per-page-options="[10, 25, 50, 100]"
        :loading="metaModal.repeatInvoice.loading"
        density="compact"
        :header-props="{
          class: '!bg-scLightest dark:!bg-dark2 whitespace-nowrap',
        }"
        :row-props="{
          class: 'cursor-pointer',
        }"
        item-value="id"
        show-current-page
        show-select
        v-model="invoiceMaintenanceStore.selectedRepeatInvoices"
        @update:options="(data:any) => invoiceMaintenanceStore.fetchRepeatDataServerFetch(data)"
        fixed-header
        height="450"
        hover
      >
        <template #item.bank_name="{ item }">
          <span
            v-if="item.bank_name && item.account_number && item.account_name"
          >
            {{ item.bank_name }} - {{ item.account_number }} -
            {{ item.account_name }}
          </span>
          <span v-else>
            {{ item.bank_name || "-" }}
          </span>
        </template>

        <template #item.exchange_rate="{ item }">
          <d-num-layout :value="item.exchange_rate" />
        </template>
        <template #item.total_vat="{ item }">
          <d-num-layout :value="item.total_vat" />
        </template>
        <template #item.total_pph23="{ item }">
          <d-num-layout :value="item.total_pph23" />
        </template>
        <template #item.total_qty="{ item }">
          <d-num-layout :value="item.total_qty" :precision="0" />
        </template>
        <template #item.total_amount_products="{ item }">
          <d-num-layout :value="item.total_amount_products" />
        </template>
        <template #item.total_dp_products="{ item }">
          <d-num-layout :value="item.total_dp_products" />
        </template>
        <template #item.total_balance_products="{ item }">
          <d-num-layout :value="item.total_balance_products" />
        </template>
        <template #item.grand_total="{ item }">
          <d-num-layout :value="item.grand_total" />
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
        <template #item.approved_status="{ item }">
          <v-chip
            :color="getStatusColor(item.approved_status)"
            size="small"
            class="text-white"
          >
            {{ item.approved_status }}
          </v-chip>
        </template>

        <template #item.title="{ item }">
          <d-text-input
            v-model="item.title"
            placeholder="Enter title"
            density="compact"
            hide-details
            class="w-full"
          />
        </template>

        <template #item.remark="{ item }">
          <d-text-input
            v-model="item.remark"
            placeholder="Enter remark"
            density="compact"
            hide-details
            class="w-full"
          />
        </template>

        <template #item.invoice_date="{ item }">
          <d-date-picker-light
            v-model="item.invoice_date"
            density="compact"
            hide-details
            class="w-full"
          />
        </template>

        <template #item.due_date="{ item }">
          <d-date-picker-light
            v-model="item.due_date"
            density="compact"
            hide-details
            class="w-full"
          />
        </template>
      </v-data-table-server>

      <template #footer>
        <div class="flex h-max w-full justify-end items-center gap-2">
          <button
            class="flex items-center gap-2 rounded-md bg-gray-500 px-3 py-2 text-[15px] font-bold text-white shadow-md hover:shadow-xl"
            @click="invoiceMaintenanceStore.closeRepeatModal()"
          >
            <Icon name="material-symbols:cancel" size="20" />
            Cancel
          </button>
          <button
            class="flex items-center gap-2 rounded-md bg-sc px-3 py-2 text-[15px] font-bold text-white shadow-md hover:shadow-xl"
            @click="invoiceMaintenanceStore.repeatSelectedInvoices()"
          >
            <Icon name="material-symbols:repeat" size="20" />
            Repeat Selected Invoice
          </button>
        </div>
      </template>
    </modals-final-modal>
  </div>
</template>

<style scoped>
.actions-dropdown :deep(.v-field__input) {
  color: white !important;
  padding: 0 12px !important;
}

.actions-dropdown :deep(.v-field) {
  background-color: #695149 !important;
  border-radius: 4px !important;
  border-color: #695149 !important;
}

.actions-dropdown :deep(.v-field__outline) {
  opacity: 0 !important;
}

.actions-dropdown :deep(.v-field__append-inner) {
  color: white !important;
}

.actions-dropdown :deep(.v-field__field) {
  color: white !important;
}

.actions-dropdown :deep(.v-autocomplete__selection) {
  color: white !important;
}

.actions-dropdown :deep(.v-autocomplete) {
  min-height: 40px !important;
}

.actions-dropdown :deep(.v-field__input) {
  min-height: 40px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  display: flex !important;
  align-items: center !important;
}
</style>


