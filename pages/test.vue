<script setup>
const values = ref({})
</script>

<template>
    <FormKit type="form" v-model="values">
        <FormKit type="text" label="One-time password" name="two_factor_code" help="We’ve sent a code to your phone."
            icon="material-symbols:search" validation="required" />
    </FormKit>

    <!-- This is just to help us visualize the data in our form: -->
    <pre wrap>{{ values }}</pre>
</template>