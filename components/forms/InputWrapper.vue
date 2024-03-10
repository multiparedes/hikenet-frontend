<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl>
        <Input
          v-bind="componentField"
          :type="type"
          :placeholder="placeholder"
          :icon="icon"
        />
      </FormControl>
      <FormDescription v-if="description">{{ description }}</FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
interface Props {
  name: string;
  type?: string;
  label?: string;
  placeholder?: string;
  icon?: string;
  description?: string;
}

withDefaults(defineProps<Props>(), {
  type: "text",
});
</script>
