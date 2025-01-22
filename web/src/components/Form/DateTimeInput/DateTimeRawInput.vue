<script setup lang="ts">
import type { PropType } from "vue";
import type { InputData } from "./DateTimeInput.vue";

const props = defineProps({
  inputData: {
    required: true,
    type: Object as PropType<InputData>,
  },
});
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
    @input="
      (e) => {
        inputData.realValue = (e.target as HTMLInputElement).value;
        inputData.value = Number(inputData.realValue);
        inputData.value =
          inputData.value && !Number.isNaN(inputData.value)
            ? Math.max(
                inputData.min,
                Math.min(inputData.max, inputData.value ?? 0)
              )
            : null;
        inputData.realValue = inputData.value?.toString() ?? ``;
        
        emit(`input`, inputData);
      }
    "
    @blur="
      inputData.realValue = inputData.value?.toString().padStart(2, '0') ?? ``
    "
  />
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";

input {
  min-width: 1.5em;
  width: fit-content;
  border: none;
  // border-bottom: 3px solid $white;
  background: none;
  outline: none;
  color: $white;
}
</style>
