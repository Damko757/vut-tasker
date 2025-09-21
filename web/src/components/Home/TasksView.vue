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
  <!-- <div class="relative mb-3" v-if="showWeek && weekNumber">
      <div class="new-week" :class="{ active: weekNumber == moment().week() }">
        <div class="week-num ps-1">
          {{
            (() => {
              if (
                WINTER_START_WEEK <= weekNumber &&
                weekNumber < WINTER_START_WEEK + 13
              ) {
                return `${weekNumber}/${weekNumber - WINTER_START_WEEK + 1}`;
              }
              if (
                SUMMER_START_WEEK <= weekNumber &&
                weekNumber < SUMMER_START_WEEK + 13
              ) {
                return `${weekNumber}/${weekNumber - SUMMER_START_WEEK + 1}`;
              }

              return weekNumber;
            })()
          }}
        </div>
      </div>
    </div> -->
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
