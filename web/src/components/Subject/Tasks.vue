<script setup lang="ts">
import { ref, type PropType } from "vue";
import { TaskType, type Task as TaskT } from "../../../../shared/Entities/Task";
import Task from "./Task.vue";
import TaskEdit from "./TaskEdit.vue";

const props = defineProps({
    tasks: {
        type: Object as PropType<TaskT[]>,
        default: [],
    },
    type: {
        type: String,
    },
    subject: {
        type: String,
    },
});

const adding = ref(false);

function addTask(newTask: TaskT | null) {
    adding.value = false;
    if (!newTask) return;

    props.tasks.push(newTask);
}
</script>
<template>
    <div v-for="(task, i) in tasks" :key="task._id">
        <Task v-model="tasks[i]" @delete="" />
    </div>
    <TaskEdit
        v-if="adding"
        :add-or-edit="'add'"
        @done="addTask"
        :task="{ type: props.type as unknown as TaskType, subject: props.subject, required: true }"
    />
    <div
        class="btn-success btn fw-bold"
        @click="adding = true"
        v-show="!adding"
    >
        Add
    </div>
</template>
<style lang="scss" scoped></style>
