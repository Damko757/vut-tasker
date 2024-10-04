<script setup lang="ts">
import { useCookies } from "@vueuse/integrations/useCookies";
import type { User } from "../../../shared/Entities/User";
import { API_URL, CookieValue } from "../const";
import UserComponent from "../components/Main/UserComponent.vue";
import axios from "axios";
import { ref } from "vue";

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

const users = ref<User[]>();

axios.get<User[]>(API_URL + "/users").then((response) => {
    users.value = response.data;
});
</script>
<template>
    <h1 class="fw-bold p-2">Hello! Who are you?</h1>
    <div class="d-flex justify-content-center align-items-center">
        <UserComponent
            v-if="users != undefined"
            v-for="user in users"
            :key="user.nick"
            :user="user"
            @click="onUserClick(user)"
        />
        <div v-else class="fst-italic">Loading...</div>
    </div>
</template>

<style scoped lang="scss">
@import "/src/SCSS/main.scss";
h1 {
    color: $white;
}
</style>
