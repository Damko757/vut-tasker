<script setup lang="ts">
import type { User } from "../../../shared/Entities/User";
import { API_URL } from "../const";
import UserComponent from "../components/Main/UserComponent.vue";
import axios from "axios";
import { ref } from "vue";
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
</template>

<style scoped lang="scss">
@import "/src/SCSS/main.scss";
h1 {
  color: $white;
}
</style>
