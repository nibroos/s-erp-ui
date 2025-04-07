
<script setup lang="ts">
import { mergeProps } from "vue";
import draggable from "vuedraggable";
import type {
  KanbanListActionsType,
  KanbanSectionListActionsType,
} from "~/types/KanbanBoardType";
import type { FormScheduleStepType } from "~/types/sales-orders/SalesOrderType";
import type {
  FieldSelectableType,
  FilterSelectableType,
} from "~/types/SelectTableType";

const selectedTasks = ref<any[]>([]);

const headersTask = ref<FieldSelectableType[]>([
  {
    title: "Name",
    key: "name",
    value: "name",
    align: "start",
    sortable: true,
    type: "text",
  },
  {
    title: "Description",
    key: "description",
    value: "description",
    align: "start",
    sortable: true,
    type: "text",
  },
  {
    title: "Remark",
    key: "remark",
    value: "remark",
    align: "start",
    sortable: true,
    type: "text",
  },
]);

const filtersTask = ref<FilterSelectableType[]>([
  {
    title: "Name",
    key: "name",
  },
]);

const handleSelectedTasks = (data: any[]) => {
  // TODO fix reset to empty after select
  console.log("selectedTasks", data);
  selectedTasks.value = data;

  if (data.length > 0) {
    emit("insert-tasks", {
      stepIndex: props.stepIndex,
      tasks: data,
    });
  }
};

