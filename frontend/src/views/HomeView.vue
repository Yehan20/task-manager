<script setup lang="ts">

import TaskList from '@/components/TaskList.vue';

</script>

<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12" class="pa-2 bg-white  rounded-lg">
        <TaskList />
      </v-col>
    </v-row>
  </v-container>
</template>
