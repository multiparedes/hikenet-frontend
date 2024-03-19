<template>
    <FormField v-slot="{ componentField }" :name="name">
        <FormItem>
            <FormLabel>{{ label }}</FormLabel>
            <FormControl>
                <Slider v-bind="{ ...componentField, ...props }" :placeholder="placeholder" />
            </FormControl>
            <FormDescription v-if="description">{{ description }}</FormDescription>
            <FormMessage />
        </FormItem>
    </FormField>
</template>

<script setup lang="ts">
import { Slider } from "../ui/slider";

interface Props {
    name: string;
    label?: string;
    placeholder?: string;
    description?: string;
    min?: number,
    max?: number
}

const props = withDefaults(defineProps<Props>(), {});
</script>