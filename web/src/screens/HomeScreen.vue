<script setup lang="ts">
import { Icon } from "@iconify/vue";
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
          ), // Hide completed
      )
      .sort(compareTasksByDueDate) ?? [],
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
  <!-- Top Bar -->
  <div class="grid w-full grid-cols-1 text-3xl md:grid-cols-2">
    <div class="relative my-3 md:order-2">
      <div class="sanity-wrapper" @click="invertFilter">
        <!-- <SanityBar v-if="!showFilter" :tasks="sortedTasks" /> -->
        <HomeFilter :filter-map="filterMap" />
      </div>
    </div>
    <div class="mb-2 flex items-center font-bold md:order-1 md:mb-5">
      <!-- FitCheats link -->
      <a
        class="fitcheats-link"
        href="https://vutbr-my.sharepoint.com/shared"
        target="_blank"
        title="FitCheats"
      >
        <Icon icon="material-symbols:dataset-linked-outline-rounded" />
      </a>
      <h1 class="px-2">Upcoming tasks:</h1>
    </div>
  </div>

  <div class="types">
    <section class="type mb-2">
      <div v-if="!sortedTasks.length" class="fs-1 font-bold">
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
  // width: 30em;
  // max-width: 80%;
  // margin-left: auto;
  // margin-right: 0em;
  // position: relative;
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
