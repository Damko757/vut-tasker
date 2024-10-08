<script setup lang="ts">
import { ref, type PropType } from "vue";
import { TaskType, type Task as TaskT } from "../../../../shared/Entities/Task";
import TaskView from "../Subject/TaskView.vue";
import TaskReadOnly from "./TaskReadOnly.vue";

const props = defineProps({
    tasks: {
        type: Object as PropType<TaskT[]>,
        default: [],
    },
});
</script>
<template>
    <div v-for="(task, i) in tasks" :key="task._id">
        <TaskReadOnly v-model="tasks[i]" />
    </div>
</template>
<style lang="scss" scoped></style>
