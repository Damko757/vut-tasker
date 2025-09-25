<script setup lang="ts">
import { computed, inject, type PropType } from "vue";
import type { User } from "../../../../shared/Entities/User";
import type { StoreType } from "../../store/store";

const store: StoreType = inject("store") as unknown as StoreType;
const _users = store.getters.getAllUsers();
const users = computed(() => {
  const m: { [nick: string]: User } = {};
  _users.value.forEach((user) => (m[user.nick] = user));
  return m;
});

const props = defineProps({
  completedBy: {
    type: Object as PropType<string[]>,
    default: [],
  },
});

const availableCompletedBy = computed(() =>
  props.completedBy.sort().filter((u) => users.value[u]),
);
</script>
<template>
  <div
    class="wrapper flex w-10 shrink-0 flex-row-reverse flex-wrap items-center justify-start"
  >
    <div
      v-for="nick in availableCompletedBy"
      :key="nick"
      class="dot m-0.5 aspect-square w-2 rounded-full"
      :style="{ background: users[nick]?.color ?? 'red' }"
      :title="nick"
    ></div>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  max-height: 1.5em;
  width: 1.5em;
  // writing-mode: vertical-lr;
  position: relative;
  .dot {
    // width: 0.5em;
    // height: 0.5em;
    // margin: 0.1em;
    // border-radius: 1em;
  }
}
</style>
