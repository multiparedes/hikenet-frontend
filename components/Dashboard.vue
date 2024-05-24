<template>
  <div>
    <h1 class="text-lg font-semibold">Hikes related to me</h1>
    <section class="flex flex-col gap-4" v-auto-animate>
      <Card
        v-for="post in posts"
        :key="post.id"
        class="override overflow-clip flex gap-x-2 relative pb-2 hover:shadow-md hover:cursor-pointer transition-all"
        @click="handleClick(post.id)"
      >
        <div class="rounded-r-lg w-1/2 hid relative">
          <DisplayMap
            class=""
            :id="post.id"
            :markers="post.contents"
            :center="post.location"
            is-preview
          ></DisplayMap>
        </div>

        <div class="py-1 w-full flex flex-col justify-around pr-3">
          <div class="flex justify-between">
            <h1 class="text-lg text-primary-600">{{ post.title }}</h1>
            <div class="flex gap-2 items-center">
              <p>{{ hike?.likes ?? 0 }}</p>
              <Icon name="fluent:heart-48-regular" />
            </div>
          </div>
          <p>{{ post.description }}</p>

          <div class="text-secondary-700 text-end text-xs">
            {{ post.User.fullName }} - {{ post.createdAt }}
          </div>
        </div>
      </Card>
    </section>

    <Loader v-if="pendingQuery" />

    <Button class="mt-2" v-if="nextUrl" @click="fetchData" type="button"
      >Load more</Button
    >
  </div>
</template>

<script setup>
import uniqolor from "uniqolor";

const currentPage = ref(0);
const pageLimit = 2;
const nextUrl = ref(
  `/feed/${useAuth().user.username}?limit=${pageLimit}&page=${
    currentPage.value
  }`
);

const pendingQuery = ref(false);
const posts = ref([]);
const api = useApi();

async function fetchData() {
  pendingQuery.value = true;

  const { data, error } = await api.get(nextUrl.value);

  console.log(data.value.results);
  posts.value.push(...data.value.results);

  console.log(data.value.next);

  nextUrl.value = data.value.next;

  pendingQuery.value = false;
}

fetchData();

function handleClick(id) {
  return navigateTo(`/hike/${id}`);
}

const colors = (id) => {
  return getUserColors();
};

function getUserColors(userId) {
  if (userId) {
    const color1 = uniqolor(userId.split("-")[0]).color;
    const color2 = uniqolor(userId.split("-")[1]).color;
    return [color1, color2];
  }
  return [];
}
</script>

<style scoped>
.override {
  @apply p-0 !important;
}
</style>
