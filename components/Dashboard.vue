<template>
  <p class="text-xl text-center">
    {{ $t("under_construction", { user: useAuth().user?.username }) }}
  </p>
</template>