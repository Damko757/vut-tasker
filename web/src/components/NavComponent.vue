<script setup lang="ts">
import { clsx } from "clsx";
import { inject, onMounted } from "vue";
import type { StoreType } from "../store/store";

const store: StoreType = inject("store") as unknown as StoreType;

// const dynamicSubjects = ref<string[]>([]);
// axios
//   .get(API_URL + `/subjects`)
//   .then((response) => (dynamicSubjects.value = response.data));
// const subjects = computed(() => props.subjects ?? dynamicSubjects.value);
// const specifiedSubjects = computed(() => {
//   const out = {
//     subscribed: <string[]>[],
//     unsubscribed: <string[]>[],
//   };

//   subjects.value.forEach((subject) =>
//     out[
//       store.getters.getUser().value?.subscribed_subjects.includes(subject)
//         ? "subscribed"
//         : "unsubscribed"
//     ].push(subject),
//   );

//   return out;
// });

const subjects = store.getters.getAllSubjects();

onMounted(() => {
  store.mutations.loadSubjects();
});

function redirect(subject: string) {
  window.location.href = subject;
}
</script>
<template>
  <nav
    class="no-scrollbar bg-fit-dark-blue fixed bottom-0 z-50 h-fit w-full overflow-scroll rounded-t-xl px-2 py-2"
    :class="
      clsx(
        'md:left-1 md:top-0 md:h-fit md:w-fit md:rounded-b-xl md:rounded-t-none',
      )
    "
  >
    <div
      class="mx-0 mb-0 mt-0 flex h-full w-full items-stretch justify-start p-0 text-xl"
      :class="
        clsx(
          '[&>li]:ms-2 [&>li]:flex [&>li]:cursor-pointer [&>li]:items-center [&>li]:justify-center [&>li]:font-bold [&>li]:hover:underline',
          'md:mb-2 md:flex-col',
          'text-center md:[&>li]:ms-0 md:[&>li]:mt-2',
        )
      "
    >
      <div>
        <a
          class="flex cursor-pointer items-center justify-center overflow-hidden transition-all hover:saturate-0"
          @click="redirect('/')"
        >
          <img
            src="/logo.png"
            alt="Home"
            class="aspect-square h-10 rounded-lg object-contain"
          />
        </a>
      </div>
      <!-- Subscribed -->
      <div
        v-for="subject in subjects.subscribed"
        class=""
        @click="redirect(subject)"
      >
        {{ subject }}
      </div>
      <!-- Divider only if some in subscribed and in unsubscribed -->
      <div
        v-if="subjects.subscribed.length && subjects.unsubscribed.length"
        class="mb-2 ms-2 mt-2 w-[2px] rounded-full bg-white md:mb-0 md:ms-0 md:mt-2 md:h-[2px] md:w-auto"
      ></div>
      <!-- Unsubscribed -->
      <div
        v-for="subject in subjects.unsubscribed"
        class=""
        @click="redirect(subject)"
      >
        {{ subject }}
      </div>
    </div>
  </nav>
</template>
<style lang="scss" scoped>
// ul {
//   background-color: var(--color-fit-dark-blue);
//   width: fit-content;
//   height: 100vh;
//   overflow: scroll;
//   padding: 1em 0em !important;
//   padding-top: 0 !important;
//   width: 4.5rem;
//   font-size: 1rem;
//   margin: 0;
//   position: fixed;
//   top: 0;
//   height: fit-content;
//   border-radius: 0 0 1em 1em;
//   z-index: 1000;

//   .divider {
//     background-color: white;
//     height: 2px;
//     border-radius: 1px;
//     width: 80%;
//     margin: 0 auto;
//     margin-top: 0.25em;
//   }

//   padding-top: 0;
//   li {
//     text-align: center;
//     list-style: none;
//     font-weight: bold;
//     margin-top: 0.25em;
//     cursor: pointer;
//     color: white;

//     &:hover {
//       color: var(--color-slate-300);
//     }

//     &:first-child {
//       min-width: 2em;
//       height: 2em;

//       &:hover {
//         opacity: 85%;
//       }

//       img {
//         object-fit: contain;
//         width: 100%;
//         height: 100%;
//         /* filter: invert(100%); */
//       }
//     }
//   }
// }

// @include media-breakpoint-down(md) {
//   ul {
//     top: unset !important;
//     bottom: 0;
//     border-radius: 0 !important;
//     margin-bottom: 0 !important;
//     padding-top: 1em !important;
//     padding-bottom: 0 !important;

//     display: flex;
//     justify-content: start;
//     align-items: center;
//     padding: 0.5em 0 !important;

//     width: 100vw;

//     .divider {
//       min-width: 2px;
//       max-width: 2px;
//       height: 1.5rem;
//       margin: 0 auto;
//       margin: 0 0.25em;
//       margin-top: 0.25em;
//     }

//     li {
//       margin: 0 0.25em;
//     }
//   }
// }
</style>
