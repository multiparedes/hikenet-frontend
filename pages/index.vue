<template>
  <section>
    <div>
      <Card class="px-2 py-1 text-center w-full"
        >Wellcome to HikeNet ⛰!
        <p v-if="!pending && data">{{ data?.message }}</p>
        <p v-else-if="!pending && error">{{ error }}</p>
        <p v-else>Loading ...</p>
      </Card>
    </div>
  </section>
</template>

<script setup>
const { data, pending, error } = await useApi("/auth/login", {
  method: "POST",
  body: {
    username: "multiparedes",
    password: "1234",
  },
});

await useApi("/users");
</script>
