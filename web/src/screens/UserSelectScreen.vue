<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import type { User } from "../../../shared/Entities/User";
import UserComponent from "../components/Main/UserComponent.vue";
import { API_URL } from "../const";
import { getStore } from "../store/store";

const store = getStore();

function onUserClick(user: User) {
  axios.post<User>(API_URL + `/login/${user.nick}`).then((response) => {
    store.state.user.value = response.data;
  });
}

const users = ref<User[]>();

axios.get<User[]>(API_URL + "/users").then((response) => {
  users.value = response.data;
});
// TODO FIX CSS
</script>
<template>
  <main class="px-3 md:p-5">
    <h1 class="p-2 text-2xl font-bold">Hello! Who are you?</h1>
    <div class="flex flex-wrap items-center justify-center">
      <UserComponent
        v-if="users != undefined"
        v-for="user in users"
        :key="user.nick"
        :user="user"
        @click="onUserClick(user)"
      />
      <div v-else class="italic">Loading...</div>
    </div>
  </main>
</template>
