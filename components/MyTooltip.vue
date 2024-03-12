<template>
  <div>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <slot></slot>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ text }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>
