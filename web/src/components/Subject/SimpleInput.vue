<script setup lang="ts">
import { watch, ref, onMounted } from "vue";

const value = defineModel();
const props = defineProps({
    type: { type: String, default: "text" },
});

const resize = () => {
    if (inputRef.value) {
        inputRef.value.style.width = "auto";
        inputRef.value.style.width = `${inputRef.value.scrollWidth}px`;
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
    <input v-model="value" :type="type" ref="inputRef" />
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";
input {
    background: none;
    outline: none;
    border: none;
    border-bottom: 0.2em solid $white;
    color: $white;
}
</style>
