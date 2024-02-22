<template>
    <Card class="mb-4 flex justify-between shadow-lg">
        <NuxtLink to="/"
            class="text-xl font-bold tracking-wider uppercase inline-flex items-center px-2 py-1 cursor-pointer hover:bg-primary-100 rounded-md transition-colors ">
            <img class="aspect-square h-6 mr-2" src="/logo.svg" alt="HikeNet logo">
            Hike
            <span class="text-primary-400">Net</span>
        </NuxtLink>

        <div class="flex gap-4">
            <Button variant="link" link="/auth?signup">Crear cuenta</Button>
            <Button link="/auth">Iniciar sesion</Button>
        </div>
    </Card>
</template>
