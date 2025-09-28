<script setup lang="ts">
import { TaskType, taskTypeToColor } from "../../../../../shared/Entities/Task";
import { saveFilterValue } from "./HomeFilter";

const typeToColor = { ...taskTypeToColor, See: "white" };

const filterMap = defineModel<{ [key in TaskType]: boolean }>("filterMap", {
  required: true,
}); // true -> show, false -> hide
</script>
<template>
  <div class="wrapper bg-black-100 rounded-b-xl px-3 py-2 text-base">
    <div
      v-for="key in Object.keys(filterMap)"
      :key="key"
      @click.stop="
        () => {
          filterMap[key as TaskType] = !filterMap[key as TaskType];
          saveFilterValue(key[0].toUpperCase(), filterMap[key as TaskType]);
        }
      "
      :class="{
        inactive: !filterMap[key as TaskType],
        // hideButton: key == `See`,
        invertColors: key == `See` || key == TaskType.OTHER,
      }"
      :style="{
        'background-color': typeToColor[key as TaskType],
        'border-color': typeToColor[key as TaskType],
      }"
      class="filter-button mx-1 w-fit cursor-pointer rounded-xl border-4 p-3 px-3 py-2 font-bold md:mx-2"
    >
      {{ key[0].toUpperCase() }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  width: fit-content;
  margin-right: 0;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;

  position: relative;
  right: 0;

  .filter-button {
    &.inactive {
      background-color: transparent !important;
      color: white;
    }

    &.invertColors {
      color: var(--color-black);
      &.inactive {
        // background-color: var(--color-black);
        color: white;
      }
    }
  }
}
</style>
