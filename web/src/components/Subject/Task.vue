<script setup lang="ts">
import { computed, ref, type PropType } from "vue";
import type { Task } from "../../../../shared/Entities/Task";
import CheckBox from "./CheckBox.vue";
import { useCookies } from "@vueuse/integrations/useCookies";
import { CookieValue } from "../../const";
import TaskView from "./TaskView.vue";
import TaskEdit from "./TaskEdit.vue";

const cookies = useCookies([CookieValue.USER]);

const nick = computed(() => cookies.get(CookieValue.USER) as string);

const task = defineModel<Task>();

const state = ref<boolean>(task.value!.completed_by.includes(nick.value));
const isCollapsed = ref<boolean>(false);

const action = ref<"view" | "update">("view");
</script>
<template>
    <div :class="{ completed: state }" class="row">
        <div class="col-auto">
            <CheckBox :state="state" @state-change="(ns) => (state = ns)" />
        </div>
        <div class="col ps-0" @click="isCollapsed = !isCollapsed">
            <TaskView
                v-if="action == 'view'"
                :task="task!"
                :is-collapsed="isCollapsed"
                @update="action = 'update'"
            />
            <TaskEdit
                v-if="action == 'update'"
                :task="task"
                @done="
                    (newTask) => {
                        action = 'view';
                        if (newTask) task = newTask;
                    }
                "
            />
        </div>
    </div>
</template>
<style lang="scss">
@import "/src/SCSS/main.scss";

.completed h5 {
    text-decoration: line-through;
    color: darken($white, 30%);
}
</style>
