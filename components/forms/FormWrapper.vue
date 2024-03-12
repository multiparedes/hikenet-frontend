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
import { useToast } from "../ui/toast";

const api = useApi();
const { toast } = useToast();

type Methods = "patch" | "post";

interface Props {
  initial?: object;
  validation?: object;
  action?: string;
  method?: Methods;
}

const props = withDefaults(defineProps<Props>(), {
  method: "patch",
});

const emit = defineEmits<{
  (e: "submit", value: object): void;
}>();

const formSchema = computed(() => {
  return toTypedSchema(z.object({ ...(props?.validation ?? {}) }));
});

async function onSubmit(values: object = {}) {
  if (props?.action) {
    const { data, error } = await api[props.method](props.action);

    if (error.value) {
      toast({
        title: "Error during action",
        description: `Error while ${props.method} at ${props.action}`,
      });

      return;
    }

    emit("submit", data);
  } else {
    emit("submit", values);
  }
}
</script>
