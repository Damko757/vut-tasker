<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { Color, type RGB } from "../../../Color";
import type { Task, TaskType } from "../../../../../shared/Entities/Task";
import { getStore } from "../../../store/store";
import { roundTo } from "../../../Utils";

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
      0
    )
);
const ratio = computed(() => points.value / maxPoints);
// watch(ratio, () => {
//   if (ratio.value >= 1)
//     document.getElementsByTagName("body")[0].classList.add("epilepsy-mode");
//   else
//     document.getElementsByTagName("body")[0].classList.remove("epilepsy-mode");
// });

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
        (ratio.value % 0.51) * 2 // % 0.5 returns 0
      )
    : { r: 0, g: 0, b: 0 }
);
</script>
<template>
  <div class="bar-wrapper">
    <div class="bar-safe-zone">
      <div
        class="bar"
        :style="{
          backgroundColor: Color.rgbToHex(bgColor),
          width: `${ratio * 100}%`,
        }"
        :class="{ 'epilepsy-mode': ratio >= 1 }"
      ></div>
    </div>
    <div class="ratio">{{ roundTo(ratio * 100, 2) }} %</div>
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
    animation: epilepsy-color 1s linear infinite;
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
