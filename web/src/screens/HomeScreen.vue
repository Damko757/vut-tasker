<script setup lang="ts">
import { ref } from "vue";
import axios, { HttpStatusCode } from "axios";
import type { Task } from "../../../shared/Entities/Task";

defineExpose({
    load,
});
const emit = defineEmits<{
    (e: "loadStateChange", newState: number): void;
}>();

const tasks = ref<Task[]>([]);

function load() {
    emit("loadStateChange", 0);
    axios
        .get<Task[]>("http://localhost:3000/tasks")
        .then(async (response) => {
            if (response.status == HttpStatusCode.Ok) {
                emit("loadStateChange", 1);
                tasks.value = response.data;
            } else {
                emit("loadStateChange", -1);
            }
        })
        .catch(() => {
            emit("loadStateChange", -1);
        });
}
</script>
<template>Hello!</template>
<style lang="scss" scoped></style>
