<template>
  <Card class="mb-4 flex justify-between shadow-lg items-center h-fit">
    <NuxtLink to="/"
      class="text-xl font-bold tracking-wider uppercase inline-flex items-center px-2 py-1 cursor-pointer hover:bg-primary-100 rounded-md transition-colors">
      <img class="aspect-square h-6 md:mr-2" src="/logo.svg" alt="HikeNet logo" />
      <p class="hidden md:block">
        Hike
        <span class="text-primary-400 -ml-1.5">Net</span>
      </p>
    </NuxtLink>

    <!-- Reduced view, not logged om -->
    <div class="flex gap-4" v-if="!useAuth().loggedIn">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>{{ $t("navbar.preferences") }}</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <ColorToggle />
            </MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>{{ $t("navbar.language") }}</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem v-for="locale in availableLocales" @click="setLocale(locale)">{{ locale.toLocaleUpperCase()
                  }}</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Button variant="link" link="/auth?signup" class="md:block hidden">{{
      $t("auth.register")
    }}</Button>
      <Button link="/auth">{{ $t("auth.login") }}</Button>
    </div>

    <div class="flex" v-else>
      <Modal v-model="showSearchModal" :actions="false">
        <SearchUsers @select="showSearchModal = false" />
      </Modal>

      <Menubar>
        <Button variant="link" class="-mr-1">{{ $t("navbar.publish") }}</Button>

        <MenubarMenu>
          <MenubarTrigger>{{ $t("navbar.social") }}</MenubarTrigger>
          <MenubarContent>
            <MenubarItem @click="navigateTo('/profile')">{{
      $t("navbar.edit_profile")
    }}</MenubarItem>
            <MenubarItem @click="showSearchModal = true">{{ $t("navbar.search_friends") }}</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>{{ $t("navbar.preferences") }}</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <ColorToggle />
            </MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>{{ $t("navbar.language") }}</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem v-for="locale in availableLocales" @click="setLocale(locale)">{{ locale.toLocaleUpperCase()
                  }}</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem>
              <Button class="w-full" @click="logoutUser">{{
      $t("auth.logout")
                }}</Button>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  </Card>
</template>

<script setup lang="ts">
const { availableLocales, setLocale } = useI18n();

const showSearchModal = ref(false)

async function logoutUser() {
  useAuth().logout();
  useAuth().setUserToken("");

  await navigateTo("");
}
</script>
