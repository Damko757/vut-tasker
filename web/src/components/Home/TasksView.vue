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

const weekNumber = (task?: TaskT) => (task ? moment(task!.due_date).week() : 0);
const showWeekNumber = (i: number) => {
  if (i == 0) return true; // First one
  return weekNumber(props.tasks.at(i - 1)) != weekNumber(props.tasks.at(i));
};

// TODO: Automatically guess the first week?
const WINTER_START_WEEK = 38;
const SUMMER_START_WEEK = -13;
const weekText = (task: TaskT) => {
  const week = weekNumber(task);
  if (WINTER_START_WEEK <= week && week < WINTER_START_WEEK + 13) {
    return `${week}/${week - WINTER_START_WEEK + 1}`;
  }
  if (SUMMER_START_WEEK <= week && week < SUMMER_START_WEEK + 13) {
    return `${week}/${week - SUMMER_START_WEEK + 1}`;
  }

  return week;
};
</script>
<template>
  <div v-for="(task, i) in tasks" :key="task._id">
    <!-- Week Divider -->
    <div
      class="mb-3 flex items-center justify-start gap-1"
      v-if="showWeekNumber(i)"
    >
      <div
        class="new-week h-2 w-10 rounded-full"
        :class="{ active: weekNumber(task) == moment().week() }"
      ></div>
      <div class="week-num ps-1 font-bold">
        {{ weekText(task) }}
      </div>
    </div>
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
<style lang="scss" scoped>
.new-week {
  background-color: white;

  &.active {
    background-color: var(--color-fit-light-blue) !important;
    .week-num {
      color: var(--color-fit-light-blue) !important;
    }
  }
}
</style>
