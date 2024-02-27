<template>
  <Card class="mb-4 flex justify-between shadow-lg items-center h-fit">
    <NuxtLink
      to="/"
      class="text-xl font-bold tracking-wider uppercase inline-flex items-center px-2 py-1 cursor-pointer hover:bg-primary-100 rounded-md transition-colors"
    >
      <img
        class="aspect-square h-6 md:mr-2"
        src="/logo.svg"
        alt="HikeNet logo"
      />
      <p class="hidden md:block">
        Hike
        <span class="text-primary-400 -ml-1.5">Net</span>
      </p>
    </NuxtLink>

    <!-- Reduced view, not logged om -->
    <div class="flex gap-4" v-if="!useAuth().loggedIn">
      <Button variant="link" link="/auth?signup" class="md:block hidden"
        >Crear cuenta</Button
      >
      <Button link="/auth">Iniciar sesión</Button>
    </div>

    <div class="flex" v-else>
      <Menubar>
        <Button variant="link" class="-mr-1">Publicar</Button>

        <MenubarMenu>
          <MenubarTrigger>Social</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Mis amigos</MenubarItem>
            <MenubarItem>Buscar usuarios</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Preferencias</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Editar perfil</MenubarItem>
            <MenubarItem><ColorToggle /></MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>Idioma</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Español</MenubarItem>
                <MenubarItem>English</MenubarItem>
                <MenubarItem>Català</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem>
              <Button class="w-full" @click="logoutUser">Cerrar sessión</Button>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  </Card>
</template>

<script setup lang="ts">
async function logoutUser() {
  await useAuth().logout();
  await useAuth().setUserToken("");

  return navigateTo("/");
}
</script>
