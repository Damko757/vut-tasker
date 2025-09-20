<script setup lang="ts">
import moment from "moment";
import { type PropType } from "vue";
import { type Task as TaskT } from "../../../../shared/Entities/Task";
import Task from "../Subject/Task.vue";

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
    <Task
      v-model="tasks[i]"
      :show-week="
        i <= 0 ||
        moment(props.tasks[i].due_date).week() !=
          moment(props.tasks[i - 1].due_date).week()
      "
      :show-subject-name="true"
    />
  </div>
</template>
<style lang="scss" scoped></style>
