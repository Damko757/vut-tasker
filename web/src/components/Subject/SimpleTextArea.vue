<script setup lang="ts">
import { watch, ref, onMounted } from "vue";

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
  <textarea v-model="value" :type="type" ref="inputRef"></textarea>
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";
textarea {
  background: none;
  outline: none;
  border: 0.2em solid $white;
  border-radius: 0.1em;
  color: $white;
}
</style>
