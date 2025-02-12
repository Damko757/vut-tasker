<script setup lang="ts">
import { onMounted, ref, watch, type PropType } from "vue";
import DateTimeRawInput from "./DateTimeRawInput.vue";

const emit = defineEmits<{
  (e: "done"): void;
}>();
export interface InputData {
  width: number;
  realValue: string;
  value: number | null;
  min: number;
  max: number;
  element: HTMLInputElement | null;
  index: number;
  default: string;
  preWrittenValue: string;
}
const props = defineProps({
  seconds: {
    type: Boolean,
    default: false,
  },
});
const maxLimits = [31, 12, 9999, 23, 59, 59];
const minLimits = [1, 1, 0, 0, 0, 0];
const defaultPlaceholders = ["dd", "mm", "yyyy", "hh", "mm", "ss"];
const inputs = ref<InputData[]>(
  Array.from(Array(5 + Number(props.seconds))).map((_, i) => {
    return {
      width: 0,
      value: null,
      min: minLimits[i],
      max: maxLimits[i],
      element: null,
      index: i,
      default: defaultPlaceholders[i],
      realValue: defaultPlaceholders[i],
      preWrittenValue: defaultPlaceholders[i] == "yyyy" ? "20" : "",
    };
  })
);
const datetime = defineModel<string | null | undefined>("datetime");
function updateInputsByDateTime(datetime: string | null | undefined) {
  if (!datetime) return;

  const [date, time] = datetime.replace("T", " ").split(" ");
  const dateParts = date.split("-");
  const timeParts = time?.split(":") ?? [];

  [
    ...dateParts.reverse(),
    ...(timeParts.length > 1 ? timeParts : [null, null, null]),
  ].forEach((v, i) => {
    if (!inputs.value[i]) return;
    inputs.value[i].value = v == null ? null : Number(v);
    inputs.value[i].realValue =
      inputs.value[i].value?.toString().padStart(2, "0") ??
      inputs.value[i].default;
  });
}

watch(datetime, () => {
  updateInputsByDateTime(datetime.value);
  datetime.value = buildDateTimeString();
});

defineExpose({
  focusTime: () => {
    inputs.value.at(3)?.element?.focus();
  },
});

onMounted(() => {
  updateInputsByDateTime(datetime.value);
  datetime.value = buildDateTimeString();
});

function buildDateTimeString(): string | null {
  if (
    (inputs.value[2].value ?? 0) < 100 || // Year needs to be at least 3 digit for Date object to work
    inputs.value.some(
      (inputData) => inputData.value == null || Number.isNaN(inputData.value)
    )
  )
    return null;

  const v = inputs.value.map((inputData) =>
    inputData.value?.toString().padStart(2, "0")
  );
  return `${v[2]}-${v[1]}-${v[0]} ${v[3]}:${v[4]}:${v[5] ?? "00"}`;
}

function onInput(inputData: InputData): void {
  const moreSignificantValue = (inputData.value ?? 0) * 10;
  if (moreSignificantValue > inputData.max || inputData.value === 0) {
    inputs.value.at(inputData.index + 1)?.element?.focus() ??
      inputs.value[inputData.index]!.element?.blur();
    if (inputData.index + 1 >= inputs.value.length) emit("done");
  }

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
