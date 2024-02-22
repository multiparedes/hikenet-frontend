<template>
    <section class="grid place-content-center h-full">

        <Card class="grid md:grid-cols-2 grid-cols-1 gap-4 p-6">
            <div class="grid place-content-center">
                <FormKit type="form" :show-actions="false" @submit="submitAuth" :actions="false">
                    <FormKit type="text" name="username" label="Nombre de usuario" validation="required"
                        placeholder="Nombre de usuario..." />
                    <FormKit type="password" name="password" label="Contraseña" validation="required"
                        placeholder="Contraseña..." />

                    <Button class="w-full" :loading="pendingAuth">{{ logging ? 'Iniciar sesion' : 'Crear cuenta' }}</Button>
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