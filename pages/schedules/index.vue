<script setup lang="ts">
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useSalesOrderStore from "~/stores/orders/SalesOrderStore";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";
import { ScheduleXCalendar } from "@schedule-x/vue";
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  type CalendarEventExternal,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import useScheduleStore from "~/stores/orders/ScheduleStore";

const scheduleStore = useScheduleStore();
const { queryModal, metaModal, modalData, isOpen } = storeToRefs(scheduleStore);

const layoutStore = useLayoutsStore();
const { titlePath, subTitlePath, lastPathSegment, parentTitle, topTitle } =
  storeToRefs(layoutStore);

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({
  title: "Schedules",
});

const fieldsConfig = ref<FieldSelectableType[]>([
  {
    title: "Order No",
    key: "sales_order_no",
    value: "sales_order_no",
    align: "start",
    sortable: true,
  },
  {
    title: "PO Buyer No",
    key: "po_buyer_no",
    value: "po_buyer_no",
    align: "start",
    sortable: true,
  },
  {
    title: "Order Type",
    key: "order_type_name",
    value: "order_type_name",
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
    title: "Order Date",
    key: "order_at",
    value: "order_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Shipping Date",
    key: "shipping_at",
    value: "shipping_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Agreement Date",
    key: "agree_at",
    value: "agree_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Expired Date",
    key: "expired_at",
    value: "expired_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Due Date",
    key: "due_at",
    value: "due_at",
    align: "start",
    sortable: true,
  },
  {
    title: "Currency",
    key: "currency_name",
    value: "currency_name",
    align: "start",
    sortable: true,
  },
  {
    title: "Exc. Rate",
    key: "exchange_rate",
    value: "exchange_rate",
    align: "end",
    sortable: true,
  },
  {
    title: "VAT",
    key: "total_vat",
    value: "total_vat",
    align: "end",
    sortable: true,
  },
  {
    title: "PPH",
    key: "total_pph23",
    value: "total_pph23",
    align: "end",
    sortable: true,
  },
  {
    title: "Discount",
    key: "total_discount",
    value: "total_discount",
    align: "end",
    sortable: true,
  },
  {
    title: "Subtotal",
    key: "subtotal",
    value: "subtotal",
    align: "end",
    sortable: true,
  },
  {
    title: "Grand Total",
    key: "grand_total",
    value: "grand_total",
    align: "end",
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
    title: "Created By",
    key: "created_by_name",
    value: "created_by_name",
    align: "start",
    sortable: true,
  },
]);

