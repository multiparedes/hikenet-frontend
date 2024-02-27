<template>
  <section class="grid place-content-center h-full">
    <Card class="grid grid-cols-1 gap-4 items-center p-0 overflow-clip">
      <div class="grid place-content-center p-6">
        <h1 class="text-center pb-4">
          {{ logging ? "Iniciar sessión" : "Registrar-se" }}
        </h1>

        <FormKit
          type="form"
          :show-actions="false"
          @submit="submitAuth"
          :actions="false"
        >
          <FormKit
            name="username"
            label="Nombre de usuario"
            validation="required:trim"
            placeholder="Nombre de usuario..."
          />

          <div v-if="!logging">
            <div class="grid grid-cols-2 gap-x-4">
              <FormKit
                name="firstName"
                label="Nombre"
                validation="required:trim"
                placeholder="Nombre..."
              />
              <FormKit
                name="lastName"
                label="Apellidos"
                placeholder="Apellidos..."
              />
              <div class="col-span-2">
                <FormKit
                  type="email"
                  name="email"
                  label="Correo electrónico"
                  placeholder="Correo electrónico..."
                  validation="email|required:trim"
                />
              </div>
            </div>
          </div>

          <FormKit
            type="password"
            name="password"
            label="Contraseña"
            validation="required:trim"
            placeholder="Contraseña..."
          />

          <Button class="w-full" :loading="pendingAuth">
            {{ logging ? "Iniciar sesion" : "Crear cuenta" }}
          </Button>
        </FormKit>

        <div v-if="logging" class="mt-4 flex gap-1 text-center text-sm">
          <p>Eres nuevo por aqui ?</p>
          <NuxtLink class="text-primary-600" to="/auth?signup">
            Crear una cuenta</NuxtLink
          >
        </div>

        <div v-else class="mt-4 flex gap-1 text-center text-sm">
          <p>Ya tenes una cuenta ?</p>
          <NuxtLink class="text-primary-600" to="/auth"
            >Iniciar sessión</NuxtLink
          >
        </div>
      </div>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const { toast } = useToast();

const pendingAuth = ref<boolean>(false);

const route = useRoute();

const logging = computed(() => {
  return !(route.query && "signup" in route.query);
});

async function submitAuth(values: Object) {
  pendingAuth.value = true;

  try {
    const auth = useAuth();

    if (!logging.value) {
      const { error } = await useApi().post("/auth/signup", {
        body: values,
      });

      if (error) {
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
