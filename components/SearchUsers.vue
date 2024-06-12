<template>
  <section class="flex gap-2 flex-col w-full content-center">
    <FormsInputWrapper
      name="users"
      label="Search users by username"
      icon="fluent:search-16-regular"
      placeholder="Search for an user ..."
      @update="deboundedSearch"
    >
    </FormsInputWrapper>

    <div class="max-h-[20em] overflow-y-auto" v-auto-animate appear>
      <div
        v-for="user in userList"
        class="flex gap-2 items-center dark:text-white hover:bg-primary-200 px-2 py-1 rounded-full transition-colors my-1 cursor-pointer"
        @click="visitProfile(user)"
      >
        <span
          class="h-4 aspect-square grid text-slate-900 place-content-center bg-secondary-300 rounded-full border-2 border-white p-4"
        >
          {{ formatName(user) }}
        </span>

        <span> {{ user.fullName }}</span>

        <span>|</span>

        <span> @{{ user.username }}</span>
      </div>

      <span
        class="text-center w-full"
        v-if="userList.length === 0 && !firstLoad"
      >
        {{ $t("no_results") }}
      </span>

      <Loader v-else-if="firstLoad" />
    </div>
  </section>
</template>

<script setup>
import { debounce } from "~/lib/utils";

const userList = ref([]);
const api = useApi();
const firstLoad = ref(true);

const emit = defineEmits(["select"]);

const deboundedSearch = debounce(handleSearch, 500);

async function handleSearch(search) {
  const { data, error } = await api.get(`/users/?name=${search}`);

  if (error.value) {
    return;
  }

  if (firstLoad) firstLoad.value = false;

  userList.value = data.value;
}

function formatName(user) {
  return `${user?.firstName[0]}${user?.lastName[0]}`.toLocaleUpperCase();
}

function visitProfile(user) {
  emit("select", user);
  return navigateTo({ path: `/profile/${user.username}` });
}
</script>
