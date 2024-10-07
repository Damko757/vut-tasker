import { createApp } from "vue";
import App from "./App.vue";
import { Store } from "./store/store.ts";

createApp(App).provide("store", Store).mount("#app");
