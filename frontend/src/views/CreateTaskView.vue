<script lang="ts" setup>
import TaskForm from '@/components/TaskForm.vue';
</script>
<template>
  <v-container class="">
    <v-row no-gutters>
      <v-col cols="12 bg-white  rounded-lg ">
        <v-card class="elevation-0 rounded-lg pa-8 mb-4" max-width="1200">
          <div class="mb-3">
            <h1>Create Task</h1>
            <p>fill the form to create a task</p>
          </div>

          <TaskForm mode="create" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped></style>
