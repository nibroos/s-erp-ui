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

const kanbanBoardExposeRef = ref();

// Trigger the openModal method
const resetBoard = async () => {
  if (kanbanBoardExposeRef.value) {
    console.log("resetBoard-board");
    kanbanBoardExposeRef.value.resetBoard();
  } else {
    console.error("openModal method is not available on kanbanBoardExposeRef");
  }

  // await openModal(filteredModalForms.value);
};

defineExpose({
  resetBoard,
});
</script>

<template>
  <div :class="classMerge('', props.class)">
    <d-kanban-board
      ref="kanbanBoardExposeRef"
      :initial-steps="form.schedule.steps"
      @update:steps="updateSteps"
    />
  </div>
</template>