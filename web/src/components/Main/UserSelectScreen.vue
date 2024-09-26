<script setup lang="ts">
import { useCookies } from "@vueuse/integrations/useCookies";
import type { User } from "../../../../shared/Entities/User";
import { USERS } from "../../../../shared/config/users";
import { CookieValue } from "../../const";
import UserComponent from "./UserComponent.vue";

const cookies = useCookies([CookieValue.USER]);

function onUserClick(user: User) {
    cookies.set(CookieValue.USER, user.nick, {
        sameSite: "strict",
        expires: (function (d = new Date()) {
            d.setDate(d.getDate() + 365);
            return d;
        })(),
    });
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

<style scoped lang="scss">
@import "/src/SCSS/main.scss";
h1 {
    color: $white;
}
</style>
