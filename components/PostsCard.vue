<template>
  <section class="w-full">
    <p class="text-center" v-if="posts.length === 0">
      {{ $t("no_posts_yet") }}
    </p>

    <div v-else class="flex flex-col gap-y-2 max-h-[90vh] overflow-y-auto">
      <Card
        v-for="post in posts"
        :key="post.id"
        class="override overflow-clip flex gap-x-2 relative pb-2 hover:shadow-md hover:cursor-pointer transition-all"
        @click="handleClick(post.id)"
      >
        <DisplayMap
          class="rounded-r-lg w-1/2 hid"
          :id="post.id"
          :markers="post.contents"
          :center="post.location"
          is-preview
        ></DisplayMap>

        <div class="py-1 w-full flex flex-col justify-around pr-3">
          <div class="flex justify-between">
            <h1 class="text-lg text-primary-600">{{ post.title }}</h1>
            <div class="flex gap-2 items-center">
              <p>{{ post.Likes.length ?? 0 }}</p>
              <Icon name="fluent:heart-48-regular" />
            </div>
          </div>
          <p>{{ post.description }}</p>

          <div class="text-secondary-700 text-end text-xs">
            {{ post.createdAt }}
          </div>
        </div>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  posts: Record<string, any>[];
}>();

function handleClick(id: Number) {
  return navigateTo(`/hike/${id}`);
}
</script>

<style scoped>
.override {
  @apply p-0 !important;
}
</style>
