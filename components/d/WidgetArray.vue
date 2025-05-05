<script setup lang="ts">
import { useNumber } from "~/composables/useNumber";
import type { WidgetSingleType } from "~/types/sales-orders/SalesOrderType";
const { sumArrayKey } = useNumber;

export type WidgetType = {
  data: WidgetSingleType[];
  class?: string;
  isLoading?: boolean;
};

// export type WidgetDataType = Record<string, WidgetSingleType>[]

const props = withDefaults(defineProps<WidgetType>(), {
  data: () => [],
  class: "",
  isLoading: false,
});

// ['Order', 'Process', 'Shipping', 'Invoice', 'Finish', 'Cancel', 'Pending', 'Production']);
const initialColors = ref([
  {
    name: "Total",
    icon: "material-symbols:receipt-rounded",
    color: "text-[#00B8D9]",
    border: "border-[#00B8D9]",
  },
  {
    name: "Order",
    code: "bg-yellow-100 text-yellow-700 border !border-yellow-700",
    icon: "mdi:cart",
    color: "text-yellow-700",
    border: "border-yellow-700",
  },
  {
    name: "Process",
    icon: "material-symbols:nest-clock-farsight-analog",
    color: "text-sky-700",
    border: "border-sky-700",
  },
  {
    name: "Procsess",
    icon: "material-symbols:nest-clock-farsight-analog",
    color: "text-sky-700",
    border: "border-sky-700",
  },
  {
    name: "Unpaid",
    code: "bg-orange-100 text-orange-700 border !border-orange-700",
    icon: "material-symbols:receipt-text-minus-outline",
    color: "text-orange-700",
    border: "border-orange-700",
    // --
  },
  {
    name: "Partial",
    icon: "mdi:receipt-text-minus-outline",
    color: "text-amber-700",
    border: "border-amber-700",
  },
  {
    name: "production",
    code: "bg-indigo-100 text-indigo-700 border !border-indigo-700",
    icon: "material-symbols:nest-clock-farsight-analog",
    color: "text-indigo-700",
    border: "border-indigo-700",
  },
  {
    name: "Shipping",
    icon: "gridicons:shipping",
    color: "text-fuchsia-700",
    border: "border-fuchsia-700",
  },
  {
    name: "Invoice",
    code: "bg-blue-100 text-blue-700 border !border-blue-700",
    icon: "material-symbols:check-circle-rounded",
    color: "text-blue-700",
    border: "border-blue-700",
  },
  {
    name: "Finish",
    icon: "material-symbols:check-circle-rounded",
    color: "text-[#36B37E]",
    border: "border-[#36B37E]",
  },
  {
    name: "Paid",
    code: "bg-emerald-100 text-emerald-700 border !border-emerald-700",
    icon: "material-symbols:check-circle-rounded",
    color: "text-emerald-700",
    border: "border-emerald-700",
    // --
  },
  {
    name: "Cancel",
    code: "bg-rose-100 text-rose-700 border !border-rose-700",
    icon: "material-symbols:cancel",
    color: "text-rose-700",
    border: "border-rose-700",
  },
]);

// GlobalConstant::PO_STATUS_PROCESS,
// GlobalConstant::PO_STATUS_SHIPPED,
// GlobalConstant::PO_STATUS_CANCEL,
// GlobalConstant::PO_STATUS_FINISH,
watchEffect(() => {});
</script>

<template>
  <div
    v-if="!props.isLoading"
    :class="
      classMerge(
        'flex h-max flex-auto items-center justify-between gap-4 overflow-x-auto overflow-y-hidden px-4 pt-3 pb-1',
        props.class
      )
    "
  >
    <div
      v-for="(base, iBase) in props.data"
      :key="iBase"
      class=""
      :style="{
        // percentage by total props.data
        width:
          props.data.length > 0
            ? `${(100 / props.data.length).toFixed(2)}%`
            : '100%',
      }"
    >
      <div class="flex items-center gap-4">
        <div
          :class="
            classMerge(
              'flex items-center justify-center rounded-full border-4 border-[#00B8D9] p-3',
              base.border,
              base.color
            )
          "
        >
          <Icon :name="base.icon" size="30" :class="base.color" />
        </div>
        <div class="flex flex-col gap-1">
          <h3 class="text-base font-bold text-black">{{ base.status }}</h3>
          <div>
            {{ useNumber.formatNumberSeparator(base.order_count, 0, 0) }} Order
          </div>
          <div>
            {{ useNumber.formatNumberSeparator(base.total_qty, 0, 0) }} Qty
          </div>
          <div>{{ useNumber.formatNumberSeparator(base.grand_total) }}</div>
          <!-- <d-num-layout
            :value="base.grand_total"
            class="w-full gap-3"
            :min-precision="0"
            :max-precision="0"
          /> -->
        </div>
      </div>
    </div>
  </div>

  <div
    v-else
    :class="
      classMerge(
        'flex w-full flex-auto items-center justify-between gap-4 border border-zinc-200 p-2',
        props.class
      )
    "
  >
    <v-skeleton-loader
      v-for="i in 6"
      elevation="0"
      type="list-item-three-line"
      boilerplate
    ></v-skeleton-loader>
  </div>
</template>
