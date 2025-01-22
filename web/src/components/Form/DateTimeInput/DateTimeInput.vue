<script setup lang="ts">
import { onMounted, ref, watch, type PropType } from "vue";
import DateTimeRawInput from "./DateTimeRawInput.vue";

export interface InputData {
  width: number;
  realValue: string;
  value: number | null;
  min: number;
  max: number;
  element: HTMLInputElement | null;
  index: number;
  default: string;
}
const props = defineProps({
  seconds: {
    type: Boolean,
    default: false,
  },
});
const maxLimits = [31, 12, 9999, 23, 59, 59];
const defaultPlaceholders = ["dd", "mm", "yyyy", "hh", "mm", "ss"];
const inputs = ref<InputData[]>(
  Array.from(Array(5 + Number(props.seconds))).map((_, i) => {
    return {
      width: 0,
      value: null,
      min: 1,
      max: maxLimits[i],
      element: null,
      index: i,
      default: defaultPlaceholders[i],
      realValue: defaultPlaceholders[i],
    };
  })
);
const datetime = defineModel<string | null | undefined>("datetime", {
  // required: true,
  type: Object as PropType<string | null | undefined>,
});
function updateInputsByDateTime(datetime: string | null | undefined) {
  console.log("Here!", datetime);
  if (!datetime) return;

  const [date, time] = datetime.split(" ");
  const dateParts = date.split("-");
  const timeParts = time.split(":");

  [...dateParts.reverse(), ...timeParts].forEach((v, i) => {
    console.log(i, v);
    if (!inputs.value[i]) return;
    inputs.value[i].value = Number(v);
    inputs.value[i].realValue = inputs.value[i].value
      .toString()
      .padStart(2, "0");
  });
}

watch(datetime, () => updateInputsByDateTime(datetime.value));
onMounted(() => {
  updateInputsByDateTime(datetime.value);
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
  <div class="d-inline-block">
    <div class="date me-3">
      <DateTimeRawInput :input-data="inputs[0]" @input="onInput" />.
      <DateTimeRawInput :input-data="inputs[1]" @input="onInput" />.
      <DateTimeRawInput :input-data="inputs[2]" @input="onInput" />
    </div>
    <div class="time">
      <DateTimeRawInput :input-data="inputs[3]" @input="onInput" />:
      <DateTimeRawInput :input-data="inputs[4]" @input="onInput" />
      <span v-if="props.seconds"
        >:<DateTimeRawInput :input-data="inputs[5]" @input="onInput"
      /></span>
    </div>
    <div class="border-bottom w-fit-content"></div>
  </div>
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
