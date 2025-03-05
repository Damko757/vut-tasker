<script setup lang="ts">
import { computed, inject, onMounted, ref, watch, type PropType } from "vue";
import type { StoreType } from "../../store/store";
import type { User } from "../../../../shared/Entities/User";

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
  props.completedBy.sort().filter((u) => users.value[u])
);
</script>
<template>
  <div
    class="d-flex flex-shrink-0 flex-wrap justify-content-start align-items-center wrapper"
  >
    <div
      v-for="nick in availableCompletedBy"
      :key="nick"
      class="dot"
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
    width: 0.5em;
    height: 0.5em;
    margin: 0.1em;
    border-radius: 1em;
  }
}
</style>
