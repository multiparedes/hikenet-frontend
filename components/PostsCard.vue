<template>
  <section class="w-full">
    <p class="text-center" v-if="posts.length === 0">
      {{ $t("no_posts_yet") }}
    </p>

    <div v-else class="flex flex-col gap-y-2">
      <Card v-for="post in posts" :key="post.id" class="override overflow-clip flex gap-x-2 relative pb-2">
        <img class="rounded-r-lg w-1/3" src="/fuji.jpg" alt="" />

        <div class="py-1 w-full pr-1">
          <h1 class="text-lg text-primary-600">{{ post.title }}</h1>
          <p>{{ post.description }}</p>

          <div class="text-secondary-700 text-end text-xsw">
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
</script>

<style scoped>
.override {
  @apply p-0 !important;
}
</style>
