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

const emit = defineEmits(["update:steps"]);

const { form } = storeToRefs(salesOrderStore);

const updateSteps = (steps: FormScheduleStepType[]) => {
  console.log("kanbanboardstep", steps);

  form.value.schedule.steps = steps;
  emit("update:steps", steps);
};
</script>

<template>
  <div :class="classMerge('', props.class)">
    <d-kanban-board
      :initial-steps="form.schedule.steps"
      @update:steps="updateSteps"
    />
  </div>
</template>