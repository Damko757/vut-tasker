<script setup lang="ts">
import { computed, ref, type PropType } from "vue";
import type { Task } from "../../../../shared/Entities/Task";
import CheckBox from "./CheckBox.vue";
import { useCookies } from "@vueuse/integrations/useCookies";
import { CookieValue } from "../../const";
import TaskView from "./TaskView.vue";

const cookies = useCookies([CookieValue.USER]);

const nick = computed(() => cookies.get(CookieValue.USER) as string);

const props = defineProps({
    task: {
        type: Object as PropType<Task>,
        required: true,
    },
});

const state = ref<boolean>(props.task.completed_by.includes(nick.value));
const isCollapsed = ref<boolean>(false);
</script>
<template>
    <div :class="{ completed: state }" class="row">
        <div class="col-auto">
            <CheckBox :state="state" @state-change="(ns) => (state = ns)" />
        </div>
        <div
            class="col ps-0 cursor-pointer"
            @click="isCollapsed = !isCollapsed"
        >
            <TaskView :task="task" :is-collapsed="isCollapsed" />
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import "/src/SCSS/main.scss";

.completed {
    text-decoration: line-through;
    color: darken($white, 30%);
}
</style>
