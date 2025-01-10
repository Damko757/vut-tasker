<script setup lang="ts">
import { useCookies } from "@vueuse/integrations/useCookies";
import { API_URL, CookieValue } from "../../const";
import { computed, ref } from "vue";
import axios, { type AxiosResponse } from "axios";
import type { User } from "../../../../shared/Entities/User";

const props = defineProps({
  subjectName: {
    type: String,
    required: true,
  },
});

const cookies = useCookies([CookieValue.USER]);

const nick = computed<string>(() => {
  return cookies.get(CookieValue.USER)!;
});
const user = ref<User>();
axios
  .get<User>(`${API_URL}/user/${nick.value}`)
  .then((response) => (user.value = response.data))
  .catch(() => alert("Couldn't fetch user!"));
const subscribed = computed(() =>
  user.value?.subscribed_subjects.includes(props.subjectName)
);

function changeSubscribedSubjects(newSubjects: string[]) {
  axios
    .patch<User, AxiosResponse<User, any>, Partial<User>>(
      `${API_URL}/user/${nick.value}`,
      {
        subscribed_subjects: newSubjects,
      }
    )
    .then((response) => {
      user.value = response.data;
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
      []
  );
}
</script>
<template>
  <div v-if="subscribed" class="wrapper">
    <button class="btn btn-danger mx-3 fw-bold" @click="unsubscribe()">
      Unsubscribe...
    </button>
  </div>
  <div v-else class="wrapper">
    <button class="btn btn-success mx-3 fw-bold" @click="subscribe()">
      Subscribe!
    </button>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  width: fit-content !important;
}
</style>
