<script setup lang="ts">
import type { PropType } from "vue";
import type { Task } from "../../../../shared/Entities/Task";

const props = defineProps({
    task: {
        type: Object as PropType<Task>,
        required: true,
    },
    isCollapsed: { type: Boolean, required: true },
});

const emit = defineEmits<{
    (e: "update", task: Task): void;
    (e: "delete", task: Task): void;
}>();
</script>
<template>
    <h5 class="fw-bold position-relative">
        {{ task.required ? "*" : "" }}{{ task.description }}
        <div class="collapse-arrow" :class="{ collapsed: props.isCollapsed }">
            >
        </div>
    </h5>
    <div v-if="task.due_date" class="text-muted fst-italic">
        &#40;{{ task.due_date?.ISOToFormattedDateTime() }}&#41;
    </div>
    <div class="h-0 overflow-hidden" :class="{ collapsed: props.isCollapsed }">
        <div>
            <span class="fw-bold">Registration: </span
            ><span class="">{{
                task.registration_date_start
                    ? `${task.registration_date_start.ISOToFormattedDateTime()}` +
                      (task.registration_date_end
                          ? `- ${task.registration_date_end.ISOToFormattedDateTime()}`
                          : ``)
                    : "&lt;No term&gt;"
            }}</span>
            <br />
            <span class="fw-bold">Link: </span
            ><a :href="task.link ?? '#'">{{ task.link ?? "??" }}</a>
        </div>

        <div class="pt-2 fw-bold">
            <button class="btn btn-success" @click="emit('update', task)">
                Update
            </button>
            <button class="btn btn-danger mx-3" @click="emit('delete', task)">
                Delete
            </button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";

.collapsed {
    height: auto !important;
}

.collapse-arrow {
    position: absolute;
    font-size: 1.75em;
    right: 0;
    top: 50%;
    translate: 0% -50%;
    rotate: 90deg;
    transition: 250ms;
    transform-origin: center;

    &.collapsed {
        rotate: -90deg !important;
    }
}
</style>
