<script lang="ts" setup>

import LoginForm from '@/components/LoginForm.vue';
import image from '../assets/images/task.png'
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
                <h1>Login</h1>
                <p>Manager your tasks</p>
            </div>
            
            <LoginForm />

            <v-divider class="my-6" />

            <div class="text-center text-grey">
                Not a user?
                <RouterLink to="/register" class="text-decoration-none text-primary font-weight-medium">
                    Register here 
                </RouterLink>
            </div>

        </template>
    </GuestLayout>
</template>


<style lang="scss" scoped></style>