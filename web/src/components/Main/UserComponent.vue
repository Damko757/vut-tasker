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
        class="fw-bold d-flex m-2 fs-2 user w-fit-content no-select"
        :style="{ '--color': user.color }"
    >
        <div
            class="line me-1 rounded-3"
            :style="{ background: user.color }"
        ></div>
        <div class="mx-3 w-fit-content position-relative nick px-1">
            <div class="text-block-wrapper">
                <div class="text-block rounded-2 px-1">{{ user.nick }}</div>
            </div>
            <div>{{ user.nick }}</div>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import "/src/SCSS/main.scss";
.user {
    .nick {
        transition: inherit;
    }

    cursor: pointer;
    transition: 250ms;
    color: $white !important;
    position: relative;

    &:hover {
        .text-block-wrapper {
            width: 100%;
        }
        .line {
            left: 100%;
            transform: translateX(-100%);
        }
    }

    .line {
        transition: inherit;
        position: absolute;
        left: 0;
        width: 0.3em;
        min-height: 100%;
        z-index: 3;
    }

    .text-block-wrapper {
        transition: inherit;
        width: 0%;
        height: 100%;
        position: absolute;
        overflow: hidden;

        .text-block {
            width: fit-content;
            position: relative;
            background-color: $white;
            color: var(--color);
        }
    }
}
</style>
