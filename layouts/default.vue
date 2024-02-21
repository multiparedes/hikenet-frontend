<template>
  <main class="bg-slate-300 flex flex-col relative min-h-screen">
    <div class="flex-grow flex justify-center">
      <div class="grid gap-4 py-4 grid-cols-1 mx-4 w-full max-w-screen-xl">
        <slot></slot>
      </div>
    </div>
  </main>
</template>
