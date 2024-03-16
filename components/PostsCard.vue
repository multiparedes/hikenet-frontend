<template>
  <section class="w-full">
    <p class="text-center" v-if="posts.length === 0">
      {{ $t("no_posts_yet") }}
    </p>

    <div v-else class="flex flex-col gap-y-2">
      <Card
        v-for="post in posts"
        :key="post.id"
        class="override overflow-clip flex gap-x-2 relative pb-2"
      >
        <img class="rounded-r-lg w-1/3" src="/fuji.jpg" alt="" />

        <div class="py-1">
          <h1 class="text-lg text-primary-600">{{ post.title }}</h1>
          <p>{{ post.description }}</p>
        </div>

        <div class="absolute right-1 bottom-0 text-secondary-700">
          {{ formatDate(post.createdAt) }}
        </div>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

defineProps({
  posts: {
    type: Array,
    required: true,
  },
});

// Get the locale from the Vue I18n instance
const i18n = useI18n();
const locale = i18n.locale.value;

// Import the locale file for the desired language
import("dayjs/locale/" + locale).then((localeModule) => {
  dayjs.locale(localeModule.default);
});

const formatDate = (date: string) => {
  return dayjs(date).fromNow();
};
</script>

<style scoped>
.override {
  @apply p-0 !important;
}
</style>
