<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useQuotationStore from "~/stores/orders/QuotationStore";
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
  FormQuoDtProductListType,
  ModalIndexProductFilterAutoCompleteType,
  ModalIndexProductFilterTextType,
  QuoDtBomType,
  QuoDtDiscType,
  QuoDtType,
  VatModeType,
} from "~/types/quotations/QuotationType";
import { updateQuoRefsModalFromMain } from "~/composables/maps/quotationComp";
import type { ProductBomListType } from "~/types/masters/ProductType";

const router = useRouter();
const layoutStore = useLayoutsStore();
const { topTitle } = storeToRefs(layoutStore);

const quotationStore = useQuotationStore();
const {
  tabFormIndex,
  form,
  errors,
  itemsCheck,
  isOpenModal,
  queryModal,
  metaModal,
  optionRefBtnRef,
  loading,
  openedModal,
} = storeToRefs(quotationStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Edit Quotation",
});

const id = ref(router.currentRoute.value.params.id);

const headers = ref<FieldSelectableType[]>([
  // { key: "ref_type", title: "Ref Type", sortable: true },
  { title: "", key: "expand", width: 20, sortable: false },
  { key: "item_type", title: "Item Type", sortable: true },
  { key: "item_code", title: "Product Code", sortable: true },
  { key: "item_name", title: "Product Name", sortable: true },
  { key: "unit_name", title: "Unit", sortable: true },
  { key: "price_buy", title: "Price Buy", sortable: true, align: "end" },
  { key: "qty", title: "Qty", sortable: true, align: "end" },
  { key: "markup", title: "Markup (%)", sortable: true, align: "end" },
  { key: "price_sell", title: "Price Sell", sortable: true, align: "end" },
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

const headersBOM = ref([
  { key: "item_code", title: "Product Code", sortable: true },
  { key: "item_name", title: "Product Name", sortable: true },
  { key: "unit_name", title: "Unit", sortable: true },
  { key: "price_buy", title: "Price Buy", sortable: true, align: "end" },
  { key: "qty", title: "Qty", sortable: true, align: "end" },
  { key: "subtotal_buy", title: "Total Amount", sortable: true, align: "end" },
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
  { key: "remark", title: "Remark", sortable: true },
]) as Ref<FieldSelectableType[]>;

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
    title: "Stock",
    key: "qty_stock",
    value: "qty_stock",
    align: "end",
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

const summaryLayout = ref({
  total_amount: {
    label: "Sub Amount",
    symbol: currencySymbolLabel.value,
    value: form.value.subtotal,

    format: {
      precision: 2,
    },
  },
  total_discount: {
    label: "Total Discount",
    symbol: currencySymbolLabel.value,
    value: form.value.total_discount,

    format: {
      precision: 2,
    },
  },
  total_vat: {
    label: "Total VAT",
    symbol: currencySymbolLabel.value,
    value: form.value.total_vat,
    percentage: form.value.vat_perc,

    format: {
      precision: 2,
    },
  },
  total_pph23: {
    label: "Total PPH23",
    symbol: currencySymbolLabel.value,
    value: form.value.total_pph23,
    percentage: form.value.pph23_perc,

    format: {
      precision: 2,
    },
  },
  grand_total: {
    label: "Grand Total",
    symbol: currencySymbolLabel.value,
    value: form.value.grand_total,

    format: {
      precision: 2,
    },
  },
});

const formLayout = ref({
  title: "Basic Information",
  parentPath: "/orders/quotations",
  currentTab: tabFormIndex.value,
  tabs: ["Items", "Payments", "Remark"],
  mode: "edit",
  button: {
    create: {
      path: "/orders/quotations/create",
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
  summary: summaryLayout.value,
} as FormLayoutType);

// const formSchema = z.object({
//   name: customRules.required("name", form.value.name),
//   item_group_id: customRules.required(
//     "item_group_id",
//     form.value.item_group_id
//   ),
// });

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

  form.value.quo_dts = itemsCheck.value.checkMain;

  await quotationStore.update();
};

const onClickOpenModalOptionRefBtn = async (ref: RefBtnType) => {
  isOpenModal.value.products = false;
  if (ref.key == "products") {
    itemsCheck.value.checkProducts = updateQuoRefsModalFromMain(
      itemsCheck.value.checkMain,
      "products",
      itemsCheck.value.checkProducts
    );

    quotationStore.countSelectedReferences();
    isOpenModal.value.products = true;
  }

  await quotationStore.indexProduct();
};

const fetchModalFilter = async () => {
  if (isOpenModal.value.products || isOpenModal.value.boms) {
    await quotationStore.indexProduct();
  }
  // else if (showModal.value.listPO) {
  //   queryModal.value.qListPO.customer_id = form.value.customer_id
  //   await useInventoryIn.getPurchaseOrderData(
  //     qs.stringify(queryModal.value.qListPO)
  //   )
  // } else if (showModal.value.listWip) {
  //   // queryModal.value.qListWip.customer_id = form.value.customer_id
  //   // queryModal.value.qListWip.mode = 'OUT'

  //   await useInventoryIn.getAllDataRequestWIP()
  // }
};

const fetchInitialData = async () => {
  form.value.id = Number(id.value);
  await Promise.all([quotationStore.show(), quotationStore.indexProduct()]);
};

const closeAllModal = () => {
  isOpenModal.value.products = false;
  isOpenModal.value.boms = false;
};

const fetchDataServerFetch = async (options: { [key: string]: any }) => {
  if (isOpenModal.value.products) {
    queryModal.value.qIndexProducts.page = options.page;
    queryModal.value.qIndexProducts.per_page = options.itemsPerPage;

    if (options.sortBy.length > 0) {
      queryModal.value.qIndexProducts.order_column = options.sortBy[0].key;
      queryModal.value.qIndexProducts.order_direction = options.sortBy[0].order;
    } else {
      queryModal.value.qIndexProducts.order_column = "";
      queryModal.value.qIndexProducts.order_direction = "";
    }
  }

  if (isOpenModal.value.boms) {
    queryModal.value.qIndexBoms.page = options.page;
    queryModal.value.qIndexBoms.per_page = options.itemsPerPage;

    if (options.sortBy.length > 0) {
      queryModal.value.qIndexBoms.order_column = options.sortBy[0].key;
      queryModal.value.qIndexBoms.order_direction = options.sortBy[0].order;
    } else {
      queryModal.value.qIndexBoms.order_column = "";
      queryModal.value.qIndexBoms.order_direction = "";
    }
  }

  fetchModalFilter();
};

const onClickUpdateProductsModal = () => {
  quotationStore.selectItemRefModal();
  quotationStore.countSelectedReferences();
  closeAllModal();
};

const onClickDeleteSelected = (item: any, index: number) => {
  itemsCheck.value.checkMain.splice(index, 1);

  quotationStore.countSelectedReferences();
};

const onClickUpdateBomsModal = () => {
  // console.log("item, onClickUpdateBomsModal", itemsCheck.value.checkBoms);
  quotationStore.selectItemRefModal();
  quotationStore.countSelectedReferences();
  closeAllModal();
};

const onClickOpenModalBOM = async (
  item: FormQuoDtProductListType,
  index: number
) => {
  openedModal.value.boms.index = index;
  openedModal.value.boms.id = item.ref_id;
  openedModal.value.boms.product_id = item.item_id as number;
  openedModal.value.boms.product_uuid = item.product_uuid as string;

  itemsCheck.value.checkBoms = item.quo_dts_boms;
  isOpenModal.value.boms = true;
  await quotationStore.indexProduct();
};

const onClickDeleteBom = (
  index: number,
  indexBom: number,
  internalItem: any
) => {
  const item = itemsCheck.value.checkMain[index];
  if (item && item.quo_dts_boms) {
    item.quo_dts_boms.splice(indexBom, 1);
  }

  quotationStore.calculateTotalAmount();
};

const calculateTotalAmountLocal = () => {
  quotationStore.calculateTotalAmount();

  if (formLayout.value.summary) {
    formLayout.value.summary.total_amount.value = form.value.subtotal;
    formLayout.value.summary.total_discount.value = form.value.total_discount;
    formLayout.value.summary.total_vat.value = form.value.total_vat;
    formLayout.value.summary.total_pph23.value = form.value.total_pph23;
    formLayout.value.summary.grand_total.value = form.value.grand_total;

    // TODO foreach currency symbol
  }
};

const clickClearForm = () => {
  quotationStore.handleClickClear();
  quotationStore.calculateTotalAmount();
};

onMounted(async () => {
  clickClearForm();
  await fetchInitialData();
  // quotationStore.updateRefsModal();
});

watchEffect(() => {
  // changeTitle();
  topTitle.value = "Quotations";
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <d-form-layout
      :config="formLayout"
      @click:save="handleSubmit()"
      @click:clear="quotationStore.handleClickClear()"
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
              v-model="form.quo_no"
              :label="`Quotation No`"
              :placeholder="`Quotation No`"
              :errors="errors.name"
            >
            </d-text-input>
          </div>
          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.title"
              :label="`Title`"
              :placeholder="`Title`"
              :errors="errors.title"
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
              label="Customer"
              v-model="form.customer_id"
              class="col-span-2 lg:col-span-1"
              is-quick-select
              @click:selected="
                (data) => quotationStore.autocompleteCustomer(data)
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
          <div class="sm:col-span-1">
            <d-date-picker-light
              v-model="form.due_at"
              label="Due Date"
            ></d-date-picker-light>
          </div>
          <div class="sm:col-span-1">
            <d-date-picker-light
              v-model="form.expired_at"
              label="Expired Date"
            ></d-date-picker-light>
          </div>
          <div class="sm:col-span-1">
            <d-autocomplete-client
              v-model="form.status"
              :items="useStatics.formStatusQuotation"
              label="Status"
              item-value="id"
              item-title="name"
              :clearable="false"
            />
          </div>
          <div class="sm:col-span-1">
            <d-switch-status v-model="form.is_approved" :label="`Approve`" />
          </div>
          <d-bt type="submit" class="!hidden"></d-bt>
        </form>
      </template>
      <template #content>
        <div
          v-if="tabFormIndex == useStatics.formTabQuotation.items"
          class="grid grid-cols-3 sm:grid-cols-1 gap-2"
        >
          <d-option-ref-btn
            :refs="optionRefBtnRef"
            class="col-span-2"
            @click:ref="onClickOpenModalOptionRefBtn"
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
            @click="quotationStore.clickClearRefs"
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
            <template #item.markup="{ item }">
              <d-num-v-format
                v-model="item.markup"
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
            <template #item.price_buy="{ item }">
              <d-num-layout :value="item.price_buy" />
            </template>
            <template #item.price_sell="{ item }">
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
              <div class="flex flex-col">
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
              </div>
            </template>

            <template #item.total_am="{ item }">
              <d-num-layout :value="item.total_am" />
            </template>
            <template #item.action="{ item, index }">
              <div class="action-button flex gap-2">
                <d-bt
                  v-if="item.item_type == 'product'"
                  @click="onClickOpenModalBOM(((item as unknown as FormQuoDtProductListType)), index)"
                  class="px-2 py-1 bg-scLighter hover:bg-scDarker hover:text-primary1 rounded-lg ease-in-out transition-all hover:dark:!bg-scDarker3 dark:!bg-sc"
                  text-class="text-primary1 dark:text-white"
                  rounded="xl"
                  cta="+ Add BOM"
                  no-icon
                ></d-bt>
                <d-bt
                  @click="onClickDeleteSelected(item, index)"
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
                  internalItem.raw.quo_dts_boms &&
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
              <tr v-if="item.quo_dts_boms.length > 0">
                <td :colspan="columns.length" class="!p-0">
                  <div class="">
                    <v-data-table-virtual
                      :headers="headersBOM"
                      :items="item.quo_dts_boms || []"
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
                      <template #item.remark="{ item }">
                        <d-text-area-input
                          v-model="(item as QuoDtType).remark"
                          :label="``"
                          :placeholder="`Remark`"
                          class="w-full"
                        />
                      </template>
                      <template #item.qty="{ item }">
                        <d-num-v-format
                          v-model="(item as QuoDtType).qty"
                          :precision="{
                            min: 3,
                            max: 3,
                          }"
                          hide-currency-display
                          label=""
                          class="w-full"
                        />
                      </template>
                      <template #item.price_buy="{ item }">
                        <d-num-v-format
                          v-model="(item as QuoDtType).price_buy"
                          :precision="{
                            min: 3,
                            max: 3,
                          }"
                          hide-currency-display
                          label=""
                          class="w-full"
                        />
                      </template>
                      <template #item.subtotal_buy="{ item }">
                        <d-num-layout :value="item.subtotal_buy" />
                      </template>
                      <template #item.action="{ item: itemBom, index: iBom }">
                        <div class="action-button">
                          <d-bt
                            @click="onClickDeleteBom(index, iBom, internalItem)"
                            icon="mdi-delete"
                            is-no-text
                            class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                            icon-class="text-cancel dark:text-primary1"
                            rounded="xl"
                            cta="delete"
                            icon-size="16"
                            :is-notif="true"
                            :notif-text="`${(itemBom as QuoDtBomType).item_name} deleted`"
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
          v-if="tabFormIndex == useStatics.formTabQuotation.payments"
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
                (data) => quotationStore.autocompleteCurrency(data)
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
              @click:selected="(data) => quotationStore.autocompleteVat(data)"
              @click:clear="quotationStore.removeVat()"
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
              v-model="form.vat_perc"
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
                (data, oldId) => quotationStore.autocompletePph(data, oldId)
              "
              @click:clear="quotationStore.removePph()"
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
              v-model="form.pph23_perc"
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
              v-model="form.disc_perc"
              :precision="{
                min: 3,
                max: 3,
              }"
              hide-currency-display
              @update:modelValue="calculateTotalAmountLocal"
              label="Disc (%)"
            />
          </div>
          <div class="sm:col-span-1">
            <d-num-v-format
              v-model="form.disc_am"
              :precision="{
                min: 3,
                max: 3,
              }"
              hide-currency-display
              @update:modelValue="calculateTotalAmountLocal"
              label="Disc Amount"
            />
          </div>
          <div class="sm:col-span-1">
            <d-num-v-format
              v-model="form.disc_am"
              :precision="{
                min: 3,
                max: 3,
              }"
              hide-currency-display
              @update:modelValue="calculateTotalAmountLocal"
              label="Markup (%)"
            />
          </div>
        </div>
        <div v-if="tabFormIndex == useStatics.formTabQuotation.remarks">
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
      parent-class="!z-[1500]"
      label="List of Products"
      @update:is-open="isOpenModal.products = $event"
    >
      <template #top>
        <form
          class="grid grid-cols-5 w-full flex-row items-center gap-2"
          @submit.prevent="fetchModalFilter"
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
            @click:submit="fetchModalFilter"
            @click:clear="quotationStore.handleClearQuery()"
            class="grid-cols-1"
          />
        </form>
      </template>

      <v-data-table-server
        v-model="itemsCheck.checkProducts"
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
        @update:options="fetchDataServerFetch"
        fixed-header
        height="450"
        hover
      >
        <template #item.item_type="{ item }">
          <span class="capitalize"
            >{{ defineQuoItemTypeQuotation((item as QuoDtType)) }}
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

        <template #item.price_sell="{ item }">
          <d-num-layout :value="item.price_sell" />
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
          <tr v-if="item.quo_dts_boms.length > 0">
            <td :colspan="columns.length" class="!p-0">
              <div class="">
                <v-data-table-virtual
                  :headers="headersBOMModal"
                  :items="item.quo_dts_boms || []"
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
                      @update:modelValue="calculateTotalAmountLocal"
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
                </v-data-table-virtual>
              </div>
            </td>
          </tr>
          <tr v-else-if="item.boms.length > 0">
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
                  <template #item.qty="{ item }">
                    <d-num-layout :value="(item as ProductBomListType).qty" />
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
            @click="onClickUpdateProductsModal"
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
          @submit.prevent="fetchModalFilter"
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
            @click:submit="fetchModalFilter"
            @click:clear="quotationStore.handleClearQuery()"
            class="grid-cols-1"
          />
        </form>
      </template>

      <v-data-table-server
        v-model="itemsCheck.checkBoms"
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
        @update:options="fetchDataServerFetch"
        fixed-header
        height="450"
        hover
      >
        <template #item.item_type="{ item }">
          <span class="capitalize"
            >{{ defineQuoItemTypeQuotation((item as QuoDtType)) }}
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
            @click="onClickUpdateBomsModal"
          >
            <Icon name="material-symbols:save-rounded" size="20" />
            Add Selected Boms ({{ itemsCheck.checkBoms.length }})
          </button>
        </div>
      </template>
    </modals-final-modal>
  </div>
</template>