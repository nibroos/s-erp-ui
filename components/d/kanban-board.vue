<script setup lang="ts">
import type {
  KanbanListActionsType,
  KanbanListTasksType,
} from "~/types/KanbanBoardType";
import type {
  FormScheduleStepType,
  FormScheduleTaskType,
  ScheduleEntityType,
} from "~/types/sales-orders/SalesOrderType";
const props = defineProps({
  initialSteps: {
    type: Array as () => FormScheduleStepType[],
    default: () => [],
  },
});

const steps = ref<FormScheduleStepType[]>(
  props.initialSteps.length ? props.initialSteps : useInitials.defaultSteps
);

const emit = defineEmits([
  "update:steps",
  "task-updated",
  "task-added",
  "comment-added",
  "task-deleted",
  "tasks-deleted",
  "comment-deleted",
  "step-deleted",
  "step-added",
]);

const addNewStep = () => {
  console.log("addNewStep");

  const newStep: FormScheduleStepType = {
    title: "New Column",
    stepIndex: steps.value.length,
    remark: "This item hasn't been started",
    order_item: steps.value.length,
    schedule_id: null,
    color: "text-blue-600",
    tasks: [],
  };
  steps.value.push(newStep);
  emit("step-added", newStep);
  emit("update:steps", steps.value);
};

type HandleType = {
  stepIndex: number;
  taskIndex: number;
  updatedTask: FormScheduleStepType;
};

const handleTaskUpdate = ({
  stepIndex,
  taskIndex,
  updatedTask,
}: HandleType) => {
  console.log("handleTaskUpdate", stepIndex, taskIndex, updatedTask);

  steps.value[stepIndex].tasks[taskIndex] = updatedTask;
  emit("task-updated", { stepIndex, taskIndex, updatedTask });
  emit("update:steps", steps.value);
};

const handleAddTask = (stepIndex: number) => {
  const newTask: FormScheduleTaskType = {
    id: null,
    parent_id: steps.value[stepIndex].id ?? null,
    parent_uuid: steps.value[stepIndex].uuid,
    schedule_id: steps.value[stepIndex].schedule_id ?? null,
    order_item: steps.value[stepIndex].tasks.length,
    title: "New Task",
    remark: "",
  };

  console.log("handleAddTask", stepIndex, newTask);

  steps.value[stepIndex].tasks.push(newTask);
  emit("task-added", { stepIndex, newTask });
  emit("update:steps", steps.value);
};

type CommentType = {
  stepIndex: number;
  taskIndex: number;
  payload: any;
};

const handleAddComment = ({ stepIndex, taskIndex, payload }: CommentType) => {
  emit("comment-added", { stepIndex, taskIndex, payload });
  emit("update:steps", steps.value);
};

type DeleteTaskType = {
  stepIndex: number;
  taskIndex: number;
};

const handleDeleteTask = async ({ stepIndex, taskIndex }: DeleteTaskType) => {
  console.log("d-kanban-board-handleDeleteTask", stepIndex, taskIndex);
  console.log(
    "steps.value d-kanban-board-handleDeleteTask",
    steps.value[stepIndex].tasks
  );
  console.log(
    "steps.value d-kanban-board-handleDeleteTask2",
    steps.value[stepIndex].tasks[taskIndex]
  );

  const currentTask = steps.value[stepIndex].tasks[
    taskIndex
  ] as FormScheduleTaskType;

  const isConfirmed = await useAlert.showPopupConfirmation(
    `Are you sure to delete this task?`,
    `"${currentTask.title}" task will be deleted.`
  );

  if (!isConfirmed) {
    return;
  }

  const deletedTask = steps.value[stepIndex].tasks.splice(taskIndex, 1)[0];
  emit("task-deleted", { stepIndex, deletedTask });
  emit("update:steps", steps.value);
};

type DeleteTasksType = {
  stepIndex: number;
};

// delete all tasks in a step
const handleDeleteTasks = async ({ stepIndex }: DeleteTasksType) => {
  console.log("handleDeleteTasks", stepIndex);

  const isConfirmed = await useAlert.showPopupConfirmation(
    `Are you sure to delete all tasks?`,
    `All tasks in ${steps.value[stepIndex].title} step will be deleted.`
  );

  if (!isConfirmed) {
    return;
  }

  try {
    steps.value[stepIndex].tasks = [];
    useAlert.alertSuccess(
      `All tasks in ${steps.value[stepIndex].title} step have been deleted.`
    );

    emit("tasks-deleted", { stepIndex });
    emit("update:steps", steps.value);
  } catch (error) {
    console.error("Error showing loading:", error);
  }
};

