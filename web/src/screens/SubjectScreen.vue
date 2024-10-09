<script setup lang="ts">
import axios, { HttpStatusCode } from "axios";
import { computed, ref } from "vue";
import { TaskType, type Task } from "../../../shared/Entities/Task";
import { API_URL } from "../const";
import "../Utils.ts";
import Tasks from "../components/Subject/Tasks.vue";

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

const subjectTasks = ref<Task[] | null>();
const allTaskTypes = Object.keys(TaskType)
    .filter((v) => isNaN(Number(v)))
    .map((v) => v.toLocaleLowerCase())
    .sort();
const typeToTasks = computed(() => {
    const map = new Map<TaskType, Task[]>();
    allTaskTypes.forEach((type) => map.set(type as unknown as TaskType, []));
    subjectTasks.value?.forEach((task) => {
        map.get(task.type)?.push(task);
    });

    return map;
});

function load() {
    emit("loadStateChange", 0);
    axios
        .get<Task[]>(API_URL + `/tasks/${props.subjectName}`)
        .then(async (response) => {
            emit("loadStateChange", 1);

            subjectTasks.value = [];
        })
        .catch((response) => {
            if (response.status == HttpStatusCode.NotFound) {
                subjectTasks.value = null;
                emit("loadStateChange", 1);
            } else {
                emit("loadStateChange", -1);
            }
        });
}
</script>
<template>
    <div
        v-if="subjectTasks?.length == 0"
        class="fs-2 fw-bold text-center text-danger"
    >
        !!!
        <em
            ><u>{{ subjectName }}</u></em
        >
        neexistuje :/ !!!
    </div>
    <div>
        <h1 class="fw-bold px-2">
            {{ subjectName }}
        </h1>
        <div class="types px-4">
            <section
                v-for="taskType in allTaskTypes"
                class="type mb-2"
                :key="taskType"
            >
                <h3 class="fw-bold w-fit-content">
                    <div class="ps-1 pe-5">
                        {{ (taskType as unknown as string).capitalize() }}
                    </div>
                    <div class="hr"></div>
                </h3>
                <div>
                    <Tasks
                        :tasks="typeToTasks.get(taskType as unknown as TaskType)"
                        :subject="subjectName"
                        :type="taskType"
                    />
                </div>
            </section>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";

section.type {
    .hr {
        margin-top: 0.5em;
        background-color: $white;
        min-height: 0.15em;
        border-radius: 0.15em;
        width: 100%;
    }
}
</style>
