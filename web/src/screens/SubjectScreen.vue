<script setup lang="ts">
import { Icon } from "@iconify/vue";
import axios, { HttpStatusCode } from "axios";
import fontColorContrast from "font-color-contrast";
import stc from "string-to-color";
import { computed, ref } from "vue";
import { TaskType, type Task } from "../../../shared/Entities/Task";
import Subscriber from "../components/Subject/Subscriber.vue";
import TaskTypeSection from "../components/Subject/TaskTypeSection.vue";
import { API_URL } from "../const";
import "../Utils.ts";

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
  .map((v) => v.toLocaleLowerCase());
// .sort();

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
  () => fontColorContrast(backgroundColor.value) == "#000000",
);
</script>
<template>
  <div>
    <h1 class="mb-3 flex items-center px-2">
      <div
        class="border-3 me-2 rounded-xl px-5 py-0.5 text-xl font-bold tracking-wider md:px-10 md:py-1 md:text-2xl"
        :style="{
          'border-color': backgroundColor,
          'background-color': backgroundColor,
        }"
        :class="[isForegroundColorBlack ? 'text-black' : 'text-white']"
      >
        <div class="relative block">
          <div
            v-if="subjectTasks?.length == 0"
            class="fw-bold text-danger absolute -left-2.5 top-1/2 me-2 block -translate-x-1/2 -translate-y-1/2 md:-left-5"
          >
            <Icon icon="material-symbols:add-circle-outline-rounded" />
          </div>
          {{ subjectName }}
        </div>
      </div>
      <div class="inline-block">
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
          @task-update="
            (newTask) => {
              // Replacing in subjectTasks or inserting
              const index = subjectTasks.findIndex((t) => t._id == newTask._id);
              if (index == -1) subjectTasks.push(newTask);
              else subjectTasks[index] = newTask;
            }
          "
        />
      </section>
    </div>
  </div>
</template>
