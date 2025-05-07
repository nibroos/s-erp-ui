<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useItemSubGroupStore from "~/stores/masters/ItemSubGroupStore";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const { queryModal } = useItemSubGroupStore();
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Item Sub Groups",
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
    title: "Group Name",
    key: "group_name",
    value: "group_name",
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
    title: "Group",
    key: "parent_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      query: {
        is_active: 1,
      },
      api: "/v1/item-groups/index-item-group",
      singleApi: "/v1/item-groups/index-item-group",
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
    },
  },
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

    <d-index-layout
      :config="{
        permission: {
          isActive: true,
          name: ['r_ms', 'superadmin'],
        },
      }"
    >
      <d-datatable
        api="/v1/item-sub-groups/index-item-sub-group"
        detail-link="/masters/customizations/item-sub-groups"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        label="Master Sub Group"
        class="col-span-2 lg:col-span-1"
        search-placeholder="Search anything related to item sub groups.."
        is-quick-select
        no-title
        edit-link="/masters/customizations/item-sub-groups/edit"
        delete-api="/v1/item-sub-groups/delete-item-sub-group"
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qListIndex"
        :create-option="{
          link: '/masters/customizations/item-sub-groups/create',
          show: true,
          cta: '+ Create',
        }"
        @update:filters="
          (filters: Record<string, any>) => {
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