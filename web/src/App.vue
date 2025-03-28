<script setup lang="ts">
import UserSelectScreen from "./screens/UserSelectScreen.vue";
import MainScreen from "./screens/MainScreen.vue";
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
@import "/src/SCSS/main.scss";
body {
  background-color: $black !important;
  color: $white;
}
</style>
