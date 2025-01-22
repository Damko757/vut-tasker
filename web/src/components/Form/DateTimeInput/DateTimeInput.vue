<script setup lang="ts">
import { ref, type PropType } from "vue";
import DateTimeRawInput from "./DateTimeRawInput.vue";

export interface InputData {
  width: number;
  realValue: string;
  value: number | null;
  min: number;
  max: number;
  element: HTMLInputElement | null;
  index: number;
}
const props = defineProps({
  seconds: {
    type: Boolean,
    default: false,
  },
});
const maxLimits = [31, 12, 9999, 23, 59, 59];
const inputs = ref<InputData[]>(
  Array.from(Array(5 + Number(props.seconds))).map((_, i) => {
    return {
      width: 0,
      value: null,
      realValue: "",
      min: 1,
      max: maxLimits[i],
      element: null,
      index: i,
    };
  })
);

const datetime = defineModel("datetime", {
  required: true,
  type: Object as PropType<string | null>,
});

function buildDateTimeString(): string | null {
  if (inputs.value.some((inputData) => inputData.value == null)) return null;

  const v = inputs.value.map((inputData) =>
    inputData.value?.toString().padStart(2, "0")
  );
  return `${v[2]}-${v[1]}-${v[0]} ${v[3]}:${v[4]}:${v[5] ?? "00"}`;
}

function onInput(inputData: InputData): void {
  const moreSignificantValue = (inputData.value ?? 0) * 10;
  if (moreSignificantValue > inputData.max)
    inputs.value.at(inputData.index + 1)?.element?.focus() ??
      inputs.value[inputData.index]!.element?.blur();

  datetime.value = buildDateTimeString();
}
</script>
<template>
  <div class="date px-2 me-3">
    <DateTimeRawInput :input-data="inputs[0]" @input="onInput" />.
    <DateTimeRawInput :input-data="inputs[1]" @input="onInput" />.
    <DateTimeRawInput :input-data="inputs[2]" @input="onInput" />
  </div>
  <div class="time px-2">
    <DateTimeRawInput :input-data="inputs[3]" @input="onInput" />:
    <DateTimeRawInput :input-data="inputs[4]" @input="onInput" />
    <span v-if="props.seconds"
      >:<DateTimeRawInput :input-data="inputs[5]" @input="onInput"
    /></span>
  </div>
  <div class="border-bottom w-fit-content"></div>
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";

.date,
.time {
  border-bottom: 3px solid $white;
  width: fit-content;
  font-weight: bold;
  display: inline-block;
}
</style>
