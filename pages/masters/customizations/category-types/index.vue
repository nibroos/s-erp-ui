<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useCustomerTypeStore from "~/stores/masters/CustomerTypeStore";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const { queryModal } = useCustomerTypeStore();
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Category Types",
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
    title: "Description",
    key: "description",
    value: "description",
    align: "start",
    sortable: true,
  },
  {
    title: "Remark",
    key: "remark",
    value: "remark",
    align: "start",
    sortable: true,
  },
  {
    title: "Status",
    key: "status",
    value: "status",
    align: "start",
    sortable: true,
  },
]);

const filtersConfig = ref<FilterSelectableType[]>([
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Description",
    key: "description",
  },
  {
    title: "Remark",
    key: "remark",
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
    <l-top-menu
      :top-menu="topMenuCustomizationTab"
      parent_link=""
      @update:parent-link="getParentLink"
    >
    </l-top-menu>

    <d-datatable
      api="/v1/category-types/index-category-type"
      edit-link="/masters/customizations/category-types/edit"
      delete-api="/v1/category-types/delete-category-type"
      method-api="post"
      detail-method-api="post"
      items-prop="data"
      total-prop="meta.total"
      label="Master Category Type"
      class="col-span-2 lg:col-span-1"
      search-placeholder="Search anything related to customer types.."
      is-quick-select
      no-title
      :fields="fieldsConfig"
      :filters="filtersConfig"
      :query-modal="queryModal.qListIndex"
      :create-option="{
        link: '/masters/customizations/category-types/create',
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
  </div>
</template>