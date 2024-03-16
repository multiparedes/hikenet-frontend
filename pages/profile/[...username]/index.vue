<template>
  <Loader v-if="pageLoading" />
  <section v-else class="grid md:grid-cols-2 grid-cols-1 gap-4">
    <ProfileCard
      :user="user"
      :profile="profile"
      @updated="updateUserData"
      @follow="updateFollow"
      @unfollow="updateUnfollow"
    />
    <PostsCard :posts="posts" />
  </section>
</template>

<script setup>
import { useToast } from "@/components/ui/toast/use-toast";

definePageMeta({
  middleware: ["user-auth"],
});

const api = useApi();
const route = useRoute();

const user = ref({});
const profile = ref({});
const posts = ref([]);
const pageLoading = ref(true);

async function fetchData() {
  console.log(route.params);
  const { data, error } = await api.get(`/users/${route.params?.username[0]}`);

  if (error.value) {
    useToast().error({ title: "error ocurred" });
    return;
  }

  user.value = data.value;

  const { data: profileData, error: errorProfile } = await api.get(
    `/profile/${user.value.username}`
  );

  if (errorProfile.value) {
    useToast().error({
      title: "error ocurred",
      description: "error with profile fetching",
    });
    return;
  }

  const { data: postsData, error: errorPosts } = await api.get(
    `/posts/${user.value.username}`
  );

  if (errorPosts.value) {
    useToast().error({
      title: "error ocurred",
      description: "error with posts fetching",
    });
    return;
  }

  posts.value = postsData.value;
  profile.value = profileData.value;

  pageLoading.value = false;
}

fetchData();

function updateUserData(newValues) {
  user.value = { ...user.value, ...newValues.user };
  profile.value = newValues.profile;
}

function updateFollow(newUser) {
  user.value.followers.push(newUser);
}

function updateUnfollow(oldUser) {
  user.value.followers = user.value.followers.filter(
    (f) => f.id !== oldUser.id
  );
}
</script>
