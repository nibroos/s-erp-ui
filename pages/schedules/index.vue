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
import useAuthStore from "~/stores/AuthStore";
import type { FormScheduleType } from "~/types/sales-orders/SalesOrderType";

const scheduleStore = useScheduleStore();
const salesOrderStore = useSalesOrderStore();
const {
  queryModal,
  metaModal,
  modalData,
  isOpen,
  form: formSchedule,
} = storeToRefs(scheduleStore);
const {
  form: formSalesOrder,
  loading: loadingSalesOrder,
  isOpenModal,
  modals,
} = storeToRefs(salesOrderStore);

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
  events: [],
  monthGridOptions: {
    nEventsPerDay: 5,
  },
  callbacks: {
    onClickPlusEvents: (date) => {
      scheduleStore.getAllEventsByDate(date);
    },
    beforeRender($app) {
      // const range = $app.calendarState.range.value;

      // if (range) {
      //   queryModal.value.qListIndex.start_at = range.start;
      //   queryModal.value.qListIndex.end_at = range.end;
      // }

      scheduleStore.indexSchedule().then(() => {
        // calendarApp.events.set(metaModal.value.index.data as any[]);
        calendarApp.events.set(
          metaModal.value.index.data as CalendarEventExternal[]
        );
      });

      // fetchYourEventsFor(range.start, range.end)
    },
    onRangeUpdate(range) {
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
      scheduleStore.openCreateEventModal();
    },
  },
});

const updateSchedule = () => {
  scheduleStore.indexSchedule().then(() => {
    // calendarApp.events.set(metaModal.value.index.data as any[]);

    calendarApp.events.set(
      metaModal.value.index.data as CalendarEventExternal[]
    );

    isOpen.value.detailEvent = false;
  });
};

const createScheduleNoRef = () => {
  scheduleStore.indexSchedule().then(() => {
    // calendarApp.events.set(metaModal.value.index.data as any[]);
    calendarApp.events.set(
      metaModal.value.index.data as CalendarEventExternal[]
    );
  });
};

const refreshCalendar = async () => {
  await scheduleStore.indexSchedule().then(() => {
    // calendarApp.events.set(metaModal.value.index.data as any[]);
    calendarApp.events.set(
      metaModal.value.index.data as CalendarEventExternal[]
    );
  });
};

watch(
  () => useAuthStore().theme,
  (newValue) => {
    if (newValue === "dark") {
      calendarApp.setTheme("dark");
    } else {
      calendarApp.setTheme("light");
    }
  },
  { immediate: true }
);

