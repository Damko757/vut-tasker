<script setup lang="ts">
import axios from "axios";
import moment from "moment";
import { computed, ref } from "vue";
import type { Task } from "../../../../shared/Entities/Task";
import { API_URL } from "../../const";
import { getStore } from "../../store/store";
import CheckBox from "./CheckBox.vue";
import CompletedByDots from "./CompletedByDots.vue";
import TaskEdit from "./TaskEdit.vue";
import TaskView from "./TaskView.vue";

const store = getStore();
const user = store.getters.getUser();

const task = defineModel<Task>();
const deleted = ref(false);

const state = computed(() =>
  task.value!.completed_by.includes(user.value?.nick ?? ""),
);
const isCollapsed = ref<boolean>(false);

const action = ref<"view" | "update">("view");
defineExpose({
  action,
});

function deleteTask() {
  if (!confirm("Really?")) return;

  axios
    .delete(API_URL + `/task/${task.value?._id}`)
    .then((response) => {
      deleted.value = true;
    })
    .catch(console.error);
}

function todoCheck(ns: boolean) {
  axios[ns ? "post" : "delete"](
    API_URL + `/task/${task.value!._id}/${user.value!.nick}`,
  ).then((response) => {
    if (response.data.completed_by)
      task.value!.completed_by = response.data.completed_by as string[];
  });
}

const props = defineProps<{
  showWeek: boolean;
  showSubjectName: boolean; // If subject name should be shown
}>();

const weekNumber = computed(() =>
  task.value ? moment(task.value!.due_date).week() : 0,
);

const WINTER_START_WEEK = 38;
const SUMMER_START_WEEK = -13;
</script>
<template>
  <div :class="{ completed: state }" class="row mb-3 py-2" v-if="!deleted">
    <div class="position-relative mb-3" v-if="showWeek && weekNumber">
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
    </div>
    <div class="position-relative col-auto pb-2">
      <div class="position-absolute" style="left: -0.75em">
        <div class="personal" v-if="task?.personal">#</div>
        <CompletedByDots :completed-by="task?.completed_by ?? []" v-else />
      </div>
      <CheckBox :state="state" @state-change="todoCheck" />
    </div>
    <div class="col ps-0" @click="isCollapsed = !isCollapsed">
      <TaskView
        v-if="action == 'view'"
        :task="task!"
        :is-collapsed="isCollapsed"
        :showSubjectName="showSubjectName"
        @update="action = 'update'"
        @delete="deleteTask"
      />
      <TaskEdit
        v-if="action == 'update'"
        :task="task"
        @done="
          (newTask) => {
            action = 'view';
            if (newTask) task = newTask;
          }
        "
      />
    </div>
  </div>
</template>
<style lang="scss">
.new-week {
  width: 2em;
  height: 0.5rem;
  background-color: white;
  left: 0;
  top: 100%;
  transform: translate(-1em, -50%);
  border-radius: 1em;

  .week-num {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(100%, -50%);
    font-weight: bold;
  }

  &.active {
    background-color: var(--color-fit-light-blue) !important;
    .week-num {
      color: var(--color-fit-light-blue) !important;
    }
  }
}

.completed h5 {
  text-decoration: line-through;
  color: var(--color-slate-400);
}

.personal {
  color: var(--color-slate-400);
  display: block;
  position: absolute;
  font-size: 1.75rem;
  transform: translateY(-25%);
  font-weight: bold;
}
</style>
