<script setup lang="ts">
import { computed, type PropType } from "vue";
import {
  compareTasksByDueDate,
  type Task as TaskT,
} from "../../../../shared/Entities/Task";
import Task from "./Task.vue";
import { getStore } from "../../store/store";

const store = getStore();
const user = store.getters.getUser();

const props = defineProps({
  tasks: {
    type: Object as PropType<TaskT[]>,
    default: [],
  },
  type: {
    type: String,
  },
  subject: {
    type: String,
  },
});
const sortedTasks = computed(() => {
  const completed: TaskT[] = [];
  const uncompleted: TaskT[] = [];

  const sortedTasks = props.tasks.slice().sort(compareTasksByDueDate);

  sortedTasks.forEach((task) => {
    task.completed_by.includes(user.value?.nick ?? "")
      ? completed.push(task)
      : uncompleted.push(task);
  });

  return [...uncompleted, ...completed];
});
</script>
<template>
  <div v-for="(task, i) in sortedTasks" :key="task._id">
    <Task v-model="sortedTasks[i]" @delete="" />
  </div>
</template>
<style lang="scss" scoped></style>
