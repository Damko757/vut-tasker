<script setup lang="ts">
import { onMounted, ref } from "vue";
import NavComponent from "../NavComponent.vue";

const dots = ref("");
const dotInterval = setInterval(() => {
    dots.value += ".";
    if (loadState.value != 0) clearInterval(dotInterval);
}, 500);

const loadState = ref(1);

onMounted(() => {
    // fetch();
});
</script>
<template>
    <div v-if="loadState == 0" class="fw-bold text-white p-3 fs-2">
        Loading{{ dots }}
    </div>
    <div
        v-else-if="loadState == -1"
        class="fw-bold p-3 fs-1 text-danger text-center"
    >
        Unable to connect! :C
        <button type="button" class="btn btn-success d-block mx-auto fw-bold">
            Refresh
        </button>
    </div>
    <template v-else-if="loadState == 1">
        <NavComponent />
    </template>
</template>
<style lang="sass" scoped></style>
