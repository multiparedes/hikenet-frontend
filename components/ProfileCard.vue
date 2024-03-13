<template>
    <div>
        <Modal v-model="editModal" :title="$t('edit_profile_title')" :sub-title="$t('edit_profile_subtitle')"
            :actions="false">
            <FormWrapper ref="updateModal" :initial="formValues" :validation="validationSchema" @submit="handleSubmit">
                <InputWrapper name="username" :label="$t('username')" :placeholder="`${$t('username')}...`"
                    icon="user" />

                <div class="grid grid-cols-2 gap-x-4">
                    <InputWrapper name="firstName" :label="$t('name')" :placeholder="`${$t('name')}...`" />

                    <InputWrapper name="lastName" :label="$t('last_name')" :placeholder="`${$t('last_name')}...`" />
                </div>

                <InputWrapper type="email" name="email" :label="$t('email')" :placeholder="`${$t('email')}...`" />

                <TextAreaWrapper name="description" :label="$t('description')"
                    :placeholder="`${$t('description')}...`" />

                <Button class="w-full mt-2" :loading="pendingData">
                    {{ $t("save") }}
                </Button>
            </FormWrapper>
        </Modal>

        <Card class="flex flex-col items-center relative">
            <div class="relative flex w-full justify-center">
                <span class="w-full h-12 rounded-lg"
                    :style="`background-image: linear-gradient(to right, ${colors[0]}, ${colors[1]});`" />
                <span
                    class="h-16 aspect-square grid place-content-center absolute bg-secondary-300 rounded-full border-2 -bottom-8 border-white p-4 right-0 left-0 m-auto">{{
            `${user.firstName[0]}${user?.lastName[0]}`.toLocaleUpperCase()
        }}</span>
            </div>

            <div class="mt-8 text-center flex flex-col gap-2 text-slate-950 dark:text-white">
                <div class="flex flex-col">
                    <span class="text-slate-400 text-sm"> @{{ user.username }} </span>
                    <span class="text-lg">{{ user.fullName }}</span>
                    <div>
                        <span class="bg-secondary-500 px-2 py-1 text-white rounded-md text-sm mr-2">
                            {{ user.isAdmin ? "Admin" : "User" }}
                        </span>
                        <span>{{ $t("joined") }} {{ formattedJoinDate }}</span>
                    </div>
                </div>

                <div class="flex gap-4 justify-center">
                    <Button variant="outline">{{ $t("friends") }}: {{ user.friends ?? 0 }}</Button>
                    <Button v-if="isOwn" icon="fluent:edit-12-regular" @click="editModal = true">{{ $t("edit")
                        }}</Button>
                    <div v-else class="flex gap-4">
                        <Button variant="outline" icon="fluent:person-add-24-regular" icon-start>
                            {{ $t("follow") }}
                        </Button>
                        <Button icon="fluent:note-add-16-regular" icon-start>{{
            $t("message")
        }}</Button>
                    </div>
                </div>

                <p class="text-sm px-8">
                    {{ profile?.description ?? $t("no_description_yet") }}
                </p>
            </div>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { InputWrapper, FormWrapper } from "~/components/forms";
import * as z from "zod";
import { useToast } from "./ui/toast";

import uniqolor from "uniqolor";
import TextAreaWrapper from "./forms/TextAreaWrapper.vue";

const api = useApi();
const { toast } = useToast();

const editModal = ref(false);
const updateModal = ref(null);
const pendingData = ref(false);

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
    profile: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits<{
    (e: "updated", value: object): void;
}>();

const formValues = ref({
    username: props.user.username,
    firstName: props.user.firstName,
    lastName: props.user.lastName,
    email: props.user.email,
    description: props.profile.description,
});

const validationSchema = ref({
    username: z.string().trim().min(4).max(50),
    firstName: z.string().trim().min(4).max(50),
    lastName: z.string().max(100),
    email: z.string().trim().email(),
    description: z.string(),
});

const isOwn = computed(() => {
    const queryParam = useRoute().params?.username[0];

    console.log(useRoute().params.username)

    return queryParam === useAuth()?.user?.username;
});

const formattedJoinDate = computed(() => {
    const date = new Date(props.user.createdAt);
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${month} ${year}`;
});

const colors = computed(() => {
    return getUserColors(props.user?.id);
});

function getUserColors(userId: string) {
    if (userId) {
        const color1 = uniqolor(userId.split("-")[0]).color;
        const color2 = uniqolor(userId.split("-")[1]).color;
        return [color1, color2];
    }
    return [];
}

async function handleSubmit(values: any) {
    pendingData.value = true;

    const { data: newU, error: errorU } = await api.patch(
        `/users/${props.user.username}`,
        {
            body: values,
        }
    );

    if (errorU.value) {
        toast({
            title: "Error during action",
            description: `Error at ${errorU.value}`,
        });
    }

    const { data: newP, error: errorP } = await api.patch(
        `/profile/${props.user.username}`,
        {
            body: values,
        }
    );

    if (errorP.value) {
        toast({
            title: "Error during action",
            description: `Error at ${errorP.value}`,
        });
    }

    emit("updated", { user: newU.value, profile: newP.value });

    pendingData.value = false;

    formValues.value = values;
    editModal.value = false;
}
</script>
