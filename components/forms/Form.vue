<template>
  <form type="form" v-auto-animate @submit.prevent="onSubmit">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

interface Props {
  validation: object;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "submit", value: object): void;
}>();

const formSchema = computed(() => {
  return toTypedSchema(z.object({ ...props?.validation }));
});

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values) => {
  emit("submit", values);
});
</script>
