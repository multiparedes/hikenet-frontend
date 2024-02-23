<template>
  <div>
    <Label :for="props.context.attrs.key">{{ props.context.label }}</Label>
    <Input
      :to="props.context.attrs.key"
      :class="context.classes.digit"
      :value="props.context._value"
      :icon="props.context?.icon"
      @input="handleInput"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  context: Object,
});

function handleInput(e) {
  props.context.node.input(e.target.value);
}
</script>
