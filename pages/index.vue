<template>
  <div class="h-screen w-screen grid place-content-center bg-slate-200">
    <Card class="px-2 py-1">Wellcome to HikeNet ⛰!</Card>
  </div>
</template>

<script setup>
useFetch("/", { baseURL: useRuntimeConfig().public.apiPath });
</script>
