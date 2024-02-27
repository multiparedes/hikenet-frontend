<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Primitive, type PrimitiveProps } from "radix-vue";
import { type ButtonVariants, buttonVariants } from ".";
import { cn } from "@/lib/utils";

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  as?: string;
  class?: HTMLAttributes["class"];
  icon?: string | "";
  disabled?: boolean;
  iconStart?: boolean;
  link?: string;
  isExternalLink?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
});

function navigate() {
  if (props.isExternalLink) {
    window.open(props.link || "", "_blank");
  } else if (props.link) {
    return navigateTo(props.link);
  }
}
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :disabled="disabled || loading"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    @click="navigate"
  >
    <slot />
    <Icon v-if="loading" name="svg-spinners:270-ring" class="ml-2" />

    <Icon
      v-if="icon"
      :name="icon"
      class="ml-2"
      :class="{ iconStart: '-order-1' }"
    />
  </Primitive>
</template>