const filtersConfig = ref<FilterSelectableType[]>([
  {
    title: "Customers",
    key: "customer_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
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
    title: "Order Type",
    key: "order_type_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      api: "/v1/order-types/index-order-type",
      singleApi: "/v1/order-types/index-order-type",
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
    title: "Date Type",
    key: "date_type",
    type: "autocomplete-client",
    others: {
      items: useStatics.SoIndexDateType,
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
    title: "Currency",
    key: "currency_ids",
    type: "autocomplete",
    others: {
      methodApi: "post",
      api: "/v1/currencies/index-currency",
      singleApi: "/v1/currencies/index-currency",
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
    title: "Status",
    key: "status",
    type: "autocomplete-client",
    others: {
      items: useStatics.SoIndexStatus,
    },
  },
  {
    title: "Order No",
    key: "sales_order_no",
  },
  {
    title: "PO Buyer No",
    key: "po_buyer_no",
  },
]);

const nextSalesOrder = ref<number | null>(null);

const calendarApp = createCalendar({
  // date yyyy-mm-dd
  // selectedDate: new Date().toISOString().split("T")[0],
  locale: "en-US",
  isDark: false,
  views: [createViewMonthGrid(), createViewMonthAgenda()],
  events: [
    // {
    //   id: 2,
    //   title: "Event lorem ipsum dolor sit amet, consectetur adipiscing elit",
    //   start: "2025-04-19",
    //   end: "2025-04-27",
    //   color: "#88a8a8",
    //   isOpenTip: false,
    // },
    // {
    //   id: 3,
    //   title: "Event AJDKJWQ",
    //   start: "2025-04-19",
    //   end: "2025-04-27",
    //   color: "#55a8a8",
    //   isOpenTip: false,
    // },
    // {
    //   id: 6,
    //   title: "Event E",
    //   start: "2025-04-19",
    //   end: "2025-04-27",
    //   color: "#EE00FF",
    //   isOpenTip: false,
    // },
    // {
    //   id: 7,
    //   title: "Event F",
    //   start: "2025-04-19",
    //   end: "2025-04-27",
    //   color: "#FF00FF",
    //   isOpenTip: false,
    // },
    // {
    //   id: 8,
    //   title: "Event G",
    //   start: "2025-04-19",
    //   end: "2025-04-27",
    //   color: "#FF00FF",
    //   isOpenTip: false,
    // },
    // {
    //   id: 9,
    //   title: "Event H",
    //   start: "2025-04-19",
    //   end: "2025-04-27",
    //   color: "#FF00FF",
    //   isOpenTip: false,
    // },
    // {
    //   id: 10,
    //   title: "Event I",
    //   start: "2025-04-19",
    //   end: "2025-04-27",
    //   color: "red",
    //   isOpenTip: false,
    // },
    // {
    //   id: 11,
    //   title: "Event K",
    //   start: "2025-04-30",
    //   end: "2025-05-03",
    //   color: "red",
    //   isOpenTip: false,
    // },
  ],
  callbacks: {
    onClickPlusEvents: (date) => {
      console.log("plus Event clicked!", date);
      scheduleStore.getAllEventsByDate(date);
    },
    beforeRender($app) {
      // const range = $app.calendarState.range.value;

      // if (range) {
      //   queryModal.value.qListIndex.start_at = range.start;
      //   queryModal.value.qListIndex.end_at = range.end;
      // }
      console.log("beforeRender");

      scheduleStore.indexSchedule().then(() => {
        // calendarApp.events.set(metaModal.value.index.data as any[]);
        calendarApp.events.set(
          metaModal.value.index.data as CalendarEventExternal[]
        );
      });

      // fetchYourEventsFor(range.start, range.end)
    },
    onRangeUpdate(range) {
      console.log("onRangeUpdate", calendarApp.events.getAll());

      console.log("new calendar range start date", range.start);
      console.log("new calendar range end date", range.end);
      // queryModal.value.qListIndex.start_at = range.start;
      // queryModal.value.qListIndex.end_at = range.end;

      // scheduleStore.indexSchedule().then(() => {
      //   calendarApp.events.set(
      //     metaModal.value.index.data as CalendarEventExternal[]
      //   );
      // });
    },
    onEventClick(calendarEvent) {
      scheduleStore.openDetailEventModal(calendarEvent);
    },
    onClickDate(date) {
      isOpen.value.createEvent = true;
      console.log("onClickDate", date);
    },
  },
});

const clickEvent = (event: any) => {
  let isOpenTip = event.isOpenTip;
  isOpenTip = isOpenTip ? false : true;

  console.log("Event clicked!-isOpenTip", event, isOpenTip);

  calendarApp.events.update({
    ...event,
  });
  console.log("Event clicked!");
};

const menu = ref(false);

const updateSchedule = () => {
  scheduleStore.indexSchedule().then(() => {
    // calendarApp.events.set(metaModal.value.index.data as any[]);
    calendarApp.events.set(
      metaModal.value.index.data as CalendarEventExternal[]
    );
  });
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <ScheduleXCalendar :calendar-app="calendarApp">
      <template #monthGridEvent="{ calendarEvent: event }">
        <!-- <v-menu :close-on-content-click="false" location="end">
          <template v-slot:activator="{ props }">
            <div
              v-bind="props"
              :class="
                classMerge('text-dark3 p-2 rounded-md w-full rounded-l-lg')
              "
              :style="{
                backgroundColor: event.color,
                color: event.color ? 'white' : 'black',
              }"
              @click="clickEvent(event)"
            >
              {{ event.title }} {{ event.isOpenTip }}
            </div>
          </template>

          <div
            class="flex flex-col gap-3 p-3 bg-primary1 dark:bg-dark1 border border-solid border-dark1"
          >
            <div class="flex gap-2 items-center">
              <div
                :style="{ backgroundColor: event.color }"
                class="w-2 h-2 rounded-full"
              ></div>
              <div class="text-lg font-semibold">{{ event.title }}</div>
            </div>

            <div class="flex gap-2 items-center">
              <v-icon icon="mdi-calendar" :size="24" class="text-dark1" />
              <div>{{ event.start }} - {{ event.end }}</div>
            </div>
          </div>
        </v-menu> -->

        <div
          :class="
            classMerge(
              'text-dark3 p-2 w-full rounded-lg border-l-8 border-solid'
            )
          "
          :style="{
            borderColor: event.color,
            backgroundColor: event.color ? event.color + '80' : 'white',
          }"
        >
          {{ event.title }}
        </div>
      </template>
      <template #monthGridDate="{ date }">
        <div class="">{{ date }}</div>
      </template>
    </ScheduleXCalendar>

    <modals-final-modal
      :is-open="isOpen.plusEvent"
      custom-class="overflow-y-auto !w-1/2"
      label="List of Schedules"
      parent-class="!z-[1500]"
      @update:is-open="isOpen.plusEvent = $event"
      :focus-trap="false"
    >
      <div class="flex flex-col gap-3 p-3 dark:text-primary1">
        <div
          v-for="event in modalData.plusEvents"
          :key="event.id"
          class="flex flex-col gap-2 p-2 border-l-8 border-solid hover:bg-gray-100 cursor-pointer"
          :style="{
            borderColor: event.color,
            backgroundColor: event.color ? event.color + '33' : 'white',
          }"
          @click="scheduleStore.openDetailEventModal(event)"
        >
          <div class="flex gap-2 items-center">
            <div class="text-lg font-semibold">{{ event.title }}</div>
          </div>

          <div class="flex gap-2 items-center">
            <v-icon
              icon="mdi-calendar"
              :size="24"
              class="text-dark1 dark:text-primaryDarkest"
            />
            <div>{{ event.start }} - {{ event.end }}</div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-3 w-full">
          <d-bt
            :cta="'Close'"
            :class="
              classMerge(
                'w-1/3 whitespace-nowrap border-scDarker dark:hover:bg-scDarker dark:bg-scDarker3 dark:border-scDarker font-bold justify-center gap-1 rounded-lg tracking-normal bg-sc hover:bg-scDarker border-1.5 p-2 transition-all ease-in-out'
              )
            "
            :text-class="classMerge('text-primary1')"
            :icon-class="classMerge('text-primary1')"
            icon="mdi-close"
            @click="isOpen.plusEvent = false"
          />

          <d-bt
            :cta="'New Schedule'"
            :class="
              classMerge(
                'grow whitespace-nowrap border-scDarker text-scDarker dark:text-primary1 dark:hover:bg-dark1 dark:bg-dark2 dark:border-scDarker font-bold justify-center gap-1 rounded-lg tracking-normal bg-primaryDarker hover:bg-primaryDarkest border-1.5 p-2 transition-all ease-in-out'
              )
            "
            :text-class="classMerge('text-scDarker dark:text-white')"
            :icon-class="classMerge('text-scDarker dark:text-white')"
            icon="mdi-calendar-plus"
            @click="isOpen.createEvent = true"
          />
        </div>
      </template>
    </modals-final-modal>
    <modals-final-modal
      :is-open="isOpen.detailEvent"
      custom-class="overflow-y-auto !w-11/12"
      :label="`${modalData.selectedPlusEvent.title} - Schedule Detail`"
      parent-class="!z-[1501]"
      @update:is-open="isOpen.detailEvent = $event"
      :focus-trap="false"
    >
      <div class="flex flex-col gap-3 p-3">
        <d-schedule-single @update:schedule="updateSchedule" />
      </div>

      <template #footer>
        <div class="flex gap-3 w-full">
          <d-bt
            :cta="'Close'"
            :class="
              classMerge(
                'w-1/3 whitespace-nowrap border-scDarker dark:hover:bg-scDarker dark:bg-scDarker3 dark:border-scDarker font-bold justify-center gap-1 rounded-lg tracking-normal bg-sc hover:bg-scDarker border-1.5 p-2 transition-all ease-in-out'
              )
            "
            :text-class="classMerge('text-primary1')"
            :icon-class="classMerge('text-primary1')"
            icon="mdi-close"
            @click="isOpen.detailEvent = false"
          />

          <d-bt
            :cta="'Sales Order Details'"
            :class="
              classMerge(
                'grow whitespace-nowrap border-scDarker text-scDarker dark:text-primary1 dark:hover:bg-dark1 dark:bg-dark2 dark:border-scDarker font-bold justify-center gap-1 rounded-lg tracking-normal bg-primaryDarker hover:bg-primaryDarkest border-1.5 p-2 transition-all ease-in-out'
              )
            "
            :text-class="classMerge('text-scDarker dark:text-white')"
            :icon-class="classMerge('text-scDarker dark:text-white')"
            icon="mdi-file-document"
            @click="
              () => {
                useSalesOrderStore().tabFormIndex = 2;
                useSalesOrderStore()
                  .goToSalesOrder(modalData.selectedPlusEvent.sales_order_id)
                  .then(() => {
                    isOpen.detailEvent = false;
                    isOpen.plusEvent = false;
                    isOpen.createEvent = false;
                  });
              }
            "
          />
        </div>
      </template>
    </modals-final-modal>
    <modals-final-modal
      :is-open="isOpen.createEvent"
      custom-class="overflow-y-auto !w-3/12"
      :label="`New Schedule`"
      parent-class="!z-[1502]"
      @update:is-open="isOpen.createEvent = $event"
      :focus-trap="false"
    >
      <div class="flex flex-col gap-3 p-3">
        <!-- <d-schedule-single @update:schedule="updateSchedule" /> -->

        <d-select-table
          api="/v1/sales-orders/index-sales-order"
          detail-api="/v1/sales-orders/index-sales-order"
          method-api="post"
          detail-method-api="post"
          mapping-detail="data[0]"
          total-prop="meta.total"
          cta="Go To Sales Order"
          label="Sales Order"
          v-model="nextSalesOrder"
          class="col-span-2 lg:col-span-1"
          is-quick-select
          @click:selected="
            (data) => {
              if (!!data) {
                useSalesOrderStore().tabFormIndex = 2;
                useSalesOrderStore()
                  .goToSalesOrder(data.id)
                  .then(() => {
                    isOpen.detailEvent = false;
                    isOpen.plusEvent = false;
                    isOpen.createEvent = false;
                  });
              }
            }
          "
          modal-parent-class="!z-[2500]"
          modal-custom-class="!w-4/5"
          :fields="fieldsConfig"
          :filters="filtersConfig"
        />
      </div>
    </modals-final-modal>
  </div>
</template>