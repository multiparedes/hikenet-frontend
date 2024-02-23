<template>
    <section class="grid place-content-center h-full">

        <Card class="grid md:grid-cols-2 grid-cols-1 gap-4 p-6">
            <div class="grid place-content-center">
                <FormKit type="form" :show-actions="false" @submit="submitAuth" :actions="false">
                    <FormKit name="username" label="Nombre de usuario" validation="required"
                        placeholder="Nombre de usuario..." />


                    <div v-if="!logging">
                        <div class="grid grid-cols-2 gap-x-4">
                            <FormKit name="first_name" label="Nombre" validation="required" placeholder="Nombre..." />
                            <FormKit name="last_name" label="Apellidos" placeholder="Apellidos..." />
                            <div class="col-span-2">
                                <FormKit type="email" name="email" label="Correo electrónico"
                                    placeholder="Correo electrónico..." validation="email|required" />
                            </div>
                        </div>
                    </div>

                    <FormKit type="password" name="password" label="Contraseña" validation="required"
                        placeholder="Contraseña..." />


                    <Button class="w-full" :loading="pendingAuth">{{ logging ? 'Iniciar sesion' : 'Crear cuenta'
                    }}</Button>
                </FormKit>
            </div>

            <img src="/202792.webp" alt="Image" class="rounded-2xl hidden md:block">
        </Card>

    </section>
</template>

<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

const pendingAuth = ref(false)

const logging = computed(() => {
    const query = useRoute().query;
    return !(query && 'signup' in query);
})


async function submitAuth(values: Object) {
    pendingAuth.value = true

    try {
        const data = await useApi().post(`/auth/${logging.value ? 'login' : 'signup'}`, {
            body: values
        })

        console.log(data)
    } catch (error) {
        toast({ title: `${logging.value ? 'login' : 'signup'} error`, description: 'Wrong username or password', variant: 'destructive', duration: 1500 })
    }

    pendingAuth.value = false
}

</script>