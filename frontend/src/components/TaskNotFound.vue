<template>
    <v-container class="fill-height d-flex flex-column align-center justify-center text-center">
        <v-icon size="96" color="">mdi-alert-octagon</v-icon>
        <h1 class="text-h3 font-weight-bold">404 Task -  Not Found</h1>
        <p class="text-body-1 mb-6">This task doesnt not exist.</p>
        <v-btn color="deep-purple-darken-3" @click="$router.push('/')">Back to Home</v-btn>
    </v-container>
</template>
