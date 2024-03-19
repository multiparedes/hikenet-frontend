<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "@/lib/utils";

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
  icon?: string | null;
  placeholder?: string | null;
  type?: string;
}>();

const internalType = ref<string | null>(null);

onMounted(() => {
  if (props.type === "password") {
    internalType.value = props.type;
  }
});

const emits = defineEmits<{
  (e: "update:modelValue" | "update", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});

watch(
  () => modelValue.value,
  () => {
    emits("update", modelValue.value ?? "");
  },
  { immediate: true }
);

const passwordVisible = computed(() => {
  return internalType.value === "text";
});

interface IconRegister {
  name: string;
  icon: string;
}

const defaultIcons = [
  {
    name: "user",
    icon: "fluent:person-20-regular",
  },
  {
    name: "password",
    icon: "fluent:lock-closed-key-16-regular",
  },
] as IconRegister[];

function switchPasswordType() {
  const types = ["text", "password"];

  internalType.value = types.filter((t) => t != internalType.value)[0];
}

function propagateEmit(val: any) {
  emits("update", val);
}
</script>

<template>
  <div class="relative w-full items-center">
    <input
      v-model="modelValue"
      :type="internalType ?? type"
      :placeholder="placeholder ?? ''"
      :class="[
        cn(
          'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300',
          props.class
        ),
        { 'pl-10': props.icon },
      ]"
      @update="propagateEmit"
    />

    <span
      class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
    >
      <Icon
        v-if="props.icon"
        :name="
          defaultIcons.find((i) => i.name === props.icon)?.icon || props.icon
        "
        class="size-6 text-primary-500"
      />
    </span>

    <span
      v-if="type === 'password'"
      class="absolute end-0 inset-y-0 flex items-center justify-center px-2 cursor-pointer"
      @click="switchPasswordType"
    >
      <Icon
        type="button"
        v-auto-animate
        :name="
          passwordVisible
            ? 'fluent:eye-off-16-regular'
            : 'fluent:eye-16-regular'
        "
        class="size-6 text-primary-500"
      />
    </span>
  </div>
</template>
