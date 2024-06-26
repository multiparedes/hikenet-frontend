<template>
  <section class="w-full">
    <p class="text-center" v-if="posts.length === 0">
      {{ $t("no_posts_yet") }}
    </p>

    <div v-else class="flex flex-col gap-y-2 max-h-[90vh] overflow-y-auto">
      <Card
        v-for="post in posts"
        :key="post.id"
        class="override overflow-clip grid grid-cols-3 gap-x-2 relative pb-2 hover:shadow-md hover:cursor-pointer transition-all"
        @click="handleClick(post.id)"
      >
        <DisplayMap
          class="rounded-r-lg w-full"
          :id="post.id"
          :markers="post.contents"
          :center="post.location"
          is-preview
        ></DisplayMap>

        <div class="py-1 w-full flex flex-col justify-around pr-3 col-span-2">
          <div class="flex justify-between">
            <h1 class="text-lg text-primary-600">{{ post.title }}</h1>
            <div class="flex gap-2 items-center">
              <p>{{ post.Likes.length ?? 0 }}</p>
              <Icon
                :name="
                  hikeLiked(post.id)
                    ? 'fluent:heart-48-filled'
                    : 'fluent:heart-48-regular'
                "
                :class="{ 'text-red-400': hikeLiked(post.id) }"
              />
            </div>
          </div>
          <p class="max-h-[8em] overflow-clip fade override text-justify">
            {{ post.description }}
          </p>
        </div>
      </Card>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  posts: Record<string, any>[];
}>();

function handleClick(id: Number) {
  return navigateTo(`/hike/${id}`);
}

function hikeLiked(postId: any) {
  const post = props.posts.find((p) => p.id === postId);
  return (
    post!.Likes.filter((l: any) => l.userId === useAuth()?.user?.id).length !==
    0
  );
}
</script>

<style scoped>
.override {
  @apply p-0 !important;
}

.fade {
  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
}
</style>
