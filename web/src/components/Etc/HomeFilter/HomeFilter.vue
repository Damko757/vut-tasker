<script setup lang="ts">
import {
  TaskType,
  taskTypeToColor,
  type Task,
} from "../../../../../shared/Entities/Task";

const filterMap = defineModel<{ [key in TaskType]: boolean }>("filterMap", {
  required: true,
}); // true -> show, false -> hide
</script>
<template>
  <div class="wrapper py-1 rounded-2 px-2">
    <div
      v-for="key in Object.keys(filterMap)"
      :key="key"
      @click.stop="() => filterMap[key as TaskType] = !filterMap[key as TaskType]"
      :class="{inactive: !filterMap[key as TaskType], hideButton: key == `Hide`}"
      :style="{'background-color': taskTypeToColor[key as TaskType]}"
      class="filter-button py-3 px-3 rounded-1 w-fit-content fw-bold mx-2 cursor-pointer"
    >
      {{ key[0].toUpperCase() }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";
.wrapper {
  background-color: lighten($black, 10%);
  width: fit-content;
  margin-right: 0;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;

  .filter-button {
    &.inactive {
      background-color: lighten($black, $amount: 15%) !important;
      color: $white;
    }

    &.hideButton {
      background-color: $white !important;
      color: $black;
      &.inactive {
        background-color: lighten($black, $amount: 15%) !important;
        color: $white;
      }
    }
  }
}
</style>
