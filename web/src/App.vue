<script setup lang="ts">
import { useCookies } from "@vueuse/integrations/useCookies";
import { CookieValue } from "./const";
import { computed } from "vue";
import UserSelectScreen from "./screens/UserSelectScreen.vue";
import MainScreen from "./screens/MainScreen.vue";

const cookies = useCookies([CookieValue.USER]);

const user = computed<string | undefined>(() => {
  return cookies.get(CookieValue.USER);
});
</script>
<template>
  <MainScreen v-if="user" />
  <UserSelectScreen v-else />
</template>

<style lang="scss">
@import "/src/SCSS/main.scss";
body {
  background-color: $black !important;
  color: $white;
}
</style>
