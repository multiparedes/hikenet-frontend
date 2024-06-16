<template>
  <section class="grid place-content-center h-full">
    <Card class="grid grid-cols-1 gap-4 items-center p-0 overflow-clip px-4 py-2">
      <p class="text-center">
        {{ $t("reset_password") }}
      </p>

      <FormWrapper v-if="!sentReset" :validation="FormWrapperSchema" @submit="submitReset">
        <InputWrapper name="email" :label="$t('email')" :placeholder="`${$t('email')}...`" />
        <Button class="w-full mt-2">{{ $t("reset") }}</Button>
      </FormWrapper>

      <div v-else-if="sentReset && !otpValid">
        <PinInput v-model="otpCode" placeholder="x" @complete="handleReset">
          <PinInputGroup>
            <PinInputInput class="text-slate-950 dark:text-white" v-for="(id, index) in 6" :key="id" :index="index" />
          </PinInputGroup>
        </PinInput>

        <Button class="mt-2 w-full" @click="handleReset">{{
          $t("send")
        }}</Button>
      </div>

      <div v-else>
        <FormWrapper :validation="FormWrapperSchema" @submit="resetPassword">
          <InputWrapper name="password" type="password" icon="password" :label="$t('password')"
            :placeholder="`${$t('password')}...`" />
          <Button class="w-full mt-2" type="submit">{{
          $t("reset")
            }}</Button>
        </FormWrapper>
      </div>
    </Card>
  </section>
</template>

<script setup>
import { useToast } from "@/components/ui/toast/use-toast";

import { InputWrapper, FormWrapper } from "~/components/forms";

import {
  PinInput,
  PinInputGroup,
  PinInputInput,
} from "@/components/ui/pin-input";

import * as z from "zod";
const { toast } = useToast();

const api = useApi();
const { t } = useI18n();

definePageMeta({
  middleware: "user-guest",
});

const sentReset = ref(false);
const otpCode = ref([]);
const otpValid = ref(false);
const resetEmail = ref("");

const FormWrapperSchema = computed(() => ({
  email: z.string().trim().email(),
}));

async function submitReset(values) {
  const { error } = await api.post(`/reset/${values.email}`);

  if (error.value) {
    toast({
      title: `Error`,
      variant: "destructive",
    });

    return;
  }

  resetEmail.value = values.email;
  sentReset.value = true;
}

async function resetPassword(values) {
  const { error } = await api.patch(`/reset/${resetEmail.value}`, {
    body: { otp: otpCode.value, password: values.password },
  });

  if (error.value) {
    toast({
      title: `Error`,
      variant: "destructive",
    });

    return;
  }
  toast({
    title: t("password_reseted_successfully"),
    variant: "success",
  });

  return navigateTo(useLocalePath()("/auth"));
}

async function handleReset() {
  const { error } = await api.post(`/reset/check/${resetEmail.value}`, {
    body: { otp: otpCode.value.join("") },
  });

  if (error.value) {
    toast({
      title: `Error`,
      variant: "destructive",
    });

    return;
  }

  otpValid.value = true;
}
</script>
