import { computed, inject, ref } from "vue";
import type { User } from "../../../shared/Entities/User.ts";
import axios from "axios";
import { API_URL } from "../const.ts";

export const getStore = () => inject("store") as unknown as StoreType;

export const Store = {
  state: {
    allUsers: ref<User[]>([]),
    user: ref<User | null>(),
  },

  getters: {
    getAllUsers: () => {
      Store.mutations.loadAllUsers();
      return Store.state.allUsers;
    },
    getUser: () => {
      return Store.state.user;
    },
  },

  mutations: {
    loadAllUsers: () => {
      axios
        .get<User[]>(API_URL + "/users")
        .then((response) => (Store.state.allUsers.value = response.data));
    },
    loadUser: () => {
      axios
        .get<User>(`${API_URL}/user`)
        .then((response) => (Store.state.user.value = response.data))
        .catch(() => (Store.state.user.value = null));
    },
  },

  actions: {},
};

export type StoreType = typeof Store;
