<script setup lang="ts">
import axios from "axios";
import { computed, inject, ref, type PropType } from "vue";
import { API_URL } from "../const";
import type { StoreType } from "../store/store";

const props = defineProps({
  subjects: {
    type: Object as PropType<string[] | null>,
    default: null,
  },
});
const store: StoreType = inject("store") as unknown as StoreType;

const dynamicSubjects = ref<string[]>([]);
axios
  .get(API_URL + `/subjects`)
  .then((response) => (dynamicSubjects.value = response.data));
const subjects = computed(() => props.subjects ?? dynamicSubjects.value);
const specifiedSubjects = computed(() => {
  const out = {
    subscribed: <string[]>[],
    unsubscribed: <string[]>[],
  };

  subjects.value.forEach((subject) =>
    out[
      store.getters.getUser().value?.subscribed_subjects.includes(subject)
        ? "subscribed"
        : "unsubscribed"
    ].push(subject)
  );

  return out;
});

function redirect(subject: string) {
  window.location.href = subject;
}
</script>
<template>
  <ul class="no-scrollbar">
    <li class="fs-5 d-flex" @click="redirect('/')">
      <img src="/logo.png" alt="Home" />
    </li>
    <li
      v-for="subject in specifiedSubjects.subscribed"
      class="fs-5"
      @click="redirect(subject)"
    >
      {{ subject }}
    </li>
    <div class="divider"></div>
    <li
      v-for="subject in specifiedSubjects.unsubscribed"
      class="fs-5"
      @click="redirect(subject)"
    >
      {{ subject }}
    </li>
  </ul>
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";
ul {
  background-color: $fit-dark-blue;
  width: fit-content;
  height: 100vh;
  overflow: scroll;
  padding: 1em 0em !important;
  padding-top: 0 !important;
  width: 4.5rem;
  font-size: 1rem;
  margin: 0;
  position: fixed;
  top: 0;
  height: fit-content;
  border-radius: 0 0 1em 1em;

  .divider {
    background-color: $white;
    height: 2px;
    border-radius: 1px;
    width: 80%;
    margin: 0 auto;
    margin-top: 0.25em;
  }

  padding-top: 0;
  li {
    text-align: center;
    list-style: none;
    font-weight: bold;
    margin-top: 0.25em;
    cursor: pointer;
    color: white;

    &:hover {
      color: darken($white, 15%);
    }

    &:first-child {
      max-width: 100%;
      height: 2em;

      &:hover {
        opacity: 85%;
      }

      img {
        object-fit: contain;
        width: 100%;
        height: 100%;
        // filter: invert(100%);
      }
    }
  }
}

@include media-breakpoint-down(md) {
  ul {
    top: unset !important;
    bottom: 0;
    border-radius: 0 !important;
    margin-bottom: 0 !important;
    padding-top: 1em !important;
    padding-bottom: 0 !important;

    display: flex;
    justify-content: start;
    align-items: center;
    padding: 0.5em 0 !important;

    width: 100vw;

    .divider {
      width: 2px;
      height: 1.5rem;
      // margin: 0 auto;
      margin: 0 0.25em;
      // margin-top: 0.25em;
    }

    li {
      margin: 0 0.25em;
    }
  }
}
</style>
