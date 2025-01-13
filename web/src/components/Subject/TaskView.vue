<script setup lang="ts">
import type { PropType } from "vue";
import type { Task } from "../../../../shared/Entities/Task";

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true,
  },
  isCollapsed: { type: Boolean, required: true },
  showAll: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (e: "update", task: Task): void;
  (e: "delete", task: Task): void;
}>();
</script>
<template>
  <div class="cursor-pointer">
    <h5 class="fw-bold position-relative pe-3">
      {{ task.required ? "*" : "" }}{{ task.description }}
      <template v-if="showAll">
        <span class="fw-bold"
          >(<u>{{ task.subject }}</u> -
          {{ (task.type as unknown as string).capitalize() }})</span
        >
      </template>
      <div class="collapse-arrow" :class="{ collapsed: props.isCollapsed }">
        >
      </div>
    </h5>
    <div v-if="task.due_date" class="due-date fst-italic">
      &#40;{{ task.due_date?.ISOToFormattedDateTime()
      }}{{
        task.due_date_end
          ? ` &hyphen; ${task.due_date_end.ISOToFormattedDateTime()}`
          : ``
      }}&#41;
    </div>
    <div class="h-0 overflow-hidden" :class="{ collapsed: props.isCollapsed }">
      <div>
        <span class="fw-bold">Link: </span
        ><a :href="task.link ?? '#'">{{ task.link ?? "&hyphen;" }}</a>
      </div>

      <div class="pt-2 fw-bold" v-if="!showAll">
        <button class="btn btn-success" @click.stop="emit('update', task)">
          Update
        </button>
        <button class="btn btn-danger mx-3" @click.stop="emit('delete', task)">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";

.due-date {
  color: darken($white, 10%);
}

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
