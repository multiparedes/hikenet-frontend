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
      <Button variant="destructive" class="mr-2" @click="deleteMarker">{{
        $t("delete")
      }}</Button>
      <Button>{{ $t("edit") }}</Button>
    </div>
  </Card>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { debounce } from "~/lib/utils";

const api = useApi();

const map = ref(null);
const baseNominatim = "https://nominatim.openstreetmap.org/search.php?";

const searcher = ref("");
const editing = ref(false);

const popMarker = ref(null);

const popupContent = ref(null);
const popupVisible = ref(false); // Reactive variable to control popup visibility

const debouncedSearch = debounce(nominatimResolve, 500);
const markers = ref(null);

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
  }).addTo(map.value);

  getUserPosition();

  // a layer group, used here like a container for markers
  markers.value = L.layerGroup();
  map.value.addLayer(markers.value);

  map.value.on("click", function (e) {
    if (editing.value) {
      var marker = L.marker(e.latlng).addTo(toRaw(markers.value));
      marker.bindPopup(popupContent.value);
      popupVisible.value = true;

      return;
    }
    return;
  });

  map.value.on("popupopen", function (e) {
    popMarker.value = e.popup._source;
  });
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
  markers.value.removeLayer(popMarker.value);
}
</script>

<style>
.override {
  @apply px-2 !important;
}
</style>
