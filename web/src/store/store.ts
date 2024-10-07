import { ref } from "vue";
import type { User } from "../../../shared/Entities/User.ts";
import axios from "axios";
import { API_URL } from "../const.ts";

export const Store = {
    state: {
        allUsers: ref<User[]>([]),
    },

    getters: {
        getAllUsers: () => {
            Store.mutations.loadAllUsers();
            return Store.state.allUsers;
        },
    },

    mutations: {
        loadAllUsers: () => {
            axios
                .get<User[]>(API_URL + "/users")
                .then(
                    (response) => (Store.state.allUsers.value = response.data)
                );
        },
    },

    actions: {},
};

export type StoreType = typeof Store;
