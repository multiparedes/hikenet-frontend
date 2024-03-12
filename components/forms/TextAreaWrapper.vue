<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl>
        <Textarea v-bind="componentField" :placeholder="placeholder" />
      </FormControl>
      <FormDescription v-if="description">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import { Textarea } from "../ui/textarea";

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
}

withDefaults(defineProps<Props>(), {});
</script>
