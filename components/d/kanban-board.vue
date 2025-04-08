<script setup lang="ts">
import type {
  KanbanListActionsType,
  KanbanListTasksType,
  KanbanSectionListActionsType,
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
const drawer = ref(false);

// stepIndex: props.stepIndex,
// tasks: props.step.tasks,
// isOpen: drawer.value,

const currentDetailTaskStep = ref<FormScheduleStepType | null>(null);
const currentDetailTasks = ref<KanbanListTasksType[]>([]);
const currentDetailTasksPanel = ref<string[]>([]);
const currentDetailTasksListActions = ref<KanbanSectionListActionsType | null>(
  null
);

const handleToggleDetailTasks = ({
  stepIndex,
  tasks,
  isOpen,
  listActions,
}: {
  stepIndex: number;
  tasks: KanbanListTasksType[];
  isOpen: boolean;
  listActions: KanbanSectionListActionsType;
}) => {
  console.log("handleToggleDetailTasks", stepIndex, tasks, isOpen);
  drawer.value = isOpen;
  currentDetailTasksListActions.value = listActions;
  currentDetailTaskStep.value = steps.value[stepIndex];
  currentDetailTasksPanel.value = tasks.map((task) => {
    task.uuid = randomId();
    return task.uuid;
  });
  currentDetailTasks.value = tasks;
};

const onCloseDetailTasks = () => {
  // update tasks api
  console.log(
    (currentDetailTaskStep.value as unknown as FormScheduleStepType).stepIndex
  );

  currentDetailTaskStep.value = null;
  currentDetailTasks.value = [];
  currentDetailTasksPanel.value = [];
};

const onDeleteDetailTask = async (taskIndex: number) => {
  console.log("onDeleteDetailTask", taskIndex);

  const isConfirmed = await useAlert.showPopupConfirmation(
    `Are you sure to delete this task?`,
    `"${currentDetailTasks.value[taskIndex].title}" task will be deleted.`
  );

  if (!isConfirmed) {
    return;
  }

  currentDetailTasks.value.splice(taskIndex, 1);
};

watch(
  () => drawer.value,
  (newVal, oldVal) => {
    if (oldVal !== newVal && oldVal !== undefined && !newVal) {
      console.log("closeDetailTasks", newVal, oldVal);

      onCloseDetailTasks();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="p-4 dark:bg-dark3 !border-grey3 border-solid !border">
    <div class="flex overflow-x-auto gap-4 pb-4">
      <div v-for="(step, stepIndex) in steps" :key="stepIndex">
        <d-kanban-column
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
          @detail-tasks="handleToggleDetailTasks"
        />
      </div>

      <v-dialog
        z-index="2510"
        v-model="drawer"
        :retain-focus="false"
        :content-class="classMerge('relative h-screen right-0')"
        width="50vw"
      >
        <template #default>
          <div
            class="flex flex-col gap-3 bg-white dark:!bg-zinc-900 p-4 rounded-lg absolute inset-y-0 right-0 w-[50vw]"
          >
            <div class="flex items-center justify-between">
              <h1
                class="text-lg font-semibold text-zinc-900 dark:text-primary1"
              >
                <slot name="label">
                  {{ `"${currentDetailTaskStep?.title}"` }} task list
                </slot>
              </h1>
              <div
                @click="drawer = false"
                class="cursor-pointer rounded-full p-1 transition-all duration-300 ease-in-out hover:bg-gray-200 dark:bg-dark1 dark:hover:bg-dark2 dark:text-primary1"
              >
                <Icon name="material-symbols:close-rounded" size="25" />
              </div>
            </div>
            <d-divider></d-divider>
            <div></div>
            <!-- <v-expansion-panels v-model="currentDetailTasksPanel" multiple>
                <v-expansion-panel
                  v-for="(task, taskIndex) in currentDetailTasks"
                  :key="taskIndex"
                  :value="task.uuid"
                >
                  <template #title>
                    <div class="flex flex-col gap-2">
                      <div class="text-lg font-semibold">{{ task.title }}</div>
                      <input
                        v-model="task.title"
                        class="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-brown-500 rounded px-1"
                      />
                    </div>
                  </template>
                  <template #text>
                    <div class="flex flex-col gap-2">
                      <div class="">{{ task.remark ?? "-" }}</div>
                    </div>
                  </template>
                </v-expansion-panel>
              </v-expansion-panels> -->

            <div class="overflow-y-auto flex flex-col gap-3">
              <div
                v-for="(task, taskIndex) in currentDetailTasks"
                :key="taskIndex"
              >
                <div class="flex flex-col">
                  <div
                    class="flex items-center justify-between p-2 rounded-t-lg border border-solid border-brown-500 bg-brown-100 dark:bg-dark1"
                  >
                    <input
                      v-model="task.title"
                      class="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-brown-500 rounded px-1 font-medium"
                    />
                    <!-- delete task -->
                    <d-button
                      @click="onDeleteDetailTask(taskIndex)"
                      icon="mdi-delete"
                      is-no-text
                      class="p-1 hover:text-zinc-100 hover:bg-lightCancel2 rounded-full ease-in-out transition-all hover:dark:!bg-cancel1 dark:!bg-cancel"
                      icon-class="text-cancel dark:text-primary1"
                      rounded="xl"
                      size=""
                      cta="select"
                      icon-size="16"
                    ></d-button>
                  </div>
                  <div
                    class="flex flex-col p-2 rounded-b-lg border border-solid border-brown-500 bg-brown-50 dark:bg-dark1"
                  >
                    <input
                      v-model="task.remark"
                      class="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-brown-500 rounded px-1 text-rose-600 text-sm"
                    />
                  </div>
                  <!-- <div class="text-lg font-semibold">{{ task.title }}</div> -->

                  <!-- <div class="text-sm text-gray-500">{{ task.remark }}</div> -->
                </div>
              </div>
            </div>
          </div>
        </template>
      </v-dialog>
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