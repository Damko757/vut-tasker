<script setup lang="ts">
import { useCookies } from "@vueuse/integrations/useCookies";
import { CookieValue } from "./const";
import UserSelectScreen from "./components/Main/UserSelectScreen.vue";
import { computed } from "vue";
import MainScreen from "./components/Main/MainScreen.vue";

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
}
</style>
