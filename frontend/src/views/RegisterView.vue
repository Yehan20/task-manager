<script lang="ts" setup>
import image from '../assets/images/task.png';
import RegistrationForm from '@/components/RegistrationForm.vue';
import GuestLayout from '@/layouts/GuestLayout.vue';
</script>

<template>
  <GuestLayout>
    <template #image-section>
      <v-img title="Cover imge" class="h-full" cover :src="image"></v-img>
    </template>

    <template #form-section>
      <div class="mb-6">
        <h1>Registration</h1>
        <p>Fill the form to register and start managing tasks</p>
      </div>

      <RegistrationForm />

      <v-divider class="my-6" />

      <div class="text-center text-grey">
        Already have an account?
        <RouterLink to="/login" class="text-decoration-none text-primary font-weight-medium">
          Login here
        </RouterLink>
      </div>
    </template>
  </GuestLayout>
</template>

<style lang="scss" scoped></style>
