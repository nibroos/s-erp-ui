<script setup lang="ts">
import type {
  DeleteTaskType,
  KanbanListActionsType,
  KanbanListTasksType,
  KanbanSectionListActionsType,
  OrderScheduleTaskType,
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
  props.initialSteps.length
    ? props.initialSteps
    : JSON.parse(JSON.stringify(useInitials.defaultSteps))
);

const generateStepIndex = () => {
  steps.value.forEach((step, index) => {
    step.stepIndex = index;
  });
};

generateStepIndex();

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

type HandleType = {
  stepIndex: number;
  taskIndex: number;
  updatedTask: FormScheduleStepType;
};

const generateTasks = (stepIndex: number) => {
  steps.value[stepIndex].tasks.forEach((task, index) => {
    task.order_item = index;
    task.parent_uuid = steps.value[stepIndex].uuid;
    task.parent_id = steps.value[stepIndex].id ?? null;
    task.is_checked = task.is_checked ?? 0;
  });
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
  // const newTask: FormScheduleTaskType = {
  //   id: null,
  //   parent_id: steps.value[stepIndex].id ?? null,
  //   parent_uuid: steps.value[stepIndex].uuid,
  //   schedule_id: steps.value[stepIndex].schedule_id ?? null,
  //   order_item: steps.value[stepIndex].tasks.length,
  //   title: "New Task",
  //   remark: "",
  // };
  // console.log("handleAddTask", stepIndex, newTask);
  // steps.value[stepIndex].tasks.push(newTask);
  // emit("task-added", { stepIndex, newTask });
  // emit("update:steps", steps.value);
};

