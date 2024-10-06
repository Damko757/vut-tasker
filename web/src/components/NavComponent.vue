<script setup lang="ts">
import axios from "axios";
import { computed, ref, type PropType } from "vue";
import { API_URL } from "../const";

const props = defineProps({
    subjects: {
        type: Object as PropType<string[] | null>,
        default: null,
    },
});

const dynamicSubjects = ref<string[]>([]);
axios
    .get(API_URL + `/subjects`)
    .then((response) => (dynamicSubjects.value = response.data));
const subjects = computed(() => props.subjects ?? dynamicSubjects.value);

function redirect(subject: string) {
    window.location.href = subject;
}
</script>
<template>
    <ul class="no-scrollbar pt-0">
        <li class="fs-5" @click="redirect('/')">
            <img src="/src/assets/black-home.png" alt="Home" />
        </li>
        <li v-for="subject in subjects" class="fs-5" @click="redirect(subject)">
            {{ subject }}
        </li>
    </ul>
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";
ul {
    background-color: $dark-blue;
    width: fit-content;
    height: 100vh;
    overflow: scroll;
    padding: 1em 0em !important;
    width: 4.5rem;
    font-size: 1rem;
    margin: 0;
    position: fixed;
    top: 0;
    height: fit-content;
    border-radius: 0 0 1em 1em;
    li {
        text-align: center;
        list-style: none;
        font-weight: bold;
        margin-top: 0.25em;
        cursor: pointer;

        &:hover {
            color: darken($white, 15%);
        }

        &:first-child {
            max-width: 100%;
            height: 1.5em;

            &:hover {
                opacity: 85%;
            }

            img {
                object-fit: contain;
                width: 100%;
                height: 100%;
                filter: invert(100%);
            }
        }
    }
}
</style>
