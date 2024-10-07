<script setup lang="ts">
import { computed, ref } from "vue";
import axios, { HttpStatusCode } from "axios";
import type { Task } from "../../../shared/Entities/Task";
import { API_URL } from "../const";
import TaskView from "../components/Subject/TaskView.vue";
import Tasks from "../components/Subject/Tasks.vue";

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
const sortedTasks = computed(
    () =>
        allTasks.value
            ?.filter((x) => getUpcomingDate(x))
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
</script>
<template>
    <h1 class="fw-bold px-2">Najbližšie udalosti:</h1>
    <div class="types px-4">
        <section class="type mb-2">
            <!-- <h3 class="fw-bold w-fit-content">
                <div class="ps-1 pe-5">
                    {{ (taskType as unknown as string).capitalize() }}
                </div>
                <div class="hr"></div>
            </h3> -->
            <div>
                <Tasks :tasks="sortedTasks" subject="" type="" />
            </div>
        </section>
    </div>
</template>
<style lang="scss" scoped></style>
