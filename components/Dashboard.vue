<template>
  <p class="text-xl text-center">
    {{ $t("under_construction", { user: useAuth().user?.username }) }}
  </p>
</template>

<script setup lang="ts">
const { data, pending } = useApi().get("/users");
</script>