const handleDeleteTask = async ({ stepIndex, taskIndex }: DeleteTaskType) => {
  console.log("d-kanban-board-handleDeleteTask1", stepIndex, taskIndex);
  console.log(
    "steps.value d-kanban-board-handleDeleteTask",
    steps.value[stepIndex].tasks
  );
  console.log(
    "steps.value d-kanban-board-handleDeleteTask2",
    steps.value[stepIndex].tasks[taskIndex]
  );

  const currentTask = steps.value[stepIndex].tasks[taskIndex];

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

    let lastTaskOrderItem = steps.value[stepIndex].tasks.length;

    steps.value[subList.key as number].tasks.push(
      ...steps.value[stepIndex].tasks.map((task) => ({
        ...task,
        parent_id: steps.value[subList.key as number].id,
        parent_uuid: steps.value[subList.key as number].uuid,
        // order_item push to the end
        order_item: lastTaskOrderItem++,
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

const handleDeleteStep = (stepIndex: number) => {
  if (stepIndex < 5) {
    useAlert.alertError(`You cannot delete the first 5 steps.`);
    return;
  } else {
    const deletedStep = steps.value.splice(stepIndex, 1)[0];
    emit("step-deleted", { stepIndex, deletedStep });
    emit("update:steps", steps.value);
  }
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
    let lastTaskOrderItem = steps.value[stepIndex].tasks.length;
    steps.value[stepIndex].tasks.push(
      ...tasks.map((task) => ({
        ...task,
        id: null,
        parent_id: steps.value[stepIndex].id,
        uuid: randomId(),
        parent_uuid: steps.value[stepIndex].uuid,
        order_item: lastTaskOrderItem++,
        title: task.name,
        entity_id: task.id as number,
        entity_type: "tasks" as ScheduleEntityType,
        is_checked: task.is_checked ?? 0,
      }))
    );
    emit("update:steps", steps.value);
  } catch (error) {
    console.error("Error showing loading:", error);
  }
};
const drawer = ref(false);

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
  steps.value[stepIndex].stepIndex = stepIndex;

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
  console.log("onCloseDetailTasks", currentDetailTaskStep.value);

  if (!!currentDetailTaskStep.value) {
    steps.value[currentDetailTaskStep.value.stepIndex].tasks =
      currentDetailTasks.value;
  }

  currentDetailTaskStep.value = null;
  currentDetailTasks.value = [];
  currentDetailTasksPanel.value = [];
  emit("update:steps", steps.value);
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

const taskDragged = (log: any, stepIndex: number) => {
  const { added, removed, moved } = log;

  if (!!moved) {
  }

  if (!!added) {
    const { element, newIndex, oldIndex } = added;
  }

  generateTasks(stepIndex);

  emit("update:steps", steps.value);
};

const handleCheckAllTasks = (stepIndex: number) => {
  console.log("handleCheckAllTasks", stepIndex);

  steps.value[stepIndex].tasks.forEach((task) => {
    task.is_checked = 1;
  });
  emit("update:steps", steps.value);
};

const handleUncheckAllTasks = (stepIndex: number) => {
  steps.value[stepIndex].tasks.forEach((task) => {
    task.is_checked = 0;
  });
  emit("update:steps", steps.value);
};

const handleOrderTasks = (
  stepIndex: number,
  orderTaskMode: OrderScheduleTaskType
) => {
  console.log("handleOrderTasks", stepIndex, orderTaskMode);

  const column = orderTaskMode.order_column as keyof FormScheduleTaskType; // Ensure column is a valid key

  steps.value[stepIndex].tasks.sort((a, b) => {
    const valueA = a[column] ?? ""; // Handle undefined or null values
    const valueB = b[column] ?? "";

    if (orderTaskMode.order_direction === "asc") {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  });

  generateTasks(stepIndex);

  emit("update:steps", steps.value);
};

const addNewStep = () => {
  const newStep: FormScheduleStepType = {
    id: null,
    uuid: randomId(),
    stepIndex: steps.value.length,
    schedule_id: null,
    entity_id: null,
    entity_type: "steps" as ScheduleEntityType,
    order_item: steps.value.length,
    color: "",
    title: "Step " + (steps.value.length + 1),
    start_at: "",
    end_at: "",
    tasks: [],
  };

  steps.value.push(newStep);
  emit("step-added", { newStep });
  emit("update:steps", steps.value);
};

// reset board expose functions
const resetBoard = () => {
  console.log("defaultSteps", useInitials.defaultSteps);

  steps.value = JSON.parse(
    JSON.stringify(useInitials.defaultSteps)
  ) as FormScheduleStepType[];
  console.log("resetBoard", steps.value);

  emit("update:steps", steps.value);
};

defineExpose({
  resetBoard,
});

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
  <div class="p-4 bg-white dark:!bg-dark3 !border-grey3 border-solid !border">
    <div class="flex overflow-x-auto gap-4 pb-4">
      <div v-for="(step, stepIndex) in steps" :key="stepIndex">
        <d-kanban-column
          :key="stepIndex"
          :step="step"
          :step-index="stepIndex"
          :steps="steps"
          @update-task="handleTaskUpdate"
          @add-task="handleAddTask"
          @add-tasks="handleAddTask"
          @delete-task="handleDeleteTask"
          @delete-step="handleDeleteStep"
          @delete-tasks="handleDeleteTasks"
          @check-all-tasks="handleCheckAllTasks"
          @uncheck-all-tasks="handleUncheckAllTasks"
          @ordered-tasks="handleOrderTasks"
          @move-all-tasks="handleMoveAllTasks"
          @insert-tasks="handleInsertTasks"
          @detail-tasks="handleToggleDetailTasks"
          @tasks-dragged="taskDragged"
        />
      </div>

      <v-dialog
        z-index="2510"
        v-model="drawer"
        :retain-focus="false"
        :content-class="
          classMerge(
            'relative h-screen right-0 !w-[50vw] sm:!w-full !max-h-none !m-0'
          )
        "
      >
        <template #default>
          <div
            class="flex flex-col gap-3 bg-white dark:!bg-zinc-900 p-4 rounded-lg absolute inset-y-0 right-0 w-[50vw] sm:w-full"
          >
            <div class="flex items-center justify-between">
              <span class="text-zinc-900 dark:text-primary1">
                <slot name="label">
                  <span class="text-lg font-semibold">
                    {{ `${currentDetailTaskStep?.title ?? ""}` }}
                  </span>
                </slot>
                <span> task list </span>
              </span>
              <div
                @click="drawer = false"
                class="cursor-pointer rounded-full p-1 transition-all duration-300 ease-in-out hover:bg-gray-200 dark:bg-dark1 dark:hover:bg-dark2 dark:text-primary1"
              >
                <Icon name="material-symbols:close-rounded" size="25" />
              </div>
            </div>
            <d-divider></d-divider>

            <div v-if="currentDetailTasks.length > 0" class="flex-1">
              <v-virtual-scroll
                :items="currentDetailTasks"
                style="max-height: calc(100vh - 100px)"
                :class="classMerge('abc')"
              >
                <template
                  v-slot:default="{
                    item: task,
                    index: taskIndex,
                  }: {
                    item: any,
                    index: number,
                  }"
                >
                  <div class="flex flex-col py-2">
                    <div
                      class="flex items-center text-zinc-900 dark:text-primary1 justify-between p-2 rounded-t-lg border border-solid border-brown-500 bg-brown-100 dark:bg-dark1"
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
                      class="flex flex-col gap-2 text-zinc-900 dark:text-primary1 p-2 rounded-b-lg border border-solid border-brown-500 bg-brown-50 dark:bg-dark1"
                    >
                      <!-- <input
                        v-model="task.remark"
                        class="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-brown-500 rounded px-1 text-sm"
                      /> -->

                      <div class="grid grid-cols-2 gap-2">
                        <d-autocomplete
                          v-model="task.assignee_id"
                          api="/v1/users/index-user"
                          single-api="/v1/users/show-user"
                          page-end-prop="meta.next_page_url"
                          item-title="name"
                          item-value="id"
                          method-api="post"
                          inner-search-key="global"
                          label="Assignee"
                        ></d-autocomplete>

                        <div class="flex gap-2 grow">
                          <d-date-picker-light
                            v-model="task.start_at"
                            label="Start Date"
                          ></d-date-picker-light>
                          <d-date-picker-light
                            v-model="task.end_at"
                            label="End Date"
                          ></d-date-picker-light>
                        </div>
                      </div>
                      <d-text-area-input
                        v-model="task.remark"
                        :label="``"
                        :placeholder="`Remark`"
                        class=""
                        :auto-grow="false"
                        :rows="3"
                      />
                    </div>
                    <!-- <div class="text-lg font-semibold">{{ task.title }}</div> -->

                    <!-- <div class="text-sm text-gray-500">{{ task.remark }}</div> -->
                  </div>
                </template>
              </v-virtual-scroll>
            </div>

            <div v-else>
              <span class="text-grey3"> No tasks available </span>
            </div>
          </div>
        </template>
      </v-dialog>
      <div class="flex-shrink-0 w-64">
        <button
          @click="addNewStep"
          class="w-full p-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center gap-2"
        >
          <span>+ Add Step</span>
        </button>
      </div>
    </div>
  </div>
</template>