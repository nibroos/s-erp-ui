<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useInvoiceMaintenanceStore from "~/stores/invoices/InvoiceMaintenanceStore";
import type { QInvoiceMaintenanceIndexType } from "~/types/invoice-maintenances/InvoiceMaintenanceType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";
import type { WidgetSingleType } from "~/types/sales-orders/SalesOrderType";

const { queryModal, metaModal } = useInvoiceMaintenanceStore();
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
const invoiceMaintenanceStore = useInvoiceMaintenanceStore();

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
]);

const selectedAction = ref(null);

function handleActionSelected(action: any) {
  if (action?.value === "approve") {
    enterApprovalMode("approve");
  } else if (action?.value === "cancel") {
    enterApprovalMode("cancel");
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
  }
  return false;
}

async function proceedApproval() {
  if (selectedInvoices.value.length === 0) {
    useAlert.alertError("Please select at least one invoice");
    return;
  }

  const actionText =
    currentMode.value === "approve" ? "approve" : "cancel approval for";
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
    } else {
      response = await invoiceMaintenanceStore.cancelApprovalInvoiceMaintenance(
        selectedInvoices.value
      );
    }

    cancelApprovalMode();

    const successMessage =
      currentMode.value === "approve"
        ? "Selected invoices have been approved successfully"
        : "Approval has been cancelled for selected invoices";

    useAlert.alertSuccess(successMessage);

    await invoiceMaintenanceStore.indexInvoiceMaintenance();

    window.location.href = "/invoices/invoice-maintenances";
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

onMounted(() => {
  useInvoiceMaintenanceStore().indexWidget();
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
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndex"
        :create-option="{
          link: '/invoices/invoice-maintenances/create',
          show: true,
          cta: '+ Create',
        }"
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
                    <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
                  </v-list-item>
                </template>
              </d-autocomplete-client>
            </div>

            <div v-if="approvalMode" class="flex ml-2">
              <button
                @click="proceedApproval"
                class="px-4 py-1.5 bg-brown-700 text-white rounded mr-2 flex items-center border !border-[#70544b]"
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
      </d-datatable>
    </d-index-layout>
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


