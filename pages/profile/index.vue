<script setup>
definePageMeta({
    middleware: (to, from) => {
        return navigateTo(`/profile/${useAuth().user.username}`);
    }
})
</script>