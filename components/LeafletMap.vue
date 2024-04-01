<template>
  <Card class="col-span-2 row-span-2 override flex flex-col gap-2">
    <div class="grid md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-2 items-center">
      <Input
        v-model="searcher"
        class="w-full"
        icon="fluent:search-16-regular"
        :placeholder="$t('search_a_location') + '...'"
        name="search"
        @update="debouncedSearch"
      />

      <div class="flex gap-x-2 items-center md:justify-end justify-between">
        <p>{{ $t("upload_hike_map") }}</p>
        <Button
          size="sm"
          variant="outline"
          icon="fluent:arrow-upload-16-regular"
          >{{ $t("uplaod") }}</Button
        >
      </div>
    </div>

    <div id="map" class="h-[35em] rounded-md overflow-clip relative">
      <Button
        :icon="
          editing ? 'fluent:hand-draw-16-regular' : 'fluent:pin-12-regular'
        "
        class="absolute bottom-1 left-1 z-10"
        :variant="editing ? 'outline' : 'default'"
        @click.stop="editing = !editing"
        >{{ editing ? $t("move") : $t("edit") }}</Button
      >
    </div>
    <div
      ref="popupContent"
      :style="{ display: popupVisible ? 'block' : 'none' }"
    >
      <p class="text-center">
        {{ activePopoupContent }}
      </p>

      <div class="flex gap-2 w-full justify-center">
        <Button variant="destructive" @click="deleteMarker">{{
          $t("delete")
        }}</Button>
        <Button @click="handleEditMarker">{{ $t("edit") }}</Button>
      </div>
    </div>

    <Modal
      v-model="editMarkerModal"
      :title="$t('edit_marker')"
      :actions="false"
    >
      <FormWrapper
        :initial="editForm"
        :validation="validationSchema"
        @submit="updateMarker"
      >
        <TextAreaWrapper name="description" />
        <div class="mt-4 flex ml-auto gap-2 justify-end">
          <Button
            variant="destructive"
            @click="editMarkerModal = !editMarkerModal"
            >{{ $t("close") }}</Button
          >
          <Button type="submit">{{ $t("edit") }}</Button>
        </div>
      </FormWrapper>
    </Modal>
  </Card>
</template>

<script setup>
import colors from "tailwindcss/colors";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as z from "zod";

import { FormWrapper, TextAreaWrapper } from "~/components/forms";

import { debounce } from "~/lib/utils";

const api = useApi();
const { t } = useI18n();
const baseNominatim = "https://nominatim.openstreetmap.org/search.php?";

const map = ref(null);
const editMarkerModal = ref(false);

const searcher = ref("");
const editing = ref(false);

const popMarker = ref(null);

const popupContent = ref(null);
const popupVisible = ref(false);

const debouncedSearch = debounce(nominatimResolve, 500);
const markersLayer = ref(null);
const markers = ref([]);
const pathLayer = ref(null);

const editForm = ref({});

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

watch(editing, () => {
  if (editing.value) {
    map.value.dragging.disable();
    map.value.boxZoom.disable();
    map.value.scrollWheelZoom.disable();
  } else {
    map.value.dragging.enable();
    map.value.boxZoom.enable();
    map.value.scrollWheelZoom.enable();
  }
});

watch(markers.value, () => {
  updateLines();
});

const activePopoupContent = computed(() => {
  return (
    markers.value.find((m) => m?.id === popMarker.value?._leaflet_id)
      ?.content ?? ""
  );
});

const validationSchema = ref({
  description: z.string().trim().min(1),
});

onMounted(() => {
  map.value = L.map("map", {
    center: L.latLng(49.2125578, 16.62662018),
    minZoom: 5,
    maxZoom: 15,
    zoom: 14,
  });

  // Add Tracestrack Topo layer
  L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
    attribution:
      'Map data: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
  }).addTo(toRaw(map.value));

  getUserPosition();

  // a layer group, used here like a container for markersLayer
  markersLayer.value = L.layerGroup();
  map.value.addLayer(markersLayer.value);

  map.value.on("click", function (e) {
    if (editing.value) {
      var marker = L.marker(e.latlng).addTo(toRaw(markersLayer.value));
      marker.bindPopup(popupContent.value);
      markers.value.push({
        id: marker._leaflet_id,
        content: t("no_content"),
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });

      return;
    }
    return;
  });

  map.value.on("popupopen", function (e) {
    popMarker.value = e.popup._source;
    popupVisible.value = true;
  });

  pathLayer.value = L.layerGroup().addTo(toRaw(map.value));

  // markers.value = props.modelValue;
});

function getUserPosition() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      map.value.panTo([position.coords.latitude, position.coords.longitude]);
    });
  }
}

async function nominatimResolve(search) {
  if (!search) return;

  const { data, error } = await api.get(baseNominatim, {
    params: {
      format: "jsonv2",
      q: search,
    },
  });

  if (error.value && !!point) {
    return;
  }

  const point = [data.value.at(0).lat, data.value.at(0).lon];
  map.value.flyTo(point, 15);
}

function deleteMarker() {
  markersLayer.value.removeLayer(popMarker.value);
  updateLines();
}

function handleEditMarker() {
  editForm.value = { description: activePopoupContent.value };

  editMarkerModal.value = true;
}

function updateMarker({ description }) {
  if (popMarker.value) {
    const markerIndex = markers.value.findIndex(
      (marker) => marker.id === popMarker.value._leaflet_id
    );

    if (markerIndex !== -1) {
      markers.value[markerIndex].content = description;
    }
  }

  editMarkerModal.value = false;
}
function updateLines() {
  pathLayer.value.clearLayers();
  const pathCoords = connectTheDots(markersLayer.value);
  L.polyline(pathCoords).addTo(toRaw(pathLayer.value));

  emit("update:modelValue", markers.value);
}

function connectTheDots(data) {
  const coords = [];
  for (const layerId in data._layers) {
    const layer = data._layers[layerId];
    if (layer.getLatLng) {
      const latLng = layer.getLatLng();
      coords.push([latLng.lat, latLng.lng]);
    }
  }
  return coords;
}
</script>

<style>
.override {
  @apply px-2 !important;
}
</style>
