<script setup lang="ts">
const props = defineProps({
  text: {
    required: true,
    type: String,
  },
  amount: {
    default: 5,
    type: Number,
  },
});
</script>
<template>
  <span
    v-for="(letter, i) in text"
    :style="{ filter: `hue-rotate(${amount * i}deg)` }"
    >{{ letter }}</span
  >
</template>
