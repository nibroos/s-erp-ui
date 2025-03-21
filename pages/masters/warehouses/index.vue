<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useWarehouseStore from "~/stores/masters/WarehouseStore";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const { queryModal } = useWarehouseStore();
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Warehouses",
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
    title: "Code",
    key: "code",
    value: "code",
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
    title: "Code",
    key: "code",
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

    <d-index-layout
      :config="{
        permission: {
          isActive: true,
          name: ['r_ms'],
        },
      }"
    >
      <d-datatable
        api="/v1/warehouses/index-warehouse"
        edit-link="/masters/warehouses/edit"
        delete-api="/v1/warehouses/delete-warehouse"
        method-api="post"
        items-prop="data"
        total-prop="meta.total"
        label="Warehouses"
        class="col-span-2 lg:col-span-1"
        search-placeholder="Search anything related to warehouse types.."
        no-title
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qListIndex"
        :create-option="{
          link: '/masters/warehouses/create',
          show: true,
          cta: '+ Create',
        }"
        @update:filters="
          (filters: typeof queryModal.qListIndex) => {
            queryModal.qListIndex = filters;
          }
        "
      >
        <template #item.status="{ item }">
          <d-active-status :value="item.status" />
        </template>
      </d-datatable>
    </d-index-layout>
  </div>
</template>