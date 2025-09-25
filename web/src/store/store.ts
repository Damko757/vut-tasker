import axios from "axios";
import { computed, inject, ref } from "vue";
import type { User } from "../../../shared/Entities/User.ts";
import { API_URL } from "../const.ts";

export const getStore = () => inject("store") as unknown as StoreType;

export const Store = {
  state: {
    allUsers: ref<User[]>([]),
    user: ref<User | null>(),
    subjects: ref<string[]>([]),
  },

  getters: {
    getAllUsers: () => {
      return Store.state.allUsers;
    },
    getUser: () => {
      return Store.state.user;
    },
    getAllSubjects: () => {
      return computed(() => {
        const out = {
          subscribed: [] as string[],
          unsubscribed: [] as string[],
        };

        Store.state.subjects.value
          .toSorted((a, b) => a.localeCompare(b))
          .forEach((subject) => {
            if (
              Store.getters
                .getUser()
                .value?.subscribed_subjects.includes(subject)
            )
              out.subscribed.push(subject);
            else out.unsubscribed.push(subject);
          });
        return out;
      });

      // const specifiedSubjects = computed(() => {
      //   const out = {
      //     subscribed: <string[]>[],
      //     unsubscribed: <string[]>[],
      //   };

      //   subjects.value.forEach((subject) =>
      //     out[
      //       store.getters.getUser().value?.subscribed_subjects.includes(subject)
      //         ? "subscribed"
      //         : "unsubscribed"
      //     ].push(subject),
      //   );

      //   return out;
    },
  },

  mutations: {
    loadSubjects: () => {
      axios
        .get<string[]>(API_URL + `/subjects`)
        .then((response) => (Store.state.subjects.value = response.data ?? []));
    },
    loadAllUsers: () => {},
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
