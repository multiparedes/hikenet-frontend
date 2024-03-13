<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl>
        <Input v-bind="componentField" :type="type" :placeholder="placeholder" :icon="icon" @update="propagateEmit" />
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

const emit = defineEmits<{
  (e: 'update', value: string): void
}>()

withDefaults(defineProps<Props>(), {
  type: "text",
});

function propagateEmit(val: any) { emit('update', val) } 
</script>
