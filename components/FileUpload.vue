<template>
  <div class="flex flex-col gap-y-4" v-auto-animate>
    <div class="flex gap-x-4 w-full justify-around max-w-xs" v-auto-animate>
      <Button
        type="button"
        class="mr-auto"
        variant="outline"
        icon-start
        icon="fluent:cloud-add-24-regular"
        @click="openInput"
        >{{ $t("upload_images") }}</Button
      >
      <input
        class="hidden"
        ref="imageInputRef"
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        multiple="multiple"
        @change="uploadImage"
      />

      <Button
        type="button"
        v-if="images.length > 0"
        variant="destructive"
        icon-start
        icon="fluent:delete-24-regular"
        @click="images = []"
        >{{ $t("delete_images") }}</Button
      >
    </div>

    <div>
      <Carousel v-if="images.length > 0" class="relative w-full max-w-xs">
        <CarouselContent>
          <CarouselItem v-for="(blob, index) in images" :key="index">
            <div class="p-1">
              <Card style="padding: 0em !important">
                <CardContent
                  class="flex aspect-square items-center justify-center flex-col"
                  style="padding: 0em !important"
                >
                  <img :src="blob" class="object-cover w-full h-full" />
                </CardContent>
              </Card>
            </div>
            <p class="py-1 text-center">
              {{ index + 1 }} / {{ images.length }}
            </p>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious v-show="images.length > 0" />
        <CarouselNext v-show="images.length > 0" />
      </Carousel>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const imageInputRef = ref(null);
const images = ref([]);

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

watch(images, () => {
  emit("update:modelValue", images.value);
});

function openInput() {
  imageInputRef.value.click();
}
function uploadImage(e) {
  const fileList = e.target.files;

  if (fileList.length === 0) return;

  images.value = [];

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result; // Extract base64 string
      images.value.push(base64String); // Push base64 string to images array
    };

    if (file) {
      reader.readAsDataURL(file); // Read file as Data URL (base64)
    }
  }
}
</script>
