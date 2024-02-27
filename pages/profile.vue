<template>
  <section>
    <Card></Card>
  </section>
</template>

<script setup>
definePageMeta({
  middleware: ["user-auth"],
});
</script>
