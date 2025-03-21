<script setup lang="ts">
import { computed, inject, ref, watch, watchEffect } from "vue";
import axios, { HttpStatusCode } from "axios";
import {
  compareTasksByDueDate,
  TaskType,
  type Task,
} from "../../../shared/Entities/Task";
import TasksView from "../components/Home/TasksView.vue";
import RainbowText from "../components/Home/RainbowText.vue";
import type { StoreType } from "../store/store";
import { API_URL } from "../const";
import SanityBar from "../components/Etc/SanityBar/SanityBar.vue";
import { useCookies } from "@vueuse/integrations/useCookies";
import HomeFilter from "../components/Etc/HomeFilter/HomeFilter.vue";

const SHOW_FILTER = "SHOW_FILTER";

const store: StoreType = inject("store") as unknown as StoreType;
const cookies = useCookies([SHOW_FILTER]);

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
          needsToBeShown(x) && // if completed and after deadline, it should not be shown
          filterMap.value[x.type] // Is not filtered out
      )
      .sort(compareTasksByDueDate) ?? []
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

const filterMap = ref<{ [key in TaskType]: boolean }>({
  [TaskType.PROJECT]: true,
  [TaskType.HOMEWORK]: true,
  [TaskType.EXAM]: true,
  [TaskType.REGISTRATION]: true,
});

watch(store.state.user, loadTasks);
function load() {
  emit("loadStateChange", 0);
  if (store.getters.getUser().value) loadTasks();
}
</script>
<template>
  <div
    class="sanity-wrapper"
    @click="
      () => {
        cookies.set(SHOW_FILTER, !cookies.get(SHOW_FILTER), {
          sameSite: `strict`,
          expires: (function (d = new Date()) {
            d.setDate(d.getDate() + 365 * 10); // 10 years
            return d;
          })(),
        });
      }
    "
  >
    <SanityBar v-if="!cookies.get(SHOW_FILTER)" :tasks="sortedTasks" />
    <HomeFilter v-else :filter-map="filterMap" />
  </div>
  <h1 class="fw-bold px-2 mb-md-5 mb-4">Upcoming tasks:</h1>
  <div class="types px-4">
    <section class="type mb-2">
      <div v-if="!sortedTasks.length" class="fw-bold fs-1">
        <span style="color: orangered" class="fst-italic">
          <RainbowText text="YaaY! Nothing to do :)"
        /></span>
      </div>
      <div>
        <TasksView :tasks="sortedTasks" />
      </div>
    </section>
  </div>
</template>
<style lang="scss" scoped>
.sanity-wrapper {
  width: 30em;
  max-width: 80%;
  height: 3em;
  position: absolute;
  top: 1em;
  right: 1em;
}
</style>
