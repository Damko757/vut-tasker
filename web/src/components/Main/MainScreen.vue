<script setup lang="ts">
import { onMounted, ref } from "vue";
import NavComponent from "../NavComponent.vue";
import axios, { HttpStatusCode } from "axios";
import type { Task } from "../../../../shared/Entities/Task";

const dots = ref("");
const dotInterval = setInterval(() => {
    dots.value += ".";
    if (loadState.value != 0) clearInterval(dotInterval);
}, 500);

const loadState = ref(0);
const tasks = ref<Task[]>([]);

onMounted(async () => {
    const response = await axios.get<Task[]>("http://localhost:3000/tasks");
    if (response.status == HttpStatusCode.Ok) {
        loadState.value = 1;
        tasks.value = response.data;
    } else {
        loadState.value = -1;
    }
});
</script>
<template>
    <div v-if="loadState == 0" class="fw-bold text-white p-3 fs-2">
        Loading{{ dots }}
    </div>
    <div
        v-else-if="loadState == -1"
        class="fw-bold p-3 fs-1 text-danger text-center"
    >
        Unable to connect! :C
        <button type="button" class="btn btn-success d-block mx-auto fw-bold">
            Refresh
        </button>
    </div>
    <template v-else-if="loadState == 1">
        <NavComponent />
    </template>
</template>
<style lang="sass" scoped></style>
