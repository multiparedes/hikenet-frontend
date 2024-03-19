<template>
    <Card class="col-span-2 row-span-2 override flex flex-col gap-2">

        <div class="grid grid-cols-2 gap-4 items-center">
            <Input v-model="searcher" class="w-full" icon="fluent:search-16-regular"
                :placeholder="$t('search_a_location') + '...'" name="search" @update="deboundedSearch" />

            <div class="flex gap-2 items-center justify-end">
                <p>{{ $t('upload_hike_map') }}</p>
                <Button size="sm" variant="outline" icon="fluent:arrow-upload-16-regular">{{ $t('uplaod') }}</Button>
            </div>
        </div>

        <div id="map" class="h-[35em] rounded-md overflow-clip relative">
            <Button :icon="editing ? 'fluent:hand-draw-16-regular' : 'fluent:pin-12-regular'"
                class="absolute bottom-1 left-1 z-10" @click="editing = !editing">{{
                editing ? $t('move') : $t('edit') }}</Button>
        </div>

    </Card>
</template>

<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import L from 'leaflet'

import { debounce } from '~/lib/utils';

const api = useApi()

const map = ref(null)
const baseNominatim = 'https://nominatim.openstreetmap.org/search.php?'

const searcher = ref('')
const editing = ref(false)

const deboundedSearch = debounce(nominatimResolve, 500)

onMounted(() => {
    map.value = L.map('map', {
        center: L.latLng(49.2125578, 16.62662018),
        minZoom: 5,
        maxZoom: 15,
        zoom: 14,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map.value);

    getUserPosition()
})

function getUserPosition() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            map.value.panTo([position.coords.latitude, position.coords.longitude])
        });
    }
}

async function nominatimResolve(search: string) {
    if (!search) return

    const { data, error } = await api.get(baseNominatim, {
        params: {
            format: 'jsonv2',
            q: search
        }
    })


    if (error.value) { return }

    const point = [data.value.at(0).lat, data.value.at(0).lon]
    map.value.flyTo(point, 15)
}
</script>

<style>
.leaflet-container,
.leaflet-pane,
.leaflet-control {
    @apply z-[5] !important
}

.override {
    @apply px-2 !important
}
</style>