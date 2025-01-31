<script setup lang="ts">
import { ref } from "vue";
import type { Room } from "../../../../../shared/Entities/Room";
import SimpleTextArea from "../../Subject/SimpleTextArea.vue";
import RawRoomInputParse from "./RawRoomInputParse.vue";

const rooms = defineModel<Room[]>();
</script>
<template>
  <RawRoomInputParse @parse="" />
</template>
