<template>
  <button
    class="inline-flex items-center gap-2 px-4 py-2 transition-color duration-200 linear text-slate-900 dark:text-white rounded-full"
    :class="`button-${color}-${variant}`"
    :disabled="disabled"
    :style="{ fontSize: size }"
    @click="navigate"
  >
    <slot></slot>
    <Icon v-if="icon" :name="icon" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  color?: "primary" | "secondary" | "transparent" | "error";
  variant?: "solid" | "bordered" | "link";
  size?: string;
  icon?: string | "";
  disabled?: boolean;
  iconStart?: boolean;
  link?: string;
  isExternalLink?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: "primary",
  variant: "solid",
});

const route = useRouter();

function navigate() {
  if (props.isExternalLink) {
    window.open(props.link || "", "_blank");
  } else if (props.link) {
    route.push(props.link);
  }
}
</script>

<style scoped>
.button-primary-solid {
  @apply text-current border-2 border-primary-600 bg-primary-600 hover:bg-primary-400;
}

.button-primary-bordered {
  @apply text-current border-2 border-primary-600 hover:bg-primary-400 hover:text-white text-primary-600;
}

.button-secondary-solid {
  @apply text-current border-2 border-secondary-600 bg-secondary-600 hover:bg-secondary-400;
}

.button-secondary-bordered {
  @apply text-current border-2 border-secondary-600 text-secondary-600 hover:bg-secondary-400 hover:text-white;
}

.button-transparent-solid {
  @apply text-current p-0;
}

.button-error-solid {
  @apply text-current border-2 border-red-600 bg-red-600 hover:bg-red-400;
}

.button-error-bordered {
  @apply text-current border-2 border-red-600 text-red-600 hover:bg-red-400 hover:text-white;
}

.button-primary-link {
  @apply p-0 text-current hover:text-primary-400 hover:underline;
}

.button-secondary-link {
  @apply p-0 text-current hover:text-secondary-400 hover:underline;
}
</style>
