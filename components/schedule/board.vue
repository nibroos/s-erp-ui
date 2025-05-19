<script setup lang="ts">
import useSalesOrderStore from "~/stores/orders/SalesOrderStore";
import type {
  FormScheduleStepType,
  FormScheduleType,
} from "~/types/sales-orders/SalesOrderType";
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

  if (!form.value.schedule) {
    form.value.schedule = cloneObject(
      useInitials.formSalesOrderCreateEdit.schedule as FormScheduleType
    );
  }

  if (form.value.schedule) {
    // count form.schedule.total_all_tasks_done
    const totalAllTasksDone = steps.reduce((acc, step) => {
      return acc + step.tasks.filter((task) => task.is_checked).length;
    }, 0);

    form.value.schedule.total_all_tasks_done = totalAllTasksDone;
    form.value.schedule.total_tasks = steps.reduce(
      (acc, step) => acc + step.tasks.length,
      0
    );

    console.log("total_all_tasks_done", totalAllTasksDone);
    console.log("total_tasks", form.value.schedule.total_tasks);

    form.value.schedule.steps = steps;
  }
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
  <div :class="classMerge('', props.class)" v-if="form.schedule">
    <d-kanban-board
      ref="kanbanBoardExposeRef"
      :initial-steps="form.schedule.steps"
      @update:steps="updateSteps"
    />
  </div>
</template>