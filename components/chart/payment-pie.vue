<template>
  <div class="flex flex-col gap-2 p-4 bg-white dark:bg-dark2">
    <div
      class="flex items-center justify-between border-b border-b-zinc-200 dark:border-b-dark3 pb-4"
    >
      <div class="flex items-center gap-4">
        <v-icon
          icon="mdi-cog-outline"
          is-no-text
          class="rounded-full ease-in-out transition-all"
          icon-class="text-sc dark:text-primary1"
          rounded="xl"
        />
        <div class="flex flex-col">
          <h1 class="text-lg text-dark1 font-bold dark:text-white">
            Payment Status
          </h1>
          <p class="text-xs text-dark1 dark:text-white">
            Summary Of Payment Completion Status For All Transactions
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <d-bt
          icon="mdi-refresh"
          class="px-2 py-1.5 gap-1 !bg-zinc-100 hover:!bg-zinc-200 dark:!bg-dark3 dark:hover:!bg-dark1 rounded-lg ease-in-out transition-all"
          icon-class="dark:text-primary1 text-dark1"
          text-class="dark:text-primary1 text-dark1"
          rounded="xl"
          is-no-text
          icon-size="16"
          :loading="metaModal.indexInvoiceMaintenance.loading"
          @click="onClickFilter()"
        ></d-bt>
      </div>
    </div>
    <div class="grid grid-cols-4 items-center gap-2">
      <d-autocomplete-client
        v-model="queryModal.qIndexDonut.invoice_type"
        :items="useStatics.dashboardInvoiceType"
        label="Invoice Type"
        item-value="id"
        item-title="name"
        :clearable="false"
      />

      <d-date-picker-light
        v-model="queryModal.qIndexDonut.start_at"
        label="Start Date"
      ></d-date-picker-light>
      <d-date-picker-light
        v-model="queryModal.qIndexDonut.end_at"
        label="End Date"
      ></d-date-picker-light>

      <d-submit-button
        @click:submit="onClickFilter()"
        @click:clear="dashboardStore.clearDonutFilter()"
        class="grid-cols-1"
      />
    </div>

    <div class="flex items-center justify-center gap-2 w-full">
      <AgCharts :options="barOptions" />
      <div
        class="flex flex-col gap-2 grow"
        v-if="!metaModal.indexDonut.loading"
      >
        <div v-for="(item, index) in metaModal.indexDonut.data" :key="index">
          <div
            class="flex items-center gap-2 bg-zinc-100 dark:bg-dark3 rounded-lg px-4 py-2"
          >
            <div
              :class="
                classMerge(
                  'px-4 py-1 rounded-lg self-start place-self-start justify-self-start h-max',
                  'dark:text-primary1'
                )
              "
              :style="{
                backgroundColor: item.hex,
                color: item.hex,
              }"
            >
              &nbsp;
            </div>
            <div class="flex flex-col">
              <h3
                class="text-sm uppercase text-black dark:!text-primary1 leading-tight"
              >
                {{ item.status }}
              </h3>
              <div class="font-bold">
                Rp.
                {{ useNumber.formatNumberSeparator(item.grand_total, 0, 0) }}
              </div>
              <div :style="{ color: item.hex }">
                {{
                  useNumber.formatNumberSeparator(
                    item.order_count ?? item.ticket_count,
                    0,
                    0
                  )
                }}
                Transaction
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col gap-2 w-full">
        <v-skeleton-loader
          type="list-item-three-line"
          class="w-full"
          v-for="i in 4"
        ></v-skeleton-loader>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AgCharts } from "ag-charts-vue3";
import type { AgChartOptions, AgChartTheme } from "ag-charts-types";
import useDashboardStore from "~/stores/dashboard/DashboardStore";

const dashboardStore = useDashboardStore();

const { metaModal, queryModal, loading } = storeToRefs(dashboardStore);

interface IProps {
  title?: string;
  data?: any[];
  chartType?: string;
  series?: any[];
}

const props = withDefaults(defineProps<IProps>(), {
  title: "",
});

const emit = defineEmits(["update:modelValue"]);

const myTheme = ref<AgChartTheme>({
  palette: {
    fills: ["#198754", "#dc3545", "#cc9a06", "#3085fe"],
    // strokes: ["#003f58", "#934962", "#004a25", "#914d1d", "#006288"],
  },
  params: {
    // backgroundColor: "#fff1e5",
    // accentColor: "#0d7680",
    // chromeBackgroundColor: "#fff7ef",
    // chromeTextColor: "#262a33",
    // fontFamily: "Georgia, serif",
    fontSize: 12,
  },
});

const onClickFilter = async () => {
  let filteredData: any[] = [];
  await dashboardStore.indexWidgetDonut().then(() => {
    // barOptions.value.data = metaModal.value.indexDonut.data;
    // take other than "TOTAL"
    filteredData = metaModal.value.indexDonut.data.filter(
      (item) => item.status !== "TOTAL"
    );

    barOptions.value = {
      ...barOptions.value,
      data: filteredData,
    };
  });

  return filteredData;
};

const barOptions = ref<AgChartOptions>({
  theme: myTheme.value,
  // title: { text: "Quarterly Revenue" },
  data: [],
  series: [
    {
      type: "pie",
      angleKey: "grand_total",
      // calloutLabelKey: "status",
      sectorLabelKey: "grand_total",
      legendItemKey: "status",
      sectorLabel: {
        color: "white",
        fontWeight: "bold",
        // formatter: ({ value }) => `$${(value / 1000).toFixed(0)}K`,
        formatter: ({ value }) => {
          useNumber.formatNumberSeparator(value, 0, 0);

          return `Rp. ${useNumber.formatNumberSeparator(value, 0, 0)}`;
        },
      },
    },
  ],
  legend: {
    listeners: {
      legendItemClick: (event) => {
        // Custom toggle logic here
        console.log("Toggled:", event.itemId);
        // Add your custom logic to enable/disable items
      },
    },
    item: {},
  },
});

onMounted(() => {
  onClickFilter();
});
</script>
