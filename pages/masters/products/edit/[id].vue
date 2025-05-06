<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useProductStore from "~/stores/masters/ProductStore";
import type { RefBtnType } from "~/types/components/OptionRefBtnType";
import type { FormLayoutType } from "~/types/FormLayoutType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";
import type {
  ModalIndexMasterFilterTextType,
  ProductBomListType,
} from "~/types/masters/ProductType";
import useUnitStore from "~/stores/masters/UnitStore";
import type {
  ModalIndexProductFilterAutoCompleteType,
  ModalIndexProductFilterTextType,
} from "~/types/quotations/QuotationType";

const router = useRouter();
const layoutStore = useLayoutsStore();
const { topTitle } = storeToRefs(layoutStore);

const unitStore = useUnitStore();
const {} = storeToRefs(unitStore);

const productStore = useProductStore();
const {
  tabFormIndex,
  form,
  errors,
  itemsCheck,
  isOpenModal,
  queryModal,
  metaModal,
  loading,
} = storeToRefs(productStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Edit Product",
});

const id = ref(router.currentRoute.value.params.id);

const headersBoms = ref<FieldSelectableType[]>([
  { key: "code", title: "Item Code", sortable: true },
  { key: "name", title: "Item Name", sortable: true },
  { key: "qty", title: "Qty", sortable: true, align: "end" },
  // { key: "price_buy", title: "Price Buy", sortable: true, align: "end" },
  // { key: "price_sell", title: "Price Sell", sortable: true, align: "end" },
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

const headersUnits = ref<FieldSelectableType[]>([
  { key: "name", title: "Unit", sortable: true },
  { key: "conversion", title: "Conversion", sortable: true, align: "end" },
  { key: "price_buy", title: "Price Buy", sortable: true, align: "end" },
  { key: "price_sell", title: "Price Sell", sortable: true, align: "end" },
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

const headersSubGroup = ref<FieldSelectableType[]>([
  {
    title: "Group",
    key: "group_name",
    value: "group_name",
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
    title: "Code",
    key: "code",
    value: "code",
    align: "start",
    sortable: true,
  },
]);

const filtersSubGroup = ref<FilterSelectableType[]>([
  {
    title: "Sub Group Type",
    key: "group_ids",
    type: "autocomplete",
    display: "name",
    others: {
      methodApi: "post",
      api: "/v1/item-groups/index-item-group",
      singleApi: "/v1/item-groups/index-item-group",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "SubGroup Type",
      innerSearchKey: "global",
    },
  },
]);

const headersModalBoms = ref<FieldSelectableType[]>([
  { key: "item_group_name", title: "Group", sortable: true },
  { key: "item_sub_group_name", title: "Subgroup", sortable: true },
  { key: "code", title: "Product Code", sortable: true },
  { key: "name", title: "Product Name", sortable: true },
  { key: "unit_name", title: "Unit", sortable: true },
  { key: "sku", title: "SKU", align: "end", sortable: true },
  { key: "barcode", title: "Barcode", align: "end", sortable: true },
  {
    key: "specification",
    title: "Specification",
    align: "end",
    sortable: true,
  },
  { key: "price_sell", title: "Price Sell", align: "end", sortable: true },
  { key: "price_buy", title: "Price Buy", align: "end", sortable: true },
  { key: "remark", title: "Remark", sortable: true },
]);

const headersModalUnits = ref<FieldSelectableType[]>([
  {
    title: "Unit Name",
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
  // {
  //   title: "Price Buy",
  //   key: "price_buy",
  //   value: "price_buy",
  //   align: "end",
  //   sortable: true,
  // },
  // {
  //   title: "Price Sell",
  //   key: "price_sell",
  //   value: "price_sell",
  //   align: "end",
  //   sortable: true,
  // },
  // {
  //   title: "Conversion",
  //   key: "conversion",
  //   value: "conversion",
  //   align: "end",
  //   sortable: true,
  // },
]);

const filtersOptionsBoms = ref([
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

const filtersTextBoms = ref([
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
const filtersTextUnits = ref([
  {
    title: "Code",
    key: "code",
  },
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Global",
    key: "global",
  },
]);

const formLayout = ref({
  title: "Basic Information",
  parentPath: "/masters/products",
  currentTab: tabFormIndex.value,
  tabs: ["BOM", "Conversions", "Remark"],
  mode: "edit",
  button: {
    create: {
      path: "/masters/products/create",
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
  summary: {},
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

  form.value.boms = itemsCheck.value.checkMainBoms;
  form.value.units = itemsCheck.value.checkMainUnits;

  await productStore.update();
};

// const onClickOpenModalOptionRefBtn = async (ref: RefBtnType) => {
//   isOpenModal.value.units = false;
//   if (ref.key == "units") {
//     isOpenModal.value.units = true;
//   } else if (ref.key == "boms") {
//     isOpenModal.value.boms = true;
//   }

//   await productStore.indexUnit();
// };

const fetchInitialData = async () => {
  form.value.id = Number(id.value);
  await Promise.all([productStore.show(), productStore.indexUnit()]);
};

const closeAllModal = () => {
  isOpenModal.value.units = false;
  isOpenModal.value.boms = false;
};

const fetchDataServerFetch = async (options: { [key: string]: any }) => {
  if (isOpenModal.value.units) {
    queryModal.value.qListUnits.page = options.page;
    queryModal.value.qListUnits.per_page = options.itemsPerPage;

    if (options.sortBy.length > 0) {
      queryModal.value.qListUnits.order_column = options.sortBy[0].key;
      queryModal.value.qListUnits.order_direction = options.sortBy[0].order;
    } else {
      queryModal.value.qListUnits.order_column = "";
      queryModal.value.qListUnits.order_direction = "";
    }
  }

  if (isOpenModal.value.boms) {
    queryModal.value.qListBoms.page = options.page;
    queryModal.value.qListBoms.per_page = options.itemsPerPage;

    if (options.sortBy.length > 0) {
      queryModal.value.qListBoms.order_column = options.sortBy[0].key;
      queryModal.value.qListBoms.order_direction = options.sortBy[0].order;
    } else {
      queryModal.value.qListBoms.order_column = "";
      queryModal.value.qListBoms.order_direction = "";
    }
  }

  productStore.fetchModalFilter();
};

const onClickUpdateProductsModal = () => {
  productStore.selectItemRefModal();
  closeAllModal();
};

const onClickDeleteSelected = (item: any, index: number) => {
  itemsCheck.value.checkMainBoms.splice(index, 1);
};

const onClickDeleteSelectedUnit = (item: any, index: number) => {
  itemsCheck.value.checkMainUnits.splice(index, 1);
};

const onClickUpdateBomsModal = () => {
  // console.log("item, onClickUpdateBomsModal", itemsCheck.value.checkBoms);
  productStore.selectItemRefModal();
  closeAllModal();
};

const clickClearForm = () => {
  productStore.handleClickClear();
};

onMounted(async () => {
  clickClearForm();
  await fetchInitialData();
  // productStore.updateRefsModal();
});

watchEffect(() => {
  // changeTitle();
  topTitle.value = "Products";
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <d-form-layout
      :config="formLayout"
      @click:save="handleSubmit()"
      @click:clear="productStore.handleClickClear()"
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
              v-model="form.code"
              :label="`Code`"
              :placeholder="`Code`"
              :errors="errors.code"
            >
            </d-text-input>
          </div>
          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.name"
              :label="`Name`"
              :placeholder="`Name`"
              :errors="errors.name"
            />
          </div>
          <div class="sm:col-span-1">
            <d-select-table
              api="/v1/item-sub-groups/index-item-sub-group"
              detail-api="/v1/item-sub-groups/index-item-sub-group"
              method-api="post"
              detail-method-api="post"
              mapping-detail="data[0]"
              total-prop="meta.total"
              label="Sub Group"
              v-model="form.item_sub_group_id"
              class="col-span-2 lg:col-span-1"
              is-quick-select
              modal-custom-class="!w-4/5"
              :fields="headersSubGroup"
              :filters="filtersSubGroup"
            />
          </div>

          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.sku"
              :label="`SKU`"
              :placeholder="`SKU`"
              :errors="errors.sku"
            />
          </div>
          <div class="sm:col-span-1">
            <d-text-input
              v-model="form.barcode"
              :label="`Barcode`"
              :placeholder="`Barcode`"
              :errors="errors.barcode"
            />
          </div>

          <div class="sm:col-span-1">
            <d-date-picker-light
              v-model="form.expired_at"
              label="Expired Date"
            ></d-date-picker-light>
          </div>
          <div class="sm:col-span-1">
            <div class="sm:col-span-1">
              <d-autocomplete-client
                v-model="form.item_unit_id"
                :items="itemsCheck.checkMainUnits"
                label="Unit"
                item-value="unit_id"
                item-title="name"
                :clearable="false"
              />

              <!-- <d-autocomplete
                v-model="form.item_unit_id"
                api="/v1/units/index-unit"
                single-api="/v1/units/show-unit"
                page-end-prop="meta.next_page_url"
                item-title="name"
                item-value="id"
                method-api="post"
                inner-search-key="global"
                label="Unit"
                :errors="errors.item_unit_id"
              ></d-autocomplete> -->
            </div>
          </div>

          <div
            class="sm:col-span-1 col-span-2 flex gap-2 sm:grid sm:grid-cols-2"
          >
            <d-switch-status
              v-model="form.status"
              :label="`Status`"
              class="col-span-2"
            />
            <d-switch-status v-model="form.is_vat" :label="`VAT`" />
            <d-switch-status v-model="form.is_pph23" :label="`PPH23`" />
          </div>
          <d-bt type="submit" class="!hidden"></d-bt>
        </form>
      </template>
      <template #content>
        <div
          v-if="tabFormIndex == useStatics.formTabProduct.boms"
          class="grid grid-cols-3 sm:grid-cols-1 gap-2"
        >
          <div class="col-span-2">
            <d-bt
              :class="'!border !border-solid p-2 gap-1 text-dark1 !border-grey3 dark:border-dark1 transition-all ease-in-out dark:bg-dark2 dark:hover:bg-dark1 dark:text-primary1 rounded-lg'"
              @click="
                productStore.onClickOpenModalOptionRefBtn({ key: 'boms' })
              "
              :cta="`BOM (${itemsCheck.checkMainBoms.length})`"
              no-icon
              :type="'button'"
              key="products"
              icon="mdi-alpha-m-box-outline"
            >
            </d-bt>
          </div>

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
            @click="productStore.clickClearRefs"
          />
          <v-data-table-virtual
            :items="itemsCheck.checkMainBoms ?? []"
            :headers="headersBoms"
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
            <template #item.remark="{ item }">
              <d-text-area-input
                v-model="item.remark"
                :label="``"
                :placeholder="`Remark`"
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
                :initial-value="item.qty ?? 1"
                class="w-full"
              />
            </template>
            <!-- <template #item.price_buy="{ item }">
              <d-num-v-format
                v-model="item.price_buy"
                :precision="{
                  min: 3,
                  max: 3,
                }"
                hide-currency-display
                label=""
                class="w-[9rem]"
              />
            </template>
            <template #item.price_sell="{ item }">
              <d-num-v-format
                v-model="item.price_sell"
                :precision="{
                  min: 3,
                  max: 3,
                }"
                hide-currency-display
                label=""
                class="w-[9rem]"
              />
            </template> -->
            <template #item.action="{ item, index }">
              <div class="action-button flex gap-2">
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
          </v-data-table-virtual>
        </div>
        <div
          v-if="tabFormIndex == useStatics.formTabProduct.units"
          class="grid grid-cols-3 sm:grid-cols-1 gap-2"
        >
          <div class="col-span-2">
            <d-bt
              :class="'!border !border-solid p-2 gap-1 text-dark1 !border-grey3 dark:border-dark1 transition-all ease-in-out dark:bg-dark2 dark:hover:bg-dark1 dark:text-primary1 rounded-lg'"
              @click="
                productStore.onClickOpenModalOptionRefBtn({ key: 'units' })
              "
              :cta="`Unit (${itemsCheck.checkMainUnits.length})`"
              no-icon
              :type="'button'"
              key="products"
              icon="mdi-alpha-m-box-outline"
            >
            </d-bt>
          </div>

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
            @click="productStore.clickClearRefs"
          />
          <v-data-table-virtual
            :items="itemsCheck.checkMainUnits ?? []"
            :headers="headersUnits"
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
            <template #item.conversion="{ item }">
              <div class="flex w-full justify-end">
                <d-num-v-format
                  v-model="item.conversion"
                  :precision="{
                    min: 3,
                    max: 3,
                  }"
                  :initial-value="item.conversion ?? 1"
                  hide-currency-display
                  label=""
                  class="w-[9rem]"
                />
              </div>
            </template>
            <template #item.price_buy="{ item }">
              <div class="flex w-full justify-end">
                <d-num-v-format
                  v-model="item.price_buy"
                  :precision="{
                    min: 3,
                    max: 3,
                  }"
                  hide-currency-display
                  label=""
                  class="w-[9rem]"
                />
              </div>
            </template>
            <template #item.price_sell="{ item }">
              <div class="flex w-full justify-end">
                <d-num-v-format
                  v-model="item.price_sell"
                  :precision="{
                    min: 3,
                    max: 3,
                  }"
                  hide-currency-display
                  label=""
                  class="w-[9rem]"
                />
              </div>
            </template>
            <template #item.action="{ item, index }">
              <div class="action-button flex gap-2">
                <d-bt
                  @click="onClickDeleteSelectedUnit(item, index)"
                  icon="mdi-delete"
                  is-no-text
                  class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                  icon-class="text-cancel dark:text-primary1"
                  rounded="xl"
                  size=""
                  cta="delete"
                  icon-size="16"
                  :is-notif="true"
                  :notif-text="`${item.name} deleted`"
                ></d-bt>
              </div>
            </template>
          </v-data-table-virtual>
        </div>
        <div
          v-if="tabFormIndex == useStatics.formTabProduct.remarks"
          class="grid grid-cols-1 gap-2"
        >
          <d-text-area-input
            v-model="form.remark"
            :label="`Remark`"
            :placeholder="`Remark`"
            :errors="errors.remark"
          />
          <d-text-input
            v-model="form.specification"
            :label="`Specification`"
            :placeholder="`Specification`"
            :errors="errors.specification"
          />
        </div>
      </template>
    </d-form-layout>
    <modals-final-modal
      :is-open="isOpenModal.units"
      size="xl"
      custom-class="overflow-y-auto"
      parent-class="!z-[1500]"
      label="List of Units"
      @update:is-open="isOpenModal.units = $event"
    >
      <template #top>
        <form
          class="grid grid-cols-5 w-full flex-row items-center gap-2"
          @submit.prevent="productStore.fetchModalFilter"
        >
          <d-text-input
            v-for="filter in filtersTextUnits"
            :key="filter.key"
            v-model="queryModal.qListUnits[filter.key as ModalIndexMasterFilterTextType]"
            :label="filter.title"
            :placeholder="filter.title"
            append-inner-icon="mdi-magnify"
          />

          <d-submit-button
            @click:submit="productStore.fetchModalFilter"
            @click:clear="productStore.handleClearQuery()"
            class="grid-cols-1"
          />
        </form>
      </template>

      <v-data-table-server
        v-model="itemsCheck.checkUnits"
        :items="metaModal.indexUnits.data ?? []"
        :headers="headersModalUnits"
        :items-per-page="queryModal.qListUnits.per_page"
        :items-length="metaModal.indexUnits.meta.total ?? 0"
        :items-per-page-options="useInitials.perPageOptions"
        :loading="metaModal.indexUnits.loading"
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
          />
        </template>

        <template #item.price_sell="{ item }">
          <d-num-layout :value="item.price_sell" />
        </template>
        <template #item.status="{ item }">
          <d-active-status :value="item.status" />
        </template>
      </v-data-table-server>

      <template #footer>
        <div class="flex h-max w-full justify-end">
          <button
            class="flex items-center gap-2 rounded-md bg-sc px-3 py-2 text-[15px] font-bold text-white shadow-md hover:shadow-xl"
            @click="onClickUpdateProductsModal"
          >
            <Icon name="material-symbols:save-rounded" size="20" />
            Add Selected Units ({{ itemsCheck.checkUnits.length }})
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
          @submit.prevent="productStore.fetchModalFilter"
        >
          <d-autocomplete
            v-for="filter in filtersOptionsBoms"
            :key="filter.key"
            v-model="queryModal.qListBoms[filter.key as ModalIndexProductFilterAutoCompleteType]"
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
            v-for="filter in filtersTextBoms"
            :key="filter.key"
            v-model="queryModal.qListBoms[filter.key as ModalIndexProductFilterTextType]"
            :label="filter.title"
            :placeholder="filter.title"
            append-inner-icon="mdi-magnify"
          />

          <d-submit-button
            @click:submit="productStore.fetchModalFilter"
            @click:clear="productStore.handleClearQuery()"
            class="grid-cols-1"
          />
        </form>
      </template>

      <v-data-table-server
        v-model="itemsCheck.checkBoms"
        :items="metaModal.indexBoms.data ?? []"
        :headers="headersModalBoms"
        :items-per-page="queryModal.qListBoms.per_page"
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