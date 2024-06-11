<template>
  <Loader v-if="pageLoading" />
  <section v-else class="flex flex-col gap-4">
    <div class="flex justify-between">
      <Card class="w-fit">
        <div class="flex gap-1">
          <p class="text-primary-600">{{ hike.title }}</p>
          <p>{{ $t("by") }} {{ hike.User.fullName }}</p>
        </div>

        <div class="flex gap-2 justify-center items-center">
          <p>
            {{ $t("difficulty") }}
            <span>{{ hike.difficulty }} / 10</span>
          </p>

          <span
            class="bg-secondary-300 px-2 py-0.5 rounded-md dark:bg-secondary-800"
            >{{ hike.location?.resolved?.country }} -
            {{
              hike.location.resolved.city ?? hike.location.resolved.province
            }}</span
          >
        </div>
      </Card>

      <Card class="flex gap-x-4 items-center">
        <div class="flex flex-col items-end">
          <button class="flex gap-2 items-center group">
            <p>{{ hike?.likes ?? 0 }} {{ $t("likes").toLocaleLowerCase() }}</p>
            <Icon
              name="fluent:heart-48-regular"
              class="group-hover:fill-red-400 group-hover:text-red-400 transition-all"
            />
          </button>
          <div class="flex gap-2 items-center">
            <p>
              {{ hike?.Comments?.length ?? 0 }}
              {{ $t("comments").toLocaleLowerCase() }}
            </p>
            <Icon name="fluent:comment-48-regular" />
          </div>
        </div>
        <Button
          v-if="hike.User.id === $auth.user.id"
          icon="fluent:edit-12-regular"
          :link="`/hike?id=${hike.id}`"
          >{{ $t("edit") }}</Button
        >
      </Card>
    </div>

    <DisplayMap :markers="hike.contents" :center="hike.location" />

    <Card>
      <p>{{ $t("description") }}: {{ hike.description }}</p>
    </Card>

    <div v-if="hike.images.length > 0" class="flex gap-2">
      <div v-for="(image, index) in hike.images" :key="index">
        <img
          :src="image"
          :alt="'Image ' + (index + 1)"
          class="max-w-xs h-auto"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
const api = useApi();
const route = useRoute();

const pageLoading = ref(true);

const hike = ref({});

async function fetchData() {
  pageLoading.value = true;

  const { data, error } = await api.get(`/posts/${route.params.id}`);

  if (error.value) {
    return;
  }

  hike.value = data.value;

  pageLoading.value = false;
}

fetchData();
</script>
