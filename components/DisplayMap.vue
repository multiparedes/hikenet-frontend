<template>
  <Card class="override">
    <div
      :id="`map-${id}`"
      class="rounded-md overflow-clip relative h-full"
      :class="isPreview ? 'h-[10em] pointer-events-none hid' : 'h-[35em]'"
    ></div>
  </Card>
</template>

<script setup>
import colors from "tailwindcss/colors";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as z from "zod";

const { t } = useI18n();

const map = ref(null);

const popMarker = ref(null);

const popupContent = ref(null);
const popupVisible = ref(false);

const markersLayer = ref(null);
const markers = ref([]);
const pathLayer = ref(null);

const props = defineProps({
  id: {
    type: Number,
    required: false,
    default: 0,
  },
  markers: {
    type: Array,
    required: true,
  },
  center: {
    type: Object,
    requiered: true,
  },
  isPreview: {
    type: Boolean,
    required: false,
    default: false,
  },
});

var baseIcon = L.icon({
  iconUrl: "/base.svg",

  iconSize: [40, 40], // size of the icon
  iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});

var startIcon = L.icon({
  iconUrl: "/start.svg",

  iconSize: [40, 40], // size of the icon
  iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});

var endIcon = L.icon({
  iconUrl: "/end.svg",

  iconSize: [40, 40], // size of the icon
  iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});

const activePopoupContent = computed(() => {
  return (
    markers.value.find((m) => m?.id === popMarker.value?._leaflet_id)
      ?.content ?? ""
  );
});

onMounted(() => {
  map.value = L.map(`map-${props.id}`, {
    center: L.latLng(props.center.lat, props.center.lng),
    minZoom: 5,
    maxZoom: 15,
    zoom: 14,
    zoomControl: !props.isPreview,
    zoomAnimation: true,
    fadeAnimation: true,
    markerZoomAnimation: true,
  });

  const attribution = props.isPreview
    ? null
    : {
        attribution:
          'Map data: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
      };

  L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution
  ).addTo(toRaw(map.value));

  markersLayer.value = L.layerGroup();

  map.value.on("popupopen", function (e) {
    popMarker.value = e.popup._source;
    popupVisible.value = true;
  });

  pathLayer.value = L.layerGroup().addTo(toRaw(map.value));

  markers.value = [...props.markers];

  updateMarkers();
  updateLines();

  map.value.addLayer(toRaw(markersLayer.value));

  // MAGIC TRICK!
  L.Popup.prototype._animateZoom = function (e) {
    if (!this._map) {
      return;
    }
    var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center),
      anchor = this._getAnchor();
    L.DomUtil.setPosition(this._container, pos.add(anchor));
  };
});

function updateMarkers() {
  markersLayer.value.clearLayers();
  const markerBounds = L.latLngBounds(); // Create bounds object to encompass all markers

  markers.value.forEach((marker, index) => {
    const { lat, lng, content } = marker;

    let markerIcon = baseIcon;

    if (index === 0) {
      markerIcon = startIcon;
    } else if (index === markers.value.length - 1) {
      markerIcon = endIcon;
    }

    const newMarker = L.marker([lat, lng], { icon: markerIcon });

    if (content) {
      newMarker.bindPopup(content);
    }

    markersLayer.value.addLayer(newMarker);

    // Extend the bounds to include the marker position
    markerBounds.extend([lat, lng]);
  });

  // Fit the map to the marker bounds
  map.value.fitBounds(markerBounds.pad(0.02));
}

function updateLines() {
  pathLayer.value.clearLayers();
  const pathCoords = connectTheDots(markersLayer.value);
  L.polyline(pathCoords).addTo(toRaw(pathLayer.value));
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

.hid .leaflet-control-attribution {
  display: none;
}
</style>