const props = defineProps({
  key: {
    type: Number,
  },
  step: {
    type: Object as () => FormScheduleStepType,
    required: true,
  },
  steps: {
    type: Array as () => FormScheduleStepType[],
    required: true,
  },
  stepIndex: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits([
  "insert-tasks",
  "update-task",
  "add-task",
  "add-comment",
  "delete-task",
  "delete-comment",
  "delete-step",
  "delete-tasks",
  "move-tasks",
  "move-all-tasks",
  "add-tasks",
  "update-step",
  "delete-steps",
  "tasks-dragged",
]);

const updateStepName = () => {
  // watchListActionSubMenu(props.steps);
  emit("update-task", {
    stepIndex: props.stepIndex,
    taskIndex: null,
    updatedTask: props.step,
  });
};

const onTaskDragEnd = () => {
  // You can add additional logic here if needed when tasks are reordered
  // console.log("onTaskDragEnd", props.step.tasks);
  // emit("tasks-dragged", {
  //   stepIndex: props.stepIndex,
  //   updatedTask: props.step,
  // });
};

// onTaskDragEnter
// onTaskDragLeave

const onTaskDragEnter = () => {
  console.log("onTaskDragEnter", props.step.tasks);
  emit("tasks-dragged", {
    stepIndex: props.stepIndex,
    updatedTask: props.step,
  });
};

const onTaskDragLeave = () => {
  console.log("onTaskDragLeave", props.step.tasks);
  emit("tasks-dragged", {
    stepIndex: props.stepIndex,
    updatedTask: props.step,
  });
};

const handleChangeOrder = (log: any) => {
  console.log("handleChangeOrder", log);
  // emit("tasks-dragged", {
  //   stepIndex: props.stepIndex,
  //   updatedTask: props.step,
  // });
};

type HandleType = {
  taskIndex: number;
  updatedTask: FormScheduleStepType;
  payload: any;
};

const handleTaskUpdate = ({ taskIndex, updatedTask }: HandleType) => {
  emit("update-task", {
    stepIndex: props.stepIndex,
    taskIndex,
    updatedTask,
  });
};

const handleAddComment = ({ taskIndex, payload }: HandleType) => {
  emit("add-comment", {
    stepIndex: props.stepIndex,
    taskIndex,
    payload,
  });
};

const handleDeleteTask = (taskIndex: number) => {
  console.log("d-kanban-column-handleDeleteTask", taskIndex);
  emit("delete-task", {
    stepIndex: props.stepIndex,
    taskIndex,
  });
};

const handleDeleteComment = ({ taskIndex, payload }: HandleType) => {
  emit("delete-comment", {
    stepIndex: props.stepIndex,
    taskIndex,
    payload,
  });
};

const listActions: KanbanSectionListActionsType = {
  items: {
    title: "Tasks",
    key: "tasks",
    lists: [
      {
        title: "Add tasks",
        key: "",
        emitKey: "add-tasks",
        icon: "mdi-plus",
        type: "action",
      },
      {
        title: "Move all tasks",
        key: "",
        emitKey: "",
        icon: "mdi-arrow-right",
        type: "submenu",
        // get lists of move tasks except the current step
        lists: props.steps
          .filter((step, index) => index !== props.stepIndex)
          .map((step) => ({
            title: step.title,
            key: step.stepIndex,
            emitKey: `move-all-tasks`,
            icon: "",
            type: "action",
          })),
      },
      {
        title: "Delete all tasks",
        key: "delete-tasks",
        emitKey: "delete-tasks",
        icon: "mdi-delete",
        type: "action",
      },
    ],
  },
  // steps: {
  //   title: "Step",
  //   key: "steps",
  //   lists: [{ title: "Delete step", key: "delete-step", icon: "mdi-delete" }],
  // },
};

const handleActions = (
  action: string,
  list?: KanbanListActionsType,
  subList?: KanbanListActionsType
) => {
  switch (action) {
    case "add-tasks":
      // trigger on open modal

      emit("add-tasks", props.stepIndex);
      break;
    case "move-tasks":
      console.log("move-tasks", props.stepIndex);

      emit("move-tasks", props.stepIndex);
      break;
    case "move-all-tasks":
      console.log(
        "d-kanban-column-move-all-tasks",
        props.stepIndex,
        list,
        subList
      );
      handleMoveAllTasks({
        list: list as KanbanListActionsType,
        subList: subList as KanbanListActionsType,
      });
      break;
    case "delete-tasks":
      handleDeleteTasks();
      break;
    case "delete-steps":
      handleDeleteStep();
      break;
    default:
      break;
  }
};
const handleDeleteStep = () => {
  emit("delete-step", props.stepIndex);
};
const handleDeleteTasks = () => {
  emit("delete-tasks", {
    stepIndex: props.stepIndex,
  });
};
const handleMoveAllTasks = ({
  list,
  subList,
}: {
  list: KanbanListActionsType;
  subList: KanbanListActionsType;
}) => {
  if (!props.steps[props.stepIndex].tasks.length) {
    useAlert.alertError(
      `No tasks in ${props.steps[props.stepIndex].title} step.`
    );

    return;
  }
  emit("move-all-tasks", {
    stepIndex: props.stepIndex,
    list,
    subList,
  });
};

const watchListActionSubMenu = (newVal: FormScheduleStepType[]) => {
  console.log("steps changed", newVal);
  // Update all listActions with the new steps
  // listActions.items.lists[1].lists = newVal
  //   // .filter((stepListAction, index) => index !== props.stepIndex)
  //   .map((stepListAction) => ({
  //     title: stepListAction.title,
  //     key: stepListAction.stepIndex,
  //     emitKey: "move-all-tasks",
  //     icon: "",
  //     type: "action",
  //   }));
  listActions.items.lists.forEach((item, index) => {
    // FIX TODO WATCHER ON PARENT
    if (item.type === "submenu") {
      console.log("listActions.items.lists-submenu", item);

      listActions.items.lists[index].lists = newVal
        .filter((step, index) => index !== props.stepIndex)
        .map((stepProp) => ({
          title: stepProp.title,
          key: stepProp.stepIndex,
          emitKey: "move-all-tasks",
          icon: "",
          type: "action",
        }));

      console.log("listActions.items.lists-submenu-item.lists", item.lists);
    }
  });
};

watch(
  () => props.steps,
  (newVal, oldVal) => {
    // if (newVal !== oldVal) {
    console.log("steps changed", newVal);
    // Update the listActions with the new steps
    watchListActionSubMenu(newVal);
    // }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div
    class="flex flex-col justify-between w-[24rem] bg-white dark:!bg-dark2 rounded-lg shadow dark:text-white !border border-grey3"
  >
    <div class="flex flex-col p-3 border-b">
      <div class="flex justify-between items-center">
        <div class="font-medium flex gap-2">
          <input
            v-model="step.title"
            @change="updateStepName"
            class="bg-transparent dark:!text-white w-fit min-w-[3.75rem] max-w-[10.25rem] focus:outline-none focus:ring-1 focus:ring-brown-500 rounded px-1"
          />
        </div>

        <div class="flex gap-1 items-center">
          <div
            class="bg-grey1 dark:bg-dark3 dark:text-white px-1.5 font-bold rounded-full"
          >
            {{ step.tasks.length }}
          </div>
          <v-menu
            activator="parent"
            no-click-animation
            :close-on-content-click="false"
            :open-delay="0"
            :close-delay="0"
            open-on-hover
            transition="slide-y-transition"
          >
            <template v-slot:activator="{ props: menu }">
              <v-tooltip location="top">
                <template v-slot:activator="{ props: tooltip }">
                  <v-btn
                    v-bind="mergeProps(menu, tooltip)"
                    density="compact"
                    class="dark:text-white hover:text-gray-500 w-max"
                    icon="mdi-dots-horizontal"
                    variant="flat"
                  >
                  </v-btn>
                </template>
                <span>{{ step.title }} Actions</span>
              </v-tooltip>
            </template>

            <!-- loop items using object keys & regular loop steps -->
            <v-list v-for="(item, key) in listActions" :key="key" class="w-48">
              <!-- <div class="px-2 py-1 text-sm font-bold text-gray-500">
                {{ item.title }}
              </div> -->
              <v-list-item
                v-for="(list, index) in item.lists"
                :key="index"
                class="cursor-pointer hover:bg-gray-100 dark:hover:bg-dark1 dark:text-white"
                @click="handleActions(list.emitKey)"
                density="compact"
                elevation="0"
              >
                <!-- <div class="flex items-center gap-2">
                  <v-icon :icon="list.icon" size="20" />
                  <span class="text-sm">{{ list.title }}</span>
                </div> -->
                <template v-if="list.type === 'action'">
                  <div class="flex items-center gap-2">
                    <v-icon :icon="list.icon" size="20" />
                    <span class="text-sm">{{ list.title }}</span>
                  </div>
                </template>

                <template v-else-if="list.type === 'submenu'">
                  <v-menu
                    offset="10"
                    :open-on-focus="false"
                    activator="#submenu-activator"
                    open-on-hover
                    submenu
                  >
                    <template v-slot:activator="{ props: submenuProps }">
                      <div
                        v-bind="submenuProps"
                        class="flex items-center justify-between w-full"
                        id="submenu-activator"
                      >
                        <div class="flex items-center gap-2">
                          <v-icon :icon="list.icon" size="20" />
                          <span class="text-sm">{{ list.title }}</span>
                        </div>
                        <v-icon icon="mdi-chevron-right" size="20" />
                      </div>
                    </template>

                    <v-list class="w-48">
                      <v-list-item
                        v-for="(subItem, subIndex) in list.lists"
                        :key="subIndex"
                        class="cursor-pointer hover:bg-gray-100 dark:hover:bg-dark1 dark:text-white"
                        @click="handleActions(subItem.emitKey, list, subItem)"
                        density="compact"
                        elevation="0"
                      >
                        <div class="flex items-center gap-2">
                          <v-icon
                            :icon="subItem.icon"
                            size="20"
                            v-if="!!subItem.icon"
                          />
                          <span class="text-sm">{{ subItem.title }}</span>
                        </div>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
      <h4 class="text-sm text-gray-500 dark:text-gray-400">
        <input
          v-model="step.remark"
          @change="updateStepName"
          class="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-brown-500 rounded px-1"
        />
      </h4>
    </div>

    <div class="p-2 flex flex-col h-full">
      <draggable
        v-model="step.tasks"
        group="tasks"
        item-key="id"
        class="space-y-2 min-h-20 max-h-48 overflow-y-auto flex-grow"
        @change="handleChangeOrder"
      >
        <!-- @dragenter="onTaskDragEnter"
        @dragleave="onTaskDragLeave" -->
        <template #item="{ element: task, index: taskIndex }">
          <d-kanban-task
            :step="step"
            :task="task"
            :task-index="taskIndex"
            :step-index="stepIndex"
            @update-task="handleTaskUpdate"
            @add-comment="handleAddComment"
            @delete-task="handleDeleteTask"
            @delete-comment="handleDeleteComment"
          />
        </template>
      </draggable>
    </div>

    <div class="px-2 pb-2">
      <lazy-d-select-table
        :key="props.key"
        api="/v1/tasks/index-task"
        detail-api="/v1/tasks/index-task"
        method-api="post"
        detail-method-api="post"
        mapping-detail="data[0]"
        total-prop="meta.total"
        :label="`Tasks${props.stepIndex}`"
        v-model="selectedTasks"
        class="col-span-2 lg:col-span-1"
        multiple
        return-object
        @update:model-value="handleSelectedTasks"
        modal-parent-class="!z-[2500]"
        modal-custom-class="!w-4/5"
        is-reset-when-close
        :fields="headersTask"
        :filters="filtersTask"
        :form-options="{
          ...useInitials.formOptionDefault,
          creatable: true,
          editable: true,
          mode: '',
          keyDif: props.stepIndex,
          cta: 'Create New Task Master',
        }"
      >
        <template #btn="{ onOpenModal, onClearSelected }">
          <v-btn
            @click="onOpenModal"
            class="w-full p-2 font-medium !capitalize !tracking-normal !bg-scLightest dark:!bg-sc dark:text-white text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-dark3 dark:hover:text-white rounded self-end place-self-end justify-self-end"
            variant="flat"
          >
            + Add Tasks
          </v-btn>
        </template>
      </lazy-d-select-table>
    </div>
  </div>
</template>