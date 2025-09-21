<script setup lang="ts">
import { Icon } from "@iconify/vue";
import fontColorContrast from "font-color-contrast";
import stc from "string-to-color";
import { computed, onBeforeMount, ref, watch, type PropType } from "vue";
import { taskTypeToColor, type Task } from "../../../../shared/Entities/Task";
import { getStore } from "../../store/store";
import { getDayByDate } from "../../Utils";
const store = getStore();
const user = store.getters.getUser();

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true,
  },
  isCollapsed: { type: Boolean, required: true },
  showSubjectName: { type: Boolean, default: false },
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
  /**
   * due_date is used first. If it under zero, date_end is used (if defined)
   */
  const dates = [props.task.due_date, props.task.due_date_end];

  if (!dates.some((x) => x)) {
    // If every null, but faster?
    countdown.value = null;
    return;
  }

  const today = new Date();
  const untilDueDate = (new Date(dates[0]!).getTime() - today.getTime()) / 1000; // s
  if (!dates[1] || untilDueDate >= 0) {
    countdown.value = untilDueDate;
    return;
  }

  const untilDueDateEnd =
    (new Date(dates[1]!).getTime() - today.getTime()) / 1000; // s
  countdown.value = untilDueDateEnd;
};

onBeforeMount(() => {
  setCountdown();

  setInterval(function () {
    setCountdown(); // Refreshing counter (with precision +-500 ms)
  }, 1000);
});
watch(() => [props.task.due_date, props.task.due_date_end], setCountdown);

const backgroundColor = computed(() =>
  props.task ? stc(props.task.subject) : "",
);
const isForegroundColorBlack = computed(
  () => fontColorContrast(backgroundColor.value) == "#000000",
);

const isCompleted = computed(() =>
  props.task.completed_by.includes(user.value?.nick ?? ""),
);
</script>
<template>
  <div class="">
    <h5
      class="relative flex items-center pe-3 md:text-lg"
      :class="{ 'saturate-0': isCompleted }"
    >
      <!-- Show subject name -->
      <span
        v-if="showSubjectName"
        class="border-3 me-2 rounded-xl px-2 font-bold tracking-wider"
        :style="{
          background: task.required ? backgroundColor : 'transparent',
          'border-color': backgroundColor,
        }"
        :class="[
          isForegroundColorBlack &&
          task.required /* if required, no BG, so white text */
            ? 'text-black'
            : 'text-white',
        ]"
      >
        {{ task.subject }}</span
      >
      <!-- Show only basic task -->
      <span class="font-bold" v-else>{{ task.required ? "*" : "" }}</span
      >{{ task.name }}
      <template v-if="showSubjectName">
        <span
          class="ms-2 font-bold"
          :style="{ color: taskTypeToColor[task.type] }"
          >({{ (task.type as unknown as string).capitalize() }})</span
        >
      </template>
      <!-- !!! -->
      <span
        class="text-vut-red mx-2 rounded-xl text-2xl font-bold"
        v-if="!task.completed_by.includes(user?.nick ?? ``)"
        >{{ incomingExclamations }}</span
      >
      <!-- Dropdown -->
      <div class="me-0 ms-auto flex items-center justify-end gap-2">
        <div
          class="cursor-pointer hover:text-slate-400"
          @click.stop="emit('update', task)"
        >
          <Icon icon="material-symbols:edit-rounded" />
        </div>
        <div
          class="cursor-pointer hover:text-slate-400"
          :class="[
            isCollapsed ? 'rotate-90' : '-rotate-90',
            extraInfo.some((x) => task[x]) ? 'opacity-0' : 'opacity-100',
          ]"
        >
          <Icon icon="material-symbols:arrow-forward-ios-rounded" />
        </div>
      </div>
    </h5>
    <!-- Small text under subject -->
    <div
      v-if="task.due_date"
      class="due-date fst-italic text-sm md:mt-1 md:text-base"
    >
      &#40;{{ getDayByDate(task.due_date) }}
      {{ task.due_date?.ISOToFormattedDateTime()
      }}{{
        task.due_date_end
          ? ` &hyphen; ${getDayByDate(
              task.due_date_end,
            )} ${task.due_date_end.ISOToFormattedDateTime()}`
          : ``
      }}&#41; <span v-if="room">at {{ room }}&nbsp;</span>
      <span
        :class="[
          countdown != null && countdown <= 0 ? 'text-vut-red' : 'text-white',
        ]"
        class="ms-2 text-nowrap font-bold"
        >{{ countdownText }}</span
      >
    </div>
    <div class="h-0 overflow-hidden" :class="{ collapsed: props.isCollapsed }">
      <div v-if="task.link">
        <a
          class="text-break text-fit-blue hover:text-fit-dark-blue underline"
          :href="task.link ?? '#'"
          @click.stop
          target="_blank"
          >{{ task.link ?? "&hyphen;" }}</a
        >
      </div>
      <div v-if="task.description">
        <div class="bg-black-400 mt-2 rounded-xl p-2">
          {{ task.description }}
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.incoming {
  // vertical-align: top;
  // display: inline-block;
  // height: 0 !important;
}

.due-date {
  color: var(--color-slate-400);
}

.collapsed {
  height: auto !important;
}

.collapse-arrow {
  // position: absolute;
  // font-size: 1.75em;
  // right: 0;
  // top: 50%;
  // translate: 0% -50%;
  // rotate: 90deg;
  // transition: 250ms;
  // transform-origin: center;

  // &.collapsed {
  //   rotate: -90deg !important;
  // }
}
</style>
