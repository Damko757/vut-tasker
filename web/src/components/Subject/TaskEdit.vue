<script setup lang="ts">
import axios from "axios";
import { ref, watch, watchEffect, type PropType } from "vue";
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

const props = defineProps({
  task: {
    type: Object as PropType<Partial<Task> | null>,
    required: false,
    default: null,
  },
  addOrEdit: {
    type: String,
    default: "edit",
  },
});

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
  <h5 class="fw-bold position-relative">
    {{ addOrEdit == "edit" ? "Edit" : "Add" }} task
  </h5>
  <div v-if="edittedTask.due_date" class="due-date fst-italic">
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
    <div>
      <span class="fw-bold">Name: </span
      ><span><SimpleInput v-model="edittedTask.name" /></span>
      <br />
      <span class="fw-bold">Due date: </span
      ><span
        ><DateTimeInput
          v-model:datetime="edittedTask.due_date"
          :ref="(el) => (dueDates[0] = el as (typeof dueDates)[0])"
          @done="
            () => {
              dueDates[1]?.focusTime();
            }
          "
        /><span class="fw-bold"> - </span></span
      >
      <span
        ><DateTimeInput
          v-model:datetime="edittedTask.due_date_end"
          :ref="(el) => (dueDates[1] = el as (typeof dueDates)[1])"
      /></span>
      <br />
      <span class="fw-bold">Required: </span
      ><span class="d-inline-block my-2 ps-2"
        ><CheckBox
          :state="edittedTask.required"
          :grey-out="false"
          @state-change="(ns) => (edittedTask.required = ns)"
      /></span>
      <span class="d-inline-block" style="width: 2em"></span>
      <template v-if="task?.created_by == user?.nick || !task?.created_by">
        <span class="fw-bold">Personal only: </span
        ><span class="d-inline-block my-2 ps-2"
          ><CheckBox
            :state="edittedTask.personal"
            :grey-out="false"
            @state-change="(ns) => (edittedTask.personal = ns)"
        /></span>
      </template>
      <br />
      <span class="fw-bold">Link: </span
      ><a
        ><SimpleInput
          v-model="edittedTask.link"
          type="text"
          style="color: cyan"
      /></a>
      <br />
      <span class="fw-bold">Description: </span>
      <div>
        <SimpleTextArea
          v-model="edittedTask.description"
          type="text"
          style="width: 100%"
        />
      </div>
      <span class="fw-bold">Room: </span>
      <span>
        <SimpleInput v-model="modifiableRoom" type="text" />
      </span>
    </div>

    <div class="fw-bold pt-2">
      <button class="btn btn-success fw-bold mx-3" @click="submit()">
        Submit!
      </button>
      <button class="btn btn-danger fw-bold mx-3" @click="emit('done', null)">
        Cancel!
      </button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.due-date {
  color: var(--color-slate-400);
}
.editables {
  text-decoration: none !important;
}
</style>
