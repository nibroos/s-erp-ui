<script setup lang="ts">
import useTicketStore from "~/stores/supports/TicketStore";
import type {
  FormScheduleStepType,
  FormScheduleType,
} from "~/types/sales-orders/SalesOrderType";
const ticketStore = useTicketStore();

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

const { form } = storeToRefs(ticketStore);

const updateSteps = (steps: FormScheduleStepType[]) => {
  console.log("kanbanboardstep", steps);

  if (!form.value.schedule) {
    form.value.schedule = cloneObject(
      useInitials.formTicketCreateEdit.schedule as FormScheduleType
    );
  }

  if (form.value.schedule) {
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