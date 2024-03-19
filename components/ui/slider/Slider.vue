<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import type { SliderRootEmits, SliderRootProps } from 'radix-vue'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<SliderRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<SliderRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <div class="flex h-10">
    <p
      class="bg-white dark:bg-slate-950 dark:text-white px-2 py-1 rounded-lg mr-2 w-[3em] grid place-content-center border border-slate-200 ">
      {{
        forwarded!.modelValue?.at(0) ?? 0 }}</p>
    <SliderRoot :class="cn(
        'relative flex w-full touch-none select-none items-center',
        props.class,
      )" v-bind="forwarded">
      <SliderTrack class="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-100 dark:bg-slate-950">
        <SliderRange class="absolute h-full bg-secondary-900 dark:bg-secondary-600" />
      </SliderTrack>
      <SliderThumb
        class="block h-5 w-5 rounded-full border-2 border-secondary-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-50 dark:bg-slate-950 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300" />
    </SliderRoot>
  </div>
</template>
