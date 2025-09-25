<script setup lang="ts">
import MainScreen from "./screens/MainScreen.vue";
import UserSelectScreen from "./screens/UserSelectScreen.vue";
import { getStore } from "./store/store";

getStore().mutations.loadUser();
getStore().mutations.loadAllUsers();
const user = getStore().getters.getUser();
</script>
<template>
  <MainScreen v-if="user !== null" />
  <UserSelectScreen v-else />
</template>

<style lang="scss">
body {
  background-color: var(--color-black);
  color: white;
}
</style>
