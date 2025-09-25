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

const props = defineProps<{
  task: Task | null;
  showSubjectName: boolean; // If subject name should be shown
}>();

const emit = defineEmits<{
  (e: "update", task: Task): void;
}>();
const deleted = ref(false);

const state = computed(() =>
  props.task!.completed_by.includes(user.value?.nick ?? ""),
);
const isCollapsed = ref<boolean>(false);

const action = ref<"view" | "update">("view");
defineExpose({
  action,
});

function deleteTask(id: Task["_id"] | null) {
  if (!id) return;
  if (!confirm("Really?")) return;

  axios
    .delete(API_URL + `/task/${props.task?._id}`)
    .then((response) => {
      deleted.value = true;
      // TODO improve notification about subjects change
      store.mutations.loadSubjects(); // May deleted all?
    })
    .catch(console.error);
}

function todoCheck(ns: boolean) {
  axios[ns ? "post" : "delete"](
    API_URL + `/task/${props.task!._id}/${user.value!.nick}`,
  ).then((response) => {
    if (response.data.completed_by)
      props.task!.completed_by = response.data.completed_by as string[];
  });
}
</script>
<template>
  <div
    :class="{ completed: state }"
    class="mb-3 grid grid-cols-[auto_1fr] gap-3 py-2 md:mb-1"
    v-if="!deleted"
  >
    <!-- CheckBox -->
    <div class="w-13 relative grid grid-cols-2 gap-x-0.5">
      <div>
        <div class="personal" v-if="task?.personal">#</div>
        <CompletedByDots :completed-by="task?.completed_by ?? []" v-else />
      </div>
      <CheckBox :state="state" @state-change="todoCheck" />
    </div>
    <!-- Task -->
    <div class="col ps-0">
      <TaskView
        v-if="action == 'view'"
        :task="task!"
        :showSubjectName="showSubjectName"
        @update="action = 'update'"
      />
      <TaskEdit
        v-if="action == 'update'"
        add-or-edit="edit"
        :task="task ?? null"
        @done="
          (newTask) => {
            action = 'view';
            if (newTask) {
              emit('update', newTask);
            }
          }
        "
        @delete="deleteTask"
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
