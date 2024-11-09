<script setup lang="ts">
import { computed, ref, type PropType } from "vue";
import type { Task } from "../../../../shared/Entities/Task";
import CheckBox from "./CheckBox.vue";
import { useCookies } from "@vueuse/integrations/useCookies";
import { API_URL, CookieValue } from "../../const";
import TaskView from "./TaskView.vue";
import TaskEdit from "./TaskEdit.vue";
import axios from "axios";
import CompletedByDots from "./CompletedByDots.vue";

const cookies = useCookies([CookieValue.USER]);

const nick = computed(() => cookies.get(CookieValue.USER) as string);

const task = defineModel<Task>();
const deleted = ref(false);

const state = ref<boolean>(task.value!.completed_by.includes(nick.value));
const isCollapsed = ref<boolean>(false);

const action = ref<"view" | "update">("view");

function deleteTask() {
    if (!confirm("Really?")) return;

    axios
        .delete(API_URL + `/task/${task.value?._id}`)
        .then((response) => {
            deleted.value = true;
        })
        .catch(console.error);
}

function todoCheck(ns: boolean) {
    axios[ns ? "post" : "delete"](
        API_URL + `/task/${task.value!._id}/${nick.value}`
    ).then((response) => {
        state.value = ns;
        if (response.data.completed_by)
            task.value!.completed_by = response.data.completed_by as string[];
    });
}
</script>
<template>
    <div :class="{ completed: state }" class="row" v-if="!deleted">
        <div class="col-auto position-relative pb-2">
            <div class="position-absolute" style="left: -0.5em">
                <CompletedByDots :completed-by="task?.completed_by ?? []" />
            </div>
            <CheckBox :state="state" @state-change="todoCheck" />
        </div>
        <div class="col ps-0" @click="isCollapsed = !isCollapsed">
            <TaskView
                v-if="action == 'view'"
                :task="task!"
                :is-collapsed="isCollapsed"
                @update="action = 'update'"
                @delete="deleteTask"
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

        <hr class="mt-2" />
    </div>
</template>
<style lang="scss">
@import "/src/SCSS/main.scss";

.completed h5 {
    text-decoration: line-through;
    color: darken($white, 30%);
}
</style>
