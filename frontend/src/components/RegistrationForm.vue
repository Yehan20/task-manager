<script setup lang="ts">
import { ref, watch } from 'vue'
import { useField, useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import { AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import { type NewUser } from '@/types/type'
import { log } from '@/utils'

// Schema set up
const { handleSubmit, setErrors, errors } = useForm({
    validationSchema: {
        name(value: string) {
            if (!value) return 'Name is required'
            return true
        },
        email(value: string) {

            if (!value) return 'Email required'
            if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true
            return 'Must be a valid e-mail.'
        },
        password(value: string) {

            if (!value) return 'Password required'
            if (value.length > 6) return true
            return 'Password must be more than 6 character.'
        },
        password_confirmation(value: string) {

            if (value === password.value.value) return true
            return 'Passwords not matching.'
        },
    },
})

// Router
const router = useRouter();

// Store
const auth = useAuthStore();

// Ref
const loading = ref(false)
const snackbar = ref(false);
const timeout = ref(2000)
const errortext = ref('');
const show1 = ref(false)
const show2 = ref(false)

// Vee validate feilds
const name = useField('name')
const password = useField('password')
const password_confirmation = useField('password_confirmation')
const email = useField('email')

// Submit method
const submit = handleSubmit(async (values) => {

    loading.value = true;
    const newUser = values as NewUser;

    try {
        log(values);

        await auth.registerUser(newUser);
        router.push({ name: 'home' });

    } catch (e) {

        if (e instanceof AxiosError) {

            log(e.response);

            if (e.response?.status === 401) {

                snackbar.value = true;
                errortext.value = e.response.data.message
            }

            if (e.response?.status === 422) {
                snackbar.value = true;
                errortext.value = 'Failed to register'
                setErrors(e.response.data.errors);
            }
        }

    } finally {
        loading.value = false;
    }
})

</script>

<template>
    <form @submit.prevent="submit">

        <!-- Name feild -->
        <v-text-field class="mb-3" density="comfortable" style="border-radius:10px;" variant="outlined"
            v-model="name.value.value" :error-messages="name.errors.value" :max-errors="name.errors.value.length"
            label="Name" />


        <!-- Email feild   -->
        <v-text-field label="Email" density="comfortable" variant="outlined" :error-messages="email.errorMessage.value"
            :max-errors="email.errors.value.length" class="mb-3" v-model="email.value.value" />


        <!-- Password feild -->
        <v-text-field class="mb-3" density="comfortable" variant="outlined" v-model="password.value.value"
            :max-errors="password.errors.value.length" :error-messages="password.errors.value"
            :append-inner-icon="show1 ? 'mdi-eye-off' : 'mdi-eye'" :type="show1 ? 'text' : 'password'"
            @click:append-inner="show1 = !show1" label="Password" 
            prepend-inner-icon="mdi-lock-outline" />

        <!-- Confirmation  feild-->
        <v-text-field class="mb-3" density="comfortable" variant="outlined" label="Confirm Password"
            v-model="password_confirmation.value.value" :error-messages="password.errors.value"
            :max-errors="password_confirmation.errors.value.length"
            :append-inner-icon="show2 ? 'mdi-eye-off' : 'mdi-eye'" prepend-inner-icon="mdi-lock-outline"
            :type="show2 ? 'text' : 'password'" @click:append-inner="show2 = !show2" />


        <!-- Register Feild -->
        <v-btn :disabled="loading" :loading="loading" type="submit" class="text-none mb-4 rounded-full"
            color="indigo-darken-3" size="large" variant="flat" block>
            Register
        </v-btn>


        <!-- Snack bar-->
        <v-snackbar absolute style="bottom:10%; right:20px;" v-model="snackbar" :timeout="timeout" color="error"
            variant="flat" location="bottom right" class="mt-2 mx-auto rounded-lg" max-width="400">

            <div class="d-flex align-center justify-between w-100">
                <span class="text-white font-weight-medium">
                    {{ errortext }}
                </span>

            </div>
        </v-snackbar>

    </form>
</template>

<style></style>