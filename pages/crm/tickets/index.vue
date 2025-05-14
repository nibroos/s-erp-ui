<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useTicketStore from "~/stores/supports/TicketStore";
import type {
  QTicketIndexType,
  TicketWidgetSingleType,
} from "~/types/tickets/TicketType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const { queryModal, metaModal } = useTicketStore();
const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Tickets",
});

const fieldsConfig = ref<FieldSelectableType[]>([
  {
    title: "Issue Title",
    key: "title",
    value: "title",
    align: "start",
    sortable: true,
  },
  {
    title: "Customer",
    key: "customer_name",
    value: "customer_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Product",
    key: "product_name",
    value: "product_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Reported Date",
    key: "reported_at",
    value: "reported_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Priority",
    key: "priority_type",
    value: "priority_type",
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
  {
    title: "Ticket No",
    key: "ticket_no",
    value: "ticket_no",
    align: "start",
    sortable: true,
  },
  {
    title: "Created By",
    key: "created_by_name",
    value: "created_by_name",
    align: "start",
    sortable: true,
  },
]);

const filtersConfig = ref<FilterSelectableType[]>([
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
    title: "Customers",
    key: "customer_ids",
    type: "autocomplete",
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
    },
  },
  {
    title: "Product",
    key: "product_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      query: {
        is_active: 1,
      },
      api: "/v1/products/index-product",
      singleApi: "/v1/products/index-product",
      mappingDetail: "data",
      itemsProp: "data",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Product",
      innerSearchKey: "global",
      multiple: true,
      returnObject: false,
      itemColor: "brown-lighten-2",
    },
  },
  {
    title: "Priority Type",
    key: "priority_types",
    type: "autocomplete-client",
    others: {
      items: useStatics.priorityTypes,
    },
  },
  {
    title: "Status",
    key: "status",
    type: "autocomplete-client",
    others: {
      items: useStatics.ticketIndexStatus,
    },
  },
  {
    title: "Ticket No",
    key: "ticket_no",
  },
  {
    title: "Issue Title",
    key: "title",
  },
]);

// const changeTitle = () => {
//   let config = {
//     topTitle: "Ticket",
//     parentTitle: "Orders",
//     subTitlePath: "Ticket",
//     lastPathSegment: "",
//   };

//   layoutStore.defineTitlePath(config);
// };

watchEffect(() => {
  // changeTitle();
  topTitle.value = "CS Support";
});

onMounted(() => {
  useTicketStore().indexWidget();
});

watchEffect(() => {
  if (topTitle.value != "CS Support") {
    topTitle.value = "CS Support";
  }
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <d-index-layout
      :config="{
        permission: {
          isActive: true,
          name: ['r_ms', 'superadmin'],
        },
      }"
    >
      <d-datatable
        api="/v1/tickets/index-ticket"
        detail-link="/crm/tickets"
        method-api="post"
        detail-method-api="post"
        items-prop="data"
        total-prop="meta.total"
        class="col-span-2 lg:col-span-1"
        search-placeholder="Search anything related to Order.."
        is-quick-select
        no-title
        edit-link="/crm/tickets/edit"
        delete-api="/v1/tickets/delete-ticket"
        :fields="fieldsConfig"
        :filters="filtersConfig"
        :query-modal="queryModal.qIndex"
        :create-option="{
          link: '/crm/tickets/create',
          show: true,
          cta: '+ Create',
        }"
        @click:find="useTicketStore().indexWidget()"
        @update:filters="
          (filters: QTicketIndexType) => {
            queryModal.qIndex = filters;
          }
        "
      >
        <template #topFilters>
          <d-widget-array
            :data="(metaModal.indexWidgets.data as TicketWidgetSingleType[])"
            :class="''"
            :isLoading="metaModal.indexWidgets.loading"
          />
        </template>
        <template #item.status="{ item }">
          {{ item.status }}
        </template>
      </d-datatable>
    </d-index-layout>
  </div>
</template>