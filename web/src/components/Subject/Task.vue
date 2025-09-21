<script setup lang="ts">
import axios from "axios";
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
  showSubjectName: boolean; // If subject name should be shown
}>();
</script>
<template>
  <div
    :class="{ completed: state }"
    class="mb-3 grid grid-cols-[auto_1fr] gap-3 py-2"
    v-if="!deleted"
  >
    <!-- CheckBox -->
    <div class="relative grid grid-cols-2 gap-x-0.5">
      <div>
        <div class="personal" v-if="task?.personal">#</div>
        <CompletedByDots :completed-by="task?.completed_by ?? []" v-else />
      </div>
      <CheckBox :state="state" @state-change="todoCheck" />
    </div>
    <!-- Task -->
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
// .completed h5 {
//   text-decoration: line-through;
//   color: var(--color-slate-400);
// }

.personal {
  color: var(--color-slate-400);
  display: block;
  position: absolute;
  font-size: 1.75rem;
  transform: translateY(-25%);
  font-weight: bold;
}
</style>
