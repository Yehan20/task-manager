<script setup lang="ts">

import AppLayout from '@/layouts/AppLayout.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

</script>

<template>
  <AppLayout>
    <v-container>
      <h2>User logged {{authStore?.currentUser?.name}}</h2>
      
      <v-sheet color="surface-light" height="200" rounded="lg" width="100%">
        
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magnam vero odio ab assumenda incidunt totam eveniet
        laudantium ipsam blanditiis iure delectus, quasi, modi natus molestias nam praesentium sunt animi. Porro?
      </v-sheet>
    </v-container>
  </AppLayout>

</template>
