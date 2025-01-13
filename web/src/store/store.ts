import { computed, ref } from "vue";
import type { User } from "../../../shared/Entities/User.ts";
import axios from "axios";
import { API_URL, CookieValue } from "../const.ts";
import { useCookies } from "@vueuse/integrations/useCookies";

export const Store = {
  state: {
    allUsers: ref<User[]>([]),
    user: ref<User>(),
  },

  getters: {
    getAllUsers: () => {
      Store.mutations.loadAllUsers();
      return Store.state.allUsers;
    },
    getUser: () => {
      if (!Store.state.user.value) Store.mutations.loadUser();
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
      const cookies = useCookies([CookieValue.USER]);
      const nick = computed<string>(() => {
        return cookies.get(CookieValue.USER)!;
      });
      axios
        .get<User>(`${API_URL}/user/${nick.value}`)
        .then((response) => (Store.state.user.value = response.data));
    },
  },

  actions: {},
};

export type StoreType = typeof Store;
