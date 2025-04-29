
<script setup lang="ts">
import useSalesOrderStore from "~/stores/orders/SalesOrderStore";
import useScheduleStore from "~/stores/orders/ScheduleStore";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const emits = defineEmits(["update:schedule"]);

const headersCustomer = ref<FieldSelectableType[]>([
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
    title: "Phone",
    key: "phone",
    value: "phone",
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
    title: "Address",
    key: "address",
    value: "address",
    align: "start",
    sortable: true,
  },
  {
    title: "Customer Type",
    key: "customer_type_name",
    value: "customer_type_name",
    align: "start",
    sortable: true,
  },
]);

const filtersCustomer = ref<FilterSelectableType[]>([
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Code",
    key: "code",
  },
  {
    title: "Phone",
    key: "phone",
  },
  {
    title: "Email",
    key: "email",
  },
  {
    title: "Address",
    key: "address",
  },
  {
    title: "Customer Type",
    key: "customer_type_ids",
    type: "autocomplete",
    display: "name",
    others: {
      methodApi: "post",
      api: "/v1/customer-types/index-customer-type",
      singleApi: "/v1/customer-types/index-customer-type",
      pageEndProp: "meta.next_page_url",
      itemTitle: "name",
      itemValue: "id",
      label: "Customer Type",
      innerSearchKey: "global",
    },
  },
]);

const salesOrderStore = useSalesOrderStore();
const scheduleStore = useScheduleStore();

// const { form, errors, loading } = storeToRefs(salesOrderStore);
const { form, errors, loading } = storeToRefs(scheduleStore);

const kanbanBoardExposeRef = ref();

const handleUpdateSchedule = () => {
  salesOrderStore.form.is_scheduled = 1;
  salesOrderStore.updateSchedule().then(() => {
    emits("update:schedule");
  });
};

// Trigger the openModal method
const resetBoard = async () => {
  if (kanbanBoardExposeRef.value) {
    console.log("resetBoard-SO");

    kanbanBoardExposeRef.value.resetBoard();
  } else {
    console.error("openModal method is not available on kanbanBoardExposeRef");
  }

  // await openModal(filteredModalForms.value);
};
</script>

<template>
  <div v-if="!loading.editPageLoading">
    <div class="grid grid-cols-6 gap-2 items-center content-center">
      <div class="lg:col-span-6">
        <d-text-input
          v-model="form.title"
          :label="`Title`"
          :placeholder="`Title`"
          :errors="errors.title"
        />
      </div>

      <!-- assignee_id -->
      <div class="lg:col-span-6">
        <d-autocomplete
          v-model="form.assignee_id"
          api="/v1/users/index-user"
          single-api="/v1/users/show-user"
          page-end-prop="meta.next_page_url"
          item-title="name"
          item-value="id"
          method-api="post"
          inner-search-key="global"
          label="Assignee"
        ></d-autocomplete>
      </div>
      <div class="lg:col-span-6">
        <d-select-table
          api="/v1/customers/index-customer"
          detail-api="/v1/customers/index-customer"
          method-api="post"
          detail-method-api="post"
          mapping-detail="data[0]"
          total-prop="meta.total"
          label="Customer"
          v-model="form.customer_id"
          class=""
          is-quick-select
          @click:selected="(data) => salesOrderStore.autocompleteCustomer(data)"
          modal-parent-class="!z-[2500]"
          modal-custom-class="!w-4/5"
          :fields="headersCustomer"
          :filters="filtersCustomer"
        />
      </div>

      <div class="lg:col-span-6">
        <d-date-picker-light
          v-model="form.start_at"
          label="Start Date"
        ></d-date-picker-light>
      </div>
      <div class="lg:col-span-6">
        <d-date-picker-light
          v-model="form.end_at"
          label="End Date"
        ></d-date-picker-light>
      </div>
      <div class="lg:col-span-6 col-span-2 flex gap-2 items-center">
        <v-menu
          :close-on-content-click="false"
          no-click-animation
          :open-delay="0"
          :close-delay="0"
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              density="compact"
              :class="
                classMerge(
                  'dark:text-white hover:text-gray-500 min-h-[2.5rem] !border border-solid !border-zinc-400 dark:bg-dark3'
                )
              "
              variant="flat"
            >
              <span :class="classMerge('text-xs dark:text-primary1')"
                >Color</span
              >
              <div
                :style="{
                  backgroundColor: form.color,
                  color: form.color ? 'white' : 'black',
                }"
                class="w-6 h-6 rounded-full border border-solid border-grey2 ml-2"
              ></div>
            </v-btn>
          </template>
          <v-color-picker
            show-swatches
            v-model="form.color"
            :modes="['hex']"
            hide-inputs
          >
          </v-color-picker>
        </v-menu>

        <d-bt
          :cta="'Reset Schedule'"
          :class="
            classMerge(
              '!bg-zinc-200 justify-self-end hover:!bg-grey2 dark:!bg-dark2 gap-1 dark:hover:!bg-dark1 text-sm transition-all ease-in-out !border-2 p-2 rounded-lg !border-zinc-200 dark:border-none w-max'
            )
          "
          :text-class="classMerge('text-scDarker dark:text-white mx-auto')"
          :icon-class="classMerge('text-scDarker dark:text-white mx-auto')"
          icon="mdi-refresh"
          type="button"
          @click="resetBoard()"
        />

        <d-bt
          :cta="'Update Schedule'"
          :class="
            classMerge(
              'min-h-[2.5rem] px-2 rounded-lg !bg-sc transition-all ease-in-out hover:!bg-scDarker3'
            )
          "
          :text-class="classMerge('text-white mx-auto !font-bold')"
          :no-icon="true"
          type="button"
          @click="handleUpdateSchedule"
        />
        <d-autocomplete-client
          v-model="form.steps_id"
          :items="useInitials.defaultSteps"
          label="Steps"
          item-value="id"
          item-title="name"
          :clearable="false"
          disabled
          max-length-display="90"
          class="!hidden"
        />
      </div>
    </div>
    <div class="overflow-x-auto">
      <v-skeleton-loader
        height="240"
        type="image"
        :loading="loading.editPageLoading"
      >
        <schedule-board
          ref="kanbanBoardExposeRef"
          class="mt-2"
          v-if="!loading.editPageLoading"
        />
      </v-skeleton-loader>
    </div>
  </div>
  <div v-else class="grid grid-cols-5 gap-6">
    <v-skeleton-loader
      v-for="i in 5"
      class="mx-auto border"
      width="300"
      height="300"
      type="article"
    ></v-skeleton-loader>
  </div>
</template>