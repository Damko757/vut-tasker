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

const subject = ref<Task[]>();

function load() {
    emit("loadStateChange", 0);
    axios
        .get<Task[]>(`http://localhost:3000/tasks/${props.subjectName}`)
        .then(async (response) => {
            if (response.status == HttpStatusCode.Ok) {
                emit("loadStateChange", 1);
                subject.value = response.data;
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
    {{ subject }}
</template>
