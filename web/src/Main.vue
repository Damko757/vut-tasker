<script setup lang="ts">
import { useCookies } from "@vueuse/integrations/useCookies";
import { USERS } from "../../shared/config/users";
import type { User } from "../../shared/Entities/User";
import UserComponent from "./components/Main/UserComponent.vue";

const cookies = useCookies(["user"]);

function onUserClick(user: User) {
    cookies.set("user", user.nick);
    console.log(cookies.get("user"));
}
</script>
<template>
    <h1 class="fw-bold p-2">Hello! Who are you?</h1>
    <div class="d-flex justify-content-center align-items-center">
        <UserComponent
            v-for="user in USERS"
            :key="user.nick"
            :user="user"
            @click="onUserClick(user)"
        />
    </div>
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