watch(
  () => isOpen.value.detailEvent,
  (newValue, oldValue) => {
    console.log(newValue, oldValue, "detailEvent open");

    if (!newValue) {
      formSalesOrder.value = cloneObject(useInitials.formSalesOrderCreateEdit);
      formSchedule.value = cloneObject(
        useInitials.formSalesOrderCreateEdit.schedule as FormScheduleType
      );
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="flex flex-col gap-2">
    <ScheduleXCalendar :calendar-app="calendarApp">
      <template #headerContentRightPrepend>
        <!-- refresh -->
        <d-bt
          icon="mdi-refresh"
          class="px-2 py-1.5 gap-1 !bg-sc hover:!bg-scDarker3 rounded-lg ease-in-out transition-all"
          icon-class="text-primary1"
          text-class="text-primary1"
          rounded="xl"
          cta="Refresh"
          icon-size="16"
          :loading="metaModal.index.loading"
          @click="refreshCalendar()"
        ></d-bt>
      </template>
      <template #monthGridEvent="{ calendarEvent: event }">
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
          ({{
            useNumber.formatNumberSeparator(
              (event.total_all_tasks_done * 100) / event.total_tasks,
              0,
              0
            )
          }}%)
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

          <div class="flex justify-between">
            <div class="flex gap-2 items-center">
              <v-icon
                icon="mdi-calendar"
                :size="24"
                class="text-dark1 dark:text-primaryDarkest"
              />
              <div>{{ event.start }} - {{ event.end }}</div>
            </div>
            <div class="flex gap-2 items-center">
              <v-icon
                icon="mdi-account-details-outline"
                :size="24"
                class="text-dark1 dark:text-primaryDarkest"
              />
              <div>
                {{ event.total_all_tasks_done }}/{{ event.total_tasks }} Tasks
                ({{
                  useNumber.formatNumberSeparator(
                    (event.total_all_tasks_done * 100) / event.total_tasks,
                    0,
                    0
                  )
                }}%)
              </div>
            </div>
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
        <div v-if="scheduleStore.form.id" class="flex flex-col gap-3">
          <d-schedule-single-no-ref @update:schedule="updateSchedule" />
          <div class="md:col-span-1 col-span-2 flex flex-col gap-2">
            <!-- attached files -->
            <div class="flex flex-col gap-2">
              <span class="text-sm font-medium dark:text-primary1"
                >Uploaded Files</span
              >
              <div>
                <div
                  v-if="
                    !formSchedule.attachments ||
                    formSchedule.attachments.length == 0
                  "
                >
                  <span
                    class="text-sm font-normal text-grey3 dark:text-primary1"
                    >No files attached</span
                  >
                </div>
                <div
                  v-else
                  class="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-2 content-start"
                >
                  <div
                    v-for="(file, index) in formSchedule.attachments"
                    :key="index"
                    class="flex justify-between items-center gap-2 p-2 border border-solid border-grey2 hover:bg-grey1 dark:hover:bg-dark2 rounded-lg"
                  >
                    <div class="flex gap-2">
                      <lazy-d-img
                        v-if="file.file_type.includes('image')"
                        :aspect-ratio="1"
                        :alt="file.file_name"
                        :src="file.file_url"
                        width="50"
                        class="border border-solid border-grey3 cursor-pointer"
                        @click="
                          scheduleStore.openModalAttachmentImg(true, file)
                        "
                      ></lazy-d-img>

                      <div v-if="!file.file_type.includes('image')">
                        <v-icon
                          icon="mdi-file-document-outline"
                          class="text-sc dark:text-primary1"
                          size="50"
                        />
                      </div>

                      <div class="flex flex-col justify-center">
                        <input
                          v-model="file.file_name"
                          class="w-full text-sm font-medium bg-transparent focus:outline-none focus:ring-1 focus:ring-sc rounded px-1"
                        />
                        <div class="text-xs dark:text-grey1">
                          {{ shortenBytes(file.file_size) }}
                        </div>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <d-bt
                        v-if="file.file_type.includes('image')"
                        icon="mdi-information-outline"
                        is-no-text
                        class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-scLightest rounded-full ease-in-out transition-all hover:dark:!bg-scDarker2 dark:!bg-sc"
                        icon-class="text-sc dark:text-primary1"
                        rounded="xl"
                        cta="full view"
                        icon-size="16"
                        :loading="loadingSalesOrder.imageDownloadLoading"
                        @click="scheduleStore.handleViewFullPageFile(file)"
                      ></d-bt>
                      <d-bt
                        icon="mdi-download"
                        is-no-text
                        class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-scLightest rounded-full ease-in-out transition-all hover:dark:!bg-scDarker2 dark:!bg-sc"
                        icon-class="text-sc dark:text-primary1"
                        rounded="xl"
                        cta="download"
                        icon-size="16"
                        :loading="loadingSalesOrder.imageDownloadLoading"
                        @click="scheduleStore.handleDownloadFile(file)"
                      ></d-bt>
                      <d-bt
                        @click="scheduleStore.handleExistingFile(file, index)"
                        icon="mdi-delete"
                        is-no-text
                        class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                        icon-class="text-cancel dark:text-primary1"
                        rounded="xl"
                        cta="delete"
                        icon-size="16"
                      ></d-bt>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="">
            <v-file-upload
              v-model="formSchedule.files"
              clearable
              density="compact"
              variant="compact"
              multiple
            >
              <template v-slot:item="{ props: itemProps }">
                <v-file-upload-item v-bind="itemProps" lines="one" nav>
                  <template v-slot:prepend>
                    <v-avatar size="32" rounded></v-avatar>
                  </template>

                  <template v-slot:clear="{ props: clearProps }">
                    <v-btn
                      class="!text-cancel hover:!text-cancel2 !transition-all !ease-in-out"
                      v-bind="clearProps"
                    ></v-btn>
                  </template>
                </v-file-upload-item>
              </template>
            </v-file-upload>
          </div>
        </div>

        <div
          v-else-if="useSalesOrderStore().form.id"
          class="flex flex-col gap-3"
        >
          <d-schedule-single @update:schedule="updateSchedule" />
          <div class="md:col-span-1 col-span-2 flex flex-col gap-2">
            <!-- attached files -->
            <div class="flex flex-col gap-2">
              <span class="text-sm font-medium dark:text-primary1"
                >Uploaded Files</span
              >
              <div>
                <div
                  v-if="
                    !formSalesOrder.attachments ||
                    formSalesOrder.attachments.length == 0
                  "
                >
                  <span
                    class="text-sm font-normal text-grey3 dark:text-primary1"
                    >No files attached</span
                  >
                </div>
                <div
                  v-else
                  class="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-2 content-start"
                >
                  <div
                    v-for="(file, index) in formSalesOrder.attachments"
                    :key="index"
                    class="flex justify-between items-center gap-2 p-2 border border-solid border-grey2 hover:bg-grey1 dark:hover:bg-dark2 rounded-lg"
                  >
                    <div class="flex gap-2">
                      <lazy-d-img
                        v-if="file.file_type.includes('image')"
                        :aspect-ratio="1"
                        :alt="file.file_name"
                        :src="file.file_url"
                        width="50"
                        class="border border-solid border-grey3 cursor-pointer"
                        @click="
                          salesOrderStore.openModalAttachmentImg(true, file)
                        "
                      ></lazy-d-img>

                      <div v-if="!file.file_type.includes('image')">
                        <v-icon
                          icon="mdi-file-document-outline"
                          class="text-sc dark:text-primary1"
                          size="50"
                        />
                      </div>

                      <div class="flex flex-col justify-center">
                        <input
                          v-model="file.file_name"
                          class="w-full text-sm font-medium bg-transparent focus:outline-none focus:ring-1 focus:ring-sc rounded px-1"
                        />
                        <div class="text-xs dark:text-grey1">
                          {{ shortenBytes(file.file_size) }}
                        </div>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <d-bt
                        v-if="file.file_type.includes('image')"
                        icon="mdi-information-outline"
                        is-no-text
                        class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-scLightest rounded-full ease-in-out transition-all hover:dark:!bg-scDarker2 dark:!bg-sc"
                        icon-class="text-sc dark:text-primary1"
                        rounded="xl"
                        cta="full view"
                        icon-size="16"
                        :loading="loadingSalesOrder.imageDownloadLoading"
                        @click="salesOrderStore.handleViewFullPageFile(file)"
                      ></d-bt>
                      <d-bt
                        icon="mdi-download"
                        is-no-text
                        class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-scLightest rounded-full ease-in-out transition-all hover:dark:!bg-scDarker2 dark:!bg-sc"
                        icon-class="text-sc dark:text-primary1"
                        rounded="xl"
                        cta="download"
                        icon-size="16"
                        :loading="loadingSalesOrder.imageDownloadLoading"
                        @click="salesOrderStore.handleDownloadFile(file)"
                      ></d-bt>
                      <d-bt
                        @click="salesOrderStore.handleExistingFile(file, index)"
                        icon="mdi-delete"
                        is-no-text
                        class="p-1 bg-primary1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                        icon-class="text-cancel dark:text-primary1"
                        rounded="xl"
                        cta="delete"
                        icon-size="16"
                      ></d-bt>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="">
            <v-file-upload
              v-model="formSalesOrder.files"
              clearable
              density="compact"
              variant="compact"
              multiple
            >
              <template v-slot:item="{ props: itemProps }">
                <v-file-upload-item v-bind="itemProps" lines="one" nav>
                  <template v-slot:prepend>
                    <v-avatar size="32" rounded></v-avatar>
                  </template>

                  <template v-slot:clear="{ props: clearProps }">
                    <v-btn
                      class="!text-cancel hover:!text-cancel2 !transition-all !ease-in-out"
                      v-bind="clearProps"
                    ></v-btn>
                  </template>
                </v-file-upload-item>
              </template>
            </v-file-upload>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3 w-full">
          <d-bt
            :cta="'Close'"
            :class="
              classMerge(
                'grow whitespace-nowrap border-scDarker dark:hover:bg-scDarker dark:bg-scDarker3 dark:border-scDarker font-bold justify-center gap-1 rounded-lg tracking-normal bg-sc hover:bg-scDarker border-1.5 p-2 transition-all ease-in-out'
              )
            "
            :text-class="classMerge('text-primary1')"
            :icon-class="classMerge('text-primary1')"
            icon="mdi-close"
            @click="isOpen.detailEvent = false"
          />

          <d-bt
            v-if="useSalesOrderStore().form.id"
            :cta="'Sales Order Details'"
            :class="
              classMerge(
                'w-1/3 whitespace-nowrap border-scDarker text-scDarker dark:text-primary1 dark:hover:bg-dark1 dark:bg-dark2 dark:border-scDarker font-bold justify-center gap-1 rounded-lg tracking-normal bg-primaryDarker hover:bg-primaryDarkest border-1.5 p-2 transition-all ease-in-out'
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
      custom-class="overflow-y-auto !w-11/12"
      :label="`New Schedule`"
      parent-class="!z-[1502]"
      @update:is-open="isOpen.createEvent = $event"
      :focus-trap="false"
    >
      <div class="flex flex-col gap-3 p-3">
        <d-create-schedule-single @create:schedule="createScheduleNoRef" />

        <div class="lg:col-span-6">
          <v-file-upload
            v-model="formSalesOrder.files"
            clearable
            density="compact"
            variant="compact"
            multiple
          >
            <template v-slot:item="{ props: itemProps }">
              <v-file-upload-item v-bind="itemProps" lines="one" nav>
                <template v-slot:prepend>
                  <v-avatar size="32" rounded></v-avatar>
                </template>

                <template v-slot:clear="{ props: clearProps }">
                  <v-btn
                    class="!text-cancel hover:!text-cancel2 !transition-all !ease-in-out"
                    v-bind="clearProps"
                  ></v-btn>
                </template>
              </v-file-upload-item>
            </template>
          </v-file-upload>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3 w-full">
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
            :query="{
              is_schedule_not_exists: 1,
            }"
            modal-parent-class="!z-[2500]"
            modal-custom-class="!w-4/5"
            :fields="fieldsConfig"
            :filters="filtersConfig"
          />
        </div>
      </template>
    </modals-final-modal>

    <modals-final-modal
      :is-open="isOpenModal.attachment_imgs"
      size="xl"
      custom-class="overflow-y-auto"
      label="List of Uploaded Image"
      parent-class="!z-[1503]"
      @update:is-open="isOpenModal.attachment_imgs = $event"
    >
      <v-carousel
        height="500"
        progress="brown"
        v-model="isOpenModal.attachment_opened"
        class="pt-2"
      >
        <v-carousel-item
          v-for="(attachment, i) in modals.attachment_imgs"
          :key="i"
        >
          <div class="flex gap-2 pt-2">
            <div class="w-2/3">
              <lazy-d-img
                v-if="attachment.file_type.includes('image')"
                :aspect-ratio="1"
                :alt="attachment.file_name"
                :src="attachment.file_url"
                :cover="false"
                width="100%"
                class="border border-solid border-grey3 h-[25rem] cursor-pointer ease-in-out scale-95 hover:scale-100 transition-all"
                @click="salesOrderStore.handleViewFullPageFile(attachment)"
              />
            </div>
            <div class="grid grid-cols-1 content-start gap-4 grow">
              <d-text-input
                v-model="attachment.file_name"
                :label="`Name`"
                :placeholder="`Name`"
                class="h-[2rem]"
              />
              <d-text-area-input
                v-model="attachment.remark"
                :label="`Remark`"
                :placeholder="`Remark`"
                class=""
                :auto-grow="false"
                :rows="3"
              />
            </div>
          </div>
        </v-carousel-item>
      </v-carousel>
    </modals-final-modal>
  </div>
</template>