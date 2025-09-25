<script setup lang="ts">
import { Icon } from "@iconify/vue";
import axios, { type AxiosResponse } from "axios";
import { computed } from "vue";
import type { User } from "../../../../shared/Entities/User";
import { API_URL } from "../../const";
import { getStore } from "../../store/store";

const props = defineProps({
  subjectName: {
    type: String,
    required: true,
  },
});

const store = getStore();

const user = store.getters.getUser();
const subscribed = computed(() =>
  user.value?.subscribed_subjects.includes(props.subjectName),
);

function changeSubscribedSubjects(newSubjects: string[]) {
  axios
    .patch<User, AxiosResponse<User, any>, Partial<User>>(
      `${API_URL}/user/${user.value!.nick}`,
      {
        subscribed_subjects: newSubjects,
      },
    )
    .then((response) => {
      store.state.user.value = response.data;
    });
}

function subscribe() {
  changeSubscribedSubjects([
    ...(user.value?.subscribed_subjects ?? []),
    props.subjectName,
  ]);
}
function unsubscribe() {
  changeSubscribedSubjects(
    user.value?.subscribed_subjects.filter((sub) => sub != props.subjectName) ??
      [],
  );
}
</script>
<template>
  <div class="cursor-pointer text-3xl">
    <div
      v-if="subscribed"
      class="wrapper text-red-400 hover:text-red-200"
      @click="unsubscribe()"
    >
      <Icon icon="material-symbols:favorite-rounded" />
    </div>
    <div
      v-else
      class="wrapper text-white hover:text-red-200"
      @click="subscribe()"
    >
      <Icon icon="material-symbols:favorite-outline-rounded" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  width: fit-content !important;
}
</style>
