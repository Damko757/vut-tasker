<script setup lang="ts">
import { Icon } from "@iconify/vue";
import axios from "axios";
import { ref, watch, watchEffect } from "vue";
import type { Task } from "../../../../shared/Entities/Task";
import { API_URL } from "../../const";
import { getStore } from "../../store/store";
import { getDayByDate } from "../../Utils";
import DateTimeInput from "../Form/DateTimeInput/DateTimeInput.vue";
import CheckBox from "./CheckBox.vue";
import SimpleInput from "./SimpleInput.vue";
import SimpleTextArea from "./SimpleTextArea.vue";

const store = getStore();
const user = store.getters.getUser();

const props = defineProps<{
  task: Partial<Task> | null;
  addOrEdit: "edit" | "add";
}>();

const edittedTask = ref<Partial<Task>>({});
watchEffect(() => {
  edittedTask.value = props.task ?? {};
});
const originalRoom = ref(
  edittedTask.value.rooms?.[user.value?.nick ?? ""] ?? "",
);
const modifiableRoom = ref(`${originalRoom.value}`);
const submit = () => {
  if (!edittedTask.value.name?.trim() || !edittedTask.value.due_date) {
    alert("Missing name or due-date");
    return;
  }

  const taskToSend: Omit<
    Task,
    "created_by" | "rooms" | "completed_by" | "_id"
  > = {
    name: edittedTask.value.name!.trim(),
    description: edittedTask.value.description?.trim() ?? "",
    due_date: edittedTask.value.due_date!,
    due_date_end: edittedTask.value.due_date_end ?? null,
    link: edittedTask.value.link?.trim() ?? "",
    personal: edittedTask.value.personal!,
    required: edittedTask.value.required!,
    subject: edittedTask.value.subject!,
    type: edittedTask.value.type!,
  };

  const promise = props.task?._id
    ? axios.patch<Task>(API_URL + `/task/${props.task._id}`, taskToSend)
    : axios.post<Task>(API_URL + `/tasks`, taskToSend);

  promise
    .then(async (response) => {
      try {
        if (modifiableRoom.value != originalRoom.value) {
          const roomResponse = modifiableRoom.value
            ? await axios.post(
                `${API_URL}/task/${response.data._id}/room/${user.value?.nick}`,
                { room: modifiableRoom.value },
              )
            : await axios.delete(
                `${API_URL}/task/${response.data._id}/room/${user.value?.nick}`,
              );

          return emit("done", roomResponse.data as Task);
        }
      } catch (e) {
        console.error(e);
      }
      emit("done", response.data as Task);
    })
    .catch((error) => {
      console.error(error);
    });
};

const emit = defineEmits<{
  (e: "done", task: Task | null): void;
  (e: "delete", task: Task["_id"] | null): void;
}>();

const dueDates = ref<(InstanceType<typeof DateTimeInput> | null)[]>([
  null,
  null,
]);

// Copying start-date to end-date
watch(
  () => edittedTask.value.due_date,
  () => {
    if (!edittedTask.value.due_date || edittedTask.value.due_date_end) return;
    edittedTask.value.due_date_end = (function () {
      const parts = edittedTask.value.due_date?.split(" ")!;
      return `${parts[0]} `;
    })();
  },
);
</script>
<template>
  <section class="relative">
    <div
      v-if="addOrEdit == 'edit'"
      class="rounded-bl-4xl absolute right-0 top-0 cursor-pointer rounded-tr-xl bg-red-500 pb-3 pe-2 ps-3 pt-2 text-xl hover:bg-red-400"
      @click="() => emit('delete', task?._id ?? null)"
    >
      <Icon icon="material-symbols:delete-rounded" />
    </div>
    <h5 class="relative w-fit font-bold">
      {{ addOrEdit == "edit" ? "Editing" : "Adding" }} task
    </h5>
    <div v-if="edittedTask.due_date" class="due-date w-fit italic">
      &#40;{{ getDayByDate(edittedTask.due_date) }}
      {{ edittedTask.due_date?.ISOToFormattedDateTime()
      }}{{
        edittedTask.due_date_end
          ? ` &hyphen; ${getDayByDate(
              edittedTask.due_date_end,
            )} ${edittedTask.due_date_end.ISOToFormattedDateTime()}`
          : ``
      }}&#41;
    </div>
    <div class="editables">
      <div class="[&>div]:mt-2">
        <!-- Name -->
        <div>
          <span class="">Name: </span><SimpleInput v-model="edittedTask.name" />
        </div>
        <!-- Due date -->
        <div>
          <span class="">Due date: </span
          ><span
            ><DateTimeInput
              v-model:datetime="edittedTask.due_date"
              :ref="(el) => (dueDates[0] = el as (typeof dueDates)[0])"
              @done="
                () => {
                  dueDates[1]?.focusTime();
                }
              "
            /><span class=""> - </span></span
          >
          <span
            ><DateTimeInput
              v-model:datetime="edittedTask.due_date_end"
              :ref="(el) => (dueDates[1] = el as (typeof dueDates)[1])"
          /></span>
        </div>
        <!-- Checkboxes -->
        <div>
          <span class="">Required: </span
          ><span class="my-2 inline-block ps-2"
            ><CheckBox
              :state="edittedTask.required"
              :grey-out="false"
              @state-change="(ns) => (edittedTask.required = ns)"
          /></span>
          <span class="inline-block" style="width: 2em"></span>
          <template v-if="task?.created_by == user?.nick || !task?.created_by">
            <span class="">Personal only: </span
            ><span class="my-2 inline-block ps-2"
              ><CheckBox
                :state="edittedTask.personal"
                :grey-out="false"
                @state-change="(ns) => (edittedTask.personal = ns)"
            /></span>
          </template>
        </div>
        <!-- Link -->
        <div>
          <span class="">Link: </span
          ><a class="text-fit-light-blue"
            ><SimpleInput v-model="edittedTask.link" type="text"
          /></a>
        </div>
        <!-- Description -->
        <div>
          <span class="inline-block pb-1">Description: </span>
          <div class="">
            <SimpleTextArea
              v-model="edittedTask.description"
              type="text"
              style="width: 100%"
            />
          </div>
        </div>
        <div>
          <span class="">Room: </span>
          <span>
            <SimpleInput v-model="modifiableRoom" type="text" />
          </span>
        </div>
      </div>

      <div class="mt-5 text-2xl font-bold">
        <button
          class="me-3 cursor-pointer rounded-xl bg-emerald-700 px-5 py-1 hover:bg-emerald-600"
          @click="submit()"
        >
          <Icon icon="material-symbols:check-rounded" />
        </button>
        <button
          class="cursor-pointer rounded-xl bg-red-700 px-5 py-1 hover:bg-red-600"
          @click="emit('done', null)"
        >
          <Icon icon="material-symbols:close-rounded" />
        </button>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.due-date {
  color: var(--color-slate-400);
}
.editables {
  text-decoration: none !important;
}
</style>
