<template>
  <section>
    <h1>Post a new excursion !</h1>
    <FormWrapper>
      <div class="grid grid-cols-2 gap-x-2">
        <InputWrapper name="name" :label="$t('name')" />
        <RangeWrapper name="difficulty" type="number" :label="$t('difficulty')" :max="10"
          :description="$t('difficulty_explainer')" />

        <div class="col-span-2">
          <TextAreaWrapper name="description" :label="$t('description')" :placeholder="$t('write_a_description')" />
        </div>
        <LeafletMap class="mt-4"></LeafletMap>
      </div>
    </FormWrapper>
  </section>
</template>

<script setup lang="ts">
import { FormWrapper, InputWrapper, TextAreaWrapper, RangeWrapper } from "@/components/forms";
</script>
