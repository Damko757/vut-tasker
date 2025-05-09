<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  type PropType,
  watch,
  onActivated,
  onBeforeMount,
} from "vue";
import { taskTypeToColor, type Task } from "../../../../shared/Entities/Task";
import { getStore } from "../../store/store";
import stc from "string-to-color";
import fontColorContrast from "font-color-contrast";
import { getDayByDate } from "../../Utils";
const store = getStore();
const user = store.getters.getUser();

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true,
  },
  isCollapsed: { type: Boolean, required: true },
  showAll: { type: Boolean, default: false },
});

const room = computed(() => props.task.rooms?.[user?.value?.nick ?? ""]);

const emit = defineEmits<{
  (e: "update", task: Task): void;
  (e: "delete", task: Task): void;
}>();

const extraInfo: (keyof Task)[] = ["link", "description"];

const incomingExclamations = computed(() => {
  const dueDate = props.task.due_date_end ?? props.task.due_date;
  if (!dueDate) return "";

  const date = new Date(dueDate);
  const today = new Date();
  const timeDiff = date.getTime() - today.getTime();
  const timeDiffInHours = timeDiff / (3600 * 1000);

  let timeLimit = 48; // h

  let out = "";
  for (let i = 0; i < 3; i++) {
    if (timeDiffInHours < timeLimit + 1) out += "!";
    timeLimit /= 2; // 48 -> 24 -> 12;
  }

  return out;
});

const countdown = ref<number | null>(null);

const countdownText = computed(() => {
  if (countdown.value == null) return "";

  const diff = countdown.value;

  const obj: {
    s: number;
    min: number;
    h: number;
    d: number;
    w: number;
  } = {
    s: -1,
    min: -1,
    h: -1,
    d: -1,
    w: -1,
  };

  obj.s = Math.abs(diff);

  obj.min = obj.s / 60;
  obj.s = Math.floor(obj.s % 60);

  obj.h = obj.min / 60;
  obj.min = Math.floor(obj.min % 60);

  obj.d = obj.h / 24;
  obj.h = Math.floor(obj.h % 24);

  obj.w = Math.floor(obj.d / 7);
  obj.d = Math.floor(obj.d % 7);

  let out = [
    [obj.w, "w "],
    [obj.d, "d "],
    [obj.h.toString().padStart(2, "0"), ":"],
    [obj.min.toString().padStart(2, "0"), ":"],
    [obj.s.toString().padStart(2, "0"), ""],
  ];

  while (Number(out[0][0]) <= 0) {
    out.splice(0, 1);
  }

  const res = (diff > 0 ? "" : "-") + out.reduce((a, b) => a + b.join(""), "");

  return res ? `${res}` : "";
});

const setCountdown = () => {
  const date = props.task.due_date_end ?? props.task.due_date;
  if (!date) {
    countdown.value = null;
    return;
  }

  const today = new Date();
  countdown.value = (new Date(date).getTime() - today.getTime()) / 1000; // s
};

onBeforeMount(() => {
  setCountdown();

  setInterval(function () {
    if (countdown.value != null) countdown.value--;
  }, 1000);
});
watch(() => [props.task.due_date, props.task.due_date_end], setCountdown);

const backgroundColor = computed(() =>
  props.task ? stc(props.task.subject) : ""
);
const isForegroundColorBlack = computed(
  () => fontColorContrast(backgroundColor.value) == "#000000"
);
</script>
<template>
  <div class="cursor-pointer">
    <h5 class="position-relative pe-3">
      <!-- Show subject name -->
      <span
        v-if="showAll"
        class="fw-bold me-2 px-1 rounded-2"
        :style="{
          background: backgroundColor,
        }"
        :class="{
          'text-black': isForegroundColorBlack,
          'text-white': !isForegroundColorBlack,
        }"
      >
        {{ task.required ? "*" : "" }}{{ task.subject }}:</span
      >
      <!-- Show only basic task -->
      <span class="fw-bold" v-else>{{ task.required ? "*" : "" }}</span
      >{{ task.name }}
      <template v-if="showAll">
        <span class="fw-bold" :style="{ color: taskTypeToColor[task.type] }"
          >({{ (task.type as unknown as string).capitalize() }})</span
        >
      </template>
      <span
        class="incoming text-danger ms-2 fw-bold fs-3"
        v-if="!task.completed_by.includes(user?.nick ?? ``)"
        >{{ incomingExclamations }}</span
      >
      <div
        class="collapse-arrow"
        :class="{ collapsed: props.isCollapsed }"
        v-if="!showAll || extraInfo.some((x) => task[x])"
      >
        >
      </div>
    </h5>
    <div v-if="task.due_date" class="due-date fst-italic">
      &#40;{{ getDayByDate(task.due_date) }}
      {{ task.due_date?.ISOToFormattedDateTime()
      }}{{
        task.due_date_end
          ? ` &hyphen; ${getDayByDate(
              task.due_date_end
            )} ${task.due_date_end.ISOToFormattedDateTime()}`
          : ``
      }}&#41; <span v-if="room">at {{ room }}&nbsp;</span>
      <span
        :class="{
          'text-danger': countdown != null && countdown <= 0,
        }"
        class="countdown fw-bold text-nowrap"
        >{{ countdownText }}</span
      >
    </div>
    <div class="h-0 overflow-hidden" :class="{ collapsed: props.isCollapsed }">
      <div v-if="task.link">
        <span class="fw-bold">Link: </span
        ><a
          class="text-break"
          :href="task.link ?? '#'"
          @click.stop
          target="_blank"
          >{{ task.link ?? "&hyphen;" }}</a
        >
      </div>
      <div v-if="task.description">
        <span class="fw-bold">Description: </span>
        <div>
          {{ task.description }}
        </div>
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

.countdown {
  color: $white;
}

.incoming {
  vertical-align: top;
  display: inline-block;
  height: 0 !important;
}

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
