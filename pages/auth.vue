<template>
  <section class="grid place-content-center h-full">
    <Card
      class="grid md:grid-cols-2 grid-cols-1 gap-4 items-center p-0 overflow-clip"
    >
      <div class="grid place-content-center p-6">
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

        <div v-if="logging" class="mt-2 flex flex-col text-center text-sm">
          <p>Eres nuevo por aqui ?</p>
          <Button
            variant="link"
            class="text-primary-600"
            icon="fluent:arrow-right-32-filled"
            link="/auth?signup"
            >Crear una cuenta</Button
          >
        </div>

        <div v-else class="mt-2 flex flex-col text-center text-sm">
          <p>Ya tenes una cuenta ?</p>
          <Button
            variant="link"
            class="text-primary-600"
            icon="fluent:arrow-right-32-filled"
            link="/auth"
            >Ir al inicio de sessión</Button
          >
        </div>
      </div>

      <img
        src="/202792.webp"
        alt="Image"
        class="hidden md:block border-l-2 border-content grayscale-[15%] hover:grayscale-0 transition-all"
      />
    </Card>
  </section>
</template>

<script setup lang="ts">
import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();

const auth = useAuth();
const pendingAuth = ref<boolean>(false);

const logging = computed(() => {
  const query = useRoute().query;
  return !(query && "signup" in query);
});

definePageMeta({
  middleware: [
    function () {
      if (useAuth().loggedIn) {
        return navigateTo("/");
      }
    },
  ],
});

async function submitAuth(values: Object) {
  pendingAuth.value = true;

  try {
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

    const response: any = await auth.login({ body: values });

    await auth.setUser(response._data.user);
    await auth.setUserToken(response._data.token);

    toast({
      title: `${response._data.user?.username} ${
        logging.value ? "inició session" : "se registró"
      } correctamente`,
      variant: "success",
    });

    return navigateTo("/");
  } catch (error) {
    toast({
      title: `Error en el registro`,
      description: "Ups, algo salió mal.",
      variant: "destructive",
    });
  }

  pendingAuth.value = false;
}
</script>
