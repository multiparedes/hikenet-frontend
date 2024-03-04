<template>
    <Card class="flex flex-col items-center relative">
        <div class="relative flex w-full justify-center">
            <span class="w-full h-12 rounded-lg"
                :style="`background-image: linear-gradient(to right, ${colors[0]}, ${colors[1]});`" />
            <span
                class="h-16 aspect-square grid place-content-center absolute bg-secondary-300 rounded-full border-2 -bottom-8 border-white p-4 right-0 left-0 m-auto">{{
                    `${user.firstName[0]}${user?.lastName[0]}`.toLocaleUpperCase()
                }}</span>
        </div>

        <div class="mt-8 text-center flex flex-col gap-2 text-slate-950">
            <div class="flex flex-col">
                <span class="text-slate-400 text-sm">
                    @{{ user.username }}
                </span>
                <span class="text-lg">{{ `${user.firstName} ${user?.lastName}` }}</span>
                <div>
                    <span class="bg-secondary-500 px-2 py-1 text-white rounded-md text-sm mr-2">
                        {{ user.isAdmin ? "Admin" : "User" }}
                    </span>
                    <span>Joined {{ formattedJoinDate }}</span>
                </div>
            </div>

            <div class="flex gap-4 justify-center">
                <Button variant="outline">Friends: {{ user.friends ?? 0 }}</Button>
                <Button v-if="isOwn" icon="fluent:edit-12-regular">Edit</Button>
                <div v-else class="flex gap-4">
                    <Button variant="outline" icon="fluent:person-add-24-regular" icon-start>
                        Follow
                    </Button>
                    <Button icon="fluent:note-add-16-regular" icon-start>Message</Button>
                </div>
            </div>

            <p class="text-sm px-8">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Esse
                voluptatibus, illum porro soluta excepturi ipsum temporibus adipisci
                ratione quas quidem, neque dolore eius beatae nisi explicabo maiores
                consequuntur tempore ab!
            </p>
        </div>
    </Card>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { useRoute } from 'vue-router';
import uniqolor from 'uniqolor';

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
});

const isOwn = computed(() => {
    return !useRoute().params?.id;
});

const formattedJoinDate = computed(() => {
    const date = new Date(props.user.createdAt);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
});

const colors = computed(() => {
    return getUserColors(props.user?.id);
});

function getUserColors(userId: string) {
    if (userId) {
        const color1 = uniqolor(userId.split('-')[0]).color;
        const color2 = uniqolor(userId.split('-')[1]).color;
        return [color1, color2];
    }
    return [];
}
</script>