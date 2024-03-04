<template>
  <Loader v-if="pageLoading" />
  <section v-else class="grid md:grid-cols-2 grid-cols-1 gap-4">
    <ProfileCard :user="user" />
    <Card>
    </Card>
  </section>
</template>

<script setup>
import { useToast } from "@/components/ui/toast/use-toast";

definePageMeta({
  middleware: ["user-auth"],
});

const auth = useAuth();
const api = useApi()
const route = useRoute()

const user = ref({})
const pageLoading = ref(true)


const isOwn = computed(() => {
  return !route.query?.id
})

watch(isOwn, () => {
  fetchData()
})

async function fetchData() {
  pageLoading.value = true
  if (isOwn.value) {
    user.value = auth.user

  } else {
    const { data, error } = await api.get(`/users/${route.query?.id}`)

    if (error.value) {
      useToast().error({ title: 'error ocurred' })
      return
    }

    user.value = data.value
  }

  pageLoading.value = false
}

fetchData()

</script>
