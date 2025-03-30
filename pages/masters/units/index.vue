<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useUnitStore from "~/stores/masters/UnitStore";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const { queryModal } = useUnitStore();
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Units",
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
        api="/v1/units/index-unit"
        detail-link="/masters/units"
        edit-link="/masters/units/edit"
        delete-api="/v1/units/delete-unit"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        label="Master User"
        class="col-span-2 lg:col-span-1"
        search-placeholder="Search anything related to units.."
        is-quick-select
        no-title
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qListIndex"
        :create-option="{
          link: '/masters/units/create',
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