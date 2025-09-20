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
</script>
<template>
  <main class="md:p-5 px-3">
    <h1 class="fw-bold p-2">Hello! Who are you?</h1>
    <div class="d-flex justify-content-center align-items-center flex-wrap">
      <UserComponent
        v-if="users != undefined"
        v-for="user in users"
        :key="user.nick"
        :user="user"
        @click="onUserClick(user)"
      />
      <div v-else class="fst-italic">Loading...</div>
    </div>
  </main>
</template>
