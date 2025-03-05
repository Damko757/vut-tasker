<script setup lang="ts">
import { computed, ref, type PropType } from "vue";
import {
  taskTypeToColor,
  type Task,
  type TaskType,
} from "../../../../shared/Entities/Task";
import Tasks from "./Tasks.vue";
import TaskEdit from "./TaskEdit.vue";

const emit = defineEmits<{
  (e: "taskAdd", task: Task): void;
}>();

const props = defineProps({
  taskType: {
    type: String,
    required: true,
  },
  tasks: {
    type: Object as PropType<Task[]>,
    required: true,
  },
  subjectName: {
    type: String,
    required: true,
  },
});

const adding = ref(false);

function addTask(newTask: Task | null) {
  adding.value = false;
  if (!newTask) return;

  emit("taskAdd", newTask);
}
</script>
<template>
  <h3 class="fw-bold w-fit-content position-relative">
    <div
      class="ps-1 pe-3"
      :style="{ color: taskTypeToColor[taskType as TaskType] }"
    >
      {{ taskType.capitalize() }}
    </div>
    <div
      class="btn-success btn fw-bold add"
      @click="adding = true"
      v-show="!adding"
    >
      Add
    </div>
    <div
      class="hr"
      :style="{ 'background-color': taskTypeToColor[taskType as TaskType] }"
    ></div>
  </h3>
  <div>
    <div class="mb-3">
      <TaskEdit
        v-if="adding"
        :add-or-edit="'add'"
        @done="addTask"
        :task="{ type: props.taskType as unknown as TaskType, subject: props.subjectName, required: true }"
      />
    </div>
    <Tasks :tasks="tasks" :subject="subjectName" :type="taskType" />
  </div>
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";

.hr {
  margin-top: 0.5em;
  background-color: $white;
  min-height: 0.15em;
  border-radius: 0.15em;
  width: 100%;
}

.btn.add {
  position: absolute;
  top: 0;
  right: 0;
  translate: calc(100% + 0.75rem) 0;
}
</style>
