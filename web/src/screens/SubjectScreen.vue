<script setup lang="ts">
import axios, { HttpStatusCode } from "axios";
import { ref } from "vue";
import type { Task } from "../../../shared/Entities/Task";

defineExpose({
    load,
});
const emit = defineEmits<{
    (e: "loadStateChange", newState: number): void;
}>();

const props = defineProps({
    subjectName: {
        type: String,
        required: true,
    },
});

const subject = ref<Task[] | null>();

function load() {
    emit("loadStateChange", 0);
    axios
        .get<Task[]>(`http://localhost:3000/tasks/${props.subjectName}`)
        .then(async (response) => {
            emit("loadStateChange", 1);

            subject.value = response.data;
        })
        .catch((response) => {
            if (response.status == HttpStatusCode.NotFound) {
                subject.value = null;
                emit("loadStateChange", 1);
            } else {
                emit("loadStateChange", -1);
            }
        });
}
</script>
<template>
    <div v-if="subject === null" class="fs-2 fw-bold text-center text-danger">
        <em
            ><u>{{ subjectName }}</u></em
        >
        neexistuje :/
    </div>
    <div v-else>
        {{ subject }}
    </div>
</template>
