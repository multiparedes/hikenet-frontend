<template>
  <section>
    <FormWrapper :validation="validationSchema" @submit="createHike">
      <div class="grid grid-cols-2 gap-x-2">
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
              ></LeafletMap>
            </FormControl>
            <FormMessage />
          </FormField>
        </div>
        <Images></Images>
        <Button class="mt-4" type="submit" :loading="waitingQuery">{{
          $t("create")
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

const waitingQuery = ref(false);

const markers = ref([]);

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

async function createHike(values) {
  waitingQuery.value = true;

  const { data, error } = await api.post(`posts/${useAuth()?.user?.username}`, {
    body: { ...values, location: getCenter(values.contents) },
  });

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
  });

  await navigateTo("/hike/" + data.id);

  waitingQuery.value = false;
}

function getCenter(points) {
  if (!points || points.length === 0) {
    return null;
  }

  const sumLat = points.reduce((acc, point) => acc + point.lat, 0);
  const sumLng = points.reduce((acc, point) => acc + point.lng, 0);

  const avgLat = sumLat / points.length;
  const avgLng = sumLng / points.length;

  return { lat: avgLat, lng: avgLng };
}
</script>
