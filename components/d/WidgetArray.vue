<script setup lang="ts">
import { useNumber } from "~/composables/useNumber";
import type { WidgetSingleType } from "~/types/sales-orders/SalesOrderType";
import type { TicketWidgetSingleType } from "~/types/tickets/TicketType";
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
              'flex items-center justify-center rounded-full border-4 p-3',
              base.border,
              base.color,
              'dark:bg-' + base.base,
              'dark:text-primary1',
            )
          "
        >
          <Icon :name="base.icon" size="30" :class="classMerge(base.color, 'dark:text-primary1')" />
        </div>
        <div class="flex flex-col gap-1">
          <h3 class="text-base font-bold text-black dark:!text-primary1">{{ base.status }}</h3>
          <div>
            {{ useNumber.formatNumberSeparator(base.order_count ?? base.ticket_count, 0, 0) }} Report
          </div>
          <div v-if="base.widget_type !== 'tickets'">
            {{ useNumber.formatNumberSeparator(base.total_qty, 0, 0) }} Qty
          </div v-if="base.widget_type !== 'tickets'">
          <div v-if="base.widget_type !== 'tickets'">{{ useNumber.formatNumberSeparator(base.grand_total) }}</div>
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
