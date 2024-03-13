<template>
  <Dialog v-model:open="internalModal">
    <DialogContent class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">
      <slot name="title">
        <DialogHeader class="px-4 py-2 pb-0" v-if="title || subTitle">
          <DialogTitle v-if="title">{{ title }}</DialogTitle>
          <DialogDescription v-if="subTitle">
            {{ subTitle }}
          </DialogDescription>
        </DialogHeader>
      </slot>
      <div class="grid gap-4 p-4 overflow-y-auto">
        <slot></slot>
      </div>
      <DialogFooter class="px-4 py-2 pt-0 flex gap-2">
        <slot name="actions">
          <Button v-if="actions" variant="destructive" @click="internalModal = false">
            {{ $t("close") }}
          </Button>
          <Button v-if="actions" type="submit" @click="handleSave">
            {{ $t("save") }}
          </Button>
        </slot>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const internalModal = ref(false);

interface Props {
  modelValue: boolean;
  title?: string;
  subTitle?: string;
  actions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  actions: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: Boolean): void;
  (e: "saved"): void;
}>();

watch(
  () => props.modelValue,
  () => {
    internalModal.value = props.modelValue;
  },
  { immediate: true }
);

watch(internalModal, () => {
  emit("update:modelValue", internalModal.value);
});

function handleSave() {
  emit("saved");
  internalModal.value = false;
}
</script>
