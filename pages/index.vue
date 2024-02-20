<template>
  <div class="h-screen w-screen grid place-content-center bg-slate-200">
    <Card class="px-2 py-1 text-center">Wellcome to HikeNet ⛰!
      <p v-if="!pending">{{ data?.message }}</p>
      <p v-else>Loading ...</p>
    </Card>
  </div>
</template>

<script setup>
const { data, pending } = useApi('/')
</script>
