<template>
  TODO: Already logged in!

  {{ useAuth().user }}

  <hr />

  {{ data ?? error }}
</template>

<script setup lang="ts">
const { data, error } = useApi().get("/users");

console.log(useAuth());
</script>
