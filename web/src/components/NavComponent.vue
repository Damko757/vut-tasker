<script setup lang="ts">
import { computed, type PropType } from "vue";

const props = defineProps({
    subjects: {
        type: Object as PropType<string[]>,
        default: ["IZP", "ISC", "..."],
    },
});

const subjects = computed(() => props.subjects.sort());

function redirect(subject: string) {
    window.location.href = subject;
}
</script>
<template>
    <ul class="no-scrollbar">
        <li v-for="subject in subjects" class="fs-5" @click="redirect(subject)">
            {{ subject }}
        </li>
    </ul>
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";
ul {
    background-color: lighten($black, 15%);
    width: fit-content;
    height: 100vh;
    overflow: scroll;
    padding: 1em;
    margin: 0;
    position: fixed;
    top: 0;
    li {
        list-style: none;
        font-weight: bold;
        margin-top: 0.25em;
        cursor: pointer;

        &:hover {
            color: darken($white, 15%);
        }
    }
}
</style>
