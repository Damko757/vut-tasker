<script setup lang="ts">
import { computed, ref } from "vue";
import axios, { HttpStatusCode } from "axios";
import type { Task } from "../../../shared/Entities/Task";
import { API_URL, CookieValue } from "../const";
import TasksView from "../components/Home/TasksView.vue";
import { useCookies } from "@vueuse/integrations/useCookies";
import type { User } from "../../../shared/Entities/User";

const cookies = useCookies([CookieValue.USER]);

const nick = computed<string>(() => {
  return cookies.get(CookieValue.USER)!;
});
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
function getUpcomingDate(t: Task): string {
  if (t.registration_date_start) return t.registration_date_start;

  const last = t.registration_date_end || t.registration_date_start;
  if (last && new Date(last) > new Date()) return last;

  return t.due_date ?? "";
}
function needsToBeShown(t: Task) {
  return (
    new Date(t.due_date ?? "") > new Date() ||
    !t.completed_by.includes(nick.value)
  );
}
const sortedTasks = computed(
  () =>
    allTasks.value
      ?.filter(
        (x) =>
          user.value?.subscribed_subjects.includes(x.subject) &&
          getUpcomingDate(x) && // has some end date
          needsToBeShown(x) // if completed and after deadline, it should not be shown
      )
      .sort((a, b) => {
        const aVal = getUpcomingDate(a);
        const bVal = getUpcomingDate(b);

        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
        return 0;
      }) ?? []
);

function load() {
  emit("loadStateChange", 0);
  axios.get<User>(`${API_URL}/user/${nick.value}`).then((response) => {
    user.value = response.data;
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
  });
}

const user = ref<User | undefined>();
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
