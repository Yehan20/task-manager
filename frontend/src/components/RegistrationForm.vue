<script setup lang="ts">
import { ref, watch } from 'vue';
import { useField, useForm } from 'vee-validate';
import { useAuthStore } from '@/stores/auth';
import { AxiosError } from 'axios';
import { useRouter } from 'vue-router';
import { type NewUser } from '@/types/type';
import { log } from '@/utils';
import BaseInputFeild from './BaseInputFeild.vue';
import { useDisplay } from 'vuetify';
import BaseSnackBar from './BaseSnackBar.vue';

// Schema set up
const { handleSubmit, setErrors, errors } = useForm({
  validationSchema: {
    name(value: string) {
      if (!value) return 'Name is required';
      return true;
    },
    email(value: string) {
      if (!value) return 'Email required';
      if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true;
      return 'Must be a valid e-mail.';
    },
    password(value: string) {
      if (!value) return 'Password required';
      if (value.length > 6) return true;
      return 'Password must be more than 6 character.';
    },
    password_confirmation(value: string) {
      if (value === password.value.value) return true;
      return 'Passwords not matching.';
    },
  },
});

// Display Composable
const { smAndDown } = useDisplay();

// Router
const router = useRouter();

// Store
const auth = useAuthStore();

// Ref
const loading = ref(false);
const snackbar = ref(false);
const errortext = ref('');
const show1 = ref(false);
const show2 = ref(false);

// Vee validate feilds
const name = useField('name');
const password = useField('password');
const password_confirmation = useField('password_confirmation');
const email = useField('email');

// Submit method
const submit = handleSubmit(async (values) => {
  loading.value = true;
  const newUser = values as NewUser;

  try {

    console.log(values);

    await auth.registerUser(newUser);
    router.push({ name: 'home' });
  } catch (e) {

    loading.value = false;
    if (e instanceof AxiosError) {

      if (e.response?.status === 401) errortext.value = e.response.data.message;
      
      if (e.response?.status === 422) setErrors(e.response.data.errors);
     
    }else {
    
      errortext.value ='Unexpected Error occured'
    }
  }
});
</script>

<template>
  <form @submit.prevent="submit">

    <!-- Name feild -->
    <BaseInputFeild v-model="name.value.value" label="Name" :errorMessages="name.errors.value" />

    <!-- Email feild   -->
    <BaseInputFeild v-model="email.value.value" label="Email" :errorMessages="email.errors.value" />

    <!-- Password feild -->
    <BaseInputFeild :append-inner-icon="show1 ? 'mdi-eye-off' : 'mdi-eye'" :type="show1 ? 'text' : 'password'"
      @click:append-inner="show1 = !show1" v-model="password.value.value" label="Password"
      :errorMessages="password.errors.value" />

    <!-- Confirmation  feild-->
    <BaseInputFeild :append-inner-icon="show2 ? 'mdi-eye-off' : 'mdi-eye'" :type="show2 ? 'text' : 'password'"
      @click:append-inner="show2 = !show2" v-model="password_confirmation.value.value" label="Confirm Password"
      :errorMessages="password_confirmation.errors.value" />

    <!-- Register Button -->
    <v-btn :disabled="loading" :loading="loading" type="submit" class="text-none mb-4 rounded-full"
      color="deep-purple-darken-4" size="large" variant="flat" block>
      Register
    </v-btn>

 
  </form>
</template>

<style>
.snack-bar-static  .v-overlay__content {
   bottom:0;
   position: relative;
   width: 100%;
}
</style>
