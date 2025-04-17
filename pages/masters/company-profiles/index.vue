<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useCompanyProfileStore from "~/stores/masters/CompanyProfileStore";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const { queryModal } = useCompanyProfileStore();
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Company Profiles",
});

const fieldsConfig = ref<FieldSelectableType[]>([
  {
    title: "Company Name",
    key: "company_name",
    value: "company_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Owner",
    key: "company_owner_name",
    value: "company_owner_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Phone",
    key: "company_phone",
    value: "company_phone",
    align: "start",
    sortable: true,
  },
  {
    title: "Email",
    key: "company_email",
    value: "company_email",
    align: "start",
    sortable: true,
  },
  {
    title: "Status",
    key: "company_status",
    value: "company_status",
    align: "start",
    sortable: true,
  },
  {
    title: "Default Status",
    key: "is_primary",
    value: "is_primary",
    align: "start",
    sortable: true,
  },
]);

const filtersConfig = ref<FilterSelectableType[]>([
  {
    title: "Company Name",
    key: "company_name",
  },
  {
    title: "Owner",
    key: "company_owner_name",
  },
  {
    title: "Phone",
    key: "company_phone",
  },
  {
    title: "Email",
    key: "company_email",
  },
]);

const parentLink = ref("");
const getParentLink = (link: string) => {
  parentLink.value = link;
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <l-top-menu :top-menu="topMenuMasterTab" :parent_link="parentLink">
    </l-top-menu>

    <d-index-layout
      :config="{
        permission: {
          isActive: true,
          name: ['r_ms'],
        },
      }"
    >
      <d-datatable
        api="/v1/company-profiles/index-company-profile"
        edit-link="/masters/company-profiles/edit"
        delete-api="/v1/company-profiles/delete-company-profile"
        method-api="post"
        items-prop="data"
        total-prop="meta.total"
        label="Company Profiles"
        class="col-span-2 lg:col-span-1"
        search-placeholder="Search anything related to company profiles.."
        no-title
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qListIndex"
        :create-option="{
          link: '/masters/company-profiles/create',
          show: true,
          cta: '+ Create',
        }"
        @update:filters="
          (filters: typeof queryModal.qListIndex) => {
            queryModal.qListIndex = filters;
          }
        "
      >
        <template #item.company_status="{ item }">
          <d-active-status :value="item.company_status" />
        </template>
        <template #item.is_primary="{ item }">
          <d-active-status :value="item.is_primary" />
        </template>
      </d-datatable>
    </d-index-layout>
  </div>
</template>
