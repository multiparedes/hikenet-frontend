<template>
  <p class="text-xl">
    Wellcome {{ useAuth()?.user?.username }}, this site is still under
    construction 🚧, come back later 👋 .
  </p>

  <hr />

  <p>Users list:</p>

  <h1 v-if="pending">Loading <Icon name="svg-spinners:270-ring" /></h1>
  <div class="flex flex-col gap-2 ml-2" v-else>
    <span v-for="user in data">
      · Username: {{ user.username }}, name:
      {{ `${user.firstName} ${user?.lastName}` }}.
    </span>
  </div>
</template>

<script setup lang="ts">
const { data, pending } = useApi().get("/users");
</script>
