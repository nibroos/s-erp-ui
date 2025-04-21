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
    title: "Customer Type",
    key: "customer_type_name",
    value: "customer_type_name",
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
  {
    title: "Email",
    key: "email",
    value: "email",
    align: "start",
    sortable: true,
  },
  {
    title: "Phone",
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
]);

const filtersConfig = ref<FilterSelectableType[]>([
  {
    title: "Customer Type",
    key: "customer_type_id",
    type: "autocomplete",
    others: {
      methodApi: "post",
      api: "/v1/customer-types/index-customer-type",
      singleApi: "/v1/customer-types/index-customer-type",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Customer Type",
      innerSearchKey: "global",
    },
  },
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Code",
    key: "code",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Phone",
    key: "phone",
  },
]);
</script>

<template>
  <lazy-layout-topmenu :top-menu="topMenuMasterTab">
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
        detail-link="/masters/customers"
        edit-link="/masters/customers/edit"
        delete-api="/v1/customers/delete-customer"
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
          link: '/masters/customers/create',
          show: true,
          cta: '+ Create',
        }"
        @update:filters="
          (filters) => {
            queryModal.qListIndex = filters;
          }
        "
      >
        <template #item.status="{ item }">
          <d-active-status :value="item.status" />
        </template>
      </d-datatable>
    </d-index-layout>
  </lazy-layout-topmenu>
</template>