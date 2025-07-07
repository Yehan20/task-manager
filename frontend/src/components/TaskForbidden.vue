<template>
  <v-container class="fill-height d-flex flex-column align-center justify-center text-center">
    <v-icon size="96" color="deep-purple-darken-3">mdi-lock-alert</v-icon>
    <h1 class="text-h3 font-weight-bold">403 - Forbidden</h1>
    <p class="text-body-1 mb-6">You don't have permission to access this page.</p>
    <v-btn color="deep-purple-darken-3" @click="$router.push('/')">Go to Dashboard</v-btn>
  </v-container>
</template>


