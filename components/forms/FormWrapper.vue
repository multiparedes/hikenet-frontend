<template>
  <Form
    v-auto-animate
    :validation-schema="formSchema"
    :initial-values="initial ?? {}"
    @submit="onSubmit"
  >
    <slot></slot>
  </Form>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

interface Props {
  initial?: object;
  validation?: object;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "submit", value: object): void;
}>();

const formSchema = computed(() => {
  return toTypedSchema(z.object({ ...(props?.validation ?? {}) }));
});

function onSubmit(values: object = {}) {
  emit("submit", values);
}
</script>
