<script setup lang="ts">
import { ref } from "vue";
import axios, { HttpStatusCode } from "axios";
import type { Task } from "../../../shared/Entities/Task";
import { API_URL } from "../const";

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
        .get<Task[]>(API_URL + "/tasks")
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
