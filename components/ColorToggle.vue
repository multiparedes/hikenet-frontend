<template>
  <button @click="toggleTheme(otherTheme)">
    <Icon :name="icons[otherTheme]" />
    <!--{{ $t("navbar.switch_mode", { mode: $t(`navbar.${otherTheme}`) }) }}-->
    Cambiar a modo {{ otherTheme }}
  </button>
</template>

<script setup lang="ts">
const currentTheme = ref<string>(
  useColorMode().preference ?? useColorMode().value
);
const themes: string[] = ["light", "dark"];
const icons: Record<string, string> = {
  light: "ph:moon",
  dark: "ph:sun",
};

function toggleTheme(theme: string): void {
  useColorMode().preference = theme;
  currentTheme.value = theme;
}

const otherTheme = computed(
  () => themes.find((theme) => theme !== currentTheme.value) || "dark"
);
</script>
