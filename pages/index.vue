<template>
  <Landing v-if="!useAuth().loggedIn" />
  <Dashboard v-else />
</template>

<script setup>
console.log(useAuth());
</script>
