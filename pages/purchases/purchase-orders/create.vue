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
  PoDtBomType,
  PoDtDiscType,
  PoDtType,
} from "~/types/purchase-orders/PurchaseOrderType";
import { updatePoRefsModalFromMain } from "~/composables/maps/purchaseOrderComp";
import type { ProductBomListType } from "~/types/masters/ProductType";
import { debounce } from "lodash-es";

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
  openedModal,
  formLayout: formLayoutStore,
} = storeToRefs(purchaseOrderStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Create Purchase Order",
});

const headers = ref<FieldSelectableType[]>([
  { title: "", key: "expand", width: 20, sortable: false },
  {
    key: "ref_type",
    title: "Ref Type",
    sortable: true,
    cellProps: {
      class: "capitalize",
    },
  },
  { key: "product_type", title: "Item Type", sortable: true },
  { key: "item_code", title: "Product Code", sortable: true },
  { key: "item_name", title: "Product Name", sortable: true },
  { key: "unit_name", title: "Unit", sortable: true },
  { key: "qty", title: "Qty", sortable: true, align: "end" },
  { key: "price", title: "Price", sortable: true, align: "end" },
  { key: "discount_percentage", title: "Disc (%)", sortable: true, align: "end" },
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

const headersBOM = ref([
  { key: "item_code", title: "Product Code", sortable: true },
  { key: "item_name", title: "Product Name", sortable: true },
  { key: "unit_name", title: "Unit", sortable: true },
  { key: "price", title: "Price", sortable: true, align: "end" },
  { key: "qty", title: "Qty", sortable: true, align: "end" },
  { key: "subtotal", title: "Total Amount", sortable: true, align: "end" },
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
  { key: "price", title: "Price", align: "end", sortable: true },
  { key: "qty", title: "Qty", align: "end", sortable: true },
  {
    title: "Total Amount",
    key: "subtotal",
    value: "subtotal",
    align: "end",
    sortable: true,
  },
  { key: "remark", title: "Remark", sortable: true },
]) as Ref<FieldSelectableType[]>;

const headersVAT = ref<FieldSelectableType[]>([
  {
    title: "Name",
    key: "name",
    value: "name",
    align: "start",
    sortable: true,
  },
  {
    title: "Percentage",
    key: "num",
    value: "num",
    align: "start",
    sortable: true,
  },
  {
    title: "Multiplier",
    key: "multiplier",
    value: "multiplier",
    align: "start",
    sortable: true,
  },
  {
    title: "Divider",
    key: "divider",
    value: "divider",
    align: "start",
    sortable: true,
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

const currencySymbolLabel = ref<string | null>("");

const formLayout = ref({
  title: "Basic Information",
  parentPath: "/purchases/purchase-orders",
  currentTab: tabFormIndex.value,
  tabs: ["Items", "Payments", "Remark", "Schedule", "Attachments"],
  button: {
    clear: {
      show: true,
    },
  },
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
  form.value.po_dts = itemsCheck.value.checkMain;
  await purchaseOrderStore.store();
};

const fetchInitialData = async () => {
  // await purchaseOrderStore.indexProduct();
};

const calculateTotalAmountLocal = () => {
  purchaseOrderStore.calculateTotalAmount();

  if (formLayout.value.summary) {
    formLayout.value.summary.total_amount.value = form.value.subtotal;
    formLayout.value.summary.total_discount.value = form.value.total_discount;
    formLayout.value.summary.total_vat.value = form.value.total_vat;
    formLayout.value.summary.total_pph23.value = form.value.total_pph23;
    formLayout.value.summary.grand_total.value = form.value.grand_total;
  }
};

onMounted(async () => {
  purchaseOrderStore.handleClickClear();
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
              'grid grid-cols-6 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-2',
              Object.keys(errors).length > 0 ? '!items-start' : '!items-center'
            )
          "
          @submit.prevent="handleSubmit"
        >
          <div class="sm:col-span-1 flex flex-col">
            <d-text-input
              v-model="form.po_no"
              :label="`PO No`"
              :placeholder="`PO No`"
              :errors="errors.po_no"
            >
            </d-text-input>
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
              class="col-span-2 lg:col-span-1"
              is-quick-select
              @click:selected="
                (data) => purchaseOrderStore.autocompleteSupplier(data)
              "
              modal-parent-class="!z-[2500]"
              modal-custom-class="!w-4/5"
              :fields="headersCustomer"
              :filters="filtersCustomer"
            />
          </div>

          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.email"
              :label="`Email`"
              :placeholder="`Email`"
              :errors="errors.email"
              disabled
            />
          </div>
          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.phone"
              :label="`Phone`"
              :placeholder="`Phone`"
              :errors="errors.phone"
              disabled
            />
          </div>
          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.address"
              :label="`Address`"
              :placeholder="`Address`"
              :errors="errors.address"
              disabled
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
            <d-date-picker-light
              v-model="form.po_date"
              label="Order Date"
            ></d-date-picker-light>
          </div>
          <div class="sm:col-span-1">
            <d-date-picker-light
              v-model="form.delivery_date"
              label="Delivery Date"
            ></d-date-picker-light>
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
            <d-text-input
              v-model="form.shipping_destination"
              :label="`Shipping Destination`"
              :placeholder="`Shipping Destination`"
              :errors="errors.shipping_destination"
            />
          </div>
          <d-bt type="submit" class="!hidden"></d-bt>
        </form>
      </template>
      <template #content>
        <div
          v-if="tabFormIndex == useStatics.formTabPurchaseOrder.items"
          class="grid grid-cols-3 sm:grid-cols-1 gap-2"
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
            @click="purchaseOrderStore.clickClearRefs"
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
            <template #item.product_type="{ item }">
              <span class="capitalize">{{ item.product_type }} </span>
            </template>
            <template #item.remark="{ item }">
              <d-text-area-input
                v-model="item.remark"
                :label="``"
                :placeholder="`Remark`"
                class="w-[9rem]"
              />
            </template>
            <template #item.price="{ item }">
              <d-num-v-format
                v-model="item.price"
                :precision="{
                  min: 3,
                  max: 3,
                }"
                hide-currency-display
                @update:modelValue="calculateTotalAmountLocal"
                label=""
                class="w-[9rem]"
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
                @update:modelValue="calculateTotalAmountLocal"
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
                  () => {
                    if (item.discount_amount > 0) {
                      item.discount_type = 'amount';
                      item.discount_percentage = 0;
                    } else {
                      item.discount_type = null;
                    }
                    calculateTotalAmountLocal();
                  }
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
                  () => {
                    if (item.discount_percentage > 0) {
                      item.discount_type = 'percentage';
                      item.discount_amount = 0;
                    } else {
                      item.discount_type = null;
                    }
                    calculateTotalAmountLocal();
                  }
                "
                label=""
                class="w-[9rem]"
                :disabled="!!item.discount_amount"
              />
            </template>

            <template #item.total_amount="{ item }">
              <d-num-layout :value="item.total_amount" />
            </template>
            <template #item.action="{ item, index }">
              <div class="action-button flex gap-2">
                <d-bt
                  v-if="item.product_type == 'product'"
                  @click="purchaseOrderStore.onClickOpenModalBOM((item as unknown as FormPoDtProductListType), index)"
                  class="px-2 py-1 bg-scLighter hover:bg-scDarker hover:text-primary1 rounded-lg ease-in-out transition-all hover:dark:!bg-scDarker3 dark:!bg-sc"
                  text-class="text-primary1 dark:text-white"
                  rounded="xl"
                  cta="+ Add BOM"
                  no-icon
                ></d-bt>
                <d-bt
                  @click="purchaseOrderStore.onClickDeleteSelected(item, index)"
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
                  !!internalItem.raw.po_dt_boms &&
                  internalItem.raw.po_dt_boms.length > 0
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
              <tr v-if="item.po_dt_boms.length > 0">
                <td :colspan="columns.length" class="!p-0">
                  <div class="">
                    <v-data-table-virtual
                      :headers="headersBOM"
                      :items="item.po_dt_boms || []"
                      item-value="uid"
                      density="compact"
                      return-object
                      fixed-header
                      class="table-hover"
                      :height="item.po_dt_boms.length > 1 ? '170' : '100'"
                      :header-props="{
                        class: '!bg-grey1 dark:!bg-dark2 whitespace-nowrap',
                      }"
                      :row-props="{
                        class: 'whitespace-nowrap',
                      }"
                    >
                      <template #item.remark="{ item }">
                        <d-text-area-input
                          v-model="(item as PoDtType).remark"
                          :label="``"
                          :placeholder="`Remark`"
                          class="w-full"
                        />
                      </template>

                      <template #item.qty="{ item }">
                        <d-num-v-format
                          v-model="(item as PoDtType).qty"
                          :precision="{
                            min: 3,
                            max: 3,
                          }"
                          hide-currency-display
                          label=""
                          class="w-full"
                          @update:modelValue="
                            () => {
                              purchaseOrderStore.calculatePrice(
                                item,
                                internalItem.raw
                              );
                              calculateTotalAmountLocal();
                            }
                          "
                        />
                      </template>
                      <template #item.price="{ item }">
                        <d-num-v-format
                          v-model="(item as PoDtType).price"
                          :precision="{
                            min: 3,
                            max: 3,
                          }"
                          hide-currency-display
                          label=""
                          class="w-full"
                          @update:modelValue="
                            () => {
                              purchaseOrderStore.calculatePrice(
                                item,
                                internalItem.raw
                              );
                              calculateTotalAmountLocal();
                            }
                          "
                        />
                      </template>
                      <template #item.subtotal="{ item }">
                        <d-num-layout :value="item.subtotal" />
                      </template>
                      <template #item.action="{ item: itemBom, index: iBom }">
                        <div class="action-button">
                          <d-bt
                            @click="
                              purchaseOrderStore.onClickDeleteBom(
                                index,
                                iBom,
                                internalItem
                              )
                            "
                            icon="mdi-delete"
                            is-no-text
                            class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                            icon-class="text-cancel dark:text-primary1"
                            rounded="xl"
                            cta="delete"
                            icon-size="16"
                            :is-notif="true"
                            :notif-text="`${(itemBom as PoDtBomType).item_name} deleted`"
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
        <div
          v-if="tabFormIndex == useStatics.formTabPurchaseOrder.payments"
          class="grid grid-cols-6 sm:grid-cols-1 gap-x-2 gap-y-4 items-center"
        >
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
                (data) => purchaseOrderStore.autocompleteCurrency(data)
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
            <d-select-table
              api="/v1/vats/index-vat"
              detail-api="/v1/vats/index-vat"
              method-api="post"
              detail-method-api="post"
              mapping-detail="data[0]"
              total-prop="meta.total"
              label="VAT"
              v-model="form.vat_id"
              class="col-span-2 lg:col-span-1"
              is-quick-select
              modal-parent-class="!z-[2500]"
              modal-custom-class="!w-4/5"
              :display-single-multiple-keys="['name', 'num']"
              is-display-multiple-key
              @click:selected="
                (data) => {
                  purchaseOrderStore.autocompleteVat(data);
                  calculateTotalAmountLocal();
                }
              "
              @click:clear="purchaseOrderStore.removeVat()"
              :fields="headersVAT"
              :filters="[
                {
                  title: 'Name',
                  key: 'name',
                },
              ]"
            />
          </div>
          <div class="sm:col-span-1">
            <d-num-v-format
              v-model="form.vat_percentage"
              :precision="{
                min: 3,
                max: 3,
              }"
              hide-currency-display
              label="VAT (%)"
              :errors="errors.vat_perc"
              disabled
            />
          </div>

          <div class="sm:col-span-1">
            <d-select-table
              api="/v1/pph23s/index-pph23"
              detail-api="/v1/pph23s/index-pph23"
              method-api="post"
              detail-method-api="post"
              mapping-detail="data[0]"
              total-prop="meta.total"
              label="PPH"
              v-model="form.pph23_id"
              class="col-span-2 lg:col-span-1"
              is-quick-select
              @click:selected="
                (data, oldId) => {
                  purchaseOrderStore.autocompletePph(data, oldId);
                  calculateTotalAmountLocal();
                }
              "
              @click:clear="purchaseOrderStore.removePph()"
              modal-parent-class="!z-[2500]"
              modal-custom-class="!w-4/5"
              :display-single-multiple-keys="['name', 'num']"
              is-display-multiple-key
              :fields="[
                {
                  title: 'Name',
                  key: 'name',
                  value: 'name',
                  align: 'start',
                  sortable: true,
                },
                {
                  title: 'Percentage',
                  key: 'num',
                  value: 'num',
                  align: 'start',
                  sortable: true,
                },
              ]"
              :filters="[
                {
                  title: 'Name',
                  key: 'name',
                },
              ]"
            />
          </div>
          <div class="sm:col-span-1">
            <d-num-v-format
              v-model="form.pph23_percentage"
              :precision="{
                min: 3,
                max: 3,
              }"
              hide-currency-display
              label="PPH (%)"
              :errors="errors.pph23_perc"
              disabled
            />
          </div>
          <div class="sm:col-span-1">
            <d-num-v-format
              v-model="form.discount_percentage"
              :precision="{
                min: 3,
                max: 3,
              }"
              hide-currency-display
              @update:modelValue="
                () => {
                  if (form.discount_percentage > 0) {
                    form.discount_type = 'percentage';
                    form.discount_amount = 0;
                  } else {
                    form.discount_type = null;
                  }
                  calculateTotalAmountLocal();
                }
              "
              label="Disc (%)"
              :disabled="!!form.discount_amount"
            />
          </div>
          <div class="sm:col-span-1">
            <d-num-v-format
              v-model="form.discount_amount"
              :precision="{
                min: 3,
                max: 3,
              }"
              hide-currency-display
              @update:modelValue="
                () => {
                  if (form.discount_amount > 0) {
                    form.discount_type = 'amount';
                    form.discount_percentage = 0;
                  } else {
                    form.discount_type = null;
                  }
                  calculateTotalAmountLocal();
                }
              "
              label="Disc Amount"
              :disabled="!!form.discount_percentage"
            />
          </div>
          <div class="sm:col-span-1">
            <d-autocomplete
              v-model="form.shipping_term_id"
              api="/v1/shipping-terms/index-shipping-term"
              single-api="/v1/shipping-terms/show-shipping-term"
              page-end-prop="meta.next_page_url"
              item-title="name"
              item-value="id"
              method-api="post"
              inner-search-key="global"
              label="Shipping Term"
              :errors="errors.shipping_term_id"
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
        </div>
        <div v-if="tabFormIndex == useStatics.formTabPurchaseOrder.remarks">
          <div class="sm:col-span-1">
            <d-text-area-input
              v-model="form.remark"
              :label="`Remark`"
              :placeholder="`Remark`"
              :errors="errors.remark"
            />
          </div>
        </div>
        <div v-if="tabFormIndex == useStatics.formTabPurchaseOrder.schedules">
          <!-- Schedule tab content will be implemented later -->
          <div class="text-center text-gray-500 py-4">
            Schedule content will be implemented in the future
          </div>
        </div>
        <div v-if="tabFormIndex == 4">
          <!-- Attachments tab content will be implemented later -->
          <div class="text-center text-gray-500 py-4">
            Attachments content will be implemented in the future
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
        item-value="ref_id"
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
            >{{ defineItemTypePurchaseOrder(item as PoDtType) }}
          </span>
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
            v-if="internalItem.raw.boms && internalItem.raw.boms.length > 0"
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
          <tr v-if="item.boms && item.boms.length > 0">
            <td :colspan="columns.length" class="!p-0">
              <div class="">
                <v-data-table-virtual
                  :headers="headersBOMModal"
                  :items="item.boms || []"
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
                  <template #item.price="{ item }">
                    <d-num-v-format
                      v-model="item.price"
                      :precision="{
                        min: 3,
                        max: 3,
                      }"
                      hide-currency-display
                      label=""
                      class="w-[9rem]"
                      @update:modelValue="
                        () => {
                          purchaseOrderStore.calculatePrice(
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
                        purchaseOrderStore.calculatePrice(item, internalItem.raw)
                      "
                    />
                  </template>
                  <template #item.subtotal="{ item }">
                    <d-num-layout :value="item.subtotal" />
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
            @click="purchaseOrderStore.onClickUpdateProductsModal()"
          >
            <Icon name="material-symbols:save-rounded" size="20" />
            Add Selected Products ({{ itemsCheck.checkProducts.length }})
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
          @submit.prevent="purchaseOrderStore.fetchModalFilter()"
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
            @click:submit="purchaseOrderStore.fetchModalFilter()"
            @click:clear="purchaseOrderStore.handleClearQuery()"
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
        @update:options="(data:any) => purchaseOrderStore.fetchDataServerFetch(data)"
        fixed-header
        height="450"
        hover
      >
        <template #item.item_type="{ item }">
          <span class="capitalize"
            >{{ defineItemTypePurchaseOrder(item as PoDtType) }}
          </span>
        </template>
        <template #item.qty="{ item }">
          <d-num-layout :value="item.qty" />
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
            @click="purchaseOrderStore.onClickUpdateBomsModal()"
          >
            <Icon name="material-symbols:save-rounded" size="20" />
            Add Selected Boms ({{ itemsCheck.checkBoms.length }})
          </button>
        </div>
      </template>
    </modals-final-modal>
  </div>
</template>
