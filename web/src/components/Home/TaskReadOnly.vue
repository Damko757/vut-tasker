<script setup lang="ts">
import { computed, ref, type PropType } from "vue";
import type { Task } from "../../../../shared/Entities/Task";
import axios from "axios";
import TaskView from "../Subject/TaskView.vue";
import CheckBox from "../Subject/CheckBox.vue";
import CompletedByDots from "../Subject/CompletedByDots.vue";
import { getStore } from "../../store/store";
import { API_URL } from "../../const";
import moment from "moment";

const store = getStore();
const user = store.getters.getUser();

const task = defineModel<Task>();
const deleted = ref(false);

const props = defineProps<{
  showWeek: boolean;
}>();

const state = computed(() =>
  task.value!.completed_by.includes(user.value?.nick ?? "")
);
const isCollapsed = ref<boolean>(false);

const action = ref<"view" | "update">("view");

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
    API_URL + `/task/${task.value!._id}/${user.value!.nick}`
  ).then((response) => {
    if (response.data.completed_by)
      task.value!.completed_by = response.data.completed_by as string[];
  });
}
</script>
<template>
  <div
    :class="{ completed: state }"
    class="row position-relative"
    v-if="!deleted"
  >
    <div class="position-relative mb-2">
      <div class="new-week" v-if="true">
        <div class="week-num ps-1">{{ moment(task?.due_date).week() }}</div>
      </div>
    </div>
    <div class="col-auto position-relative pb-2">
      <div class="position-absolute" style="left: -0.75em">
        <CompletedByDots :completed-by="task?.completed_by ?? []" />
      </div>
      <CheckBox :state="state" @state-change="todoCheck" />
    </div>
    <div class="col ps-0" @click="isCollapsed = !isCollapsed">
      <TaskView
        v-if="action == 'view'"
        :task="task!"
        :is-collapsed="isCollapsed"
        :show-all="true"
      />
    </div>

    <hr class="mt-2" />
  </div>
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";

.new-week {
  width: 2em;
  height: 0.5rem;
  background-color: $white;
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
}

.completed h5 {
  text-decoration: line-through;
  color: darken($white, 30%);
}

button.btn {
  display: none !important;
}
</style>
