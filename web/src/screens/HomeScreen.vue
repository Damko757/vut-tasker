<script setup lang="ts">
import { computed, inject, ref, watch, watchEffect } from "vue";
import axios, { HttpStatusCode } from "axios";
import type { Task } from "../../../shared/Entities/Task";
import TasksView from "../components/Home/TasksView.vue";
import type { StoreType } from "../store/store";
import { API_URL } from "../const";

const store: StoreType = inject("store") as unknown as StoreType;

const user = store.getters.getUser();
defineExpose({
  load,
});
const emit = defineEmits<{
  (e: "loadStateChange", newState: number): void;
}>();

const allTasks = ref<Task[]>([]);

/**
 * Returns date, which is used to sort the strings
 * RULES:
 * 1. if registration_start => registration_start
 * 2. if registration_start && registration_end is after Today, then 3.
 * 3. Due Data
 * 4. ""
 */
// function getUpcomingDate(t: Task): string {
//   if (t.registration_date_start) return t.registration_date_start;

//   const last = t.registration_date_end || t.registration_date_start;
//   if (last && new Date(last) > new Date()) return last;

//   return t.due_date ?? "";
// }
function needsToBeShown(t: Task) {
  return (
    new Date(t.due_date ?? "") > new Date() ||
    !t.completed_by.includes(user.value!.nick)
  );
}
const sortedTasks = computed(
  () =>
    allTasks.value
      ?.filter(
        (x) =>
          store.getters
            .getUser()
            .value?.subscribed_subjects.includes(x.subject) &&
          x.due_date && // has some end date
          needsToBeShown(x) // if completed and after deadline, it should not be shown
      )
      .sort((a, b) => {
        const aDueDate = a.due_date ?? "";
        const bDueDate = b.due_date ?? "";

        if (aDueDate < bDueDate) return -1;
        if (aDueDate > bDueDate) return 1;

        const aDueDateEnd = a.due_date_end ?? "";
        const bDueDateEnd = b.due_date_end ?? "";
        if (aDueDateEnd < bDueDateEnd) return -1;
        if (aDueDateEnd > bDueDateEnd) return 1;
        return 0;
      }) ?? []
);

function loadTasks() {
  axios
    .get<Task[]>(API_URL + "/tasks")
    .then(async (response) => {
      if (response.status == HttpStatusCode.Ok) {
        emit("loadStateChange", 1);
        allTasks.value = response.data;
      } else {
        emit("loadStateChange", -1);
      }
    })
    .catch(() => {
      emit("loadStateChange", -1);
    });
}

watch(store.state.user, loadTasks);
function load() {
  emit("loadStateChange", 0);
  if (store.getters.getUser().value) loadTasks();
}
</script>
<template>
  <h1 class="fw-bold px-2 mb-5">Najbližšie udalosti:</h1>
  <div class="types px-4">
    <section class="type mb-2">
      <!-- <h3 class="fw-bold w-fit-content">
                <div class="ps-1 pe-5">
                    {{ (taskType as unknown as string).capitalize() }}
                </div>
                <div class="hr"></div>
            </h3> -->
      <div>
        <TasksView :tasks="sortedTasks" />
      </div>
    </section>
  </div>
</template>
<style lang="scss" scoped></style>
