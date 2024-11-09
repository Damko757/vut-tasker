<script setup lang="ts">
import { onMounted, ref } from "vue";
import HomeScreen from "./HomeScreen.vue";
import NavComponent from "../components/NavComponent.vue";
import SubjectScreen from "./SubjectScreen.vue";

const dots = ref("");

const loadState = ref(0);

const homeScreen = ref<InstanceType<typeof HomeScreen>>();
const subjectScreen = ref<InstanceType<typeof SubjectScreen>>();

const url = new URL(window.location.href);
const subject = url.pathname.split("/").at(1)?.toLocaleUpperCase() ?? null;

function load() {
    dots.value = "";
    const dotsInterval = setInterval(() => {
        dots.value += ".";
        if (loadState.value != 0) clearInterval(dotsInterval);
    }, 500);

    if (subject) {
        subjectScreen.value?.load();
    } else {
        homeScreen.value?.load();
    }
}

onMounted(async () => {
    load();
});
</script>
<template>
    <NavComponent />
    <main>
        <div
            v-if="loadState == 0"
            class="fw-bold text-white p-3 fs-2 text-wrap"
            style="word-break: break-all"
        >
            Loading{{ dots }}
        </div>
        <div
            v-else-if="loadState == -1"
            class="fw-bold p-3 fs-1 text-danger text-center"
        >
            Unable to connect! :C
            <button
                type="button"
                class="btn btn-success d-block mx-auto fw-bold"
                @click="load"
            >
                Refresh
            </button>
        </div>
        <div v-show="loadState == 1">
            <SubjectScreen
                v-if="subject"
                ref="subjectScreen"
                :subject-name="subject"
                @load-state-change="
                    (ns) => {
                        loadState = ns;
                    }
                "
            />
            <HomeScreen
                v-else
                ref="homeScreen"
                @load-state-change="
                    (ns) => {
                        loadState = ns;
                    }
                "
            />
        </div>
    </main>
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";
main {
    @include media-breakpoint-up(md){
        padding-left: 5rem;
    }
}
</style>
