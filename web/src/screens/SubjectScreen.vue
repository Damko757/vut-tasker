<script setup lang="ts">
import axios, { HttpStatusCode } from "axios";
import { computed, ref } from "vue";
import { TaskType, type Task } from "../../../shared/Entities/Task";
import { API_URL } from "../const";
import "../Utils.ts";
import Tasks from "../components/Subject/Tasks.vue";
import Subscriber from "../components/Subject/Subscriber.vue";
import TaskTypeSection from "../components/Subject/TaskTypeSection.vue";
import stc from "string-to-color";
import fontColorContrast from "font-color-contrast";

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

const subjectTasks = ref<Task[]>([]);
const allTaskTypes = Object.keys(TaskType)
  .filter((v) => isNaN(Number(v)))
  .map((v) => v.toLocaleLowerCase())
  .sort();

function load() {
  emit("loadStateChange", 0);
  axios
    .get<Task[]>(API_URL + `/tasks/${props.subjectName}`)
    .then(async (response) => {
      emit("loadStateChange", 1);

      subjectTasks.value = response.data;
    })
    .catch((response) => {
      if (response.status == HttpStatusCode.NotFound) {
        subjectTasks.value = [];
        emit("loadStateChange", 1);
      } else {
        emit("loadStateChange", -1);
      }
    });
}
const typeToTasks = computed(() => {
  const map = new Map<TaskType, Task[]>();
  allTaskTypes.forEach((type) => map.set(type as unknown as TaskType, []));
  subjectTasks.value
    ?.sort((a, b) => {
      if (a.due_date ?? "" < (b.due_date ?? "")) return 1;
      if ((a.due_date ?? "") > (b.due_date ?? "")) return -1;
      return 0;
    })
    .forEach((task) => {
      map.get(task.type)?.push(task);
    });

  return map;
});

const backgroundColor = computed(() => stc(props.subjectName));
const isForegroundColorBlack = computed(
  () => fontColorContrast(backgroundColor.value) == "#000000"
);
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
    does not exist :/ !!!
  </div>
  <div>
    <h1 class="fw-bold px-2 d-flex align-items-center">
      <span
        class="px-3 rounded-3"
        :style="{
          background: backgroundColor,
        }"
        :class="{
          'text-black': isForegroundColorBlack,
          'text-white': !isForegroundColorBlack,
        }"
      >
        {{ subjectName }}
      </span>
      <div class="d-inline-block">
        <Subscriber :subject-name="subjectName" />
      </div>
    </h1>
    <div class="types px-4">
      <section
        v-for="taskType in allTaskTypes"
        class="type mb-2"
        :key="taskType"
      >
        <TaskTypeSection
          :subject-name="subjectName"
          :task-type="taskType"
          :tasks="typeToTasks.get(taskType as unknown as TaskType) ?? []"
          @task-add="(task) => subjectTasks.push(task)"
        />
      </section>
    </div>
  </div>
</template>
