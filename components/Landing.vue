<template>
  <section
    class="grid place-content-center md:grid-cols-2 grid-cols-1 gap-12 px-6 items-center"
  >
    <div
      class="flex justify-center sm:items-start items-center gap-6 flex-col md:text-left text-center"
    >
      <p class="md:text-6xl text-4xl leading-tight">
        Descubre tu próxima aventura en
        <span
          class="bg-gradient-to-r from-primary-400 to-secondary-400 text-gradient"
        >
          HikeNet</span
        >.
      </p>

      <p class="text-2xl text-slate-800">
        Conéctate con la naturaleza, descubre paisajes impresionantes y comparte
        momentos inolvidables. Únete hoy y empieza a explorar con HikeNet.
      </p>

      <Button icon="fluent:arrow-right-32-filled" class="w-fit" link="/auth"
        >Empezar</Button
      >
    </div>

    <img class="hidden md:block" src="/logo.svg" alt="" />
  </section>
</template>
