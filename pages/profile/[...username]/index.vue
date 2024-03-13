<template>
  <Loader v-if="pageLoading" />
  <section v-else class="grid md:grid-cols-2 grid-cols-1 gap-4">
    <ProfileCard :user="user" :profile="profile" @updated="updateUserData" />
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
const pageLoading = ref(true);

async function fetchData() {
  const { data, error } = await api.get(
    `/users/${route.params?.username}`
  );

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

  profile.value = profileData.value;

  pageLoading.value = false;
}

fetchData();

function updateUserData(newValues) {
  user.value = newValues.user;
  profile.value = newValues.profile;
}
</script>
