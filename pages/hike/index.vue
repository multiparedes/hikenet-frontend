<template>
  <section>
    <h1>Post a new excursion !</h1>
    <FormWrapper>
      <div class="grid grid-cols-2 gap-2">
        <InputWrapper name="name" :label="$t('name')" />
        <InputWrapper
          name="difficulty"
          type="number"
          :label="$t('difficulty')"
        />

        <div class="col-span-2">
          <TextAreaWrapper
            name="description"
            :label="$t('description')"
            :placeholder="$t('write_a_description')"
          />
        </div>
      </div>
    </FormWrapper>
  </section>
</template>

<script setup lang="ts">
import { FormWrapper, InputWrapper, TextAreaWrapper } from "@/components/forms";
</script>
