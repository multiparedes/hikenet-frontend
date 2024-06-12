<template>
  <section>
    <Loader v-if="!editingHike && editingId"></Loader>
    <FormWrapper
      v-else
      :validation="validationSchema"
      :initial="editingHike"
      @submit="handleAction"
    >
      <div class="md:grid flex flex-col grid-cols-2 gap-x-2">
        <InputWrapper name="title" :label="$t('name')" />
        <RangeWrapper
          name="difficulty"
          type="number"
          :label="$t('difficulty')"
          :min="1"
          :max="10"
          :description="$t('difficulty_explainer')"
        />

        <div class="col-span-2">
          <TextAreaWrapper
            name="description"
            :label="$t('description')"
            :placeholder="$t('write_a_description')"
          />
        </div>
        <div class="col-span-2">
          <FormField v-slot="{ componentField }" name="contents">
            <FormLabel>{{ $t("map_itinerary") }}</FormLabel>
            <FormControl>
              <LeafletMap
                v-bind="componentField"
                v-model="markers"
                :center="editingHike?.location"
              ></LeafletMap>
            </FormControl>
            <FormMessage />
          </FormField>
        </div>
        <div class="grid md:block place-content-center w-full">
          <FileUpload v-model="images" class="mt-4"></FileUpload>
        </div>
        <Button class="mt-4" type="submit" :loading="waitingQuery">{{
          editingId ? $t("edit") : $t("create")
        }}</Button>
      </div>
    </FormWrapper>
  </section>
</template>

<script setup>
import {
  FormWrapper,
  InputWrapper,
  TextAreaWrapper,
  RangeWrapper,
} from "@/components/forms";

import * as z from "zod";
import { useToast } from "@/components/ui/toast/use-toast";

const { t } = useI18n();
const api = useApi();
const { toast } = useToast();

const editingId = useRoute().query?.id;
const editingHike = ref(null);

const waitingQuery = ref(false);

const markers = ref([]);
const images = ref([]);

const validationSchema = ref({
  title: z.string().trim().min(1),
  difficulty: z.number().array().min(1).max(10),
  description: z.string().trim().min(1),
  contents: z
    .array(
      z.object({
        id: z.number(),
        content: z.string(),
        lat: z.number(),
        lng: z.number(),
      })
    )
    .nonempty(),
});

async function fetchData() {
  if (!editingId) return;

  const { data, error } = await api.get(`/posts/${editingId}`);

  if (error.value) {
    toast({
      title: t("error"),
      variant: "destructive",
    });

    return navigateTo(useLocalePath()("/"));
  }

  if (data.value.User.id !== useAuth().user.id) {
    toast({
      title: t("cant_edit_hike"),
      variant: "destructive",
    });

    return navigateTo(useLocalePath()("/"));
  }

  markers.value = data.value.contents;
  images.value = data.value.images;

  editingHike.value = {
    ...data.value,
    difficulty: [data.value.difficulty],
  };
}

fetchData();

async function handleAction(values) {
  waitingQuery.value = true;

  const { data, error } = await api[editingId ? "patch" : "post"](
    `posts/${editingId ? editingId : useAuth()?.user?.username}`,
    {
      body: { ...values, location: await getCenter(values.contents), images },
    }
  );

  if (error.value) {
    toast({
      title: t("generic_error"),
      description: t("try_again_later"),
      variant: "destructive",
    });
    waitingQuery.value = false;
    return;
  }

  toast({
    title: t("successfully_created_hike"),
    variant: "success",
  });

  await navigateTo("/hike/" + data.value.id);

  waitingQuery.value = false;
}

async function getCenter(points) {
  if (!points || points.length === 0) {
    return null;
  }

  const sumLat = points.reduce((acc, point) => acc + point.lat, 0);
  const sumLng = points.reduce((acc, point) => acc + point.lng, 0);

  const avgLat = sumLat / points.length;
  const avgLng = sumLng / points.length;

  const { data, error } = await api.get(
    `https://nominatim.openstreetmap.org/reverse?lat=${avgLat}&lon=${avgLng}&format=json`
  );

  return { lat: avgLat, lng: avgLng, resolved: data.value.address };
}
</script>
