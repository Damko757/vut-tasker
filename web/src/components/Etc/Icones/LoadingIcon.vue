<script setup>
import { Icon } from "@iconify/vue";

defineProps({
  // A clean, static loading icon from Iconify (e.g., Lucide, Tabler, Material Design)
  icon: {
    type: String,
    default: "mdi:loading",
  },
  // Size in pixels or string
  size: {
    type: [Number, String],
    default: 24,
  },
  // Tailwind color class
  colorClass: {
    type: String,
    default: "text-white",
  },
});
</script>

<style scoped>
@keyframes custom-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.force-spin {
  /* The !important flag guarantees it spins even if the OS has reduce-motion enabled */
  animation: custom-spin 2s linear infinite !important;
}
</style>
<template>
  <div class="">
    <Icon
      :icon="icon"
      :width="size"
      :height="size"
      class="force-spin"
      :class="colorClass"
    />
  </div>
</template>
