import { createApp } from "vue";
import App from "./App.vue";
import { Store } from "./store/store.ts";
import axios from "axios";

axios.defaults.withCredentials = true;

createApp(App).provide("store", Store).mount("#app");
