<script setup lang="ts">
import type { PropType } from "vue";
import type { User } from "../../../../shared/Entities/User";

const props = defineProps({
    user: {
        required: true,
        type: Object as PropType<User>,
    },
});
</script>
<template>
    <div
        class="fw-bold d-flex m-2 fs-2 user w-fit-content"
        :style="{ '--color': user.color }"
    >
        <div
            class="line me-1 rounded-3"
            :style="{ background: user.color }"
        ></div>
        <div>{{ user.nick }}</div>
    </div>
</template>
<style scoped lang="scss">
@import "/src/SCSS/main.scss";
.line {
    width: 0.3em;
    min-height: 100%;
}
.user {
    cursor: pointer;
    transition: 250ms;
    color: $white !important;
    &:hover {
        color: var(--color) !important;
    }
}
</style>