// move all tasks
const handleMoveAllTasks = async ({
  stepIndex,
  list,
  subList,
}: {
  stepIndex: number;
  list: KanbanListActionsType;
  subList: KanbanListActionsType;
}) => {
  console.log("handleMoveTasks", stepIndex, list, subList);

  const isConfirmed = await useAlert.showPopupConfirmation(
    `Are you sure to move all tasks?`,
    `All tasks in ${steps.value[stepIndex].title} step will be moved to ${subList.title} step.`
  );

  if (!isConfirmed) {
    return;
  }

  try {
    console.log("handleMoveTasks", stepIndex, list, subList);

    // get step parent_id

    let lastOrderItemDest =
      steps.value[subList.key as number].tasks.length > 0
        ? (steps.value[subList.key as number].tasks[
            steps.value[subList.key as number].tasks.length - 1
          ]?.order_item ?? 0) + 1
        : 0;

    steps.value[subList.key as number].tasks.push(
      ...steps.value[stepIndex].tasks.map((task) => ({
        ...task,
        parent_id: steps.value[subList.key as number].id,
        parent_uuid: steps.value[subList.key as number].uuid,
        // order_item push to the end
        order_item: lastOrderItemDest++,
      }))
    );
    steps.value[stepIndex].tasks = [];

    useAlert.alertSuccess(
      `All tasks in ${steps.value[stepIndex].title} step have been moved to ${subList.title} step.`
    );

    emit("update:steps", steps.value);
  } catch (error) {
    console.error("Error showing loading:", error);
  }
};
// const handleDeleteComment = ({ stepIndex, taskIndex, commentIndex }) => {
//   const deletedComment = steps.value[stepIndex].tasks[
//     taskIndex
//   ].comments.splice(commentIndex, 1)[0];
//   emit("comment-deleted", { stepIndex, taskIndex, deletedComment });
//   emit("update:steps", steps.value);
// };

const handleDeleteStep = (stepIndex: number) => {
  console.log("handleDeleteStep", stepIndex);

  const deletedStep = steps.value.splice(stepIndex, 1)[0];
  emit("step-deleted", { stepIndex, deletedStep });
  emit("update:steps", steps.value);
};

const handleInsertTasks = async ({
  stepIndex,
  tasks,
}: {
  stepIndex: number;
  tasks: KanbanListTasksType[];
}) => {
  console.log("handleInsertTasks", stepIndex, tasks);

  try {
    steps.value[stepIndex].tasks.push(
      ...tasks.map((task) => ({
        ...task,
        id: null,
        parent_id: steps.value[stepIndex].id,
        parent_uuid: steps.value[stepIndex].uuid,
        order_item: steps.value[stepIndex].tasks.length,
        title: task.name,
        entity_id: task.id as number,
        entity_type: "tasks" as ScheduleEntityType,
      }))
    );
    emit("update:steps", steps.value);
  } catch (error) {
    console.error("Error showing loading:", error);
  }
};
</script>


<template>
  <div class="p-4 dark:bg-dark3 !border-grey3 border-solid !border">
    <div class="flex overflow-x-auto gap-4 pb-4">
      <d-kanban-column
        v-for="(step, stepIndex) in steps"
        :key="stepIndex"
        :step="step"
        :step-index="stepIndex"
        :steps="steps"
        @update-task="handleTaskUpdate"
        @add-task="handleAddTask"
        @add-comment="handleAddComment"
        @delete-task="handleDeleteTask"
        @delete-step="handleDeleteStep"
        @delete-tasks="handleDeleteTasks"
        @move-all-tasks="handleMoveAllTasks"
        @insert-tasks="handleInsertTasks"
      />

      <!-- <div class="flex-shrink-0 w-64">
        <button
          @click="addNewStep"
          class="w-full p-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center gap-2"
        >
          <span>+ Add Column</span>
        </button>
      </div> -->
    </div>
  </div>
</template>