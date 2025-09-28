<script setup lang="ts">
import { ref, type PropType } from "vue";
import type { User } from "../../../../shared/Entities/User";

const props = defineProps({
  user: {
    required: true,
    type: Object as PropType<User>,
  },
});

const hovering = ref(false);
</script>
<template>
  <div
    class="relative mx-3 cursor-pointer px-3 py-1 text-2xl font-bold transition-colors"
    :style="{ color: hovering ? user.color : 'white' }"
    @mouseover="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="relative z-10">{{ user.nick }}</div>
    <div
      class="absolute left-0 top-0 z-0 h-full rounded-xl transition-all"
      :style="{ backgroundColor: hovering ? 'white' : user.color }"
      :class="[hovering ? 'w-full' : 'w-2']"
    ></div>
  </div>
  <!-- <div
    class="user m-2 flex w-fit select-none text-xl font-bold"
    :style="{ '--color': user.color }"
  >
    <div class="line me-1 rounded-xl" :style="{ background: user.color }"></div>
    <div class="nick relative mx-3 w-fit px-1">
      <div class="text-block-wrapper">
        <div class="text-block rounded-xl px-1">{{ user.nick }}</div>
      </div>
      <div>{{ user.nick }}</div>
    </div>
  </div> -->
</template>
<style scoped lang="scss">
.user {
  .nick {
    transition: inherit;
  }

  cursor: pointer;
  transition: 250ms;
  color: white !important;
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
      background-color: white;
      color: var(--color);
    }
  }
}
</style>
