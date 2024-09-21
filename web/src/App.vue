<script setup lang="ts">
import { USERS } from "../../shared/config/users";
import UserComponent from "./components/Main/UserComponent.vue";
</script>
<template>
    <h1>Hello! Who are you?</h1>
    <UserComponent v-for="user in USERS" :key="user.nick" :user="user" />
</template>

<style lang="scss">
@import "/src/SCSS/main.scss";
body {
    background-color: $black !important;
}
</style>
<style scoped lang="scss">
@import "/src/SCSS/main.scss";
h1 {
    color: $white;
}
</style>
