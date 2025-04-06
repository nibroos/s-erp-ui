<template>
  <div class="flex-shrink-0 w-64 bg-white rounded-lg shadow">
    <div class="p-3 border-b flex justify-between items-center">
      <h3 class="font-medium">
        <input
          v-model="step.name"
          @change="updateStepName"
          class="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
        />
      </h3>
      <button
        @click="emit('delete-step', stepIndex)"
        class="text-gray-500 hover:text-red-500"
      >
        ×
      </button>
    </div>

    <div class="p-2">
      <draggable
        v-model="step.tasks"
        group="tasks"
        item-key="id"
        class="space-y-2 min-h-20"
        @end="onTaskDragEnd"
      >
        <template #item="{ element: task, index: taskIndex }">
          <d-kanban-task
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

      <button
        @click="emit('add-task', stepIndex)"
        class="w-full mt-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
      >
        + Add Task
      </button>
    </div>
  </div>
</template>

<script setup>
import draggable from "vuedraggable";

const props = defineProps({
  step: {
    type: Object,
    required: true,
  },
  stepIndex: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits([
  "update-task",
  "add-task",
  "add-comment",
  "delete-task",
  "delete-comment",
  "delete-step",
]);

const updateStepName = () => {
  emit("update-task", {
    stepIndex: props.stepIndex,
    taskIndex: null,
    updatedTask: props.step,
  });
};

const onTaskDragEnd = () => {
  // You can add additional logic here if needed when tasks are reordered
};

const handleTaskUpdate = ({ taskIndex, updatedTask }) => {
  emit("update-task", {
    stepIndex: props.stepIndex,
    taskIndex,
    updatedTask,
  });
};

const handleAddComment = ({ taskIndex, commentText }) => {
  emit("add-comment", {
    stepIndex: props.stepIndex,
    taskIndex,
    commentText,
  });
};

const handleDeleteTask = (taskIndex) => {
  emit("delete-task", {
    stepIndex: props.stepIndex,
    taskIndex,
  });
};

const handleDeleteComment = ({ taskIndex, commentIndex }) => {
  emit("delete-comment", {
    stepIndex: props.stepIndex,
    taskIndex,
    commentIndex,
  });
};
</script>