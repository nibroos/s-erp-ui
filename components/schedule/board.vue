<script setup lang="ts">
import useSalesOrderStore from "~/stores/orders/SalesOrderStore";
import type { FormScheduleStepType } from "~/types/sales-orders/SalesOrderType";
const salesOrderStore = useSalesOrderStore();

// props
const props = defineProps({
  initialSteps: {
    type: Array as () => FormScheduleStepType[],
    default: () => [],
  },
  class: {
    type: String,
    default: "",
  },
});

const { form } = storeToRefs(salesOrderStore);
</script>

<template>
  <div :class="classMerge('', props.class)">
    <d-kanban-board :initial-steps="form.schedule.steps" />
  </div>
</template>