<template>
  <div>
    <h1 class="text-lg font-semibold">{{ $t("my_hikes") }}</h1>
    <section class="flex flex-col gap-4" v-auto-animate>
      <Card v-for="(post, idx) in posts" :key="post.id" class="override">
        <div
          class="overflow-clip flex gap-x-2 relative hover:shadow-md hover:cursor-pointer transition-all"
          @click.parent="handleClick(post.id)"
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
                <p>{{ post?.Likes.length ?? 0 }}</p>
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
            <p>{{ post.description }}</p>

            <div class="text-secondary-700 text-end text-xs">
              {{ post.User.fullName }} - {{ post.createdAt }}
            </div>
          </div>
        </div>

        <div class="bg-slate-200 px-2 py-1 flex flex-col" v-auto-animate>
          <div class="max-h-[6em] overflow-y-auto my-1">
            <p v-for="comment in post.Comments">
              <span class="font-semibold">@{{ comment.userId }}</span>
              {{ $t("says") }}:
              {{ comment.text }}
            </p>
          </div>

          <div class="w-full flex" v-if="!showCreateComment[idx]">
            <Button class="ml-auto" @click="showCreateComment[idx] = true">
              {{ $t("create_comment") }}
            </Button>
          </div>

          <FormWrapper
            v-else
            :validation="validationSchema"
            @submit="(values) => postComment(post.id, values)"
          >
            <div class="flex justify-between gap-x-2 items-top">
              <div class="w-full">
                <InputWrapper name="text" :placeholder="$t('new_comment')" />
              </div>
              <Button
                type="submit"
                class="mt-1"
                :loading="showLoadingComment[idx]"
                >{{ $t("comment") }}</Button
              >
              <Button
                variant="destructive"
                class="mt-1"
                @click="showCreateComment[idx] = false"
              >
                {{ $t("close") }}
              </Button>
            </div>
          </FormWrapper>
        </div>
      </Card>
    </section>

    <Loader v-if="pendingQuery" />

    <p class="text-center" v-else-if="posts.length === 0 && !pendingQuery">
      {{ $t("no_data_to show") }}
    </p>

    <div ref="observerTarget" class="h-1"></div>
  </div>
</template>

<script setup>
import uniqolor from "uniqolor";
import { FormWrapper, InputWrapper } from "~/components/forms";
import * as z from "zod";

const userId = useAuth().user.id;

const currentPage = ref(0);
const pageLimit = 2;
const nextUrl = ref(
  `/feed/${useAuth().user.username}?limit=${pageLimit}&page=${
    currentPage.value
  }`
);

const validationSchema = ref({
  text: z.string().trim().min(1),
});

const pendingQuery = ref(true);
const posts = ref([]);
const api = useApi();
const showCreateComment = ref([]);
const showLoadingComment = ref([]);
const observerTarget = ref(null);

async function fetchData() {
  pendingQuery.value = true;

  const { data, error } = await api.get(nextUrl.value);

  posts.value.push(...data.value.results);

  const newFalseArray = Array(data.value.results.length).fill(false);
  showCreateComment.value = showCreateComment.value.concat(newFalseArray);
  showLoadingComment.value = showLoadingComment.value.concat(newFalseArray);

  nextUrl.value = data.value.next;

  pendingQuery.value = false;
}

fetchData();

function hikeLiked(postId) {
  const post = posts.value.find((p) => p.id === postId);
  return post.Likes.filter((l) => l.userId === userId).length !== 0;
}

function handleClick(id) {
  return navigateTo(`/hike/${id}`);
}

async function postComment(postId, values) {
  const postIdx = posts.value.findIndex((p) => p.id === postId);

  showLoadingComment.value[postIdx] = true;

  const { data, error } = await api.post(
    `/comments/${useAuth().user.username}/${postId}`,
    {
      body: values,
    }
  );

  const post = posts.value.find((p) => p.id === postId);
  post.Comments.push(data.value);

  showCreateComment.value[postIdx] = false;
  showLoadingComment.value[postIdx] = false;
}

function createObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && nextUrl.value && !pendingQuery.value) {
        fetchData();
      }
    },
    {
      rootMargin: "100px",
    }
  );

  if (observerTarget.value) {
    observer.observe(observerTarget.value);
  }

  onBeforeUnmount(() => {
    if (observerTarget.value) {
      observer.unobserve(observerTarget.value);
    }
  });
}

onMounted(() => {
  createObserver();
});
</script>

<style scoped>
.override {
  @apply p-0 !important;
}
</style>
