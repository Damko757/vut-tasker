<script setup lang="ts">
import { computed } from "vue";
import type { Task, TaskType } from "../../../../../shared/Entities/Task";
import { Color, type RGB } from "../../../Color";
import { getStore } from "../../../store/store";

const store = getStore();
const user = store.getters.getUser();
const props = defineProps<{
  tasks: Task[];
}>();

const multipliers: Record<keyof typeof TaskType, number> = {
  PROJECT: 1.5,
  HOMEWORK: 1,
  EXAM: 2,
  REGISTRATION: 0.5,
  OTHER: 0.25,
};

const maxPoints = 10;
const points = computed(() =>
  props.tasks
    .filter((task) => {
      const isCompleted = task.completed_by.includes(user.value?.nick ?? ""); // Task should be uncompleted
      if (task.due_date == null) {
        return !isCompleted;
      }

      const dueDate = new Date(task.due_date.split(" ")[0]); // Due date in less that 14 days (and no-date too)
      const today = new Date();
      today.setDate(today.getDate() + 15); // One day is not a bad idea
      return !isCompleted && dueDate.getTime() <= today.getTime();
    })
    .reduce(
      (a, b) =>
        a + multipliers[`${b.type}`.toUpperCase() as keyof typeof multipliers],
      0,
    ),
);
const ratio = computed(() =>
  Math.max(Math.min(points.value / maxPoints, 1), 0),
);

const colors: RGB[] = [
  {
    r: 0,
    g: 255,
    b: 0,
  },
  {
    r: 255,
    g: 255,
    b: 0,
  },
  {
    r: 255,
    g: 0,
    b: 0,
  },
];
const bgColor = computed<RGB>(() =>
  ratio.value < 1
    ? Color.mixColors(
        colors[0 + Number(ratio.value > 0.5)],
        colors[1 + Number(ratio.value > 0.5)],
        (ratio.value % 0.51) * 2, // % 0.5 returns 0
      )
    : { r: 0, g: 0, b: 0 },
);
</script>
<template>
  <div
    class="w-100 h-2 overflow-hidden rounded-t-[calc(var(--spacing)*1)] bg-stone-600"
  >
    <!-- <div class="bar-safe-zone">
      <div
        class="bar"
        :style="{
          backgroundColor: Color.rgbToHex(bgColor),
          width: `${ratio * 100}%`,
        }"
        :class="{ 'epilepsy-mode': ratio >= 1 }"
      ></div>
    </div> -->
    <div
      class="h-full rounded-full"
      :style="{
        width: `${ratio * 100}%`,
        backgroundColor: `${Color.rgbToHex(bgColor)}`,
      }"
    ></div>
  </div>
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";

.bar-wrapper {
  border: 0.5em solid lighten($black, 10%);
  background-color: lighten($black, 5%);
  border-radius: 1.5em;
  height: 100%;
  width: 100%;
  position: relative;

  .bar-safe-zone {
    width: 100%;
    height: 100%;
    border-radius: 1.5em;
    overflow: hidden;
    display: flex;
    justify-content: end;

    .bar {
      height: 100%;
      background-color: red;
      width: 75%;
      position: relative;
    }
  }
  .ratio {
    width: fit-content;
    font-weight: bold;
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translate(-50%, 150%);
  }

  .epilepsy-mode {
    animation: epilepsy-color 10s linear infinite;
  }

  @keyframes epilepsy-color {
    0% {
      background-color: red;
    }
    25% {
      background-color: yellow;
    }
    50% {
      background-color: green;
    }
    75% {
      background-color: blue;
    }
    100% {
      background-color: red;
    }
  }
}

@include media-breakpoint-down(lg) {
  .bar-wrapper {
    position: relative !important;
    top: 0;
    right: 0;
    border-width: 0.25em;
    height: 2em;
    margin-bottom: 1em;

    .ratio {
      position: absolute;
      bottom: 0;
      right: unset;
      left: 0%;
      transform: translate(-150%, 0%);
      white-space: nowrap;
    }
  }
}
</style>
<style lang="scss">
body.epilepsy-mode {
  animation: epilepsy-shake 0.25s linear 10;
}
@keyframes epilepsy-shake {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(5deg);
  }
  75% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
</style>
