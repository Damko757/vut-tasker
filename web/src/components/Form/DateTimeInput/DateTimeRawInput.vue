<script setup lang="ts">
import type { InputData } from "./DateTimeInput.vue";

const props = defineProps<{
  inputData: InputData;
}>();
const emit = defineEmits<{
  (e: "input", inputData: InputData): void;
}>();
</script>
<template>
  <input
    class="text-end"
    :style="{ width: `${inputData.max.toString().length * 11}px` }"
    :value="inputData.realValue"
    :ref="(el) => (inputData.element = el as HTMLInputElement)"
    @focus="
      () => {
        inputData.realValue =
          inputData.value == null
            ? inputData.preWrittenValue
            : inputData.realValue;
        inputData.element?.select();
      }
    "
    @input="
      (e) => {
        inputData.realValue = (e.target as HTMLInputElement).value.trim();
        inputData.value = Number(inputData.realValue);
        inputData.value =
          inputData.realValue != `` && !Number.isNaN(inputData.value)
            ? Math.min(inputData.max, inputData.value ?? 0)
            : null;        
        emit(`input`, inputData);
      }
    "
    @blur="
      inputData.value =
        inputData.realValue != `` && !Number.isNaN(inputData.value)
          ? Math.max(
              inputData.min,
              Math.min(inputData.max, inputData.value ?? 0)
            )
          : null;
      inputData.realValue = inputData.value?.toString() ?? ``;

      inputData.realValue =
        inputData.value?.toString().padStart(2, '0') ?? inputData.default;
    "
  />
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";

input {
  min-width: 2.2em;
  width: fit-content;
  border: none;
  // border-bottom: 3px solid $white;
  background: none;
  outline: none;
  color: $white;
}
</style>
