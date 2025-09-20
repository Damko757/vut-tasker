<script setup lang="ts">
const props = defineProps({
  state: {
    type: Boolean,
    default: false,
  },
  greyOut: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{
  (e: "stateChange", state: boolean): void;
}>();

const changeState = (newState: boolean) => emit("stateChange", newState);
</script>
<template>
  <div
    @click="changeState(!props.state)"
    :class="{ active: state, grey: props.greyOut }"
  ></div>
</template>
<style lang="scss" scoped>
div {
  --checkbox_color: white;
  width: 1.5em;
  height: 1.5em;
  border: 0.2em solid var(--checkbox_color);
  border-radius: 0.2em;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  // align-items: center;
  transition: 250ms;

  &::after {
    content: "";
    position: relative;
    display: block;
    opacity: 0;
    width: 40%;
    height: 65%;
    transform-origin: top left;
    rotate: 45deg;
    transition: inherit;
    border-bottom: 0.2em solid var(--checkbox_color);
    border-right: 0.2em solid var(--checkbox_color);
  }

  &.active {
    &.grey {
      --checkbox_color: var(--text-slate-400);
    }
    &::after {
      opacity: 1;
    }
  }
}
</style>
