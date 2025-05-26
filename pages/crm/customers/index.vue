<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useCustomerStore from "~/stores/masters/CustomerStore";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const { queryModal } = useCustomerStore();
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Customers",
});

const fieldsConfig = ref<FieldSelectableType[]>([
  {
    title: "Name",
    key: "name",
    value: "name",
    align: "start",
    sortable: true,
  },
  {
    title: "Category Type",
    key: "category_type_name",
    value: "category_type_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Contract Status",
    key: "is_contract",
    value: "is_contract",
    align: "start",
    sortable: true,
  },
  {
    title: "Contract Date",
    key: "contract_date",
    value: "contract_date",
    align: "start",
    sortable: true,
  },
  {
    title: "Contract Due Date",
    key: "due_at",
    value: "due_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Payment Type",
    key: "payment_type_name",
    value: "payment_type_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Price",
    key: "contract_price",
    value: "contract_price",
    align: "start",
    type: "number",
    sortable: true,
  },
  {
    title: "Updated By",
    key: "updated_by_name",
    value: "updated_by_name",
    align: "start",
    sortable: true,
  },
]);

const filtersConfig = ref<FilterSelectableType[]>([
  {
    title: "Customers",
    key: "customer_ids",
    type: "select-table",
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
      label: "Roles",
      innerSearchKey: "global",
      multiple: true,
      returnObject: false,
      itemColor: "brown-lighten-2",
      fields: useStatics.headersCustomer,
      filters: useStatics.filtersCustomer,
    },
  },
  {
    title: "Date Type",
    key: "date_type",
    type: "autocomplete-client",
    others: {
      items: useStatics.crmIndexDateType,
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
    title: "Category Type",
    key: "category_type_id",
    type: "autocomplete",
    others: {
      methodApi: "post",
      api: "/v1/category-types/index-category-type",
      singleApi: "/v1/category-types/index-category-type",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Category Type",
      innerSearchKey: "global",
    },
  },
  {
    title: "Payment Type",
    key: "payment_type_id",
    type: "autocomplete",
    others: {
      methodApi: "post",
      api: "/v1/payment-types/index-payment-type",
      singleApi: "/v1/payment-types/index-payment-type",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Payment Type",
      innerSearchKey: "global",
    },
  },
]);
</script>

<template>
  <d-index-layout
    :config="{
      permission: {
        isActive: true,
        name: ['r_ms', 'superadmin'],
      },
    }"
  >
    <d-datatable
      api="/v1/customers/index-customer"
      edit-link="/crm/customers/edit"
      delete-api="/v1/customers/delete-crm-customer"
      method-api="post"
      detail-method-api="post"
      items-prop="data"
      total-prop="meta.total"
      label="Master User"
      class="col-span-2 lg:col-span-1"
      search-placeholder="Search anything related to customer types.."
      is-quick-select
      no-title
      :fields="fieldsConfig"
      :filters="filtersConfig"
      :query-modal="queryModal.qListIndex"
      :create-option="{
        link: '/crm/customers/create',
        show: true,
        cta: '+ Create',
      }"
      :query="{
        is_active: 1,
        is_crm: 1,
      }"
      @update:filters="
        (filters) => {
          queryModal.qListIndex = filters;
        }
      "
    >
      <template #item.is_contract="{ item }">
        <d-active-status :value="item.is_contract" />
      </template>
      <template #item.due_at="{ item }">
        <div
          :class="
            classMerge(
              'w-full h-full flex items-center',
              // if !!due_at && due_at close to today (3 months or less) bg-yellow-200
              item.due_at &&
                new Date(item.due_at) <
                  new Date(new Date().setMonth(new Date().getMonth() + 3))
                ? 'bg-yellow-200'
                : // if !!due_at && due-at past today (3 months or more) bg-red-200
                item.due_at &&
                  new Date(item.due_at) <
                    new Date(new Date().setMonth(new Date().getMonth() - 3))
                ? 'bg-red-200'
                : ''
            )
          "
        >
          {{ item.due_at }}
        </div>
      </template>
    </d-datatable>
  </d-index-layout>
</template>