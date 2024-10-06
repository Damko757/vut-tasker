<script setup lang="ts">
import { computed, ref, watch, watchEffect, type PropType } from "vue";
import type { Task } from "../../../../shared/Entities/Task";
import SimpleInput from "./SimpleInput.vue";
import CheckBox from "./CheckBox.vue";
import axios from "axios";
import { API_URL } from "../../const";

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

const submit = () => {
    const promise = props.task?._id
        ? axios.patch<Task>(
              API_URL + `/task/${props.task._id}`,
              edittedTask.value
          )
        : axios.post<Task>(API_URL + `/tasks`, edittedTask.value);

    promise
        .then((response) => {
            emit("done", response.data as Task);
        })
        .catch((error) => {
            console.error(error);
        });
};

function stateChanged(ns: boolean) {
    edittedTask.value.required = ns;
}

const emit = defineEmits<{
    (e: "done", task: Task | null): void;
}>();
</script>
<template>
    <h5 class="fw-bold position-relative">
        {{ addOrEdit == "edit" ? "Edit" : "Add" }} task
    </h5>
    <div v-if="edittedTask.due_date" class="text-muted fst-italic">
        &#40;{{ edittedTask.due_date?.ISOToFormattedDateTime() }}&#41;
    </div>
    <div class="editables">
        <div>
            <span class="fw-bold">Description: </span
            ><span><SimpleInput v-model="edittedTask.description" /></span>
            <br />
            <span class="fw-bold">Due date: </span
            ><span
                ><SimpleInput
                    v-model="edittedTask.due_date"
                    type="datetime-local"
            /></span>
            <br />
            <span class="fw-bold">Required: </span
            ><span class="d-inline-block ps-2 my-2"
                ><CheckBox
                    :state="edittedTask.required"
                    :grey-out="false"
                    @state-change="stateChanged"
            /></span>
            <br />
            <span class="fw-bold">Registration: </span
            ><span class="d-block"
                ><SimpleInput
                    v-model="edittedTask.registration_date_start"
                    type="datetime-local" />
                <span class="fw-bold"> - </span>
                <SimpleInput
                    v-model="edittedTask.registration_date_end"
                    type="datetime-local"
            /></span>
            <br />
            <span class="fw-bold">Link: </span
            ><a
                ><SimpleInput
                    v-model="edittedTask.link"
                    type="text"
                    style="color: cyan"
            /></a>
        </div>

        <div class="pt-2 fw-bold">
            <button class="btn btn-success mx-3 fw-bold" @click="submit()">
                Submit!
            </button>
            <button
                class="btn btn-danger mx-3 fw-bold"
                @click="emit('done', null)"
            >
                Cancel!
            </button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";
.editables {
    text-decoration: none !important;
}
</style>
