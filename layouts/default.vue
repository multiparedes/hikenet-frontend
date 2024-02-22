<template>
  <main class="bg-content flex flex-col relative min-h-screen overflow-hidden">
    <div class="flex-grow flex justify-center">
      <div class="grid gap-4 py-4 grid-cols-1 mx-4 w-full max-w-screen-xl ">
        <div class="min-h-[90vh]">
          <Navbar />

          <slot></slot>

        </div>
      </div>
    </div>
    <Footer />
  </main>
</template>
