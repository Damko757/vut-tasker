<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const value = defineModel({
  type: String,
});
const props = defineProps({
  type: { type: String, default: "text" },
});

const resize = () => {
  if (inputRef.value) {
    inputRef.value.style.height = "auto";
    inputRef.value.style.height = `${inputRef.value.scrollHeight + 15}px`;
  }
};

watch(value, () => {
  // inputRef.value?.width(`${value.length}em`);
  resize();
});

onMounted(() => {
  resize();
});

const inputRef = ref<HTMLInputElement | null>(null);
</script>
<template>
  <textarea
    v-model="value"
    :type="type"
    ref="inputRef"
    class="rounded-xl px-2 py-1 outline-0"
  ></textarea>
</template>
<style lang="scss" scoped>
textarea {
  border: 0.2em solid white;
}
</style>
