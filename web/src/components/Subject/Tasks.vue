<script setup lang="ts">
import { computed, ref, type ComputedRef, type PropType } from "vue";
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

const taskElements = ref<InstanceType<typeof Task>[]>([]);
const emit = defineEmits<{ (e: "update", task: TaskT | null): void }>();

const sortedTasks: ComputedRef<TaskT[]> = computed<TaskT[]>(() => {
  const completed: TaskT[] = [];
  const uncompleted: TaskT[] = [];

  if (taskElements.value.some((el) => el.action != "view"))
    return sortedTasks.value;

  const _sortedTasks = props.tasks.slice().sort(compareTasksByDueDate);

  _sortedTasks.forEach((task) => {
    task.completed_by.includes(user.value?.nick ?? "")
      ? completed.push(task)
      : uncompleted.push(task);
  });

  return [...uncompleted, ...completed];
});
</script>
<template>
  <div v-for="(task, i) in sortedTasks" :key="task._id">
    <Task
      :task="sortedTasks[i]"
      @update="(t) => emit('update', t)"
      @delete=""
      :ref="(el) => (taskElements[i] = el as InstanceType<typeof Task>)"
      :show-subject-name="false"
    />
  </div>
</template>
<style lang="scss" scoped></style>
