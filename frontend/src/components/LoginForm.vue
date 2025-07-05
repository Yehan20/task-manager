<script setup lang="ts">
import { ref, watch } from 'vue'
import { useField, useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { AxiosError } from 'axios'


const { handleSubmit, handleReset } = useForm({
    validationSchema: {
        password(value: string) {
            if (!value) return 'Password required'

            return true
        },

        email(value: string) {
            if (!value) return 'Email required'
            if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

            return 'Must be a valid e-mail.'
        },
    },
})


const router = useRouter();
const email = useField('email')
const password = useField('password')
const auth = useAuthStore();

const snackbar = ref(false)
const errortext = ref('')
const timeout = ref(2000)
const loading = ref(false)
const show = ref(false);


const submit = handleSubmit(async (values) => {

    loading.value = true;
    try {
        await auth.loginUser(values.email, values.password);
        if (auth.currentUser) {

            router.replace('/');
        }
    } catch (e) {

        if (e instanceof AxiosError)

            //  Login fail
            if (e.response?.status === 401) {

                snackbar.value = true;
                errortext.value = e.response.data.message
            }
    } finally {
        loading.value = false;
    }

    // handleReset();
})


</script>

<template>

    <form @submit.prevent="submit">

        <!-- Email feild -->
        <v-text-field class="mb-3" variant="outlined" v-model="email.value.value"
            :error-messages="email.errorMessage.value" label="Email"></v-text-field>


        <!-- Password feild -->
        <v-text-field class="mb-3" variant="outlined" v-model="password.value.value"
            :error-messages="password.errorMessage.value" label="Password"
            :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'" :type="show ? 'text' : 'password'"
            @click:append="show = !show">
        </v-text-field>


        <!-- Login button -->
        <v-btn :disabled="loading" :loading="loading" class="text-none mb-4 rounded-full" color="indigo-darken-3"
            type="submit" size="large" variant="flat" block>
            Login
        </v-btn>

        <v-snackbar absolute style="bottom:10%; right:20px;" v-model="snackbar" :timeout="timeout" color="error"
            variant="flat" location="bottom right" class="mt-2 mx-auto rounded-lg" max-width="400">

            <div class="d-flex align-center justify-between w-100">
                <span class="text-white font-weight-medium">
                    {{ errortext }}
                </span>

            </div>
        </v-snackbar>




        <!-- <v-btn :disabled="loading" :loading="loading" class="text-none mb-4 rounded-full" color="green" size="large"
            variant="flat" block @click="loading = !loading">
            Demo login
        </v-btn> -->

    </form>
</template>
