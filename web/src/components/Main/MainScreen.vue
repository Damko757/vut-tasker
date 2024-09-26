<script setup lang="ts">
import { ref } from "vue";

const loadState = ref(0);
</script>
<template>
    <div v-if="loadState == 0">Loading...</div>
</template>
