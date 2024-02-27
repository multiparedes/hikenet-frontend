<template>
  <section
    class="grid place-content-center md:grid-cols-2 grid-cols-1 gap-12 px-6 items-center h-[80svh]"
  >
    <div
      class="flex justify-center md:items-start items-center gap-6 flex-col md:text-left text-center"
    >
      <p class="md:text-6xl text-4xl leading-tight">
        {{ $t("landing.hero") }}
        <span
          class="bg-gradient-to-r from-primary-400 to-secondary-400 text-gradient"
        >
          HikeNet</span
        >.
      </p>

      <p class="text-2xl text-slate-800">
        {{ $t("landing.subhero") }}
      </p>

      <Button icon="fluent:arrow-right-32-filled" class="w-fit" link="/auth">
        {{ $t("start") }}
      </Button>
    </div>

    <HeroModel class="hidden md:block" />
  </section>
</template>
