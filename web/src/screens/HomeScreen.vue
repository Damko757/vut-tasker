<script setup lang="ts">
import { computed, inject, onMounted, ref, watch, watchEffect } from "vue";
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
import HomeFilter from "../components/Etc/HomeFilter/HomeFilter.vue";
import {
  filterState,
  loadFilterValue,
} from "../components/Etc/HomeFilter/HomeFilter";

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
          needsToBeShown(x) && // if completed and after deadline, it should not be shown
          filterMap.value[x.type] && // Is not filtered out
          !(
            filterMap.value.See &&
            x.completed_by.includes(user.value?.nick ?? "")
          ) // Hide completed
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
const showFilter = ref(false);
const invertFilter = () => {
  showFilter.value = !showFilter.value;
  filterState(showFilter.value.toString());
};

onMounted(() => {
  showFilter.value = filterState() == "true";
});

const filterMap = ref<{ [key in TaskType | "See"]: boolean }>({
  See: loadFilterValue("S", false), // Hide completed
  [TaskType.EXAM]: loadFilterValue("E", true),
  [TaskType.PROJECT]: loadFilterValue("P", true),
  [TaskType.HOMEWORK]: loadFilterValue("H", true),
  [TaskType.REGISTRATION]: loadFilterValue("R", true),
  [TaskType.OTHER]: loadFilterValue("O", true),
});

watch(store.state.user, loadTasks);
function load() {
  emit("loadStateChange", 0);
  if (store.getters.getUser().value) loadTasks();
}
</script>
<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-auto col-12">
        <h1 class="fw-bold px-2 mb-md-5 mb-2 mb-md-4">Upcoming tasks:</h1>
      </div>
      <div class="col-lg col-12">
        <div class="sanity-wrapper" @click="invertFilter">
          <SanityBar v-if="!showFilter" :tasks="sortedTasks" />
          <HomeFilter v-else :filter-map="filterMap" />
        </div>
      </div>
    </div>
  </div>
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
  margin-left: auto;
  margin-right: 0em;
  margin-bottom: 1em;
  position: relative;
}
</style>
