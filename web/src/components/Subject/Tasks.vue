<script setup lang="ts">
import type { PropType } from "vue";
import type { Task as TaskType } from "../../../../shared/Entities/Task";
import Task from "./Task.vue";

const props = defineProps({
    tasks: {
        type: Object as PropType<TaskType[]>,
        default: [],
    },
});
</script>
<template>
    <div v-for="(task, i) in tasks" :key="task._id">
        <Task v-model="tasks[i]" />
        <hr />
    </div>
    <div class="btn-success btn fw-bold">Add</div>
</template>
<style lang="scss" scoped></style>
