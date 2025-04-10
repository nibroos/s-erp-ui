
<script setup lang="ts">
import { mergeProps } from "vue";
import type { KanbanListActionsType } from "~/types/KanbanBoardType";
import type {
  FormScheduleStepType,
  FormScheduleTaskType,
} from "~/types/sales-orders/SalesOrderType";
const props = defineProps({
  step: {
    type: Object as () => FormScheduleStepType,
    required: true,
  },
  task: {
    type: Object as () => FormScheduleTaskType,
    required: true,
  },
  taskIndex: {
    type: Number,
    required: true,
  },
  stepIndex: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits([
  "update-task",
  "show-task",
  "delete-task",
  // "add-comment",
  // "delete-comment",
]);

// const newComment = ref("");

const updateTask = () => {
  emit("update-task", {
    taskIndex: props.taskIndex,
    updatedTask: props.task,
  });
};

// const addComment = () => {
//   if (newComment.value.trim()) {
//     emit("add-comment", {
//       taskIndex: props.taskIndex,
//       commentText: newComment.value,
//     });
//     newComment.value = "";
//   }
// };

const listActions: KanbanListActionsType[] = [
  {
    title: "Show task",
    key: "",
    emitKey: "show-task",
    icon: "mdi-eye",
    type: "action",
  },
  {
    title: "Delete task",
    key: "delete-task",
    emitKey: "delete-task",
    icon: "mdi-delete",
    type: "action",
  },
];

const handleShowTask = () => {
  emit("show-task", props.stepIndex);
};

const handleDeleteTask = () => {
  console.log("-task handleDeleteTask", props.taskIndex, props.stepIndex);

  emit("delete-task", {
    stepIndex: props.stepIndex,
    taskIndex: props.taskIndex,
  });
};

const handleActions = (action: string, list?: KanbanListActionsType) => {
  switch (action) {
    case "show-task":
      handleShowTask();
      break;
    case "delete-task":
      handleDeleteTask();
      break;
    default:
      break;
  }
};
</script>

<template>
  <div
    class="dark:bg-dark1 dark:text-white border rounded p-1 shadow-sm hover:shadow-md transition-shadow"
  >
    <div class="flex justify-between items-center">
      <div class="flex grow">
        <v-checkbox-btn
          v-model="task.is_checked"
          class="flex w-full items-center justify-center"
          hide-details
          density="compact"
          :true-value="1"
          :false-value="0"
        />
        <input
          v-model="task.title"
          @change="updateTask"
          class="w-full text-sm font-medium bg-transparent focus:outline-none focus:ring-1 focus:ring-sc rounded px-1"
        />
      </div>
      <!-- <button
        @click="emit('delete-task', taskIndex)"
        class="dark:text-white hover:text-red-500 ml-2"
      >
        ×
      </button> -->
      <!-- <d-bt
        @click="emit('delete-task', taskIndex)"
        class="dark:text-white hover:text-red-500 ml-2"
        icon="mdi-dots-horizontal"
      /> -->

      <div>
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
              <span>{{ task.title }} Actions</span>
            </v-tooltip>
          </template>

          <!-- loop items using object keys & regular loop steps -->
          <v-list density="compact">
            <v-list-item
              v-for="(item, key) in listActions"
              :key="key"
              class="w-48 !rounded-none cursor-pointer hover:bg-gray-100 dark:hover:bg-dark1 dark:text-white"
              @click="handleActions(item.emitKey, item)"
            >
              <!-- <div class="px-2 py-1 text-sm font-bold text-gray-500">
                {{ item.title }}
              </div> -->
              <template v-if="item.type === 'action'">
                <div class="flex items-center gap-2">
                  <v-icon :icon="item.icon" size="20" />
                  <span class="text-sm">{{ item.title }}</span>
                </div>
              </template>

              <template v-else-if="item.type === 'submenu'">
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
                        <v-icon :icon="item.icon" size="20" />
                        <span class="text-sm">{{ item.title }}</span>
                      </div>
                      <v-icon icon="mdi-chevron-right" size="20" />
                    </div>
                  </template>

                  <v-list class="w-48">
                    <v-list-item
                      v-for="(subItem, subIndex) in item.lists"
                      :key="subIndex"
                      class="cursor-pointer hover:bg-gray-100"
                      @click="handleActions(subItem.emitKey, item)"
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

    <!-- <textarea
      v-model="task.description"
      @change="updateTask"
      placeholder="Description"
      class="w-full mt-2 p-1 text-sm text-gray-600 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      rows="2"
    />

    <div class="mt-3">
      <div v-if="task.comments.length > 0" class="space-y-2 mb-2">
        <div
          v-for="(comment, commentIndex) in task.comments"
          :key="comment.id"
          class="p-2 bg-gray-50 rounded text-sm"
        >
          <div class="flex justify-between items-start">
            <p class="text-gray-700">{{ comment.text }}</p>
            <button
              @click="emit('delete-comment', { taskIndex, commentIndex })"
              class="text-gray-400 hover:text-red-500 ml-2 text-xs"
            >
              ×
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            {{ comment.author }} • {{ formatDate(comment.createdAt) }}
          </p>
        </div>
      </div>

      <div class="flex items-center">
        <input
          v-model="newComment"
          @keyup.enter="addComment"
          placeholder="Add a comment..."
          class="flex-1 p-1 text-sm border rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          @click="addComment"
          class="bg-blue-500 text-white p-1 px-2 rounded-r hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </div> -->
  </div>
</template>