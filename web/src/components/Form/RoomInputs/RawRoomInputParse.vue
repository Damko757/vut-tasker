<script setup lang="ts">
import { ref } from "vue";
import type { Room } from "../../../../../shared/Entities/Room";

const emit = defineEmits<{
  (e: "parse"): Room[][]; // every posibility;
}>();
const rawRooms = ref("");
function parse() {}
</script>
<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="fw-bold w-fit-content me-2">
      <button class="btn btn-success mx-3 fw-bold" @click="parse()">
        Parse!
      </button>
    </div>
    <div class="w-100">
      <SimpleTextArea
        v-model="rawRooms"
        type="text"
        style="width: 100%"
        placeholder="Raw rooms"
      />
    </div>
  </div>
</template>
