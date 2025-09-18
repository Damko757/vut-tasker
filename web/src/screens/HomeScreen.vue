<script setup lang="ts">
import axios, { HttpStatusCode } from "axios";
import { computed, inject, onMounted, ref, watch } from "vue";
import {
  compareTasksByDueDate,
  TaskType,
  type Task,
} from "../../../shared/Entities/Task";
import {
  filterState,
  loadFilterValue,
} from "../components/Etc/HomeFilter/HomeFilter";
import HomeFilter from "../components/Etc/HomeFilter/HomeFilter.vue";
import SanityBar from "../components/Etc/SanityBar/SanityBar.vue";
import RainbowText from "../components/Home/RainbowText.vue";
import TasksView from "../components/Home/TasksView.vue";
import { API_URL } from "../const";
import type { StoreType } from "../store/store";

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
      <div
        class="col-lg-auto col-12 d-flex align-items-center mb-md-5 mb-2 mb-md-4"
      >
        <!-- FitCheats link -->
        <a
          class="fitcheats-link"
          href="https://vutbr-my.sharepoint.com/shared"
          target="_blank"
          title="FitCheats"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <!-- Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE -->
            <path
              fill="currentColor"
              d="M5 20q-.825 0-1.412-.587T3 18V4q0-.825.588-1.412T5 2h14q.825 0 1.413.588T21 4v7.1q-.25-.05-.488-.075T20 11h-1V4H5v14h3.1q.1.55.263 1.05T8.8 20zm0-3v1V4zm2-1h1.1q.2-1.225.875-2.262T10.7 12H7zm0-6h4V6H7zm7 11q-1.65 0-2.825-1.175T10 17t1.175-2.825T14 13h2v2h-2q-.825 0-1.412.588T12 17t.588 1.413T14 19h2v2zm-1-11h4V6h-4zm1 8v-2h6v2zm4 3v-2h2q.825 0 1.413-.587T22 17t-.587-1.412T20 15h-2v-2h2q1.65 0 2.825 1.163T24 17q0 1.65-1.175 2.825T20 21z"
            />
          </svg>
        </a>
        <h1 class="fw-bold px-2">Upcoming tasks:</h1>
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
@import "/src/SCSS/build/colors.scss";

.sanity-wrapper {
  width: 30em;
  max-width: 80%;
  height: 3em;
  margin-left: auto;
  margin-right: 0em;
  margin-bottom: 1em;
  position: relative;
}

.fitcheats-link {
  color: $fit-blue;
  transition: 250ms;
  display: inline-block;

  &:hover {
    color: $fit-dark-blue;
  }
}
</style>
