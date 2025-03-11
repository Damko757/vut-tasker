<script setup lang="ts">
import { computed, ref, type PropType } from "vue";
import { TaskType, type Task as TaskT } from "../../../../shared/Entities/Task";
import TaskView from "../Subject/TaskView.vue";
import TaskReadOnly from "./TaskReadOnly.vue";
import moment from "moment";

const props = defineProps({
  tasks: {
    type: Object as PropType<TaskT[]>,
    default: [],
  },
});

moment.updateLocale("en", {
  week: {
    dow: 1, // Monday is the first day of the week.
  },
});
</script>
<template>
  <div v-for="(task, i) in tasks" :key="task._id">
    <TaskReadOnly
      v-model="tasks[i]"
      :show-week="
        i <= 0 ||
        moment(props.tasks[i].due_date).week() !=
          moment(props.tasks[i - 1].due_date).week()
      "
    />
  </div>
</template>
<style lang="scss" scoped></style>
