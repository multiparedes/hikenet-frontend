<template>
  <section class="grid place-content-center h-full">
    <Card class="grid grid-cols-1 gap-4 items-center p-0 overflow-clip">
      <div class="grid place-content-center p-6">
        <h1 class="text-center pb-4">
          {{ logging ? $t("auth.login") : $t("auth.register") }}
        </h1>

        <form type="form" v-auto-animate @submit="onSubmit">
          <InputWrapper
            name="username"
            :label="$t('username')"
            :placeholder="`${$t('username')}...`"
            icon="user"
          />

          <div v-if="!logging">
            <div class="grid grid-cols-2 gap-x-4">
              <InputWrapper
                name="firstName"
                :label="$t('name')"
                :placeholder="`${$t('name')}...`"
              />
              <InputWrapper
                name="lastName"
                :label="$t('last_name')"
                :placeholder="`${$t('last_name')}...`"
              />
              <div class="col-span-2">
                <InputWrapper
                  type="email"
                  name="email"
                  :label="$t('email')"
                  :placeholder="`${$t('email')}...`"
                />
              </div>
            </div>
          </div>
          <InputWrapper
            type="password"
            name="password"
            icon="password"
            :label="$t('password')"
            :placeholder="`${$t('password')}...`"
          />

          <Button class="w-full mt-2" :loading="pendingAuth">
            {{ logging ? $t("auth.login") : $t("auth.register") }}
          </Button>
        </form>

        <div v-if="logging" class="mt-4 flex gap-1 text-center text-sm">
          <p>{{ $t("auth.new_user") }}</p>
          <NuxtLink class="text-primary-600" to="/auth?signup">
            {{ $t("auth.register") }}
          </NuxtLink>
        </div>

        <div v-else class="mt-4 flex gap-1 text-center text-sm">
          <p>{{ $t("auth.have_account") }}</p>
          <NuxtLink class="text-primary-600" to="/auth">
            {{ $t("auth.login") }}
          </NuxtLink>
        </div>
      </div>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import InputWrapper from "~/components/forms/InputWrapper.vue";

definePageMeta({
  middleware: "user-guest",
});

const { toast } = useToast();

const pendingAuth = ref<boolean>(false);

const route = useRoute();

const logging = computed(() => {
  return !(route.query && "signup" in route.query);
});

const formSchema = computed(() => {
  if (logging.value) {
    return toTypedSchema(
      z.object({
        username: z.string().trim().min(4).max(50),
        password: z.string().trim().min(4),
      })
    );
  } else {
    return toTypedSchema(
      z.object({
        username: z.string().trim().min(4).max(50),
        firstName: z.string().trim().min(4).max(50),
        lastName: z.string().max(100),
        email: z.string().trim().email(),
        password: z.string().trim().min(4),
      })
    );
  }
});

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values) => {
  submitAuth(values);
});

async function submitAuth(values: Object) {
  pendingAuth.value = true;

  try {
    const auth = useAuth();

    if (!logging.value) {
      const { error } = await useApi().post("/auth/signup", {
        body: values,
      });

      if (error.value) {
        toast({
          title: `Error en el registro`,
          description: "Ups, algo salió mal.",
          variant: "destructive",
        });

        pendingAuth.value = false;
        return;
      }
    }

    const response: any = await auth.loginWith("cookie", { body: values });

    const user = {
      ...response._data.user,
      access_token: response._data.token,
    };

    await auth.setUser(user);
    await auth.setUserToken(user.access_token);

    toast({
      title: `${user?.username} ${
        logging.value ? "inició sesión" : "se registró"
      } correctamente`,
      variant: "success",
    });

    navigateTo("/");
  } catch (error) {
    console.log(error);
    toast({
      title: `Error en el registro`,
      description: "Ups, algo salió mal.",
      variant: "destructive",
    });
  }

  pendingAuth.value = false;
}
</script>
